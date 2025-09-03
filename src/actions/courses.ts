import { moodleCall } from '../moodleClient.js';
import { z } from 'zod';
import { ListCoursesInput, GetCourseContentsInput } from '../utils/validators.js';

export async function list_courses(args: z.infer<typeof ListCoursesInput>) {
  if (args.search) {
    const res = await moodleCall('core_course_search_courses', {
      criterianame: 'search',
      criteriavalue: args.search,
      page: 0,
      perpage: args.limit ?? 50,
    });
    // Normalizar a lista simple
    const items = (res.courses || []).map((c: any) => ({
      id: c.id, shortname: c.shortname, fullname: c.fullname,
      categoryid: c.categoryid, startdate: c.startdate, enddate: c.enddate, visible: c.visible
    }));
    return items;
  }
  const res = await moodleCall('core_course_get_courses', {});
  const items = (res || []).map((c: any) => ({
    id: c.id, shortname: c.shortname, fullname: c.fullname,
    categoryid: c.categoryid, startdate: c.startdate, enddate: c.enddate, visible: c.visible
  }));
  return (args.limit ? items.slice(0, args.limit) : items);
}

export async function get_course_contents(args: z.infer<typeof GetCourseContentsInput>) {
  const res = await moodleCall('core_course_get_contents', { courseid: args.courseid });
  return res;
}
