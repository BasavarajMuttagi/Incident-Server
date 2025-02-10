import * as React from "react";
import { Section, Text, Container } from "@react-email/components";
import { BaseTemplate } from "./BaseTemplate";
import { Component, Incident, Maintenance } from "@prisma/client";

interface NotificationEmailProps {
  email: string;
  orgId: string;
  type: "component" | "incident" | "maintenance";
  action: "created" | "updated" | "deleted";
  data: Component | Incident | Maintenance;
  unsubscribeCode: string;
}

export const NotificationEmail = ({
  email,
  orgId,
  type,
  action,
  data,
  unsubscribeCode,
}: NotificationEmailProps) => {
  const title = "name" in data ? data.name : data.title;
  const status = "status" in data ? data.status : undefined;
  const description = "description" in data ? data.description : undefined;
  const startAt = "startAt" in data ? data.startAt : undefined;
  const endAt = "endAt" in data ? data.endAt : undefined;

  const getStatusColor = (type: string, status?: string) => {
    if (!status) return "#6B7280";
    switch (type) {
      case "component":
        return status === "OPERATIONAL" ? "#22C55E" : "#EF4444";
      case "incident":
        return status === "RESOLVED" ? "#22C55E" : "#F59E0B";
      case "maintenance":
        return status === "COMPLETED" ? "#22C55E" : "#3B82F6";
      default:
        return "#6B7280";
    }
  };

  return (
    <BaseTemplate email={email} orgId={orgId} unsubscribeCode={unsubscribeCode}>
      <Container>
        <Section style={{ padding: "20px" }}>
          <Text
            style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 20px" }}
          >
            Status Update: {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
            {action}
          </Text>

          <Text style={{ fontSize: "20px", margin: "0 0 10px" }}>{title}</Text>

          {status && (
            <Text
              style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: "4px",
                backgroundColor: getStatusColor(type, status),
                color: "white",
                margin: "0 0 20px",
              }}
            >
              {status.replace(/_/g, " ")}
            </Text>
          )}

          {description && (
            <Text style={{ color: "#4B5563", margin: "0 0 20px" }}>
              {description}
            </Text>
          )}

          {type === "maintenance" && (startAt || endAt) && (
            <Section
              style={{
                backgroundColor: "#F3F4F6",
                padding: "16px",
                borderRadius: "8px",
              }}
            >
              {startAt && (
                <Text style={{ margin: "0 0 8px" }}>
                  <strong>Start Time:</strong>{" "}
                  {new Date(startAt).toLocaleString()}
                </Text>
              )}
              {endAt && (
                <Text style={{ margin: "0" }}>
                  <strong>End Time:</strong> {new Date(endAt).toLocaleString()}
                </Text>
              )}
            </Section>
          )}
        </Section>
      </Container>
    </BaseTemplate>
  );
};
