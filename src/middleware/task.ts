import { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/Task";

declare global {
  namespace Express {
    interface Request {
      task: ITask;
    }
  }
}

export async function valitateTaskExist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    req.task = task;
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

export function validateTaskBelongsToProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { task } = req;
  const { projectId } = req.params;
  if (task.project.toString() !== projectId) {
    const error = new Error("Unauthorized");
    return res.status(401).json({ error: error.message });
  }
  next();
}
