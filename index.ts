import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import ComponentRouter from "./src/routes/component.route";
dotenv.config();
const port = process.env.PORT || 3000;
const app = express();
app.use(clerkMiddleware());
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/v1/component", ComponentRouter);
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
