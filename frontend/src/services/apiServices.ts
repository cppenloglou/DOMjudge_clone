import API from "./api";

// Auth Service
const auth_path = "/auth";
export const authService = {
  login: (username: string, password: string) =>
    API.post(
      auth_path + "/login",
      { username, password },
      { withCredentials: true }
    ),

  register: (
    email: string,
    password: string,
    teamName: string,
    members: string,
    university: string
  ) =>
    API.post(auth_path + "/register", {
      email,
      password,
      teamName,
      members,
      university,
    }),

  logout: (refreshToken: string | null) =>
    API.post(auth_path + "/logout", refreshToken, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }),

  refresh: (refreshToken: string | null) =>
    API.post(auth_path + "/refresh", refreshToken, { withCredentials: true }),
};

// Submissions Service
const submissions_path = "/submissions";
export const submissionsService = {
  submit: (problemId: string, codeFile: File, teamId: string) => {
    const formData = new FormData();
    formData.append("problemId", problemId);
    formData.append("codeFile", codeFile);
    formData.append("teamId", teamId);

    return API.post(submissions_path + "/submit", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getSubmissionsByProblemAndTeam: (problemId: string, teamId: string) =>
    API.get(submissions_path + `/problem/${problemId}/team/${teamId}`),
};

// Problems Service
const problems_path = "/problems";
export const problemsService = {
  getProblems: (teamId: number, page: number, size: number, filter: string) =>
    API.get(problems_path + `/team/${teamId}`, {
      params: { page, size, filter },
    }),

  getProblemsSize: (teamId: number, filter: string) =>
    API.get(problems_path, { params: { teamId, filter } }),
};

// Teams Service
export const teamsService = {
  getScoreboard: () => API.get("/scoreboard"),
  getTeamById: (teamId: number) => API.get(`/teams/${teamId}`),
};

// Timer Service
const clock_path = "/clock";
export const timerService = {
  getRemainingTime: () => API.get(clock_path + "/remaining-time"),

  startCountdown: (h: number, m: number) =>
    API.post(clock_path + `/start-countdown`, {}, { params: { h, m } }),

  isCountdownActive: () => API.get(clock_path + "/is-countdown-active"),
};
