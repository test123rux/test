import React from 'react';
import { Task } from '../types/task';
import { formatTime, formatDuration } from '../utils/dateUtils';
import { Timer, CheckCircle } from 'lucide-react';

interface ActiveTaskWidgetProps {
  task: Task;
  onComplete: (taskId: string) => void;
}

export const ActiveTaskWidget: React.FC<ActiveTaskWidgetProps> = ({ task, onComplete }) => {
  return (
    <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg p-6 shadow-lg border border-orange-500/30">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Timer className="w-6 h-6 text-orange-500" />
          Active Task
        </h2>
        <span className="text-2xl font-mono text-orange-500">
          {formatDuration(task.timeSpent)}
        </span>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">{task.name}</h3>
        <p className="text-sm text-gray-300">
          Started at: {formatTime(task.actualStartTime || task.startTime)}
        </p>
        {task.description && (
          <p className="text-sm text-gray-400">{task.description}</p>
        )}
      </div>

      <button
        onClick={() => onComplete(task.id)}
        className="mt-4 w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-md hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2"
      >
        <CheckCircle className="w-5 h-5" />
        Complete Task
      </button>
    </div>
  );
};