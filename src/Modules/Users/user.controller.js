import { Router } from "express";
import * as UserService from "./user.service.js";

const router = Router();
router.get("/:id", UserService.getProfile)

export default router;