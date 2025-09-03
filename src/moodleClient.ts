import { config } from './config.js';
import { McpError, ERRORS } from './utils/error.js';
import { logger } from './utils/logging.js';

/** Convierte un objeto JSON a pares estilo Moodle: arrays con índices -> a[b][0]=x */
function flattenParams(prefix: string, value: any, out: URLSearchParams) {
  if (Array.isArray(value)) {
    value.forEach((v, i) => flattenParams(`${prefix}[${i}]`, v, out));
  } else if (value !== null && typeof value === 'object') {
    Object.entries(value).forEach(([k, v]) => flattenParams(`${prefix}[${k}]`, v, out));
  } else if (value !== undefined) {
    out.append(prefix, String(value));
  }
}

export function buildParams(wsfunction: string, params: Record<string, any>) {
  const search = new URLSearchParams();
  search.set('wstoken', config.token);
  search.set('wsfunction', wsfunction);
  search.set('moodlewsrestformat', config.format || 'json');
  Object.entries(params || {}).forEach(([k, v]) => flattenParams(k, v, search));
  return search;
}

async function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function moodleCall<T=any>(wsfunction: string, params: Record<string, any> = {}, retries = 3): Promise<T> {
  if (!config.baseUrl || !config.token) {
    throw new McpError(ERRORS.FAILED_PRECONDITION, 'MOODLE_BASE_URL o MOODLE_TOKEN no configurados');
  }
  const url = `${config.baseUrl.replace(/\/$/, '')}/webservice/rest/server.php`;
  let attempt = 0;
  let lastErr: unknown = null;
  while (attempt <= retries) {
    try {
      const body = buildParams(wsfunction, params);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (!response.ok) {
        if (response.status >= 500 && attempt < retries) {
          attempt++;
          await delay(250 * attempt);
          continue;
        }
        const text = await response.text();
        throw new McpError(ERRORS.UNAVAILABLE, `HTTP ${response.status}: ${text}`);
      }
      const data = await response.json().catch(async () => ({}));
      if (data && data.exception) {
        // Error en formato Moodle
        const msg = `${data.errorcode || data.exception}: ${data.message || 'Error Moodle'}`;
        throw new McpError(ERRORS.FAILED_PRECONDITION, msg, data);
      }
      return data as T;
    } catch (e) {
      lastErr = e;
      logger.warn({ attempt, wsfunction }, 'moodleCall error');
      if (attempt >= retries) break;
      attempt++;
      await delay(250 * attempt);
    }
  }
  if (lastErr instanceof McpError) throw lastErr;
  const msg = lastErr instanceof Error ? lastErr.message : String(lastErr);
  throw new McpError(ERRORS.INTERNAL, msg);
}
