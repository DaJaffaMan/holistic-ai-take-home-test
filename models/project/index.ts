import { db } from "@/drizzle";
import { project } from "./project.sql";
import type { NewProject } from "./project.sql";

export async function listProjects() {
  return await db.query.project.findMany();
}

export async function createProject(newProject: NewProject) {
  return await db.insert(project).values(newProject).returning({ id: project.id });
}
