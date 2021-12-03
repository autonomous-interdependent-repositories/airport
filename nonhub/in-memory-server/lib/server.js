import { ServerState, } from '@airport/nonhub-types';
import { BasicServer } from '@airport/processor-common';
import { decryptString, encryptStringSync } from "string-cipher";
// var encryptionKey = 'ciw7p02f70000ysjon7gztjn7c2x7GfJ'
var encryptionKey = process.env.ENCRYPTION_KEY;
const EARLIEST_BIRTH_MONTH = Date.UTC(1900, 0);
export const server = new BasicServer({
    logger: false,
});
const transactionLogs = new Map();
server.fastify.register(require('fastify-cors'), {
    origin: (origin, cb) => {
        if (!origin || /localhost/.test(origin)) {
            // Request from configured host or localhost (for testing) will pass
            cb(null, true);
            return;
        }
        cb(new Error('Not allowed CORS host'), false);
    }
});
server.fastify.put('/read', (request, reply) => {
    serveReadRequest(request, reply, server.serverState, encryptionKey);
});
server.fastify.put('/write', (request, reply) => {
    serveWriteRequest(request, reply, server.serverState, encryptionKey);
});
server.fastify.put('/search', (request, reply) => {
    // TODO: implement
});
async function serveReadRequest(request, reply, serverState, encryptionKey) {
    if (serverState !== ServerState.RUNNING) {
        reply.send('');
        return;
    }
    const readRequest = await processRequest(request.body);
    if (!readRequest) {
        reply.send('');
        return;
    }
    let transactionLog = transactionLogs.get(readRequest.repositoryUuId);
    if (!transactionLog || !transactionLog.length) {
        return [];
    }
    let results = transactionLog;
    if (readRequest.syncTimestamp) {
        results = [];
        for (let transactionLogEntry of transactionLog) {
            if (transactionLogEntry.syncTimestamp >= readRequest.syncTimestamp) {
                results.push(transactionLogEntry);
            }
        }
    }
    let packagedMessage;
    if (encryptionKey) {
        packagedMessage = encryptStringSync(results.join('|'), encryptionKey);
    }
    reply.send(packagedMessage);
}
async function processRequest(request) {
    try {
        let unpackagedMessage;
        if (encryptionKey) {
            unpackagedMessage = await decryptString(request.body, encryptionKey);
        }
        return JSON.parse(unpackagedMessage);
    }
    catch (e) {
        console.log(e);
        return null;
    }
}
async function serveWriteRequest(request, reply, serverState, encryptionKey) {
    if (serverState !== ServerState.RUNNING) {
        reply.send('');
        return;
    }
    const writeRequest = await processRequest(request.body);
    if (!writeRequest) {
        reply.send('');
        return;
    }
    const syncTimestamp = new Date().getTime();
    const readResponse = {
        ...writeRequest,
        syncTimestamp
    };
    let transactionLog = transactionLogs.get(writeRequest.repositoryUuId);
    if (!transactionLog) {
        transactionLog = [];
        transactionLogs.set(writeRequest.repositoryUuId, transactionLog);
    }
    transactionLog.push(readResponse);
    let packagedMessage = JSON.stringify({
        syncTimestamp
    });
    if (encryptionKey) {
        packagedMessage = encryptStringSync(packagedMessage, encryptionKey);
    }
    reply.send(packagedMessage);
}
export function processSearchRequest(request, reply) {
    let searchRequest = request.body;
    if (!searchRequest) {
        reply.send({ received: false });
        return;
    }
    // let senderUuid = searchRequest.senderUuid
    // if (typeof senderUuid !== 'string' || senderUuid.length !== 36) {
    //     reply.send({ received: false })
    //     return
    // }
    let searchTerm = searchRequest.searchTerm;
    if (typeof searchTerm !== 'string' || searchTerm.length < 5 || searchTerm.length > 120) {
        reply.send({ received: false });
        return;
    }
    // TODO: implement
}
export function processUserRequest(request, reply, encryptionKey) {
    const userRequest = request.body;
    const email = userRequest.email;
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (typeof email !== 'string'
        || email.length > 64
        || !emailRegexp.test(email)) {
        reply.send({
            received: true,
            error: 'INVALID_EMAIL'
        });
        return;
    }
    const username = userRequest.userName;
    const usernameRegexp = /^\S*$/;
    if (typeof username !== 'string'
        || username.length < 3 || username.length > 32
        || !usernameRegexp.test(username)) {
        reply.send({
            received: true,
            error: 'INVALID_USERNAME'
        });
        return;
    }
    const now = new Date().getTime();
    const birthMonth = parseInt(userRequest.birthMonth);
    if (isNaN(birthMonth) || typeof birthMonth !== 'number'
        || birthMonth < EARLIEST_BIRTH_MONTH || birthMonth > now) {
        reply.send({
            received: true,
            error: 'INVALID_BIRTH_MONTH'
        });
        return;
    }
    const countryId = parseInt(userRequest.countryId);
    if (isNaN(countryId) || typeof countryId !== 'number'
        || countryId < 1 || countryId > 234) {
        reply.send({
            received: true,
            error: 'INVALID_COUNTRY'
        });
        return;
    }
    // TODO: implement
}
server.start(9000);
//# sourceMappingURL=server.js.map