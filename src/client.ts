//  src/client.ts
import { Registry } from "@coolcinema/contracts";
import { Grpc } from "@coolcinema/foundation";
import { Http } from "@coolcinema/foundation";
import { paths as SalesPaths } from "./generated/http/sales";

import { SalesServiceDefinition } from "./generated/sales-service_sales.js";

export const Clients = Grpc.Nice.createClients(Registry, {
  sales: SalesServiceDefinition,
});

export const SalesClient = Http.createClient<SalesPaths>(
  Registry,
  "sales-service",
);

const { data, error } = await SalesClient.GET("/price", {
  params: {
    query: { id: "123" },
  },
});

if (error) {
  console.error("Error:", error);
} else {
  console.log("Price:", data.amount);
}
