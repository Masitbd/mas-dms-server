import { Router } from "express";
import { genericControllers } from "./generic.controller";

const router = Router();

router.post("/", genericControllers.createGeneric);

// ! export

export const GenricRoutes = router;
