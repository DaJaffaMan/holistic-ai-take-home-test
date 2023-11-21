CREATE TABLE IF NOT EXISTS "projectDetails" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer,
	"details" varchar(2000)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projectDetails" ADD CONSTRAINT "projectDetails_projectId_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
