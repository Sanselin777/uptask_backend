import { Request, Response } from "express";
import Task from "../models/Task";

export class TaskController {
  public static createTask = async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body);
      task.project = req.project.id;
      req.project.tasks.push(task.id);
      await Promise.allSettled([task.save(), req.project.save()]);
      res.send("Task created successfully");
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  public static getProjectTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({ project: req.project.id }).populate(
        "project"
      );
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  public static getTaskById = async (req: Request, res: Response) => {
    try {
      const { task } = req;
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  public static updateTask = async (req: Request, res: Response) => {
    try {
      const { task } = req;
      task.set(req.body);
      await task.save();
      res.send("Task updated");
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  public static deleteTask = async (req: Request, res: Response) => {
    try {
      const { task } = req;
      req.project.tasks = req.project.tasks.filter(
        (task) => task.toString() !== task.id.toString()
      );
      await Promise.allSettled([task.deleteOne(), req.project.save()]);
      res.send("Task deleted");
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  public static updateTaskStatus = async (req: Request, res: Response) => {
    try {
      const { task } = req;
      task.status = req.body.status;
      await task.save();
      res.send("Task status updated");
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
}
