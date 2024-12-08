import React from 'react';
import { Clock, AlertCircle, CheckCircle2, Timer } from 'lucide-react';
import { Task } from '../types/task';
import { formatTime } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: Task['status']) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onDelete }) => {
  const priorityColors = {
    High: 'bg-red-500',
    Medium: 'bg-yellow-500',
    Low: 'bg-green-500',
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-white truncate max-w-[200px]">{task.name}</h3>
        <span className={`${priorityColors[task.priority]} px-2 py-1 rounded-full text-xs text-white`}>
          {task.priority}
        </span>
      </div>
      
      <div className="space-y-2 text-gray-300">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm">
            {formatTime(task.startTime)} - {formatTime(task.endTime)}
          </span>
        </div>
        
        {task.description && (
          <p className="text-sm text-gray-400 line-clamp-2">{task.description}</p>
        )}
        
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4" />
          <span className="text-sm">
            {Math.floor(task.timeSpent / 60)}m {task.timeSpent % 60}s
          </span>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => onStatusChange(task.id, 'InProgress')}
            className={`px-3 py-1 rounded-full text-xs ${
              task.status === 'InProgress'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-orange-500 hover:text-white'
            } transition-colors duration-300`}
          >
            In Progress
          </button>
          <button
            onClick={() => onStatusChange(task.id, 'Completed')}
            className={`px-3 py-1 rounded-full text-xs ${
              task.status === 'Completed'
                ? 'bg-green-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-green-500 hover:text-white'
            } transition-colors duration-300`}
          >
            Complete
          </button>
        </div>
        
        <button
          onClick={() => onDelete(task.id)}
          className="text-gray-400 hover:text-red-500 transition-colors duration-300"
        >
          <AlertCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};