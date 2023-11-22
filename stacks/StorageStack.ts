import type { StackContext } from "sst/constructs";
import { Bucket, RDS, Function } from "sst/constructs";

export function StorageStack({ stack }: StackContext) {
  const database = new RDS(stack, "Database", {
    engine: "postgresql11.13",
    defaultDatabaseName: "companycrmdb",
    scaling: { autoPause: false, minCapacity: "ACU_8", maxCapacity: "ACU_64" },
  });

  const summarizer = new Function(stack, "SummarizerFunction", {
    handler: "scripts/summary.py",
    runtime: "python3.9",
  });

  const bucket = new Bucket(stack, "Bucket", {
    name: "holisticaicodetestjj",
    cors: [
      {
        allowedHeaders: ["*"],
        allowedMethods: ["GET", "POST", "PUT", "DELETE", "HEAD"],
        allowedOrigins: ["http://localhost:3000", "https://d311ynoxc2sp8.cloudfront.net"],
      },
    ],
    cdk: {
      bucket: {
        publicReadAccess: false,
        blockPublicAccess: {
          blockPublicAcls: true,
          blockPublicPolicy: true,
          ignorePublicAcls: true,
          restrictPublicBuckets: true,
        },
      },
    },
    notifications: {
      fileUploaded: {
        function: summarizer,
      },
    },
  });

  summarizer.attachPermissions(["s3"]);

  return { database, bucket, summarizer };
}
