import { Text } from "@react-email/components";
import * as React from "react";

type StatusType =
  | "critical"
  | "major"
  | "minor"
  | "resolved"
  | "scheduled"
  | "in-progress";

interface StatusBadgeProps {
  status: StatusType;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
    const baseStyles =
      "px-3 py-1 rounded-full font-medium text-sm inline-block";
    switch (status) {
      case "critical":
        return `${baseStyles} bg-red-100 text-red-800`;
      case "major":
        return `${baseStyles} bg-orange-100 text-orange-800`;
      case "minor":
        return `${baseStyles} bg-yellow-100 text-yellow-800`;
      case "resolved":
        return `${baseStyles} bg-green-100 text-green-800`;
      case "scheduled":
        return `${baseStyles} bg-blue-100 text-blue-800`;
      case "in-progress":
        return `${baseStyles} bg-purple-100 text-purple-800`;
      default:
        return baseStyles;
    }
  };

  return (
    <Text className={getStatusStyles()}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Text>
  );
};
