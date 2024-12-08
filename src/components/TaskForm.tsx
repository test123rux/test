import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { TaskFormData, Priority, Category } from '../types/task';
import { roundToNearest15Minutes } from '../utils/dateUtils';

interface TaskFormProps {
  onSubmit: (task: TaskFormData) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<TaskFormData>({
    name: '',
    startTime: roundToNearest15Minutes(new Date()),
    endTime: roundToNearest15Minutes(new Date(Date.now() + 30 * 60000)),
    priority: 'Medium',
    category: 'Work',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      startTime: roundToNearest15Minutes(new Date()),
      endTime: roundToNearest15Minutes(new Date(Date.now() + 30 * 60000)),
      priority: 'Medium',
      category: 'Work',
      description: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Task Name
          </label>
          <input
            type="text"
            maxLength={50}
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Start Time
            </label>
            <input
              type="datetime-local"
              required
              value={formData.startTime.toISOString().slice(0, 16)}
              onChange={(e) => setFormData({ ...formData, startTime: new Date(e.target.value) })}
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              End Time
            </label>
            <input
              type="datetime-local"
              required
              value={formData.endTime.toISOString().slice(0, 16)}
              onChange={(e) => setFormData({ ...formData, endTime: new Date(e.target.value) })}
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description (Optional)
          </label>
          <textarea
            maxLength={200}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-md hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>
    </form>
  );
};