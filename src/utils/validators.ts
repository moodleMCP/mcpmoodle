import { z } from 'zod';

export const ListCoursesInput = z.object({
  categoryid: z.number().optional(),
  search: z.string().optional(),
  limit: z.number().int().positive().max(200).optional(),
});

export const GetCourseContentsInput = z.object({
  courseid: z.number().int().positive(),
});

export const GetUserByEmailInput = z.object({
  email: z.string().email(),
});

export const EnrollUserInput = z.object({
  userid: z.number().int().positive(),
  courseid: z.number().int().positive(),
  roleid: z.number().int().positive().optional(),
  timestart: z.number().int().optional(),
  timeend: z.number().int().optional(),
});

export const UnenrollUserInput = z.object({
  userid: z.number().int().positive(),
  courseid: z.number().int().positive(),
});

export const ListAssignmentsInput = z.object({
  courseids: z.array(z.number().int().positive()).min(1),
});

export const GetSubmissionsInput = z.object({
  assignmentid: z.number().int().positive(),
});

export const GradeSubmissionInput = z.object({
  assignmentid: z.number().int().positive(),
  userid: z.number().int().positive(),
  grade: z.number(),
  textfeedback: z.string().optional(),
});

export const ListForumsInput = z.object({
  courseid: z.number().int().positive(),
});

export const PostForumDiscussionInput = z.object({
  forumid: z.number().int().positive(),
  subject: z.string().min(1),
  messageHtml: z.string().min(1),
});

export const UploadFileInput = z.object({
  filename: z.string().min(1),
  filepath: z.string().min(1), // Path local o base64
  filearea: z.string().optional(),
  contextid: z.number().int().optional(),
});

export const ListQuizzesInput = z.object({
  courseid: z.number().int().positive(),
});

export const GetQuizAttemptsInput = z.object({
  quizid: z.number().int().positive(),
  userid: z.number().int().positive().optional(),
});

export type ToolName =
  | 'list_courses' | 'get_course_contents' | 'get_user_by_email'
  | 'enroll_user' | 'unenroll_user'
  | 'list_assignments' | 'get_submissions' | 'grade_submission'
  | 'list_forums' | 'post_forum_discussion'
  | 'upload_file'
  | 'list_quizzes' | 'get_quiz_attempts';

export const ToolSchemaMap = {
  list_courses: ListCoursesInput,
  get_course_contents: GetCourseContentsInput,
  get_user_by_email: GetUserByEmailInput,
  enroll_user: EnrollUserInput,
  unenroll_user: UnenrollUserInput,
  list_assignments: ListAssignmentsInput,
  get_submissions: GetSubmissionsInput,
  grade_submission: GradeSubmissionInput,
  list_forums: ListForumsInput,
  post_forum_discussion: PostForumDiscussionInput,
  upload_file: UploadFileInput,
  list_quizzes: ListQuizzesInput,
  get_quiz_attempts: GetQuizAttemptsInput,
} as const;
