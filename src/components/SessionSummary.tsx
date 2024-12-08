import React from 'react';
import { Task } from '../types/task';
import { formatTime, formatDate, formatDuration } from '../utils/dateUtils';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

interface SessionSummaryProps {
  tasks: Task[];
  onClose: () => void;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({ tasks, onClose }) => {
  const today = new Date();
  const todaysTasks = tasks.filter(task => {
    const taskDate = new Date(task.startTime);
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    );
  });

  const completedTasks = todaysTasks.filter(task => task.status === 'Completed');
  const pendingTasks = todaysTasks.filter(task => task.status !== 'Completed');
  
  const totalTimeSpent = completedTasks.reduce((acc, task) => acc + task.timeSpent, 0);

  return (
    <div className="fixed inset-0 bg-gray-900/95 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Session Summary</h2>
              <p className="text-gray-400">{formatDate(today)}</p>
            </div>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
            >
              Return to Tasks
            </button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400">Total Tasks</p>
              <p className="text-2xl font-bold text-white">{todaysTasks.length}</p>
            </div>
            <div className="bg-green-500/20 rounded-lg p-4">
              <p className="text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-green-500">{completedTasks.length}</p>
            </div>
            <div className="bg-orange-500/20 rounded-lg p-4">
              <p className="text-gray-400">Total Time</p>
              <p className="text-2xl font-bold text-orange-500">{formatDuration(totalTimeSpent)}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Completed Tasks
            </h3>
            <div className="space-y-3">
              {completedTasks.map(task => (
                <div key={task.id} className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-medium text-white">{task.name}</h4>
                    <span className="text-green-500 text-sm font-medium">
                      {formatDuration(task.timeSpent)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Started: {formatTime(task.actualStartTime || task.startTime)}
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Completed: {formatTime(task.completedAt || new Date())}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {pendingTasks.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-orange-500" />
                Pending Tasks
              </h3>
              <div className="space-y-3">
                {pendingTasks.map(task => (
                  <div key={task.id} className="bg-gray-700/50 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-2">{task.name}</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Scheduled: {formatTime(task.startTime)}
                      </p>
                      <p className="text-orange-500">Not completed</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};