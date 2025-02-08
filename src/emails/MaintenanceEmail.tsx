import * as React from "react";
import { Heading, Text, Section } from "@react-email/components";
import { BaseTemplate } from "./BaseTemplate";
import { StatusBadge } from "./StatusBadge";

interface MaintenanceEmailProps {
  email: string;
  orgId: string;
  maintenanceTitle: string;
  status: "scheduled" | "in-progress";
  description: string;
  startTime: string;
  endTime: string;
  affectedServices: string[];
  impact: string;
  alternativeAccess?: string;
}

export const MaintenanceEmail: React.FC<MaintenanceEmailProps> = ({
  email,
  orgId,
  maintenanceTitle,
  status,
  description,
  startTime,
  endTime,
  affectedServices,
  impact,
  alternativeAccess,
}) => (
  <BaseTemplate email={email} orgId={orgId}>
    <Section>
      <div className="mb-6">
        <StatusBadge status={status} />
      </div>

      <Heading className="text-2xl font-bold text-gray-800 mb-4">
        {maintenanceTitle}
      </Heading>

      <Text className="text-gray-600 mb-4">{description}</Text>

      <Section className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Text className="font-semibold">Start Time:</Text>
            <Text className="text-gray-600">{startTime}</Text>
          </div>
          <div>
            <Text className="font-semibold">End Time:</Text>
            <Text className="text-gray-600">{endTime}</Text>
          </div>
        </div>
      </Section>

      <Section className="mb-4">
        <Text className="font-semibold mb-2">Affected Services:</Text>
        <ul className="list-disc pl-6 text-gray-600">
          {affectedServices.map((service, index) => (
            <li key={index}>{service}</li>
          ))}
        </ul>
      </Section>

      <Section className="bg-yellow-50 p-4 rounded-lg mb-4">
        <Text className="font-semibold mb-2">Expected Impact:</Text>
        <Text className="text-gray-600">{impact}</Text>
      </Section>

      {alternativeAccess && (
        <Section className="bg-blue-50 p-4 rounded-lg">
          <Text className="font-semibold mb-2">Alternative Access:</Text>
          <Text className="text-gray-600">{alternativeAccess}</Text>
        </Section>
      )}
    </Section>
  </BaseTemplate>
);
