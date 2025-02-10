import { ComponentStatus } from "@prisma/client";
import { prisma } from "../../prisma/db";

export class MaintenanceComponentService {
  static async addComponents(
    components: {
      maintenanceId: string;
      componentId: string;
      status: ComponentStatus;
      orgId: string;
    }[],
  ) {
    return prisma.maintenanceComponent.createMany({
      data: components,
    });
  }

  static async listComponentsAttached(maintenanceId: string, orgId: string) {
    return prisma.maintenanceComponent.findMany({
      where: {
        maintenanceId,
        orgId,
      },
      include: {
        component: true,
      },
    });
  }

  static async listUnattachedComponents(maintenanceId: string, orgId: string) {
    const attachedComponents = await prisma.maintenanceComponent.findMany({
      where: {
        maintenanceId,
        orgId,
      },
      select: {
        componentId: true,
      },
    });

    const attachedComponentIds = attachedComponents.map((c) => c.componentId);

    return prisma.component.findMany({
      where: {
        orgId,
        id: {
          notIn: attachedComponentIds,
        },
      },
    });
  }

  static async detachComponents(
    orgId: string,
    maintenanceId: string,
    componentIds: string[],
  ) {
    return prisma.maintenanceComponent.deleteMany({
      where: {
        orgId,
        maintenanceId,
        componentId: {
          in: componentIds,
        },
      },
    });
  }
}
