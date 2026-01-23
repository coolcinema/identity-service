import "./telemetry";
import { createServer } from "http";
import { runInContext } from "@coolcinema/foundation";
// Импортируем готовый фасад API
import { IdentityService } from "@coolcinema/api";

const server = createServer(async (req, res) => {
  const fakeContext = {
    traceId: "trace-" + Math.random().toString(36).substr(2, 9),
    routingHeaders: {
      "x-telepresence-intercept-id":
        (req.headers["x-telepresence-intercept-id"] as string) || "",
    },
  };

  // Оборачиваем выполнение в контекст (для трейсинга)
  runInContext(fakeContext, async () => {
    console.log(
      `[Identity] Calling Sales with TraceID: ${fakeContext.traceId}`,
    );

    try {
      // ИСПОЛЬЗОВАНИЕ НОВОГО API
      // 1. Services - точка входа
      // 2. identity - имя сервиса (из Registry)
      // 3. grpc - протокол
      // 4. IDENTITY_SERVICE - имя интерфейса (как в манифесте)
      // 5. GetPrice - метод (типизирован!)
      // const response = await IdentityService.grpc.identity.getPrice({
      //
      // });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify(
          {
            from: "===Identity===!",
            sales_response: response,
            sent_trace_id: fakeContext.traceId,
          },
          null,
          2,
        ),
      );
    } catch (err: any) {
      console.error("gRPC Error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
  });
});

// Порт можно взять из манифеста или хардкод (как раньше),
// но в идеале сервис должен знать свой порт из конфига/env.
// Services.identity - это клиент, он не экспортирует порт сервера.
const PORT = 5000;

server.listen(PORT, () => {
  console.log(`🚀 Identity running on ${PORT}`);
});
