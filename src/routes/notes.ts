import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { ErrorSchema, Note, NoteSchema, EmptyResponse } from "../schema.js";
import { HttpError } from "../error.js";


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
            },
            params: Type.Object({
                id: Type.String({format: 'uuid'})
            })
        },
        handler: async (request, reply) => {
            const {id} = request.params;

            const note = notes.get(id);

            if(!note) {
                throw new HttpError(404, 'Note not Found');
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
            }
        },
        handler: async (request, reply) => {
            const {id} = request.params;


            if(!notes.has(id)) {
                throw new HttpError(404, 'Note not Found');
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