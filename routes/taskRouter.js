import {
  createTask,
  deleteTask,
  getMyTask,
  getSingleTask,
  updateTask,
  searchCarsByTags,
} from "../controller/taskController.js";

import express from "express";



import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();


router.post("/post", isAuthenticated, createTask);
router.delete("/delete/:id", isAuthenticated, deleteTask);
router.put("/update/:id", isAuthenticated, updateTask);
router.get("/mycar", isAuthenticated, getMyTask);
router.get("/single/:id", isAuthenticated, getSingleTask);
router.get('/cars/search', searchCarsByTags);

export default router;
