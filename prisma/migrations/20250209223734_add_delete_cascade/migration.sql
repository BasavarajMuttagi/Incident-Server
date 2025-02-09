-- DropForeignKey
ALTER TABLE "IncidentComponent" DROP CONSTRAINT "IncidentComponent_componentId_fkey";

-- DropForeignKey
ALTER TABLE "IncidentComponent" DROP CONSTRAINT "IncidentComponent_incidentId_fkey";

-- DropForeignKey
ALTER TABLE "IncidentTimeline" DROP CONSTRAINT "IncidentTimeline_incidentId_fkey";

-- DropForeignKey
ALTER TABLE "MaintenanceComponent" DROP CONSTRAINT "MaintenanceComponent_componentId_fkey";

-- DropForeignKey
ALTER TABLE "MaintenanceComponent" DROP CONSTRAINT "MaintenanceComponent_maintenanceId_fkey";

-- DropForeignKey
ALTER TABLE "MaintenanceTimeline" DROP CONSTRAINT "MaintenanceTimeline_maintenanceId_fkey";

-- AddForeignKey
ALTER TABLE "IncidentComponent" ADD CONSTRAINT "IncidentComponent_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentComponent" ADD CONSTRAINT "IncidentComponent_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentTimeline" ADD CONSTRAINT "IncidentTimeline_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceComponent" ADD CONSTRAINT "MaintenanceComponent_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "Maintenance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceComponent" ADD CONSTRAINT "MaintenanceComponent_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceTimeline" ADD CONSTRAINT "MaintenanceTimeline_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "Maintenance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
