import * as path from "path";
import { createServer } from "http";
import * as protoLoader from "@grpc/proto-loader";
import * as grpc from "@grpc/grpc-js";
import { createGrpcClient, runInContext } from "@coolcinema/foundation";
import { Registry } from "@coolcinema/registry";

// 1. Загружаем Proto (чтобы знать структуру клиента)
const PROTO_PATH = path.join(__dirname, "proto/sales.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;
const SalesServiceConstructor = protoDescriptor.coolcinema.sales.SalesService;

// 2. Создаем gRPC клиент через фабрику Foundation
// Она сама добавит интерцепторы
const salesClient = createGrpcClient(
  SalesServiceConstructor,
  Registry.Sales.url, // "sales-service:5000"
) as any;

// 3. HTTP Сервер для теста
const server = createServer((req, res) => {
  // Эмулируем входящий запрос с заголовками (TraceID)
  // В реальности это сделает HTTP Middleware
  const fakeContext = {
    traceId: "trace-" + Math.random().toString(36).substr(2, 9),
    routingHeaders: {
      "x-telepresence-intercept-id":
        req.headers["x-telepresence-intercept-id"] || "",
    },
  };

  // Запускаем контекст
  runInContext(fakeContext as any, () => {
    console.log(
      `[Identity] Calling Sales with TraceID: ${fakeContext.traceId}`,
    );

    // Вызываем gRPC метод
    salesClient.getPrice({ showtime_id: "123" }, (err: any, response: any) => {
      res.writeHead(200, { "Content-Type": "application/json" });

      if (err) {
        console.error("gRPC Error:", err);
        res.end(JSON.stringify({ error: err.message }));
      } else {
        res.end(
          JSON.stringify(
            {
              from: "Identity",
              sales_response: response,
              sent_trace_id: fakeContext.traceId,
            },
            null,
            2,
          ),
        );
      }
    });
  });
});

server.listen(Registry.Identity.port, () => {
  console.log(`🚀 Identity running on ${Registry.Identity.port}`);
});
