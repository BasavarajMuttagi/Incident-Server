import * as React from "react";
import {
  Html,
  Body,
  Container,
  Tailwind,
  Text,
  Link,
  Hr,
} from "@react-email/components";

interface BaseTemplateProps {
  children: React.ReactNode;
  showUnsubscribe?: boolean;
  email?: string;
  orgId?: string;
  unsubscribeCode?: string;
}

export const BaseTemplate: React.FC<BaseTemplateProps> = ({
  children,
  showUnsubscribe = true,
  email,
  orgId,
  unsubscribeCode,
}) => {
  const unsubscribeUrl = `${process.env.FE_BASE_URL}/unsubscribe?email=${email}&orgId=${orgId}&unsubscribeCode=${unsubscribeCode}`;

  return (
    <Html>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="max-w-2xl mx-auto my-8 bg-white p-8 rounded-lg shadow-md">
            {children}

            {showUnsubscribe && (
              <>
                <Hr className="border-gray-200 my-6" />
                <Text className="text-sm text-gray-500 text-center">
                  Don't want to receive these emails?{" "}
                  <Link
                    href={unsubscribeUrl}
                    className="text-blue-600 underline"
                  >
                    Unsubscribe here
                  </Link>
                </Text>
              </>
            )}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
