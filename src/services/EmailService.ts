import { Component, Incident, Maintenance } from "@prisma/client";
import { renderAsync } from "@react-email/components";
import { config } from "dotenv";
import { Resend } from "resend";
import { prisma } from "../../prisma/db";
import { NotificationEmail } from "../emails/NotificationEmail";
import { SubscriptionEmail } from "../emails/SubscriptionEmail";
import { UnsubscribeEmail } from "../emails/UnsubscribeEmail";
import { VerificationEmail } from "../emails/VerificationEmail";

config();
const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  static async sendVerificationEmail(
    email: string,
    orgId: string,
    verificationCode: string,
    unsubscribeCode: string,
  ) {
    const verificationLink = `${process.env.FE_BASE_URL}/verify?email=${email}&orgId=${orgId}&verificationCode=${verificationCode}`;
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Verify your email address",
      react: await VerificationEmail({
        email,
        orgId,
        verificationLink,
        unsubscribeCode,
      }),
    });
  }

  static async sendSubscriptionConfirmation(
    email: string,
    orgId: string,
    unsubscribeCode: string,
  ) {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Subscription Confirmed",
      react: await SubscriptionEmail({ email, orgId, unsubscribeCode }),
    });
  }

  static async sendUnsubscribeConfirmation(email: string) {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Unsubscribe Confirmation",
      react: UnsubscribeEmail(),
    });
  }

  static async getSubscriberById(id: string) {
    return prisma.subscriber.findUnique({
      where: {
        id,
      },
    });
  }

  static async getSubscriberByEmail(email: string, orgId: string) {
    return prisma.subscriber.findUnique({
      where: {
        orgId_email: {
          email,
          orgId,
        },
      },
    });
  }

  static async notifySubscribers(
    orgId: string,
    type: "component" | "incident" | "maintenance",
    action: "created" | "updated" | "deleted",
    data: Component | Incident | Maintenance,
  ) {
    try {
      const subscribers = await prisma.subscriber.findMany({
        where: {
          orgId,
        },
      });

      const emailPromises = subscribers.map(async (subscriber) => {
        const html = await renderAsync(
          NotificationEmail({
            email: subscriber.email,
            orgId,
            type,
            action,
            data,
            unsubscribeCode: subscriber.unsubscribeCode,
          }) as React.ReactElement,
        );

        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: subscriber.email,
          subject: `Status Update: ${type.charAt(0).toUpperCase() + type.slice(1)} ${action}`,
          html,
        });
      });

      await Promise.all(emailPromises);
    } catch (error) {
      console.error("[EMAIL_SERVICE_ERROR]", error);
    }
  }
}
