import { clerkClient, getAuth } from "@clerk/express";
import { ComponentStatus, Incident, IncidentTimeline } from "@prisma/client";
import { Request, Response } from "express";
import { io } from "../..";
import { IncidentComponentService } from "../services/IncidentComponentService";
import { IncidentService } from "../services/IncidentService";
import { IncidentTimelineService } from "../services/IncidentTimelineService";

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

    io.to(incident.orgId).emit("new-incident", incident);
    res.sendStatus(201);
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
    io.to(incident.orgId).emit("incident-updated", incident);
    res.sendStatus(200);
    return;
  } catch (error) {
    console.error("[UPDATE_INCIDENT_ERROR] Failed to update incident:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const deleteIncident = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string };
    const { incidentId } = req.params;
    const incident = await IncidentService.deleteIncident(incidentId, orgId);
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
    const components = req.body.components as {
      componentId: string;
      status: ComponentStatus;
    }[];

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

    const incidentComponents = components.map(({ componentId, status }) => ({
      incidentId,
      orgId,
      componentId,
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

const listUnattachedComponents = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string };
    const { incidentId } = req.params;

    if (!incidentId) {
      res.status(400).json({
        message: "Bad Request: Missing incident ID",
      });
      return;
    }

    const incidents = await IncidentComponentService.listUnattachedComponents(
      incidentId,
      orgId,
    );
    res.status(200).json(incidents);
    return;
  } catch (error) {
    console.error(
      "[LIST_UNATTACHED_COMPONENTS_ERROR] Failed to list unattached components:",
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
    const componentIds = req.body.componentIds as string[];
    if (!incidentId) {
      res.status(400).json({
        message: "Bad Request: Missing incident ID",
      });
      return;
    }

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

const deleteTimelineUpdates = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string };
    const { incidentId } = req.params;
    const incidentUpdateIds = req.body.incidentUpdateIds as string[];
    if (!incidentId) {
      res.status(400).json({
        message: "Bad Request: Missing incident ID",
      });
      return;
    }

    const incidents = await IncidentTimelineService.deleteUpdates(
      incidentUpdateIds,
      incidentId,
      orgId,
    );
    res.status(200).json(incidents);
    return;
  } catch (error) {
    console.error(
      "[DELETE_INCIDENT_UPDATES_ERROR] Failed to delete incident updates:",
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

    const updates = await IncidentTimelineService.listUpdates(
      incidentId,
      orgId,
    );
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

    const updates = await IncidentTimelineService.addUpdate({
      incidentId,
      message,
      status,
      orgId,
      userId,
    });
    io.to(updates.orgId).emit("timeline-updated", updates);
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

const getTimelineUpdate = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string; userId: string };
    const { incidentUpdateId, incidentId } = req.params;

    if (!incidentId) {
      res.status(400).json({
        message: "Bad Request: Missing incident ID",
      });
      return;
    }

    if (!incidentUpdateId) {
      res.status(400).json({
        message: "Bad Request: Missing incidentUpdateId",
      });
      return;
    }
    const update = await IncidentTimelineService.getUpdate(
      incidentUpdateId,
      incidentId,
      orgId,
    );
    res.status(200).json(update);
    return;
  } catch (error) {
    console.error(
      "[GET_TIMELINE_UPDATE_ERROR] Failed to get timeline update:",
      error,
    );
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const modifyUpdate = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string; userId: string };
    const { incidentUpdateId, incidentId } = req.params;
    const data = req.body as Pick<IncidentTimeline, "message" | "status">;

    if (!incidentId) {
      res.status(400).json({
        message: "Bad Request: Missing incident ID",
      });
      return;
    }

    if (!incidentUpdateId) {
      res.status(400).json({
        message: "Bad Request: Missing incidentUpdateId",
      });
      return;
    }
    const update = await IncidentTimelineService.modifyUpdate(
      incidentUpdateId,
      incidentId,
      orgId,
      data,
    );
    res.status(200).json(update);
    return;
  } catch (error) {
    console.error(
      "[GET_TIMELINE_UPDATE_ERROR] Failed to get timeline update:",
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
  deleteIncident,
  deleteTimelineUpdates,
  detachComponents,
  getIncidentById,
  getTimelineUpdate,
  listComponentsAttached,
  listIncidents,
  listTimelineUpdates,
  listUnattachedComponents,
  modifyUpdate,
  updateIncidentById,
};
