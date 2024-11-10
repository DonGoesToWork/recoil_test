// src/app.ts

import cors from "cors";
import exportRoutes from "./routes/export";
import express from "express";
import importRoutes from "./routes/import";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/import", importRoutes);
app.use("/export", exportRoutes);

export default app;
