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
        message: "Unauthorized: Missing authentication credentials",
      });
      return;
    }

    const memberships = await clerkClient.users.getOrganizationMembershipList({
      userId: userId,
    });

    const isMember = memberships.data.some((m) => m.organization.id === orgId);

    if (!isMember) {
      res.status(403).json({ error: "Not a member of this organization" });
      return;
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({ error: "Organization access denied" });
    return;
  }
};
export default requireOrganization;
