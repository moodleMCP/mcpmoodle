export class McpError extends Error {
  code: string;
  details?: unknown;
  constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.code = code;
    this.details = details;
  }
}
export const ERRORS = {
  INVALID_ARGUMENT: 'INVALID_ARGUMENT',
  FAILED_PRECONDITION: 'FAILED_PRECONDITION',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL: 'INTERNAL',
  UNAVAILABLE: 'UNAVAILABLE',
};
export const asMcpError = (e: unknown): McpError => {
  if (e instanceof McpError) return e;
  const msg = e instanceof Error ? e.message : String(e);
  return new McpError(ERRORS.INTERNAL, msg);
};
