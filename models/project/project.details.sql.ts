import { eq } from "drizzle-orm";
import { db } from "../../drizzle";
import { projectDetails } from "./project.sql";

export async function fetchProjectDetails(projectId: number) {
  return await db.query.projectDetails.findFirst({
    where: eq(projectDetails.id, projectId),
  });
}
