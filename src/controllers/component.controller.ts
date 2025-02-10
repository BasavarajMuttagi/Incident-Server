import { getAuth } from "@clerk/express";
import { Component, ComponentStatus } from "@prisma/client";
import { Request, Response } from "express";
import { io } from "../..";
import { ComponentService } from "../services/ComponentService";
import { IncidentComponentService } from "../services/IncidentComponentService";
import { EmailService } from "../services/EmailService";

const createComponent = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string; userId: string };
    const { name, description, status } = req.body;

    if (!name || !status) {
      res.status(400).json({
        message: "Bad Request: Name ,Description and Status are required",
      });
      return;
    }

    if (status && !Object.values(ComponentStatus).includes(status)) {
      res.status(400).json({
        message: "Bad Request: Invalid component status",
      });
      return;
    }

    const component = await ComponentService.createComponent({
      name,
      description,
      status,
      orgId,
    });
    await EmailService.notifySubscribers(
      orgId,
      "component",
      "created",
      component,
    );
    io.to(component.orgId).emit("new-component", component);
    res.status(201).json(component);
    return;
  } catch (error) {
    console.error(
      "[CREATE_COMPONENT_ERROR] Failed to create component:",
      error,
    );
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const updateComponent = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string; userId: string };
    const { componentId } = req.params;
    const updateData = req.body as Pick<
      Component,
      "name" | "description" | "status"
    >;

    if (!componentId) {
      res.status(400).json({
        message: "Bad Request: Missing component ID",
      });
      return;
    }

    if (!updateData.name && !updateData.description && !updateData.status) {
      res.status(400).json({
        message: "Bad Request: No valid fields to update",
      });
      return;
    }

    const component = await ComponentService.updateComponent(
      componentId,
      orgId,
      updateData,
    );
    await EmailService.notifySubscribers(
      orgId,
      "component",
      "updated",
      component,
    );
    io.to(component.orgId).emit("component-update", component);
    res.json(component);
    return;
  } catch (error) {
    console.error(
      "[UPDATE_COMPONENT_ERROR] Failed to update component:",
      error,
    );
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const deleteComponent = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string; userId: string };
    const { componentId } = req.params;

    if (!componentId) {
      res.status(400).json({
        message: "Bad Request: Missing component ID",
      });
      return;
    }

    const data = await ComponentService.deleteComponent(componentId, orgId);
    await EmailService.notifySubscribers(orgId, "component", "deleted", data);
    io.to(data.orgId).emit("component-deleted", data.id);
    res.sendStatus(204);
    return;
  } catch (error) {
    console.error(
      "[DELETE_COMPONENT_ERROR] Failed to delete component:",
      error,
    );
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const getComponent = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string; userId: string };
    const { componentId } = req.params;

    if (!componentId) {
      res.status(400).json({
        message: "Bad Request: Missing component ID",
      });
      return;
    }

    const component = await ComponentService.getComponent(componentId, orgId);

    if (!component) {
      res.status(404).json({ message: "Component not found" });
      return;
    }

    res.json(component);
    return;
  } catch (error) {
    console.error("[GET_COMPONENT_ERROR] Failed to fetch component:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const listComponents = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string; userId: string };

    // Get initial components
    const components = await ComponentService.listComponents(orgId);

    // Use Promise.all with map instead of forEach
    const componentsWithStatus = await Promise.all(
      components.map(async (element) => {
        const status = await IncidentComponentService.getComponentStatus(
          element.id,
          orgId,
        );
        if (status === "OPERATIONAL") {
          return element;
        }
        return { ...element, status };
      }),
    );

    res.json(componentsWithStatus);
  } catch (error) {
    console.error("[LIST_COMPONENTS_ERROR] Failed to list components:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export {
  createComponent,
  deleteComponent,
  getComponent,
  listComponents,
  updateComponent,
};
