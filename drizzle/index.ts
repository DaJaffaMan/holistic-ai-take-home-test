import * as projectSchema from "@/models/project/project.sql";
import * as projectDetailsSchema from "@/models/project/projectDetails.sql";
import { RDSData } from "@aws-sdk/client-rds-data";
import { drizzle } from "drizzle-orm/aws-data-api/pg";
import { migrate as mig } from "drizzle-orm/aws-data-api/pg/migrator";
import { RDS } from "sst/node/rds";

export const db = drizzle(new RDSData({}), {
  database: RDS.Database.defaultDatabaseName,
  secretArn: RDS.Database.secretArn,
  resourceArn: RDS.Database.clusterArn,
  schema: { ...projectSchema, ...projectDetailsSchema },
});

export const migrate = async (path: string) => {
  return mig(db, { migrationsFolder: path });
};

export * as SQL from "./index";
