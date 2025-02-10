import {
  ComponentStatus,
  Maintenance,
  MaintenanceStatus,
} from "@prisma/client";
import { prisma } from "../../prisma/db";

export class MaintenanceService {
  static async createMaintenance(data: {
    title: string;
    description: string;
    status: MaintenanceStatus;
    startAt: Date;
    endAt: Date;
    orgId: string;
    userId: string;
    components?: { componentId: string; status: ComponentStatus }[];
  }): Promise<Maintenance> {
    return prisma.$transaction(async (tx) => {
      const maintenance = await tx.maintenance.create({
        data: {
          title: data.title,
          description: data.description,
          startAt: data.startAt,
          endAt: data.endAt,
          orgId: data.orgId,
        },
        include: {
          timeline: true,
        },
      });

      return maintenance;
    });
  }

  static async getMaintenance(maintenanceId: string, orgId: string) {
    return prisma.maintenance.findUnique({
      where: {
        id: maintenanceId,
        orgId,
      },
    });
  }

  static async updateMaintenance({
    id,
    orgId,
    ...rest
  }: Pick<
    Maintenance,
    "id" | "orgId" | "title" | "description" | "startAt" | "endAt"
  >) {
    return prisma.maintenance.update({
      where: {
        id,
        orgId,
      },
      data: { ...rest },
      include: {
        timeline: true,
      },
    });
  }

  static async deleteMaintenance(maintenanceId: string, orgId: string) {
    return prisma.maintenance.deleteMany({
      where: {
        id: maintenanceId,
        orgId,
      },
    });
  }

  static async listMaintenances(orgId: string) {
    return prisma.maintenance.findMany({
      where: {
        orgId,
      },
      orderBy: {
        startAt: "desc",
      },
    });
  }
}
