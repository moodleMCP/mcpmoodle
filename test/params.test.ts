import { buildParams } from '../src/moodleClient';

describe('buildParams/flatten', () => {
  test('simple params', () => {
    process.env.MOODLE_TOKEN = 'tok';
    const p = buildParams('core_course_get_courses', { a: 1, b: 'x' });
    expect(p.get('wstoken')).toBe('tok');
    expect(p.get('wsfunction')).toBe('core_course_get_courses');
    expect(p.get('a')).toBe('1');
    expect(p.get('b')).toBe('x');
  });

  test('array params', () => {
    process.env.MOODLE_TOKEN = 'tok';
    const p = buildParams('mod_assign_get_assignments', { courseids: [2,3] });
    expect(p.get('courseids[0]')).toBe('2');
    expect(p.get('courseids[1]')).toBe('3');
  });

  test('nested params', () => {
    process.env.MOODLE_TOKEN = 'tok';
    const p = buildParams('core_user_get_users', { criteria: [{ key: 'email', value: 'a@b.c' }] });
    expect(p.get('criteria[0][key]')).toBe('email');
    expect(p.get('criteria[0][value]')).toBe('a@b.c');
  });
});
