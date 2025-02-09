import { getAuth } from "@clerk/express";
import { Request, Response } from "express";
import { prisma } from "../../prisma/db";
import { EmailService } from "../services/EmailService";
import { generateToken } from "../utils/token";

export async function createSubscriber(req: Request, res: Response) {
  try {
    const { orgId } = getAuth(req) as { orgId: string };
    const { email } = req.body;
    if (!email || !orgId) {
      res.status(400).json({
        message: "Bad Request: Email and Organization ID required",
      });
      return;
    }

    const existingSubscriber = await prisma.subscriber.findUnique({
      where: {
        orgId_email: {
          orgId,
          email,
        },
      },
    });

    if (existingSubscriber) {
      // If verified but unsubscribed, allow resubscription
      if (
        existingSubscriber.isVerified &&
        existingSubscriber.status === "UNSUBSCRIBED"
      ) {
        await prisma.subscriber.update({
          where: {
            orgId_email: {
              orgId,
              email,
            },
          },
          data: {
            status: "SUBSCRIBED",
            subscribedAt: new Date(),
            unsubscribedAt: null,
          },
        });
        res.status(200).json({ message: "Email re-subscribed successfully" });
        return;
      }

      // If verified and already subscribed, return error
      if (
        existingSubscriber.isVerified &&
        existingSubscriber.status === "SUBSCRIBED"
      ) {
        res.status(400).json({ message: "Email already subscribed" });
        return;
      }

      // If pending and verification code expired, send new verification
      if (
        !existingSubscriber.isVerified &&
        existingSubscriber.verificationCodeExpiresAt < new Date()
      ) {
        const verificationCode = generateToken();
        const unsubscribeCode = generateToken();

        await prisma.subscriber.update({
          where: {
            orgId_email: {
              orgId,
              email,
            },
          },
          data: {
            verificationCode,
            unsubscribeCode,
            verificationCodeExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
            status: "PENDING",
          },
        });

        await EmailService.sendVerificationEmail(
          email,
          orgId,
          verificationCode,
          unsubscribeCode,
        );

        res.status(200).json({ message: "New verification email sent" });
        return;
      }

      // If pending and verification code still valid
      res.status(400).json({
        message: "Verification email already sent. Please check your inbox.",
      });
      return;
    }

    // Create new subscriber
    const verificationCode = generateToken();
    const unsubscribeCode = generateToken();

    await prisma.subscriber.create({
      data: {
        email,
        orgId,
        verificationCode,
        unsubscribeCode,
        status: "PENDING",
        verificationCodeExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    await EmailService.sendVerificationEmail(
      email,
      orgId,
      verificationCode,
      unsubscribeCode,
    );

    res.status(201).json({ message: "Verification email sent successfully" });
    return;
  } catch (error) {
    console.error("Subscription error:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

export async function createSubscriberPublic(req: Request, res: Response) {
  try {
    const { email, orgId } = req.body;

    if (!email || !orgId) {
      res.status(400).json({
        message: "Bad Request: Email and Organization ID required",
      });
      return;
    }

    const existingSubscriber = await prisma.subscriber.findUnique({
      where: {
        orgId_email: {
          orgId,
          email,
        },
      },
    });

    if (existingSubscriber) {
      // If verified but unsubscribed, allow resubscription
      if (
        existingSubscriber.isVerified &&
        existingSubscriber.status === "UNSUBSCRIBED"
      ) {
        await prisma.subscriber.update({
          where: {
            orgId_email: {
              orgId,
              email,
            },
          },
          data: {
            status: "SUBSCRIBED",
            subscribedAt: new Date(),
            unsubscribedAt: null,
          },
        });
        res.status(200).json({ message: "Email re-subscribed successfully" });
        return;
      }

      // If verified and already subscribed, return error
      if (
        existingSubscriber.isVerified &&
        existingSubscriber.status === "SUBSCRIBED"
      ) {
        res.status(400).json({ message: "Email already subscribed" });
        return;
      }

      // If pending and verification code expired, send new verification
      if (
        !existingSubscriber.isVerified &&
        existingSubscriber.verificationCodeExpiresAt < new Date()
      ) {
        const verificationCode = generateToken();
        const unsubscribeCode = generateToken();

        await prisma.subscriber.update({
          where: {
            orgId_email: {
              orgId,
              email,
            },
          },
          data: {
            verificationCode,
            unsubscribeCode,
            verificationCodeExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
            status: "PENDING",
          },
        });

        await EmailService.sendVerificationEmail(
          email,
          orgId,
          verificationCode,
          unsubscribeCode,
        );

        res.status(200).json({ message: "New verification email sent" });
        return;
      }

      // If pending and verification code still valid
      res.status(400).json({
        message: "Verification email already sent. Please check your inbox.",
      });
      return;
    }

    // Create new subscriber
    const verificationCode = generateToken();
    const unsubscribeCode = generateToken();

    await prisma.subscriber.create({
      data: {
        email,
        orgId,
        verificationCode,
        unsubscribeCode,
        status: "PENDING",
        verificationCodeExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    await EmailService.sendVerificationEmail(
      email,
      orgId,
      verificationCode,
      unsubscribeCode,
    );

    res.status(201).json({ message: "Verification email sent successfully" });
    return;
  } catch (error) {
    console.error("Subscription error:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

export async function verifySubscriber(req: Request, res: Response) {
  try {
    const { verificationCode, orgId, email } = req.body;

    const subscriber = await prisma.subscriber.findUnique({
      where: { verificationCode, email, orgId, orgId_email: { orgId, email } },
    });

    if (!subscriber) {
      res.status(404).json({ message: "Invalid verification code/subscriber" });
      return;
    }

    if (subscriber.isVerified && subscriber.status === "SUBSCRIBED") {
      res.status(404).json({ message: "Invalid Request" });
      return;
    }
    // Update subscriber status
    const dataNow = new Date();
    await prisma.subscriber.update({
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

    res.status(200).json({ message: "subscriber updated" });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

export async function unsubscribeSubscriber(req: Request, res: Response) {
  try {
    const { unsubscribeCode, orgId, email } = req.body;
    const subscriber = await prisma.subscriber.findUnique({
      where: {
        unsubscribeCode,
        email,
        orgId,
        orgId_email: {
          orgId,
          email,
        },
      },
    });

    if (!subscriber) {
      res.status(404).json({ message: "Invalid unsubscribe code/subscriber" });
      return;
    }

    if (subscriber.isVerified === false || subscriber.status !== "SUBSCRIBED") {
      res.status(404).json({ message: "Invalid Request" });
      return;
    }

    // Update subscriber status
    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        status: "UNSUBSCRIBED",
        unsubscribedAt: new Date(),
      },
    });

    // Send unsubscribe confirmation
    await EmailService.sendUnsubscribeConfirmation(subscriber.email);

    res.status(200).json({ message: "unsubscribe confirmation sent" });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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

    res.status(200).json(subscribers);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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
      res.status(404).json({ message: "Subscriber not found" });
      return;
    }

    await prisma.subscriber.delete({
      where: { id },
    });

    res.sendStatus(204);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}
