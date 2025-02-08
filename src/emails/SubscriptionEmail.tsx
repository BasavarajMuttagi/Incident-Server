import * as React from "react";
import { Heading, Text, Section } from "@react-email/components";
import { BaseTemplate } from "./BaseTemplate";

interface SubscriptionEmailProps {
  email: string;
  orgId: string;
  unsubscribeCode: string;
}

export const SubscriptionEmail: React.FC<SubscriptionEmailProps> = ({
  email,
  orgId,
  unsubscribeCode,
}) => (
  <BaseTemplate email={email} orgId={orgId} unsubscribeCode={unsubscribeCode}>
    <Section>
      <Heading className="text-2xl font-bold text-gray-800 mb-4">
        Subscription Confirmed
      </Heading>
      <Text className="text-gray-600 mb-4">
        Thank you for subscribing to our updates! You're now part of our
        community.
      </Text>
      <Text className="text-gray-600">
        You will receive notifications about:
      </Text>
      <ul className="list-disc pl-6 mb-4 text-gray-600">
        <li>Service status updates</li>
        <li>New feature announcements</li>
        <li>Important security notifications</li>
        <li>System maintenance schedules</li>
      </ul>
    </Section>
  </BaseTemplate>
);
