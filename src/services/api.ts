const BASE_URL = 'https://lms.tech.sjp.ac.lk';

export const moodleApi = {
  // 1. Authenticate & Obtain Token
  async login(username: string, password: string): Promise<string> {
    const params = new URLSearchParams({
      username,
      password,
      service: 'moodle_mobile_app',
    });

    const res = await fetch(`${BASE_URL}/login/token.php?${params.toString()}`);
    const data = await res.json();

    if (data.error) {
      throw new Error(data.error);
    }
    return data.token;
  },

  // 2. Generic REST Function Dispatcher
  async call(token: string, wsFunction: string, params: Record<string, any> = {}) {
    const body = new URLSearchParams({
      wstoken: token,
      wsfunction: wsFunction,
      moodlewsrestformat: 'json',
      ...params,
    });

    const res = await fetch(`${BASE_URL}/webservice/rest/server.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const json = await res.json();
    if (json.exception) {
      throw new Error(json.message || 'Moodle API Error');
    }
    return json;
  },

  // 3. User Site Info & User ID
  async getSiteInfo(token: string) {
    return this.call(token, 'core_webservice_get_site_info');
  },

  // 4. Enrolled Courses
  async getCourses(token: string, userId: number) {
    return this.call(token, 'core_enrol_get_users_courses', { userid: userId.toString() });
  },

  // 5. Course Sections & File Links
  async getCourseContents(token: string, courseId: number) {
    return this.call(token, 'core_course_get_contents', { courseid: courseId.toString() });
  },

  // 6. Upcoming Assignments
  async getAssignments(token: string, courseIds: number[] = []) {
    const params: Record<string, string> = {};
    courseIds.forEach((id, index) => {
      params[`courseids[${index}]`] = id.toString();
    });
    return this.call(token, 'mod_assign_get_assignments', params);
  },

  // 7. Secure File Download URL Resolver
  getFileDownloadUrl(fileUrl: string, token: string): string {
    return `${fileUrl}?token=${token}`;
  }
};