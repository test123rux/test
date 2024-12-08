import { supabase } from '../lib/supabase';
import { Task } from '../types/task';
import { Database } from '../types/supabase';

type DbTask = Database['public']['Tables']['tasks']['Row'];

const mapToDbTask = (task: Task, userId: string): Omit<DbTask, 'id' | 'created_at'> => ({
  user_id: userId,
  name: task.name,
  description: task.description || null,
  start_time: task.startTime.toISOString(),
  end_time: task.endTime.toISOString(),
  priority: task.priority,
  category: task.category,
  status: task.status,
  time_spent: task.timeSpent,
  actual_start_time: task.actualStartTime?.toISOString() || null,
  completed_at: task.completedAt?.toISOString() || null,
});

const mapFromDbTask = (dbTask: DbTask): Task => ({
  id: dbTask.id,
  name: dbTask.name,
  description: dbTask.description || undefined,
  startTime: new Date(dbTask.start_time),
  endTime: new Date(dbTask.end_time),
  priority: dbTask.priority,
  category: dbTask.category,
  status: dbTask.status,
  timeSpent: dbTask.time_spent,
  actualStartTime: dbTask.actual_start_time ? new Date(dbTask.actual_start_time) : undefined,
  completedAt: dbTask.completed_at ? new Date(dbTask.completed_at) : undefined,
});

export const taskService = {
  async getTasks(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: true });

    if (error) throw error;
    return (data || []).map(mapFromDbTask);
  },

  async createTask(task: Omit<Task, 'id'>, userId: string): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([mapToDbTask(task as Task, userId)])
      .select()
      .single();

    if (error) throw error;
    return mapFromDbTask(data);
  },

  async updateTask(task: Task, userId: string): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update(mapToDbTask(task, userId))
      .eq('id', task.id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return mapFromDbTask(data);
  },

  async deleteTask(taskId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', userId);

    if (error) throw error;
  },
};