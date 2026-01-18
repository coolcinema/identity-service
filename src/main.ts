import { createServer } from "http";
import { Registry } from "@coolcinema/registry";

const myConfig = Registry.Identity;
// URL берется из реестра автоматически: http://sales-service.coolcinema.svc.cluster.local:5000
const salesUrl = Registry.Sales.url;

const server = createServer(async (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });

  try {
    // Делаем запрос к соседнему сервису
    console.log(`[Identity] Calling Sales at ${salesUrl}...`);
    const salesResponse = await fetch(salesUrl);
    const salesData = await salesResponse.json();

    res.end(
      JSON.stringify(
        {
          service: "Identity Service",
          status: "OK",
          integration_test: {
            target: "Sales Service",
            success: true,
            response_from_sales: salesData,
          },
        },
        null,
        2,
      ),
    );
  } catch (error) {
    console.error("[Identity] Call failed:", error);
    res.end(
      JSON.stringify(
        {
          service: "Identity Service",
          status: "Partial",
          integration_test: {
            success: false,
            error: String(error),
          },
        },
        null,
        2,
      ),
    );
  }
});

server.listen(myConfig.port, () => {
  console.log(`🚀 ${myConfig.name} is running on port ${myConfig.port}`);
});
