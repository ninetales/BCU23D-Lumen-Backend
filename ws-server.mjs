import { WebSocketServer, WebSocket } from "ws";
import Ledger from "./models/Ledger.mjs";

const SOCKET_PORT = process.env.SOCKET_PORT || 5001;
const NODES = process.env.MEMBER_NODES ? process.env.MEMBER_NODES.split(',') : [];

export default class WSServer {

    constructor({ userId, ledger } = {}) {
        this.ledger = ledger;
        this.userId = userId;
        this.nodes = [];
    };

    setUserId(userId) {
        this.userId = userId;
    }

    setLedger(ledger) {
        this.ledger = ledger;
    }

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

        const ledger = await Ledger.get({ userId: this.userId });
        console.log('Sending ledger', ledger);

        node.send(JSON.stringify(ledger));
    }

    messageHandler(node) {
        node.on('message', (message) => {
            console.log('--- Message received ---');
            const recievedLedger = JSON.parse(message);
            console.log(recievedLedger);
            Ledger.replace({
                userId: this.userId,
                newLedger: recievedLedger
            });
        });
    }

    async broadcast({ ledger }) {
        console.log('Broadcasting ledger', ledger)
        this.nodes.forEach((node) => node.send(JSON.stringify(ledger)));
    }
}