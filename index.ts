import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import ComponentRouter from "./src/routes/component.route";
import IncidentRouter from "./src/routes/incident.route";
import MaintenanceRouter from "./src/routes/maintenance.route";
import SubscriberRouter from "./src/routes/subscriber.route";
import { MaintenanceService } from "./src/services/MaintenanceService";
import { PublicService } from "./src/services/PublicService";
dotenv.config();
const port = process.env.PORT || 3000;
const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, { cors: { origin: "*" } });
app.use(clerkMiddleware());
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello");
});
app.use("/api/v1/component", ComponentRouter);
app.use("/api/v1/incident", IncidentRouter);
app.use("/api/v1/subscriber", SubscriberRouter);
app.use("/api/v1/maintenance", MaintenanceRouter);

io.on("connection", async (socket) => {
  console.log(socket.id, "connected");
  socket.on("join", async (orgId) => {
    socket.join(orgId);
  });

  socket.on("get-components", async (orgId, cb) => {
    const data = await PublicService.getComponents(orgId);
    cb(data);
  });

  socket.on("get-incidents", async (orgId, cb) => {
    const data = await PublicService.getIncidents(orgId);
    cb(data);
  });
  socket.on("get-maintenances", async (orgId, cb) => {
    const data = await MaintenanceService.listMaintenances(orgId);
    cb(data);
  });
  socket.on("disconnect", async () => {
    console.log("User disconnected");
    socket.rooms.clear();
  });
});

httpServer.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default httpServer;
