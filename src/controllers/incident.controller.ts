import { clerkClient, getAuth } from "@clerk/express";
import { Component, Incident } from "@prisma/client";
import { Request, Response } from "express";
import { IncidentComponentService } from "../services/IncidentComponentService";
import { IncidentService } from "../services/IncidentService";
import { IncidentTimeline } from "../services/IncidentTimelineService";

const createIncident = async (req: Request, res: Response) => {
  try {
    const { orgId, userId } = getAuth(req) as { orgId: string; userId: string };
    const { title, description, status, occuredAt, components } = req.body;

    if (!title || !description || !status || !occuredAt) {
      res.status(400).json({
        message:
          "Bad Request: Missing required fields (title, description, status, occuredAt)",
      });
      return;
    }

    const incident = await IncidentService.createIncident({
      title,
      description,
      status,
      occuredAt: new Date(occuredAt),
      components,
      orgId,
      userId,
    });

    res.status(201).json(incident);
    return;
  } catch (error) {
    console.error("[CREATE_INCIDENT_ERROR] Failed to create incident:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const getIncidentById = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string };
    const { incidentId } = req.params;

    if (!incidentId) {
      res.status(400).json({
        message: "Bad Request: Missing incident ID",
      });
      return;
    }

    const incident = await IncidentService.getIncident(incidentId, orgId);

    if (!incident) {
      res.status(404).json({ message: "Incident not found" });
      return;
    }

    res.status(200).json(incident);
    return;
  } catch (error) {
    console.error(
      "[GET_INCIDENT_ERROR] Failed to fetch incident by ID:",
      error,
    );
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const updateIncidentById = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string };
    const { incidentId: id } = req.params;
    const updateData = req.body as Pick<
      Incident,
      "title" | "description" | "occuredAt" | "status" | "resolvedAt"
    >;

    if (!id) {
      res.status(400).json({
        message: "Bad Request: Missing incident ID",
      });
      return;
    }

    const incident = await IncidentService.updateIncident({
      id,
      orgId,
      ...updateData,
      occuredAt: new Date(updateData.occuredAt),
      resolvedAt: updateData.resolvedAt
        ? new Date(updateData.resolvedAt)
        : null,
    });

    res.status(200).json(incident);
    return;
  } catch (error) {
    console.error("[UPDATE_INCIDENT_ERROR] Failed to update incident:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const deleteIncidents = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string };
    const { incidentId: id } = req.params;
    const { incidentIds } = req.body;

    if (!id) {
      res.status(400).json({
        message: "Bad Request: Missing incident ID",
      });
      return;
    }

    const incident = await IncidentService.deleteIncidents(incidentIds, orgId);
    res.status(200).json(incident);
    return;
  } catch (error) {
    console.error(
      "[DELETE_INCIDENTS_ERROR] Failed to delete incidents:",
      error,
    );
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const listIncidents = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string };
    const incidents = await IncidentService.listIncidents(orgId);
    res.json(incidents);
    return;
  } catch (error) {
    console.error("[LIST_INCIDENTS_ERROR] Failed to list incidents:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const addComponents = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string };
    const { incidentId } = req.params;
    const components = req.body.components as Component[];

    if (!incidentId) {
      res.status(400).json({
        message: "Bad Request: Missing incident ID",
      });
      return;
    }
    if (!components || components.length === 0) {
      res.status(400).json({
        message: "Bad Request: Missing components",
      });
      return;
    }

    const incidentComponents = components.map(({ id, status }) => ({
      incidentId,
      orgId,
      componentId: id,
      status,
    }));

    const incidents =
      await IncidentComponentService.addComponents(incidentComponents);
    res.status(200).json(incidents);
    return;
  } catch (error) {
    console.error("[ADD_COMPONENTS_ERROR] Failed to add components:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const listComponentsAttached = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string };
    const { incidentId } = req.params;

    if (!incidentId) {
      res.status(400).json({
        message: "Bad Request: Missing incident ID",
      });
      return;
    }

    const incidents = await IncidentComponentService.listComponentsAttached(
      incidentId,
      orgId,
    );
    res.status(200).json(incidents);
    return;
  } catch (error) {
    console.error(
      "[LIST_COMPONENTS_ERROR] Failed to list attached components:",
      error,
    );
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const detachComponents = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string };
    const { incidentId } = req.params;
    const components = req.body.components as Component[];
    if (!incidentId) {
      res.status(400).json({
        message: "Bad Request: Missing incident ID",
      });
      return;
    }
    const componentIds = components.map((e) => e.id);
    const incidents = await IncidentComponentService.detachComponents(
      orgId,
      incidentId,
      componentIds,
    );
    res.status(200).json(incidents);
    return;
  } catch (error) {
    console.error(
      "[DETACH_COMPONENTS_ERROR] Failed to detach components:",
      error,
    );
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const listTimelineUpdates = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string };
    const { incidentId } = req.params;
    if (!incidentId) {
      res.status(400).json({
        message: "Bad Request: Missing incident ID",
      });
      return;
    }

    const updates = await IncidentTimeline.listUpdates(incidentId, orgId);
    const userPromises = updates.map(async (update) => {
      const userInfo = await clerkClient.users.getUser(update.userId);
      return {
        ...update,
        user: userInfo.fullName,
      };
    });

    const updatesWithUserInfo = await Promise.all(userPromises);
    res.status(200).json(updatesWithUserInfo);
    return;
  } catch (error) {
    console.error(
      "[LIST_TIMELINE_ERROR] Failed to list timeline updates:",
      error,
    );
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const addTimelineUpdate = async (req: Request, res: Response) => {
  try {
    const { orgId, userId } = getAuth(req) as { orgId: string; userId: string };
    const { incidentId } = req.params;
    const { message, status } = req.body;

    if (!incidentId) {
      res.status(400).json({
        message: "Bad Request: Missing incident ID",
      });
      return;
    }

    const updates = await IncidentTimeline.addUpdate({
      incidentId,
      message,
      status,
      orgId,
      userId,
    });
    res.status(200).json(updates);
    return;
  } catch (error) {
    console.error(
      "[ADD_TIMELINE_UPDATE_ERROR] Failed to add timeline update:",
      error,
    );
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export {
  addComponents,
  addTimelineUpdate,
  createIncident,
  deleteIncidents,
  detachComponents,
  getIncidentById,
  listComponentsAttached,
  listIncidents,
  listTimelineUpdates,
  updateIncidentById,
};
