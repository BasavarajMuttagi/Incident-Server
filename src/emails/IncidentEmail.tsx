import { Heading, Section, Text } from "@react-email/components";
import * as React from "react";
import { BaseTemplate } from "./BaseTemplate";
import { StatusBadge } from "./StatusBadge";

interface IncidentEmailProps {
  email: string;
  orgId: string;
  incidentTitle: string;
  status: "critical" | "major" | "minor" | "resolved";
  description: string;
  affectedServices: string[];
  updates?: {
    timestamp: string;
    message: string;
  }[];
  estimatedResolutionTime?: string;
}

export const IncidentEmail: React.FC<IncidentEmailProps> = ({
  email,
  orgId,
  incidentTitle,
  status,
  description,
  affectedServices,
  updates,
  estimatedResolutionTime,
}) => (
  <BaseTemplate email={email} orgId={orgId}>
    <Section>
      <div className="mb-6">
        <StatusBadge status={status} />
      </div>

      <Heading className="text-2xl font-bold text-gray-800 mb-4">
        {incidentTitle}
      </Heading>

      <Text className="text-gray-600 mb-4">{description}</Text>

      <Section className="bg-gray-50 p-4 rounded-lg mb-4">
        <Text className="font-semibold mb-2">Affected Services:</Text>
        <ul className="list-disc pl-6 mb-4 text-gray-600">
          {affectedServices.map((service, index) => (
            <li key={index}>{service}</li>
          ))}
        </ul>
      </Section>

      {estimatedResolutionTime && (
        <Text className="text-gray-600 mb-4">
          Estimated Resolution Time: {estimatedResolutionTime}
        </Text>
      )}

      {updates && updates.length > 0 && (
        <Section className="border-t border-gray-200 pt-4 mt-4">
          <Text className="font-semibold mb-2">Updates:</Text>
          {updates.map((update, index) => (
            <div key={index} className="mb-3">
              <Text className="text-sm text-gray-500">{update.timestamp}</Text>
              <Text className="text-gray-600">{update.message}</Text>
            </div>
          ))}
        </Section>
      )}
    </Section>
  </BaseTemplate>
);
