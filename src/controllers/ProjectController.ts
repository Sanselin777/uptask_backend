import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);
    try {
      await project.save();
      res.status(201).send(project);
    } catch (error) {
      console.log(error);
    }
  };

  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({});
      res.json(projects);
    } catch (error) {
      console.log(error);
    }
  };

  static getProjectById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const project = await Project.findById(id).populate("tasks");
      if (!project) {
        const error = new Error("Project not found");
        return res.status(404).send({ error: error.message });
      }
      res.json(project);
    } catch (error) {
      console.log(error);
    }
  };

  static updateProject = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const project = await Project.findByIdAndUpdate(id, req.body);
      if (!project) {
        const error = new Error("Project not found");
        return res.status(404).send({ error: error.message });
      }
      res.send("Project updated");
    } catch (error) {
      console.log(error);
    }
  };

  static deleteProject = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const project = await Project.findById(id);
      if (!project) {
        const error = new Error("Project not found");
        return res.status(404).send({ error: error.message });
      }
      await project.deleteOne();
      res.send("Project deleted");
    } catch (error) {
      console.log(error);
    }
  };
}