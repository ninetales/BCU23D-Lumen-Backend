import { WebSocketServer, WebSocket } from "ws";
import Ledger from "./models/Ledger.mjs";
import { ledger } from "./server.mjs";
import { memPool } from "./server.mjs";

const SOCKET_PORT = process.env.SOCKET_PORT || 5001;
const NODES = process.env.MEMBER_NODES ? process.env.MEMBER_NODES.split(',') : [];

const CHANNELS = {
    'LEDGER': 'ledger',
    'TRANSACTION': 'transaction',
    'MEMPOOL': 'memPool'
}

export default class WSServer {

    constructor() {
        this.nodes = [];
    };


    listen() {

        const server = new WebSocketServer({ port: SOCKET_PORT });

        server.on('connection', (node) => this.connectNode(node));

        // this.connectToNodes();

        console.log(`Listening to connections on port ${SOCKET_PORT}`);
    }

    connectToNodes() {
        console.log(`Connecting to nodes... ${NODES}`);

        NODES.forEach(node => {
            const socket = new WebSocket(node);

            socket.on('open', () => this.connectNode(socket));

            socket.on('error', (error) => {
                console.log(`Error connecting to node: ${node} - Node offline`);
            });

        });
    }

    async connectNode(node) {
        this.nodes.push(node);

        console.log('Node connected!');

        this.messageHandler(node);

        node.send(JSON.stringify({ channel: CHANNELS.LEDGER, data: ledger.blocks }));
        node.send(JSON.stringify({ channel: CHANNELS.MEMPOOL, data: memPool.transactionMap }));

    }

    messageHandler(node) {
        node.on('message', (message) => {
            console.log('Response received:', JSON.parse(message));

            const response = JSON.parse(message);

            switch (response.channel) {
                case CHANNELS.LEDGER:
                    console.log('reveived ledger');
                    ledger.replace({
                        newLedger: response.data
                    });
                    memPool.clearBlockTransactions({ chain: response.data });
                    break;
                case CHANNELS.MEMPOOL:
                    console.log('Received mempool', response.data);
                    memPool.replaceTransactionMap({ transactionMap: response.data });
                    break;
                case CHANNELS.TRANSACTION:
                    console.log('Received transaction', response.data);
                    memPool.addTransaction({ transaction: response.data });
                    console.log('The mempool', memPool);
                    break;
                default:
                    return;
            }


        });
    }

    async broadcast() {
        console.log('Broadcasting ledger to all nodes...');
        this.nodes.forEach((node) => node.send(JSON.stringify({ channel: CHANNELS.LEDGER, data: ledger.blocks })));
    }

    async broadcastTransaction({ transaction }) {
        console.log('Broadcasting transaction to all nodes...');
        this.nodes.forEach((node) => node.send(JSON.stringify({ channel: CHANNELS.TRANSACTION, data: transaction })));
    }

}