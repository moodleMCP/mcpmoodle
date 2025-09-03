import { moodleCall } from '../moodleClient.js';
import { z } from 'zod';
import { ListQuizzesInput, GetQuizAttemptsInput } from '../utils/validators.js';

export async function list_quizzes(args: z.infer<typeof ListQuizzesInput>) {
  const res = await moodleCall('mod_quiz_get_quizzes_by_courses', { courseids: [args.courseid] });
  return res;
}

export async function get_quiz_attempts(args: z.infer<typeof GetQuizAttemptsInput>) {
  const res = await moodleCall('mod_quiz_get_user_attempts', {
    quizid: args.quizid,
    userid: args.userid ?? 0,
    status: 'all',
  });
  return res;
}
