import * as dgram from 'dgram';
import { Socket } from 'dgram';
import { mainLogger } from '../../app';
import { AddressInfo } from 'net';

let logger = mainLogger.child({ label: "UdpListener" })

export class UdpListener {

    private port: number;
    private host = "0.0.0.0";
    private server?: Socket;

    constructor(port: number) {
        this.port = port;
    }

    start() {
        let server = dgram.createSocket('udp4');
        this.server = server;

        server.on('error', (err) => {
            logger.error(`server error:\n${err.stack}`);
            server.close();
        });

        server.on('message', (msg, rinfo) => {
            logger.debug(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
        });

        server.on('listening', () => {
            const address = server.address() as AddressInfo;
            logger.debug(`server listening ${address.address}:${address.port}`);
        });

        server.bind({
            address: this.host,
            port: this.port,
            exclusive: true
          }, ()=>{
            logger.debug(`server bind complete`);
        });
    }

    stop() {
        if (this.server) {
            this.server.close();
        }
    }
}