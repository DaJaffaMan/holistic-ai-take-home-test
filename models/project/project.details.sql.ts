import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { project } from "./project.sql";
import { db } from "../../drizzle";

export const projectDetails = pgTable("projectDetails", {
  id: serial("id").primaryKey(),
  projectId: integer("author_id").references(() => project.id),
  details: varchar("details", { length: 2000 }),
});

export async function fetchProjectDetails(projectId: number) {
  return await db.query.projectDetails.findOne({
    where: { projectId },
  });
}
export type ProjecDetails = typeof projectDetails.$inferSelect;

export type NewProjecDetails = typeof projectDetails.$inferInsert;
