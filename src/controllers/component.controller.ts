import { getAuth } from "@clerk/express";
import { ComponentStatus } from "@prisma/client";
import { Request, Response } from "express";
import { io } from "../..";
import { ComponentService } from "../services/ComponentService";
import { IncidentComponentService } from "../services/IncidentComponentService";

const createComponent = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req) as { orgId: string; userId: string };
    const { name, description, status } = req.body;

    if (!name) {
      res.status(400).json({
        message: "Bad Request: Name is required",
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
    const updateData = req.body;

    if (!componentId) {
      res.status(400).json({
        message: "Bad Request: Missing component ID",
      });
      return;
    }

    const component = await ComponentService.updateComponent(
      componentId,
      orgId,
      updateData,
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
    io.to(data.orgId).emit("component-delete", data);
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

    try {
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
      // Error handling
      console.error("Error fetching component statuses:", error);
      res.status(500).json({ error: "Failed to fetch component statuses" });
    }
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
