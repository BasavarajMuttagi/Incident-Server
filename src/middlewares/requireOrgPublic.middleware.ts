import { clerkClient } from "@clerk/express";
import { NextFunction, Request, Response } from "express";
const requireOrgPublic = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, orgId } = req.body;
    if (!email || !orgId) {
      res.status(400).json({
        message: "Bad Request: Email and organization ID are required",
      });
      return;
    }

    const organization = await clerkClient.organizations.getOrganization({
      organizationId: orgId,
    });

    if (!organization) {
      res.status(400).json({
        message: "Organization not found",
      });
      return;
    }

    next();
  } catch (error) {
    if (
      (error as { code: number; clerkError: boolean })?.code === 404 ||
      (error as { code: number; clerkError: boolean }).clerkError
    ) {
      res.status(400).json({
        message: "Organization not found",
      });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
export default requireOrgPublic;
