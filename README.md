# moodle-mcp

Servidor **MCP** (Model Context Protocol) para exponer *tools* que permiten a un LLM interactuar con **Moodle** mediante su API REST.

> Estado: baseline listo para producción ligera (TypeScript + Fastify). Incluye validación con Zod, logging con Pino, estructura de acciones y cliente REST con *backoff*.

## Requisitos
- Node.js 20+
- Token de servicio en Moodle (REST)
- URL base de Moodle (p. ej. `https://elearning.org`)

## Configuración
1. Copia `.env.example` a `.env` y ajusta valores:
```
MOODLE_BASE_URL=https://elearning.example.org
MOODLE_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MOODLE_FORMAT=json
PORT=7410
LOG_LEVEL=info
```

2. Instala dependencias:
```bash
npm install
```

3. Arranca en modo desarrollo:
```bash
npm run dev
```
El servidor expone:
- `GET /health` → *ok*
- `POST /mcp/tools` → invocar tools MCP con payload `{ tool, arguments }`
- `GET /mcp/resources/:type/:id` → recursos cacheables (course, user, assignment)

## Ejemplos de uso

**Listar cursos**:
```bash
curl -X POST http://localhost:7410/mcp/tools   -H "content-type: application/json"   -d '{"tool":"list_courses","arguments":{"search":"prospectiva","limit":10}}'
```

**Buscar usuario por email**:
```bash
curl -X POST http://localhost:7410/mcp/tools   -H "content-type: application/json"   -d '{"tool":"get_user_by_email","arguments":{"email":"alguien@org.org"}}'
```

**Matricular usuario**:
```bash
curl -X POST http://localhost:7410/mcp/tools   -H "content-type: application/json"   -d '{"tool":"enroll_user","arguments":{"userid":123,"courseid":456,"roleid":5}}'
```

## Estructura
```
src/
  index.ts            # bootstrap Fastify
  mcpServer.ts        # registro y ruteo de tools/resources
  moodleClient.ts     # wrapper REST Moodle con backoff
  config.ts           # carga de env
  utils/
    validators.ts     # esquemas Zod
    error.ts          # tipos/ayudantes de error
    logging.ts        # logger Pino
  actions/            # handlers MCP
    courses.ts
    users.ts
    enrollments.ts
    assignments.ts
    forums.ts
    files.ts
    quizzes.ts
schemas/              # (espacio para JSON Schemas si los separas)
test/
  params.test.ts      # tests de flatten/validación
mcp.json              # manifest MCP
```

## Notas sobre Moodle REST
- Endpoint: `{MOODLE_BASE_URL}/webservice/rest/server.php`
- Parámetros obligatorios: `wstoken`, `wsfunction`, `moodlewsrestformat`
- Codificación de arrays: `courseids[0]=123&courseids[1]=456` (ya soportado por `flattenParams`).
- Errores: el cliente normaliza errores HTTP/REST y texto de Moodle.

## Docker
```bash
docker build -t moodle-mcp .
docker run --env-file .env -p 7410:7410 moodle-mcp
```

## Licencia
MIT © 2025
