import fastify from "fastify";
import { Type, TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { notesRoutes } from "./routes/notes.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

export function buildApp() {
  const app = fastify({
    logger: true,
  }).withTypeProvider<TypeBoxTypeProvider>();

  app.setNotFoundHandler(notFoundHandler);
  app.setErrorHandler(errorHandler);

  app.addHook('onSend', async (request, reply, payload) => {
    reply.header('x-request-id', request.id);
    return payload;
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

  app.get('/wait', {
    schema: {
      response: {
        200: Type.Object({
          status: Type.Literal('ok'),
          sum: Type.Number()
        })
      }
    },
    handler: async (_, res) => {
      let sum = 0;
        for(let i=0; i<5000000000000000; i++) {
          sum += i;
        }

        return res.status(200).send({status: 'ok', sum})
    }
  })

  app.register(notesRoutes, { prefix: "/notes" });

  return app;
}