import Fastify from 'fastify';
import cors from 'fastify-cors';
import { config } from './config.js';
import { logger } from './utils/logging.js';
import { McpError, asMcpError } from './utils/error.js';
import { runTool, getResource } from './mcpServer.js';

const app = Fastify({ logger });

// @ts-ignore - plugin may lack types
app.register(cors, { origin: true });

app.get('/health', async () => ({ ok: true }));

app.post('/mcp/tools', async (req, reply) => {
  try {
    const body = (req.body || {}) as any;
    const tool = body.tool;
    const args = body.arguments || {};
    const result = await runTool(tool, args);
    return { ok: true, tool, result };
  } catch (e) {
    const me = asMcpError(e);
    reply.status(400);
    return { ok: false, error: { code: me.code, message: me.message, details: me.details } };
  }
});

app.get('/mcp/resources/:type/:id', async (req, reply) => {
  try {
    const { type, id } = req.params as any;
    const result = await getResource(type, id);
    return { ok: true, result };
  } catch (e) {
    const me = asMcpError(e);
    reply.status(404);
    return { ok: false, error: { code: me.code, message: me.message } };
  }
});

app.listen({ port: config.port, host: '0.0.0.0' }).then(() => {
  logger.info(`[moodle-mcp] listening on :${config.port}`);
}).catch((err) => {
  logger.error(err, 'Fatal error on start');
  process.exit(1);
});
