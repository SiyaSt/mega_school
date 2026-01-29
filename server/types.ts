export type Role = 'parent' | 'student';

export interface User {
  id: string;
  login: string;
  passwordHash: string;
  email: string;
  role: Role;
  createdAt: Date;
}

export interface ChildProfile {
  id: string;
  userId: string;
  fullName: string;
  grade: string;
  subjectIds: string[];
  createdAt: Date;
}

export interface LessonRecord {
  id: string;
  childId: string;
  subjectId: string;
  topicName: string;
  points: number;
  completedAt: Date;
}

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  priceInPoints: number;
  imageUrl?: string;
}

export interface Purchase {
  id: string;
  childId: string;
  itemId: string;
  pricePaid: number;
  createdAt: Date;
}

export interface JWTPayload {
  userId: string;
  login: string;
  role: Role;
}
