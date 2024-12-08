import React from 'react';
import { Task } from '../types/task';
import { formatDate, formatTime, formatDuration } from '../utils/dateUtils';
import { Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface TaskHistoryProps {
  history: Task[];
  onClose: () => void;
}

export const TaskHistory: React.FC<TaskHistoryProps> = ({ history, onClose }) => {
  // Group tasks by date
  const groupedTasks = history.reduce((acc, task) => {
    const date = task.startTime.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  // Convert to array and sort by date
  const sortedDates = Object.entries(groupedTasks)
    .map(([date, tasks]) => ({ date, tasks }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="fixed inset-0 bg-gray-900/95 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-white">Task History</h2>
            </div>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
            >
              Return to Tasks
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {sortedDates.map(({ date, tasks }) => {
            const completedTasks = tasks.filter(task => task.status === 'Completed');
            const totalTimeSpent = completedTasks.reduce((acc, task) => acc + task.timeSpent, 0);

            return (
              <div key={date} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-white">
                    {formatDate(new Date(date))}
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="text-green-500">
                      {completedTasks.length}/{tasks.length} completed
                    </span>
                    <span className="text-orange-500">
                      {formatDuration(totalTimeSpent)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {tasks.map(task => (
                    <div
                      key={task.id}
                      className={`bg-gray-700/50 rounded-lg p-4 border ${
                        task.status === 'Completed'
                          ? 'border-green-500/30'
                          : 'border-orange-500/30'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-medium text-white flex items-center gap-2">
                            {task.status === 'Completed' ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-orange-500" />
                            )}
                            {task.name}
                          </h4>
                          {task.description && (
                            <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                          )}
                        </div>
                        {task.status === 'Completed' && (
                          <span className="text-green-500 text-sm font-medium">
                            {formatDuration(task.timeSpent)}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                        <p className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {task.status === 'Completed'
                            ? `Started: ${formatTime(task.actualStartTime || task.startTime)}`
                            : `Scheduled: ${formatTime(task.startTime)}`}
                        </p>
                        {task.status === 'Completed' && task.completedAt && (
                          <p className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Completed: {formatTime(task.completedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {sortedDates.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No task history available yet. Complete some tasks to see them here!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};