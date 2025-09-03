import { z } from 'zod';
import { McpError, ERRORS } from './utils/error.js';
import { logger } from './utils/logging.js';
import {
  ToolSchemaMap, ToolName
} from './utils/validators.js';

import { list_courses, get_course_contents } from './actions/courses.js';
import { get_user_by_email } from './actions/users.js';
import { enroll_user, unenroll_user } from './actions/enrollments.js';
import { list_assignments, get_submissions, grade_submission } from './actions/assignments.js';
import { list_forums, post_forum_discussion } from './actions/forums.js';
import { upload_file } from './actions/files.js';
import { list_quizzes, get_quiz_attempts } from './actions/quizzes.js';

const handlers: Record<ToolName, (args: any)=>Promise<any>> = {
  list_courses,
  get_course_contents,
  get_user_by_email,
  enroll_user,
  unenroll_user,
  list_assignments,
  get_submissions,
  grade_submission,
  list_forums,
  post_forum_discussion,
  upload_file,
  list_quizzes,
  get_quiz_attempts,
};

export async function runTool(tool: ToolName, args: any) {
  const schema = ToolSchemaMap[tool];
  if (!schema) throw new McpError(ERRORS.NOT_FOUND, `Tool no registrada: ${tool}`);
  const parsed = schema.parse(args ?? {});
  const handler = handlers[tool];
  if (!handler) throw new McpError(ERRORS.NOT_FOUND, `Handler no encontrado para: ${tool}`);
  return handler(parsed);
}

export async function getResource(type: string, id: string) {
  // Placeholder simple: en producción, consulta y cachea
  if (type === 'course') return { id, type, note: 'add caching here' };
  if (type === 'user') return { id, type, note: 'add caching here' };
  if (type === 'assignment') return { id, type, note: 'add caching here' };
  throw new McpError(ERRORS.NOT_FOUND, `Resource not found: ${type}/${id}`);
}
