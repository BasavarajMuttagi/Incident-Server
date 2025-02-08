import { config } from "dotenv";
import { Resend } from "resend";
import { prisma } from "../../prisma/db";
import { SubscriptionEmail } from "../emails/SubscriptionEmail";
import { UnsubscribeEmail } from "../emails/UnsubscribeEmail";
import { VerificationEmail } from "../emails/VerificationEmail";

config();
export class EmailService {
  private static resend = new Resend(process.env.RESEND_API_KEY);

  static async sendVerificationEmail(
    email: string,
    orgId: string,
    verificationCode: string,
    unsubscribeCode: string,
  ) {
    const verificationLink = `${process.env.FE_BASE_URL}/verify?email=${email}&orgId=${orgId}&verificationCode=${verificationCode}`;
    await this.resend.emails.send({
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
    await this.resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Subscription Confirmed",
      react: await SubscriptionEmail({ email, orgId, unsubscribeCode }),
    });
  }

  static async sendUnsubscribeConfirmation(email: string) {
    await this.resend.emails.send({
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
}
