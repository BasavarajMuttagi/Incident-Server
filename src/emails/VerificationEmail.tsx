import { Heading, Section, Text } from "@react-email/components";
import * as React from "react";
import { BaseTemplate } from "./BaseTemplate";

interface VerificationEmailProps {
  verificationLink: string;
  email: string;
  orgId: string;
  unsubscribeCode: string;
}

export const VerificationEmail: React.FC<VerificationEmailProps> = ({
  verificationLink,
  email,
  orgId,
  unsubscribeCode,
}) => (
  <BaseTemplate email={email} orgId={orgId} unsubscribeCode={unsubscribeCode}>
    <Section>
      <Heading className="text-2xl font-bold text-gray-800 mb-4">
        Verify your email address
      </Heading>
      <Text className="text-gray-600 mb-4">
        Thanks for signing up! Please use the verification link below to verify
        your email address:
      </Text>
      <Section className="bg-gray-100 p-4 rounded-md text-center mb-4">
        <Text className="font-mono text-2xl font-bold tracking-wide text-gray-800">
          {verificationLink}
        </Text>
      </Section>
      <Text className="text-sm text-gray-500">
        This code will expire in 15 minutes. If you didn't request this
        verification, you can safely ignore this email.
      </Text>
    </Section>
  </BaseTemplate>
);
