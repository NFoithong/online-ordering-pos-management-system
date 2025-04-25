"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastOrder = broadcastOrder;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const menu_routes_1 = __importDefault(require("./routes/menu.routes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// REST endpoints
app.use('/menu', menu_routes_1.default);
// Health check
// app.get('/', (_req: Request, res: Response) => res.send('API is running'));
// --- SSE setup for real-time orders ---
let sseClients = [];
app.get('/orders/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.flushHeaders();
    sseClients.push(res);
    req.on('close', () => {
        sseClients = sseClients.filter(c => c !== res);
    });
});
// Broadcast helper (call this inside your order-creation logic)
function broadcastOrder(order) {
    const payload = `data: ${JSON.stringify(order)}\n\n`;
    sseClients.forEach(client => client.write(payload));
}
app.listen(config_1.PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${config_1.PORT}`);
});
