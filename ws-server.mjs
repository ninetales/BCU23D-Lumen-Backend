import { WebSocketServer, WebSocket } from "ws";
import Ledger from "./models/Ledger.mjs";
import { ledger } from "./server.mjs";
import { memPool } from "./server.mjs";

const SOCKET_PORT = process.env.SOCKET_PORT || 5001;
const NODES = process.env.MEMBER_NODES ? process.env.MEMBER_NODES.split(',') : [];

export default class WSServer {

    constructor(/*{ userId, ledger, memPool } = {}*/) {
        // this.ledger = ledger;
        // this.memPool = memPool;
        // this.userId = userId;
        this.nodes = [];
    };

    // setUserId(userId) {
    //     this.userId = userId;
    // }

    // setMemPool(memPool) {
    //     this.memPool = memPool;
    // }

    // setLedger(ledger) {
    //     this.ledger = ledger;
    // }

    listen() {
        console.log('THE USER ID', this.userId);
        const server = new WebSocketServer({ port: SOCKET_PORT });

        server.on('connection', (node) => this.connectNode(node));

        this.connectToNodes();

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

        // const ledger = await Ledger.get({ userId: this.userId });

        // node.send(JSON.stringify(ledger));
        console.log('Sending ledger to node...', ledger);
        node.send(JSON.stringify({ type: 'ledger', data: ledger.blocks }))
    }

    messageHandler(node) {
        node.on('message', (message) => {
            console.log('Response received:', JSON.parse(message));

            const response = JSON.parse(message);

            switch (response.type) {
                case 'ledger':
                    ledger.replace({
                        newLedger: response.data
                    });
                    break;
                case 'transaction':
                    memPool.addTransaction({ transaction: response.data });
                    break;
                default:
                    return;
            }


        });
    }

    async broadcast() {
        console.log('Broadcasting ledger to all nodes...');
        this.nodes.forEach((node) => node.send(JSON.stringify({ type: 'ledger', data: ledger.blocks })));
    }

    async broadcastTransaction({ transaction }) {
        this.nodes.forEach((node) => node.send(JSON.stringify({ type: 'transaction', data: transaction })));
    }
}