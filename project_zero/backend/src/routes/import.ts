// src/routes/import.ts

import express from "express";
import { state } from "../types";

const router = express.Router();

router.get("/", (req, res) => {
  console.log("Received import command.");
  res.status(200).json(state.schemas);
});

export default router;
