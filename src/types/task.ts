export type Priority = 'High' | 'Medium' | 'Low';
export type Category = 'Work' | 'Personal';
export type TaskStatus = 'Pending' | 'InProgress' | 'Completed';

export interface Task {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  priority: Priority;
  description?: string;
  category: Category;
  status: TaskStatus;
  timeSpent: number; // in seconds
  actualStartTime?: Date;
  completedAt?: Date;
}

export interface TaskFormData extends Omit<Task, 'id' | 'timeSpent' | 'status' | 'actualStartTime' | 'completedAt'> {}