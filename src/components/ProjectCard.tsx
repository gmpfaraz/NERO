import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Project, ProjectStatistics } from '../types';
import { formatDate, calculatePercentage } from '../utils/helpers';

interface ProjectCardProps {
  project: Project;
  statistics?: ProjectStatistics;
  onDelete: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, statistics, onDelete }) => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleClick = () => {
    navigate(`/project/${project.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showDeleteConfirm) {
      onDelete(project.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  const totalEntries = statistics?.totalEntries || 0;
  const totalAmount = (statistics?.firstTotal || 0) + (statistics?.secondTotal || 0);
  const progressPercentage = calculatePercentage(totalEntries, 1000); // Assuming max 1000 entries for progress

  return (
    <div
      className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-secondary transition-colors">
            {project.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {formatDate(project.date)}
          </p>
        </div>
        
        <div className="flex space-x-2">
          {project.entryTypes.includes('akra') && (
            <span className="px-3 py-1 text-xs font-semibold bg-accent-teal bg-opacity-10 text-accent-teal rounded-full">
              Akra
            </span>
          )}
          {project.entryTypes.includes('ring') && (
            <span className="px-3 py-1 text-xs font-semibold bg-accent-purple bg-opacity-10 text-accent-purple rounded-full">
              Ring
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Entries</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalEntries}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalAmount.toLocaleString()}
          </p>
        </div>
      </div>

      {statistics && (
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">FIRST</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {statistics.firstTotal.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">SECOND</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {statistics.secondTotal.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>Progress</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary rounded-full h-2 transition-all duration-300"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Created {formatDate(project.createdAt)}
        </p>
        
        {showDeleteConfirm ? (
          <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleCancel}
              className="text-xs px-3 py-1 bg-background-lightSecondary dark:bg-gray-700 text-text-primary dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="text-xs px-3 py-1 bg-danger text-white rounded-full hover:bg-red-600 transition-colors"
            >
              Confirm Delete
            </button>
          </div>
        ) : (
          <button
            onClick={handleDelete}
            className="text-danger hover:text-red-600 transition-colors"
            title="Delete project"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;

