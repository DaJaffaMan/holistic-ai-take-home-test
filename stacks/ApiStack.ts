import type { StackContext } from "sst/constructs";
import { Api, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";

// see https://github.com/drizzle-team/sst-drizzle-example/blob/main/stacks/MyStack.ts
export function ApiStack({ stack }: StackContext) {
  const { database, summarizer } = use(StorageStack);

  const api = new Api(stack, "Api", {
    defaults: {},
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
        },
      },
      "POST /summarize": summarizer,
    },
  });

  stack.addOutputs({
    apiUrl: api.url,
  });

  return { api };
}
