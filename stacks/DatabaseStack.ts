import type { StackContext } from "sst/constructs";
import { RDS } from "sst/constructs";

export function DatabaseStack({ stack }: StackContext) {
  const database = new RDS(stack, "Database", {
    engine: "postgresql11.13",
    defaultDatabaseName: "companycrmdb",
    scaling: { autoPause: false, minCapacity: "ACU_8", maxCapacity: "ACU_64" },
  });

  return { database };
}
