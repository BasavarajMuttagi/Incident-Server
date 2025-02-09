import { getAuth } from "@clerk/express";
import { Request, Response } from "express";
import { prisma } from "../../prisma/db";
import { EmailService } from "../services/EmailService";
import { generateToken } from "../utils/token";

export async function createSubscriber(req: Request, res: Response) {
  try {
    const { orgId } = getAuth(req) as { orgId: string };
    const { email } = req.body;
    if (!email) {
      res.status(400).json({
        message: "Bad Request: Email Missing",
      });
      return;
    }
    // Check if subscriber exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: {
        orgId_email: {
          orgId,
          email,
        },
      },
    });

    if (existingSubscriber) {
      res.status(400).json({ error: "Email already subscribed" });
      return;
    }

    // Generate verification and unsubscribe codes
    const verificationCode = generateToken();
    const unsubscribeCode = generateToken();

    // Create subscriber
    const subscriber = await prisma.subscriber.create({
      data: {
        email,
        orgId,
        verificationCode,
        unsubscribeCode,
        status: "PENDING",
        verificationCodeExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    // Send verification email
    await EmailService.sendVerificationEmail(
      email,
      orgId,
      verificationCode,
      unsubscribeCode,
    );

    res.status(201).json(subscriber);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}

export async function verifySubscriber(req: Request, res: Response) {
  try {
    const { verificationCode, orgId, email } = req.body;

    const subscriber = await prisma.subscriber.findUnique({
      where: { verificationCode, orgId_email: { orgId, email } },
    });

    if (!subscriber) {
      res.status(404).json({ error: "Invalid verification code/ subscriber" });
      return;
    }

    if (subscriber.isVerified && subscriber.status === "SUBSCRIBED") {
      res.status(404).json({ error: "Invalid Request" });
      return;
    }
    // Update subscriber status
    const dataNow = new Date();
    const updatedSubscriber = await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        status: "SUBSCRIBED",
        isVerified: true,
        verifiedAt: dataNow,
        subscribedAt: dataNow,
      },
    });

    // Send confirmation email
    await EmailService.sendSubscriptionConfirmation(
      subscriber.email,
      subscriber.orgId,
      subscriber.unsubscribeCode,
    );

    res.json(updatedSubscriber);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}

export async function unsubscribeSubscriber(req: Request, res: Response) {
  try {
    const { unsubscribeCode, orgId, email } = req.body;
    const subscriber = await prisma.subscriber.findUnique({
      where: {
        unsubscribeCode,
        orgId_email: {
          orgId,
          email,
        },
      },
    });

    if (!subscriber) {
      res.status(404).json({ error: "Invalid unsubscribe code/ subscriber" });
      return;
    }

    if (subscriber.isVerified === false || subscriber.status !== "SUBSCRIBED") {
      res.status(404).json({ error: "Invalid Request" });
      return;
    }

    // Update subscriber status
    const updatedSubscriber = await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        status: "UNSUBSCRIBED",
        unsubscribedAt: new Date(),
      },
    });

    // Send unsubscribe confirmation
    await EmailService.sendUnsubscribeConfirmation(subscriber.email);

    res.json(updatedSubscriber);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}

export async function listSubscribers(req: Request, res: Response) {
  try {
    const { orgId } = getAuth(req) as { orgId: string };

    const subscribers = await prisma.subscriber.findMany({
      where: { orgId: orgId as string },
      orderBy: { createdAt: "desc" },
    });

    res.json(subscribers);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}

export async function deleteSubscriber(req: Request, res: Response) {
  try {
    const { orgId } = getAuth(req) as { orgId: string };
    const { id } = req.params;

    const subscriber = await prisma.subscriber.findFirst({
      where: {
        id,
        orgId: orgId as string,
      },
    });

    if (!subscriber) {
      res.status(404).json({ error: "Subscriber not found" });
      return;
    }

    await prisma.subscriber.delete({
      where: { id },
    });

    res.json({ message: "Subscriber deleted successfully" });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}
