import { Task } from '../types/task';

const TASKS_STORAGE_KEY = 'trueflo_tasks';

export interface DailyTasks {
  date: string;
  tasks: Task[];
}

export const saveTasks = (tasks: Task[]) => {
  const existingData = loadAllTasks();
  const today = new Date().toISOString().split('T')[0];
  
  // Update or add today's tasks
  const updatedData = existingData.filter(day => day.date !== today);
  updatedData.push({ date: today, tasks });
  
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedData));
};

export const loadAllTasks = (): DailyTasks[] => {
  const data = localStorage.getItem(TASKS_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const loadTodaysTasks = (): Task[] => {
  const today = new Date().toISOString().split('T')[0];
  const allTasks = loadAllTasks();
  const todaysTasks = allTasks.find(day => day.date === today);
  return todaysTasks ? todaysTasks.tasks.map(task => ({
    ...task,
    startTime: new Date(task.startTime),
    endTime: new Date(task.endTime),
    actualStartTime: task.actualStartTime ? new Date(task.actualStartTime) : undefined,
    completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
  })) : [];
};