import { clerkClient, getAuth } from "@clerk/express";
import { Maintenance, MaintenanceTimeline } from "@prisma/client";
import { Request, Response } from "express";
import { io } from "../..";
import { EmailService } from "../services/EmailService";
import { MaintenanceService } from "../services/MaintenanceService";
import { MaintenanceTimelineService } from "../services/MaintenanceTimelineService";

const createMaintenance = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string; userId: string };
    const { title, description, startAt, endAt } = req.body as Maintenance;

    if (!title || !description || !startAt) {
      res.status(400).json({
        message:
          "Bad Request: Missing required fields (title, description, status, startAt)",
      });
      return;
    }

    const maintenance = await MaintenanceService.createMaintenance({
      title,
      description,

      startAt: new Date(startAt),
      endAt: endAt ? new Date(endAt) : null,
      orgId,
    });
    await EmailService.notifySubscribers(
      orgId,
      "maintenance",
      "created",
      maintenance,
    );
    io.to(maintenance.orgId).emit("new-maintenance", maintenance);
    res.sendStatus(201);
    return;
  } catch (error) {
    console.error(
      "[CREATE_MAINTENANCE_ERROR] Failed to create maintenance:",
      error,
    );
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const getMaintenanceById = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string };
    const { maintenanceId } = req.params;

    if (!maintenanceId) {
      res.status(400).json({
        message: "Bad Request: Missing maintenance ID",
      });
      return;
    }

    const maintenance = await MaintenanceService.getMaintenance(
      maintenanceId,
      orgId,
    );

    if (!maintenance) {
      res.status(404).json({ message: "Maintenance not found" });
      return;
    }

    res.status(200).json(maintenance);
    return;
  } catch (error) {
    console.error(
      "[GET_MAINTENANCE_ERROR] Failed to fetch maintenance by ID:",
      error,
    );
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const updateMaintenanceById = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string };
    const { maintenanceId: id } = req.params;
    const updateData = req.body;

    if (!id) {
      res.status(400).json({
        message: "Bad Request: Missing maintenance ID",
      });
      return;
    }

    const maintenance = await MaintenanceService.updateMaintenance({
      id,
      orgId,
      ...updateData,
      ...(updateData.startAt && { startAt: new Date(updateData.startAt) }),
      ...(updateData.endAt && { endAt: new Date(updateData.endAt) }),
    });
    await EmailService.notifySubscribers(
      orgId,
      "maintenance",
      "updated",
      maintenance,
    );
    io.to(maintenance.orgId).emit("maintenance-updated", maintenance);
    res.sendStatus(200);
    return;
  } catch (error) {
    console.error(
      "[UPDATE_MAINTENANCE_ERROR] Failed to update maintenance:",
      error,
    );
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const deleteMaintenance = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string };
    const { maintenanceId } = req.params;
    if (!maintenanceId) {
      res.status(400).json({
        message: "Bad Request: Missing maintenance ID",
      });
      return;
    }
    const maintenance = await MaintenanceService.deleteMaintenance(
      maintenanceId,
      orgId,
    );
    await EmailService.notifySubscribers(
      orgId,
      "maintenance",
      "deleted",
      maintenance,
    );
    io.to(maintenance.orgId).emit("maintenance-deleted", maintenance.id);
    res.status(200).json(maintenance);
    return;
  } catch (error) {
    console.error(
      "[DELETE_MAINTENANCE_ERROR] Failed to delete maintenance:",
      error,
    );
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const listMaintenances = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string };
    const maintenances = await MaintenanceService.listMaintenances(orgId);
    res.json(maintenances);
    return;
  } catch (error) {
    console.error(
      "[LIST_MAINTENANCE_ERROR] Failed to list maintenances:",
      error,
    );
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const listTimelineUpdates = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string };
    const { maintenanceId } = req.params;

    if (!maintenanceId) {
      res.status(400).json({
        message: "Bad Request: Missing maintenance ID",
      });
      return;
    }

    const updates = await MaintenanceTimelineService.listUpdates(
      maintenanceId,
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
    const { maintenanceId } = req.params;
    const { message, status } = req.body;

    if (!maintenanceId) {
      res.status(400).json({
        message: "Bad Request: Missing maintenance ID",
      });
      return;
    }
    if (!message || !status) {
      res.status(400).json({
        message: "Bad Request: Missing message or status",
      });
      return;
    }
    const update = await MaintenanceTimelineService.addUpdate({
      maintenanceId,
      message,
      status,
      orgId,
      userId,
    });

    io.to(update.orgId).emit("maintenance-timeline-updated", update);
    res.status(200).json(update);
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

const deleteTimelineUpdates = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string };
    const { maintenanceId } = req.params;
    const maintenanceUpdateIds = req.body.maintenanceUpdateIds as string[];

    if (!maintenanceId) {
      res.status(400).json({
        message: "Bad Request: Missing maintenance ID",
      });
      return;
    }
    if (!maintenanceUpdateIds || maintenanceUpdateIds.length === 0) {
      res.status(400).json({
        message: "Bad Request: Missing update IDs",
      });
      return;
    }
    const result = await MaintenanceTimelineService.deleteUpdates(
      maintenanceUpdateIds,
      maintenanceId,
      orgId,
    );
    maintenanceUpdateIds.forEach((element) => {
      io.to(orgId).emit("maintenance-timeline-deleted", maintenanceId, element);
    });
    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(
      "[DELETE_MAINTENANCE_UPDATES_ERROR] Failed to delete maintenance updates:",
      error,
    );
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const getTimelineUpdate = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string };
    const { updateId, maintenanceId } = req.params;

    if (!maintenanceId) {
      res.status(400).json({
        message: "Bad Request: Missing maintenance ID",
      });
      return;
    }

    if (!updateId) {
      res.status(400).json({
        message: "Bad Request: Missing updateId",
      });
      return;
    }

    const update = await MaintenanceTimelineService.getUpdate(
      updateId,
      maintenanceId,
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
    const { orgId } = getAuth(req) as { orgId: string };
    const { updateId, maintenanceId } = req.params;
    const { message, status } = req.body as Pick<
      MaintenanceTimeline,
      "message" | "status"
    >;

    if (!maintenanceId) {
      res.status(400).json({
        message: "Bad Request: Missing maintenance ID",
      });
      return;
    }

    if (!updateId) {
      res.status(400).json({
        message: "Bad Request: Missing updateId",
      });
      return;
    }

    if (!message || !status) {
      res.status(400).json({
        message: "Bad Request: Missing message or status",
      });
      return;
    }
    const update = await MaintenanceTimelineService.modifyUpdate(
      updateId,
      maintenanceId,
      orgId,
      { message, status },
    );

    res.status(200).json(update);
    return;
  } catch (error) {
    console.error(
      "[MODIFY_TIMELINE_UPDATE_ERROR] Failed to modify timeline update:",
      error,
    );
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export {
  addTimelineUpdate,
  createMaintenance,
  deleteMaintenance,
  deleteTimelineUpdates,
  getMaintenanceById,
  getTimelineUpdate,
  listMaintenances,
  listTimelineUpdates,
  modifyUpdate,
  updateMaintenanceById,
};
