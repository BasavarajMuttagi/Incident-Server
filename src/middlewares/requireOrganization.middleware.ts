import { clerkClient, getAuth } from "@clerk/express";
import { NextFunction, Request, Response } from "express";

const requireOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orgId, userId } = getAuth(req);

    if (!orgId || !userId) {
      res.status(401).json({
        message: "Organization ID is required",
      });
      return;
    }

    // Get all organization memberships in one call
    const memberships = await clerkClient.users.getOrganizationMembershipList({
      userId: userId,
    });

    // Check membership using array method
    const isMember = memberships.data.some((m) => m.organization.id === orgId);

    if (!isMember) {
      res.status(403).json({ error: "Not a member of this organization" });
      return;
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error validating organization access",
    });
    return;
  }
};

export default requireOrganization;
