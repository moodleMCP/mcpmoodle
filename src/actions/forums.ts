import { moodleCall } from '../moodleClient.js';
import { z } from 'zod';
import { ListForumsInput, PostForumDiscussionInput } from '../utils/validators.js';

export async function list_forums(args: z.infer<typeof ListForumsInput>) {
  const res = await moodleCall('mod_forum_get_forums_by_courses', { courseids: [args.courseid] });
  return res;
}

export async function post_forum_discussion(args: z.infer<typeof PostForumDiscussionInput>) {
  const res = await moodleCall('mod_forum_add_discussion', {
    forumid: args.forumid,
    subject: args.subject,
    message: args.messageHtml,
    messageformat: 1, // HTML
  });
  return { discussionid: res?.discussionid ?? res?.id ?? null };
}
