import { Heading, Section, Text } from "@react-email/components";
import * as React from "react";
import { BaseTemplate } from "./BaseTemplate";

export const UnsubscribeEmail = () => (
  <BaseTemplate showUnsubscribe={false}>
    <Section>
      <Heading className="text-2xl font-bold text-gray-800 mb-4">
        Unsubscribe Confirmation
      </Heading>
      <Text className="text-gray-600 mb-4">
        You have been successfully unsubscribed from our updates.
      </Text>
      <Text className="text-gray-600 mb-4">
        We're sorry to see you go! If you change your mind, you can always
        subscribe again.
      </Text>
    </Section>
  </BaseTemplate>
);
