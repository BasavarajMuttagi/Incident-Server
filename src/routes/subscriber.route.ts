import { Router } from "express";
import {
  createSubscriber,
  deleteSubscriber,
  listSubscribers,
  unsubscribeSubscriber,
  verifySubscriber,
} from "../controllers/subscriber.controller";
import { requireAuth } from "@clerk/express";
import requireOrganization from "../middlewares/requireOrganization.middleware";

const SubscriberRouter = Router();
SubscriberRouter.use(requireAuth());
SubscriberRouter.use(requireOrganization);
SubscriberRouter.post("/", createSubscriber);
SubscriberRouter.post("/verify", verifySubscriber);
SubscriberRouter.post("/unsubscribe", unsubscribeSubscriber);
SubscriberRouter.get("/list", listSubscribers);
SubscriberRouter.delete("/:id", deleteSubscriber);

export default SubscriberRouter;
