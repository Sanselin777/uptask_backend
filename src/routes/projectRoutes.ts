import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { valitateProjectExist } from "../middleware/project";
import {
  validateTaskBelongsToProject,
  valitateTaskExist,
} from "../middleware/task";

const router = Router();

router.post(
  "/",
  body("projectName").notEmpty().withMessage("Project name is required"),
  body("clientName").notEmpty().withMessage("Client name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  handleInputErrors,
  ProjectController.createProject
);

router.get("/", ProjectController.getAllProjects);

router.get(
  "/:id",
  param("id").isMongoId().withMessage("Invalid project ID"),
  handleInputErrors,
  ProjectController.getProjectById
);

router.put(
  "/:id",
  param("id").isMongoId().withMessage("Invalid project ID"),
  body("projectName").notEmpty().withMessage("Project name is required"),
  body("clientName").notEmpty().withMessage("Client name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  handleInputErrors,
  ProjectController.updateProject
);

router.delete(
  "/:id",
  param("id").isMongoId().withMessage("Invalid project ID"),
  handleInputErrors,
  ProjectController.deleteProject
);

//Routes for tasks
router.param("projectId", valitateProjectExist);

router.post(
  "/:projectId/tasks",
  param("projectId").isMongoId().withMessage("Invalid project ID"),
  body("name").notEmpty().withMessage("Task name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  handleInputErrors,
  TaskController.createTask
);

router.get(
  "/:projectId/tasks",
  param("projectId").isMongoId().withMessage("Invalid project ID"),
  handleInputErrors,
  TaskController.getProjectTasks
);

router.param("taskId", valitateTaskExist);
router.param("taskId", validateTaskBelongsToProject);

router.get(
  "/:projectId/tasks/:taskId",
  param("projectId").isMongoId().withMessage("Invalid project ID"),
  param("taskId").isMongoId().withMessage("Invalid task ID"),
  handleInputErrors,
  TaskController.getTaskById
);
router.put(
  "/:projectId/tasks/:taskId",
  param("projectId").isMongoId().withMessage("Invalid project ID"),
  param("taskId").isMongoId().withMessage("Invalid task ID"),
  body("name").notEmpty().withMessage("Task name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  handleInputErrors,
  TaskController.updateTask
);

router.delete(
  "/:projectId/tasks/:taskId",
  param("projectId").isMongoId().withMessage("Invalid project ID"),
  param("taskId").isMongoId().withMessage("Invalid task ID"),
  handleInputErrors,
  TaskController.deleteTask
);

router.patch(
  "/:projectId/tasks/:taskId/status",
  param("projectId").isMongoId().withMessage("Invalid project ID"),
  param("taskId").isMongoId().withMessage("Invalid task ID"),
  body("status")
    .isIn(["pending", "inProgress", "completed", "onHold", "underReview"])
    .withMessage("Invalid status"),
  handleInputErrors,
  TaskController.updateTaskStatus
);

export default router;
