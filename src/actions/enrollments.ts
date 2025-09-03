import { moodleCall } from '../moodleClient.js';
import { z } from 'zod';
import { EnrollUserInput, UnenrollUserInput } from '../utils/validators.js';

export async function enroll_user(args: z.infer<typeof EnrollUserInput>) {
  const enrolments = [{
    roleid: args.roleid ?? 5, // student por defecto
    userid: args.userid,
    courseid: args.courseid,
    timestart: args.timestart ?? 0,
    timeend: args.timeend ?? 0,
    suspend: 0,
  }];
  const res = await moodleCall('enrol_manual_enrol_users', { enrolments });
  return { status: 'ok', result: res };
}

export async function unenroll_user(args: z.infer<typeof UnenrollUserInput>) {
  const enrolments = [{
    userid: args.userid,
    courseid: args.courseid,
  }];
  const res = await moodleCall('enrol_manual_unenrol_users', { enrolments });
  return { status: 'ok', result: res };
}
