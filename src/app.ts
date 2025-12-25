import express from "express";
import users from "./routes/user";
import auth from "./routes/auth";
import cors from "cors";
import errorHandler from "./middlewares/error";
import { morganMiddleware } from "./middlewares/morganMiddleware";
import notFoundHandler from "./middlewares/notFoundHandler";

const app = express();

app.use(cors());

app.use(express.json());

app.use(morganMiddleware);

app.use("/api/v1/user", users);
app.use("/api/v1/auth", auth);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
