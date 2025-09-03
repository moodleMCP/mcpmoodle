import { moodleCall } from '../moodleClient.js';
import { z } from 'zod';
import { ListAssignmentsInput, GetSubmissionsInput, GradeSubmissionInput } from '../utils/validators.js';

export async function list_assignments(args: z.infer<typeof ListAssignmentsInput>) {
  const res = await moodleCall('mod_assign_get_assignments', { courseids: args.courseids });
  const courses = res.courses || [];
  return courses.flatMap((c: any) => (c.assignments || []).map((a: any) => ({
    course: c.id, id: a.id, name: a.name, duedate: a.duedate, allowsubmissionsfromdate: a.allowsubmissionsfromdate
  })));
}

export async function get_submissions(args: z.infer<typeof GetSubmissionsInput>) {
  const res = await moodleCall('mod_assign_get_submissions', { assignmentids: [args.assignmentid] });
  return res;
}

export async function grade_submission(args: z.infer<typeof GradeSubmissionInput>) {
  const gradeinfo = {
    assignmentid: args.assignmentid,
    userid: args.userid,
    grade: args.grade,
    attemptnumber: -1,
    addattempt: 0,
    workflowstate: '',
    applytoall: 0,
    plugindata: args.textfeedback ? {
      assignfeedbackcomments_editor: { text: args.textfeedback, format: 1 }
    } : undefined,
  };
  const res = await moodleCall('mod_assign_save_grade', { grades: [gradeinfo] });
  return { status: 'ok', result: res };
}
