import 'dotenv/config';

export const config = {
  baseUrl: process.env.MOODLE_BASE_URL || '',
  token: process.env.MOODLE_TOKEN || '',
  format: process.env.MOODLE_FORMAT || 'json',
  port: Number(process.env.PORT || 7410),
  logLevel: process.env.LOG_LEVEL || 'info',
};
if (!config.baseUrl) console.warn('[config] MOODLE_BASE_URL is empty');
if (!config.token) console.warn('[config] MOODLE_TOKEN is empty');
