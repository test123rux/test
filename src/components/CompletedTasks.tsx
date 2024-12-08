import React from 'react';
import { Task } from '../types/task';
import { formatTime, formatDuration } from '../utils/dateUtils';
import { CheckCircle2, Clock } from 'lucide-react';

interface CompletedTasksProps {
  tasks: Task[];
}

export const CompletedTasks: React.FC<CompletedTasksProps> = ({ tasks }) => {
  const completedTasks = tasks.filter(task => task.status === 'Completed');

  if (completedTasks.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-green-500" />
        Completed Tasks
      </h2>
      <div className="space-y-4">
        {completedTasks.map((task) => (
          <div
            key={task.id}
            className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-4 border border-green-500/30"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium text-white">{task.name}</h3>
              <span className="text-green-500 text-sm font-medium">
                {formatDuration(task.timeSpent)}
              </span>
            </div>
            <div className="text-sm text-gray-400 space-y-1">
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
  );
};