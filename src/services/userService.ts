import { api } from './apiClient';

export interface ProgressResponse {
  points: number;
  lessons: { id: string; subjectId: string; topicName: string; points: number; completedAt: string }[];
  childId: string | null;
}

export interface ProfileResponse {
  user: { id: string; login: string; email: string; role: string };
  children: { id: string; fullName: string; grade: string; subjectIds: string[] }[];
}

export async function getProfile(): Promise<ProfileResponse> {
  return api.get<ProfileResponse>('/user/profile');
}

export async function getProgress(): Promise<ProgressResponse> {
  return api.get<ProgressResponse>('/user/progress');
}

export async function updateProgress(params: {
  childId?: string;
  points: number;
  subjectId: string;
  topicName: string;
}): Promise<{ lessonId: string; points: number }> {
  return api.post<{ lessonId: string; points: number }>('/user/progress', params);
}
