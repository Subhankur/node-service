import { FastifyPluginAsyncTypebox, Static, Type } from "@fastify/type-provider-typebox";

const ErrorResponse404 = Type.Object({
  message: Type.Literal('Not found')
});

const ErrorResponse400 = Type.Object({
  message: Type.String()
});

const SuccessResponse204 = Type.Null();


const NotesSchema = Type.Object({
    id: Type.String({format: 'uuid'}),
    text: Type.String(),
    createdAt: Type.String({format: 'date-time'})
})

type Note = Static<typeof NotesSchema>;

export const notesRoutes: FastifyPluginAsyncTypebox = async (app) => {
    const notes = new Map<string, Note>();
    
    app.get('/', {
        schema: {
            response: {
                200: Type.Array(NotesSchema),
            }
        },
        handler: async (request, reply) => {
            return reply.status(200).send([...notes.values()]);
        }
    });

    app.get("/:id", {
        schema: {
            response: {
                200: NotesSchema,
                400: ErrorResponse400,
                404: ErrorResponse404,
            },
            params: Type.Object({
                id: Type.String({format: 'uuid'})
            })
        },
        handler: async (request, reply) => {
            const {id} = request.params;

            const note = notes.get(id);

            if(!note) {
                return reply.status(404).send({message: 'Not found'});
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
                204: SuccessResponse204,
                400: ErrorResponse400,
                404: ErrorResponse404,
            }
        },
        handler: async (request, reply) => {
            const {id} = request.params;


            if(!notes.has(id)) {
                return reply.status(404).send({message: 'Not found'})
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
                201: Type.Array(NotesSchema),
                400: ErrorResponse400,
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