import { moodleCall } from '../moodleClient.js';
import { z } from 'zod';
import { GetUserByEmailInput } from '../utils/validators.js';

export async function get_user_by_email(args: z.infer<typeof GetUserByEmailInput>) {
  const res = await moodleCall('core_user_get_users', {
    criteria: [{ key: 'email', value: args.email }],
  });
  const user = (res.users && res.users[0]) || null;
  if (!user) return null;
  return {
    id: user.id,
    fullname: `${user.firstname ?? ''} ${user.lastname ?? ''}`.trim() || user.fullname || user.username,
    email: user.email,
    username: user.username,
  };
}
