import { OpenApi, z } from "@coolcinema/foundation";

// 1. Схемы (используем .meta вместо .openapi)
export const UserSchema = z
  .object({
    id: z.string().meta({ example: "123" }),
    email: z.string().email(),
  })
  .meta({ id: "User" }); // Регистрируем компонент

export type User = z.infer<typeof UserSchema>;

// 2. Определение Роутов (Группировка)
export const routes = {
  getUser: OpenApi.createRoute({
    method: "get",
    path: "/users/{id}",
    summary: "Get user by ID",
    params: z.object({ id: z.string() }),
    response: UserSchema,
  }),
};

// --- Экспорт Типов Хендлеров ---
export type ApiHandlers = OpenApi.InferHandlers<typeof routes>;
