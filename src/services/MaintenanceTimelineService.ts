import { MaintenanceStatus, MaintenanceTimeline } from "@prisma/client";
import { prisma } from "../../prisma/db";

export class MaintenanceTimelineService {
  static async addUpdate(data: {
    maintenanceId: string;
    message: string;
    status: MaintenanceStatus;
    orgId: string;
    userId: string;
  }) {
    return prisma.maintenanceTimeline.create({
      data,
    });
  }

  static async listUpdates(maintenanceId: string, orgId: string) {
    return prisma.maintenanceTimeline.findMany({
      where: {
        maintenanceId,
        orgId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async deleteUpdates(
    updateIds: string[],
    maintenanceId: string,
    orgId: string,
  ) {
    return prisma.maintenanceTimeline.deleteMany({
      where: {
        id: {
          in: updateIds,
        },
        maintenanceId,
        orgId,
      },
    });
  }

  static async getUpdate(
    updateId: string,
    maintenanceId: string,
    orgId: string,
  ) {
    return prisma.maintenanceTimeline.findFirst({
      where: {
        id: updateId,
        maintenanceId,
        orgId,
      },
    });
  }

  static async modifyUpdate(
    updateId: string,
    maintenanceId: string,
    orgId: string,
    data: Pick<MaintenanceTimeline, "message" | "status">,
  ) {
    return prisma.maintenanceTimeline.update({
      where: {
        id: updateId,
        maintenanceId,
        orgId,
      },
      data,
    });
  }
}
