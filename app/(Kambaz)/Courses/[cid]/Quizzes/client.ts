import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;

export const findQuizzesForCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/quizzes`);
  return data;
};
export const createQuizForCourse = async (courseId: string, quiz: any) => {
  const { data } = await axiosWithCredentials.post(`${COURSES_API}/${courseId}/quizzes`, quiz);
  return data;
};
export const findQuizById = async (quizId: string) => {
  const { data } = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}`);
  return data;
};
export const updateQuiz = async (quiz: any) => {
  const { data } = await axiosWithCredentials.put(`${QUIZZES_API}/${quiz._id}`, quiz);
  return data;
};
export const deleteQuiz = async (quizId: string) => {
  const { data } = await axiosWithCredentials.delete(`${QUIZZES_API}/${quizId}`);
  return data;
};
export const publishQuiz = async (quizId: string) => {
  const { data } = await axiosWithCredentials.post(`${QUIZZES_API}/${quizId}/publish`);
  return data;
};
export const unpublishQuiz = async (quizId: string) => {
  const { data } = await axiosWithCredentials.post(`${QUIZZES_API}/${quizId}/unpublish`);
  return data;
};

export const findQuestionsForQuiz = async (courseId: string, quizId: string) => {
  const { data } = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/quizzes/${quizId}/questions`);
  return data;
};
export const createQuestionForQuiz = async (courseId: string, quizId: string, question: any) => {
  const { data } = await axiosWithCredentials.post(`${COURSES_API}/${courseId}/quizzes/${quizId}/questions`, question);
  return data;
};
export const updateQuestion = async (question: any) => {
  const { data } = await axiosWithCredentials.put(`${QUIZZES_API}/questions/${question._id}`, question);
  return data;
};
export const deleteQuestion = async (questionId: string) => {
  const { data } = await axiosWithCredentials.delete(`${QUIZZES_API}/questions/${questionId}`);
  return data;
};

export const findAnswersForQuiz = async (quizId: string) => {
  const { data } = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/answers/current`);
  return data;
};
export const createAnswer = async (questionId: string, answer: any) => {
  const { data } = await axiosWithCredentials.post(
    `${HTTP_SERVER}/api/questions/${questionId}/answers`,
    { answer }
  );
  return data;
};
