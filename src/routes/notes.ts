import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { ErrorSchema, Note, NoteSchema, EmptyResponse } from "../schema.js";


export const notesRoutes: FastifyPluginAsyncTypebox = async (app) => {
    const notes = new Map<string, Note>();
    
    app.get('/', {
        schema: {
            response: {
                200: Type.Array(NoteSchema),
            }
        },
        handler: async (request, reply) => {
            return reply.status(200).send([...notes.values()]);
        }
    });

    app.get("/:id", {
        schema: {
            response: {
                200: NoteSchema,
                400: ErrorSchema,
                404: ErrorSchema,
            },
            params: Type.Object({
                id: Type.String({format: 'uuid'})
            })
        },
        handler: async (request, reply) => {
            const {id} = request.params;

            const note = notes.get(id);

            if(!note) {
                return reply.status(404).send({message: 'Not Found', error: 'Not Found', statusCode: 404});
            }

            return reply.status(200).send(note);
        }
    })

    app.delete("/:id", {
        schema: {
            params: Type.Object({
                id: Type.String({format: 'uuid'})
            }),
            response: {
                204: EmptyResponse,
                400: ErrorSchema,
                404: ErrorSchema,
            }
        },
        handler: async (request, reply) => {
            const {id} = request.params;


            if(!notes.has(id)) {
                return reply.status(404).send({message: 'Not Found', error: 'Not Found', statusCode: 404});
            }

            notes.delete(id);

            return reply.status(204).send(null);
        }
    })

    app.post("/", {
        schema: {
            body: Type.Array(
                Type.Object({
                    text: Type.String({minLength: 1, maxLength: 1000})
                }),
                {minItems: 1, maxItems: 100}
            ),
            response: {
                201: Type.Array(NoteSchema),
                400: ErrorSchema,
            }
        },
        handler: async(request, reply) => {
            const {body} = request;

            const newNotes = body.map(({text}) => {
                const id = crypto.randomUUID();
                const createdAt = new Date().toISOString();

                const newNote = {id, text, createdAt};

                notes.set(id, newNote);

                return newNote;
            });
            
            

            return reply.status(201).send(newNotes);
        }
    })
}