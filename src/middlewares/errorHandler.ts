import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { STATUS_CODES } from "node:http";

function errorBody({statusCode, message}: {statusCode: number, message: string}) {
    return {
        statusCode,
        message,
        error: STATUS_CODES[statusCode] ?? 'Error',
    }

}

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
    const status = error.statusCode ?? 500;
    if(status >= 500) {
        request.log.error(error);
        return reply.status(status).send(errorBody({statusCode: status, message: "Internal Server Error"}));
    }
    reply.status(status).send(errorBody({statusCode: status, message: error.message}));
}

export function notFoundHandler(request: FastifyRequest, reply: FastifyReply) {
    return reply.status(404).send(errorBody({statusCode: 404, message: `Route ${request.method}:${request.url} not found`}));
}