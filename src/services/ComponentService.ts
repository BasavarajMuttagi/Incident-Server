import { Component, ComponentStatus } from "@prisma/client";
import { prisma } from "../../prisma/db";

export class ComponentService {
  static async createComponent(
    data: Pick<Component, "name" | "description" | "status" | "orgId">,
  ) {
    const { name, description, status, orgId } = data;

    return await prisma.component.create({
      data: {
        name,
        description,
        status,
        orgId,
      },
    });
  }

  static async updateComponent(
    id: string,
    orgId: string,
    data: Pick<Component, "name" | "description" | "status">,
  ) {
    return await prisma.component.update({
      where: { id, orgId },
      data: {
        ...data,
      },
    });
  }

  static async deleteComponent(id: string, orgId: string) {
    return await prisma.component.delete({
      where: { id, orgId },
    });
  }

  static async getComponent(
    id: string,
    orgId: string,
  ): Promise<Component | null> {
    return await prisma.component.findFirst({
      where: { id, orgId },
      include: {
        incidents: true,
        maintenanceComponent: true,
      },
    });
  }

  static async listComponents(orgId: string) {
    return await prisma.component.findMany({
      where: { orgId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateComponentStatus(
    id: string,
    orgId: string,
    status: ComponentStatus,
  ) {
    return await prisma.component.update({
      where: { id, orgId },
      data: {
        status,
      },
    });
  }

  static async checkComponentExists(name: string, orgId: string) {
    const component = await prisma.component.findFirst({
      where: { name, orgId },
    });
    return !!component;
  }
}
