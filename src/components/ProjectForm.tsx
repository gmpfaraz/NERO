import React, { useState } from 'react';
import type { Project, EntryType } from '../types';
import { generateId } from '../utils/helpers';

interface ProjectFormProps {
  onSubmit: (project: Project) => void;
  onCancel?: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [entryTypes, setEntryTypes] = useState<EntryType[]>(['akra']);
  const [errors, setErrors] = useState<{ name?: string; entryTypes?: string }>({});

  const handleEntryTypeToggle = (type: EntryType) => {
    setEntryTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
    // Clear entry type error when user makes a selection
    if (errors.entryTypes) {
      setErrors((prev) => ({ ...prev, entryTypes: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: { name?: string; entryTypes?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (entryTypes.length === 0) {
      newErrors.entryTypes = 'Select at least one entry type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const newProject: Project = {
      id: generateId(),
      name: name.trim(),
      date,
      entryTypes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit(newProject);
    
    // Reset form
    setName('');
    setDate(new Date().toISOString().split('T')[0]);
    setEntryTypes(['akra']);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Create New Project
      </h3>

      <div className="space-y-4">
        {/* Project Name */}
        <div>
          <label
            htmlFor="project-name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Project Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="project-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            className={`input-field ${errors.name ? 'border-danger' : ''}`}
            placeholder="Enter project name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-danger">{errors.name}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label
            htmlFor="project-date"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Date
          </label>
          <input
            type="date"
            id="project-date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Entry Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Entry Types <span className="text-danger">*</span>
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={entryTypes.includes('akra')}
                onChange={() => handleEntryTypeToggle('akra')}
                className="w-5 h-5 text-secondary border-gray-300 rounded focus:ring-secondary"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                Akra (2-digit: 00-99)
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={entryTypes.includes('ring')}
                onChange={() => handleEntryTypeToggle('ring')}
                className="w-5 h-5 text-secondary border-gray-300 rounded focus:ring-secondary"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                Ring (3-digit: 000-999)
              </span>
            </label>
          </div>
          {errors.entryTypes && (
            <p className="mt-1 text-sm text-danger">{errors.entryTypes}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 mt-6">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary">
          Create Project
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;

