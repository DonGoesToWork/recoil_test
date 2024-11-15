// src/app.ts

import connectLivereload from "connect-livereload"; // Import the middleware
import cors from "cors";
import exportRoutes from "./routes/export";
import express from "express";
import importRoutes from "./routes/import";

const app = express();

app.use(connectLivereload()); // Use LiveReload middleware here
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes

app.use("/import", importRoutes);
app.use("/export", exportRoutes);

export default app;
