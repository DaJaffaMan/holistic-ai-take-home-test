import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { project } from "./project.sql";

export const projectDetails = pgTable("projectDetails", {
  id: serial("id").primaryKey(),
  projectId: integer("projectId").references(() => project.id),
  details: varchar("details", { length: 2000 }),
});

export type ProjectDetails = typeof projectDetails.$inferSelect;

export type NewProjectDetails = typeof projectDetails.$inferInsert;
