import { createServer } from "http";

import { Clients } from "./client.js";

const server = createServer(async (req, res) => {
  console.log("[Identity] Received HTTP request");

  try {
    const price = await Clients.sales.getPrice({
      showtimeId: "ticket-1",
    });

    res.end(JSON.stringify({ from: "Identity===", sales_says: price }));
  } catch (e) {
    res.statusCode = 500;
    res.end(String(e));
  }
});

server.listen(5000, () => console.log("🚀 Identity (HTTP) on 5000"));
