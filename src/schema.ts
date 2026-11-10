import { Static, Type } from "@fastify/type-provider-typebox";

export const ErrorSchema = Type.Object({
    message: Type.String(),
    error: Type.String(),
    statusCode: Type.Number(),
})


export const EmptyResponse = Type.Null();


export const NoteSchema = Type.Object({
    id: Type.String({format: 'uuid'}),
    text: Type.String(),
    createdAt: Type.String({format: 'date-time'})
})

export type Note = Static<typeof NoteSchema>;