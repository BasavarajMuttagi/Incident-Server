import {
  ComponentStatus,
  Incident,
  IncidentComponent,
  IncidentSeverity,
  IncidentStatus,
} from "@prisma/client";
import { prisma } from "../../prisma/db";

export class IncidentService {
  static async createIncident(data: {
    title: string;
    description: string;
    severity: IncidentSeverity;
    occuredAt: Date;
    orgId: string;
    userId: string;
    components?: { componentId: string; status: ComponentStatus }[];
  }): Promise<Incident> {
    return prisma.$transaction(async (tx) => {
      const incident = await tx.incident.create({
        data: {
          title: data.title,
          description: data.description,
          severity: data.severity,
          occuredAt: data.occuredAt,
          orgId: data.orgId,
          userId: data.userId,
        },
      });

      if (data.components?.length) {
        await tx.incidentComponent.createMany({
          data: data.components.map((comp) => ({
            incidentId: incident.id,
            componentId: comp.componentId,
            status: comp.status,
          })),
        });
      }

      await tx.incidentTimeline.create({
        data: {
          incidentId: incident.id,
          message: "Incident created",
          status: IncidentStatus.INVESTIGATING,
          orgId: data.orgId,
          userId: data.userId,
        },
      });

      return incident;
    });
  }

  static async updateIncidentDetails(
    incidentId: string,
    orgId: string,
    data: {
      title?: string;
      description?: string;
      severity?: IncidentSeverity;
      occuredAt?: Date;
    },
  ): Promise<Incident> {
    return prisma.incident.update({
      where: { id: incidentId, orgId },
      data,
    });
  }

  static async updateIncidentStatus(
    incidentId: string,
    orgId: string,
    status: IncidentStatus,
    userId: string,
  ): Promise<Incident> {
    return prisma.$transaction(async (tx) => {
      const incident = await tx.incident.update({
        where: { id: incidentId, orgId },
        data: {
          status,
          resolvedAt: status === IncidentStatus.RESOLVED ? new Date() : null,
        },
        include: {
          components: true,
        },
      });

      await tx.incidentTimeline.create({
        data: {
          incidentId,
          message: `Status updated to ${status}`,
          status,
          orgId,
          userId,
        },
      });

      // If incident is resolved, check all affected components
      if (status === IncidentStatus.RESOLVED) {
        for (const component of incident.components) {
          const currentStatus = await this.determineComponentStatus(
            component.componentId,
          );
          // You might want to log this status change or notify subscribers
          console.log(
            `Component ${component.componentId} current status: ${currentStatus}`,
          );
        }
      }

      return incident;
    });
  }

  static async updateComponentStatusInIncident(
    incidentId: string,
    componentId: string,
    status: ComponentStatus,
  ): Promise<IncidentComponent> {
    return prisma.$transaction(async (tx) => {
      const updatedComponent = await tx.incidentComponent.update({
        where: {
          incidentId_componentId: {
            incidentId,
            componentId,
          },
        },
        data: { status },
      });

      const currentStatus = await this.determineComponentStatus(componentId);
      // You might want to log this status change or notify subscribers
      console.log(`Component ${componentId} current status: ${currentStatus}`);

      return updatedComponent;
    });
  }

  static async addComponentToIncident(data: {
    incidentId: string;
    componentId: string;
    status: ComponentStatus;
  }): Promise<IncidentComponent> {
    return prisma.incidentComponent.create({
      data: {
        incidentId: data.incidentId,
        componentId: data.componentId,
        status: data.status,
      },
    });
  }

  static async removeComponentFromIncident(
    incidentId: string,
    componentId: string,
  ): Promise<void> {
    await prisma.incidentComponent.deleteMany({
      where: {
        incidentId,
        componentId,
      },
    });
  }

  static async addTimelineUpdate(data: {
    incidentId: string;
    message: string;
    status: IncidentStatus;
    orgId: string;
    userId: string;
  }) {
    return prisma.incidentTimeline.create({
      data,
    });
  }

  static async listIncidents(orgId: string): Promise<Incident[]> {
    return prisma.incident.findMany({
      where: {
        orgId,
      },
      include: {
        components: {
          include: { component: true },
        },
        IncidentTimeline: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { occuredAt: "desc" },
    });
  }

  static async getIncidentDetails(
    incidentId: string,
    orgId: string,
  ): Promise<Incident | null> {
    return prisma.incident.findFirst({
      where: { id: incidentId, orgId },
      include: {
        components: {
          include: { component: true },
        },
        IncidentTimeline: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  static async determineComponentStatus(
    componentId: string,
  ): Promise<ComponentStatus> {
    const activeIncidents = await prisma.incidentComponent.findMany({
      where: {
        componentId,
        incident: {
          status: {
            not: IncidentStatus.RESOLVED,
          },
        },
      },
      select: {
        status: true,
      },
    });

    if (!activeIncidents.length) {
      return ComponentStatus.OPERATIONAL;
    }

    // Map statuses to severity numbers (higher number = more severe)
    const statusSeverity = {
      [ComponentStatus.OPERATIONAL]: 0,
      [ComponentStatus.DEGRADED]: 1,
      [ComponentStatus.PARTIAL_OUTAGE]: 2,
      [ComponentStatus.MAJOR_OUTAGE]: 3,
    };

    // Find the highest severity status
    const mostSevereStatus = activeIncidents.reduce<ComponentStatus>(
      (mostSevere, incident) => {
        return statusSeverity[incident.status] > statusSeverity[mostSevere]
          ? incident.status
          : mostSevere;
      },
      ComponentStatus.OPERATIONAL,
    );

    return mostSevereStatus;
  }
}
