import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const project = pgTable("project", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  summary: varchar("summary", { length: 2000 }),
});

export type Project = typeof project.$inferInsert;

export type NewProject = typeof project.$inferInsert;

export const projectDetails = pgTable("projectDetails", {
  id: serial("id").primaryKey(),
  projectId: integer("projectId").references(() => project.id),
  details: varchar("details", { length: 2000 }),
});

export type ProjecDetails = typeof projectDetails.$inferSelect;

export type NewProjecDetails = typeof projectDetails.$inferInsert;
