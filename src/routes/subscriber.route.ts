import { requireAuth } from "@clerk/express";
import { Router } from "express";
import {
  createSubscriber,
  createSubscriberPublic,
  deleteSubscriber,
  listSubscribers,
  unsubscribeSubscriber,
  verifySubscriber,
} from "../controllers/subscriber.controller";
import requireOrganization from "../middlewares/requireOrganization.middleware";
import requireOrgPublic from "../middlewares/requireOrgPublic.middleware";

const SubscriberRouter = Router();
SubscriberRouter.post("/public", requireOrgPublic, createSubscriberPublic);
SubscriberRouter.use(requireAuth());
SubscriberRouter.use(requireOrganization);
SubscriberRouter.post("/", createSubscriber);
SubscriberRouter.post("/verify", verifySubscriber);
SubscriberRouter.post("/unsubscribe", unsubscribeSubscriber);
SubscriberRouter.get("/list", listSubscribers);
SubscriberRouter.delete("/:id", deleteSubscriber);

export default SubscriberRouter;
