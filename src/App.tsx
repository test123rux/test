import React, { useState, useEffect } from 'react';
import { Task } from './types/task';
import { TaskForm } from './components/TaskForm';
import { TaskCard } from './components/TaskCard';
import { Timeline } from './components/Timeline';
import { ActiveTaskWidget } from './components/ActiveTaskWidget';
import { CompletedTasks } from './components/CompletedTasks';
import { SessionSummary } from './components/SessionSummary';
import { TaskHistory } from './components/TaskHistory';
import { AuthModal } from './components/auth/AuthModal';
import { Clock, BarChart2, LogOut, History } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { taskService } from './services/taskService';
import toast from 'react-hot-toast';

function App() {
  const { user, loading, signOut } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;
    try {
      const loadedTasks = await taskService.getTasks(user.id);
      setTasks(loadedTasks);
    } catch (error) {
      toast.error('Failed to load tasks');
    }
  };

  useEffect(() => {
    let interval: number;
    if (activeTaskId) {
      interval = setInterval(() => {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === activeTaskId
              ? { ...task, timeSpent: task.timeSpent + 1 }
              : task
          )
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTaskId]);

  const handleTaskSubmit = async (taskData: Omit<Task, 'id' | 'timeSpent' | 'status' | 'actualStartTime' | 'completedAt'>) => {
    if (!user) return;
    try {
      const newTask = await taskService.createTask({
        ...taskData,
        timeSpent: 0,
        status: 'Pending',
      }, user.id);
      setTasks(prev => [...prev, newTask]);
      toast.success('Task created successfully');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    if (!user) return;
    const now = new Date();
    try {
      const taskToUpdate = tasks.find(t => t.id === taskId);
      if (!taskToUpdate) return;

      const updatedTask = {
        ...taskToUpdate,
        status,
        ...(status === 'InProgress' ? { actualStartTime: now } : {}),
        ...(status === 'Completed' ? { completedAt: now } : {}),
      };

      const result = await taskService.updateTask(updatedTask, user.id);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? result : task
        )
      );

      if (status === 'InProgress') {
        setActiveTaskId(taskId);
      } else if (status === 'Completed') {
        setActiveTaskId(null);
      }
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!user) return;
    try {
      await taskService.deleteTask(taskId, user.id);
      if (taskId === activeTaskId) {
        setActiveTaskId(null);
      }
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setTasks([]);
      setActiveTaskId(null);
      setShowSummary(false);
      setShowHistory(false);
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthModal onClose={() => {}} />;
  }

  const activeTask = tasks.find(task => task.id === activeTaskId);
  const pendingTasks = tasks.filter(task => task.status !== 'Completed');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-8 h-8 text-orange-500" />
              <h1 className="text-3xl font-bold">TrueFlo</h1>
            </div>
            <p className="text-gray-400">Welcome, {user.email}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowHistory(true)}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              <History className="w-5 h-5" />
              History
            </button>
            <button
              onClick={handleSignOut}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
            <button
              onClick={() => setShowSummary(true)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              End Session
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-orange-500" />
                Task Overview
              </h2>
              <Timeline tasks={tasks} />
            </section>

            {activeTask && (
              <section>
                <ActiveTaskWidget
                  task={activeTask}
                  onComplete={(taskId) => handleStatusChange(taskId, 'Completed')}
                />
              </section>
            )}

            <section>
              <CompletedTasks tasks={tasks} />
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                />
              ))}
            </section>
          </div>

          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
            <TaskForm onSubmit={handleTaskSubmit} />
          </div>
        </div>
      </div>

      {showSummary && (
        <SessionSummary
          tasks={tasks}
          onClose={() => setShowSummary(false)}
        />
      )}

      {showHistory && (
        <TaskHistory
          history={tasks}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}

export default App;