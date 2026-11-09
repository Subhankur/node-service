import { buildApp } from "./app.js";
import { PORT } from "./env.js";

try {
  const app = buildApp();
  await app.listen({ port: PORT });
} catch (error) {
  console.error(error);
  process.exit(1);
}