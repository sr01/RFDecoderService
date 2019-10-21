import { mainLogger } from "../../app";
import * as Net from 'net';

let logger = mainLogger.child({ label: "TcpListener" })
let END_SIGNAL = [6, 6, 6, 6];

export class TcpListener {

    private port: number;
    private server?: Net.Server;

    constructor(port: number) {
        this.port = port;
    }

    start() {
        let server = new Net.Server();
        let port = this.port;
        this.server = server;
        let listener = this;

        server.listen(port, function () {
            logger.debug(`Server listening for connection requests on socket localhost:${port}`);

        });

        // When a client requests a connection with the server, the server creates a new
        // socket dedicated to that client.
        server.on('connection', function (socket) {

            let buffer = new Uint8Array(1000);
            let readIndex = 0;

            logger.debug('A new connection has been established.');

            // The server can also receive data from the client by reading from its socket.
            socket.on('data', function (chunk: Buffer) {
                buffer.set(chunk, readIndex);
                readIndex += chunk.length;

                // logger.debug(`Data received from client, chunk.length: ${chunk.length}, readIndex: ${readIndex}`);

                let endIndex = findEndOfTransmition(buffer);
                if (endIndex > -1) {
                    let receivedData = buffer.slice(0, endIndex);
                    logger.debug(`receivedData: ${receivedData.length}`);

                    let tail = buffer.slice(endIndex + END_SIGNAL.length, readIndex);
                    logger.debug(`tail: ${tail.length}`);

                    buffer.fill(0, 0, buffer.length);
                    readIndex = 0;

                    listener.processIncomingData(receivedData);
                }
            });

            // When the client requests to end the TCP connection with the server, the server
            // ends the connection.
            socket.on('end', function () {
                logger.debug('Closing connection with the client');
            });

            // Don't forget to catch error, for your own sake.
            socket.on('error', function (err) {
                logger.error(`Error: ${err}`);
            });
        });
    }

    stop() {
        if (this.server) {
            this.server.close();
        }
    }

    private processIncomingData(data: Uint8Array) {
        let intArray = new Uint16Array(data.length / 2);
        let intIndex = 0;
        for (let i = 0; i < data.length; i += 2) {
            let lowByte = data[i];
            let highByte = data[i+1];
            let value = (highByte << 8 ) | lowByte;

            intArray[intIndex++] = value;
        }
        
        // logger.debug(`processIncomingData: ${data}`)
        logger.debug(`processIncomingData: ${intArray}`)
    }

}

function findEndOfTransmition(array: Uint8Array): number {
    return findPattern(array, END_SIGNAL, 0);
}

function findPattern(array: Uint8Array, pattern: Array<number>, offset: number): number {
    let index = array.indexOf(pattern[0], offset);
    if (index > -1) {

        let patternFound = true;

        for (let i = 1; i < pattern.length; i++) {
            if (array[index + i] != pattern[i]) {
                patternFound = false;
                break;
            }
        }

        if (patternFound) {
            return index;
        }
        else {
            return findPattern(array, pattern, index + 1);
        }
    }
    return -1;
}



let t1 = new Uint8Array([6, 6, 6, 6]);
console.log(`**** t1: ${t1} , End:${findEndOfTransmition(t1)}`); //0
let t2 = new Uint8Array([6, 6, 6, 7, 7, 6, 6, 6]);
console.log(`**** t2: ${t2} , End:${findEndOfTransmition(t2)}`); //-1
let t3 = new Uint8Array([6, 6, 6, 7, 7, 6, 6, 6, 6]);
console.log(`**** t3: ${t3} , End:${findEndOfTransmition(t3)}`); //5
let t4 = new Uint8Array([1, 2, 3, 6, 6, 6, 4, 5, 6, 7, 6]);
console.log(`**** t4: ${t4} , End:${findEndOfTransmition(t4)}`); //-1
let t5 = new Uint8Array([1, 2, 3, 6, 6, 6, 4, 5, 6, 6, 6, 6, 6, 6, 7, 6]);
console.log(`**** t5: ${t5} , End:${findEndOfTransmition(t5)}`); //8
