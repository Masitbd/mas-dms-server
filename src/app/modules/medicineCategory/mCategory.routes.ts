import { Router } from "express";
import { categoryControllers } from "./mCategory.controller";

const router = Router();

router.post("/", categoryControllers.createCategory);

// ! export

export const CategoryRoutes = router;
