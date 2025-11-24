import { Router } from "express";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user";
import { authorize, protect } from "../middlewares/auth";

const router = Router();

router.use(protect);
router.use(authorize("admin"));

router.post("/create", createUser);
router.get("/get-all", getUsers);
router.get("/get/:id", getUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

export default router;
