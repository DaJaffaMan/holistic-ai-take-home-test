import { db } from "@/drizzle";
import { eq } from "drizzle-orm";
import type { NewProject, Project } from "./project.sql";
import { project } from "./project.sql";
import type { ProjectDetails } from "./projectDetails.sql";
import { projectDetails } from "./projectDetails.sql";

export async function listProjects() {
  return await db.query.project.findMany();
}

export async function fetchProjectDetails(projectId: number) {
  return (await db.query.projectDetails.findFirst({
    where: eq(projectDetails.id, projectId),
  })) as ProjectDetails;
}

export async function createProject(newProject: NewProject) {
  return await db.insert(project).values(newProject).returning({ id: project.id });
}

export async function updateProjectSummary(updatedProject: Project) {
  if (updatedProject.id === undefined) {
    throw new Error("Project ID is undefined");
  }

  return await db.update(project).set({ summary: updatedProject.summary }).where(eq(project.id, updatedProject.id)).returning({ id: project.id, filename: project.filename, summary: project.summary });
}
