import { SSTConfig } from "sst";
import { NextjsSite, Table } from "sst/constructs";
import { App } from "sst/constructs";
import type { StackContext } from "sst/constructs";

const config: SSTConfig = {
  config() {
    return {
      name: "coffee-tracker",
      region: "eu-north-1",
    };
  },
  stacks(app: App) {
    app.stack(function Site({ stack }: StackContext) {
      // Create the DynamoDB table
      const table = new Table(stack, "CoffeeIntake", {
        fields: {
          userId: "string",
          timestamp: "string",
          amount: "number",
          unit: "string",
        },
        primaryIndex: { partitionKey: "userId", sortKey: "timestamp" },
      });

      // Create the Next.js site
      const site = new NextjsSite(stack, "site", {
        bind: [table],
        environment: {
          COFFEE_INTAKE_TABLE: table.tableName,
        },
      });

      // Add the site's URL to stack output
      stack.addOutputs({
        URL: site.url,
        TableName: table.tableName,
      });
    });
  },
};

export default config;