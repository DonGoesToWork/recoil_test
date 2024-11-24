// src/app.ts

import connectLivereload from "connect-livereload"; // Import the middleware
import cors from "cors";
import exportRoutes from "./routes/export";
import express from "express";
import importRoutes from "./routes/import";

const app = express();

app.use(connectLivereload()); // Use LiveReload middleware here
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "2gb" })); // We're transmitting data over localhost... so limit doesn't really matter *shrug*... increase if you ever get size errors tho (whcih would be pretty hard, but not impossible)

// Routes

app.use("/import", importRoutes);
app.use("/export", exportRoutes);

export default app;
