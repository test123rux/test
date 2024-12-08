import React from 'react';
import { Task } from '../types/task';
import { formatTime } from '../utils/dateUtils';

interface TimelineProps {
  tasks: Task[];
}

export const Timeline: React.FC<TimelineProps> = ({ tasks }) => {
  const sortedTasks = [...tasks].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Today's Timeline</h2>
      <div className="space-y-4">
        {sortedTasks.map((task) => (
          <div
            key={task.id}
            className="relative flex items-center gap-4 pl-6 before:absolute before:left-2 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-orange-500 before:rounded-full before:shadow-lg before:shadow-orange-500/50"
          >
            <div className="min-w-[100px] text-sm text-gray-400">
              {formatTime(task.startTime)}
            </div>
            <div className={`
              flex-1 p-3 rounded-lg
              ${task.status === 'Completed' ? 'bg-green-500/20' : 
                task.status === 'InProgress' ? 'bg-orange-500/20' : 
                'bg-gray-700'}
            `}>
              <h3 className="text-white font-medium">{task.name}</h3>
              <p className="text-sm text-gray-400">
                Duration: {formatTime(task.startTime)} - {formatTime(task.endTime)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};