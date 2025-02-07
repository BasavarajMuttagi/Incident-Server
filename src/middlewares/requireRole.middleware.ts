import { clerkClient, getAuth } from "@clerk/express";
import { NextFunction, Request, Response } from "express";

// Define possible organization roles
type OrganizationRole = "admin" | "member" | "guest";

const requireRole = (allowedRoles: OrganizationRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orgId, userId } = getAuth(req);

      const memberships = await clerkClient.users.getOrganizationMembershipList(
        {
          userId: userId!,
        },
      );

      const membership = memberships.data.find(
        (m) => m.organization.id === orgId,
      );

      if (
        !membership ||
        !allowedRoles.includes(membership.role as OrganizationRole)
      ) {
        return res.status(403).json({
          message: `Forbidden: This action requires one of these roles: ${allowedRoles.join(", ")}`,
        });
      }

      next();
    } catch (error) {
      console.error("[ROLE_CHECK_ERROR]", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};

export default requireRole;
