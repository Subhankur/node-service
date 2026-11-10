import fastify from "fastify";
import { Type, TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { notesRoutes } from "./routes/notes.js";

export function buildApp() {
  const app = fastify({
    logger: true,
  }).withTypeProvider<TypeBoxTypeProvider>();

  app.get('/', (request, reply) => {
    reply.send('Hello World');
  });

  app.get('/health', {
    schema: {
      response: {
        200: Type.Object({
          status: Type.Literal('ok')
        })
      }
    },
    handler: async (request, reply) => {
      return reply.status(200).send({status: 'ok' as const});
    }
  });

  app.register(notesRoutes, { prefix: "/notes" });

  return app;
}