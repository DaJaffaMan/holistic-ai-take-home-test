import type { StackContext } from "sst/constructs";
import { Api, Function, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";

// see https://github.com/drizzle-team/sst-drizzle-example/blob/main/stacks/MyStack.ts
export function ApiStack({ stack }: StackContext) {
  const { database, bucket } = use(StorageStack);

  const summarizer = new Function(stack, "Summarizer", {
    handler: "scripts/summary.handler",
    runtime: "python3.11",
    timeout: 300,
  });

  summarizer.attachPermissions(["s3"]);

  const api = new Api(stack, "Api", {
    routes: {
      "GET /migrate": {
        function: {
          handler: "functions/migrator.handler",
          bind: [database],
          copyFiles: [
            {
              from: "drizzle/migrations",
              to: "migrations",
            },
          ],
          runtime: "nodejs18.x",
        },
      },
      "POST /summarize": summarizer,
    },
  });

  bucket.notifications?.fileUploaded?.bind([summarizer]);

  stack.addOutputs({
    apiUrl: api.url,
  });

  return { api, summarizer };
}
