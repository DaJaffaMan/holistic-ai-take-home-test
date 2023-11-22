import { db } from "@/drizzle";
import { eq } from "drizzle-orm";
import type { NewProject } from "./project.sql";
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
