import { Router } from "express";
import {
  login,
  register,
  forgotPassword,
  resetPassword,
  loginAdmin,
  getMe,
} from "../controllers/auth";
import { protect } from "../middlewares/auth";

const router = Router();

router.get("/me", protect, getMe);
router.post("/register", register);
router.post("/login", login);
router.post("/admin", loginAdmin);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

export default router;
