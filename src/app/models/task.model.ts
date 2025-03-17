export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum TaskDifficulty {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface Task {
  id?: string;
  listId: string;
  title: string;
  description?: string;
  imageUrl?: string;
  startDate?: Date;
  endDate?: Date;
  difficulty: TaskDifficulty;
  status: TaskStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
