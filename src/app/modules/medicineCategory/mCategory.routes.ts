import { Router } from "express";
import { mCategoryControllers } from "./mCategory.controller";

const router = Router();

router.post("/", mCategoryControllers.createMCategory);

// ! export

export const MRoutes = router;
