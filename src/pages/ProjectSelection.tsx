import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isAdminEmail } from '../config/admin';
import Layout from '../components/Layout';
import ThemeToggle from '../components/ThemeToggle';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfileDropdown from '../components/ProfileDropdown';
import type { Project } from '../types';
import { getProjects, saveProject, deleteProject } from '../utils/storage';
import { isOfflineMode } from '../lib/supabase';

const ProjectSelection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user ? isAdminEmail(user.email) : false;

  // No longer automatically redirect admins - they can use projects too

  useEffect(() => {
    // Load projects from localStorage (user-specific)
    const loadProjects = () => {
      if (user) {
        const savedProjects = getProjects(user.id);
        setProjects(savedProjects);
      } else {
        setProjects([]);
      }
      setLoading(false);
    };

    loadProjects();
  }, [user]);

  const handleCreateProject = (project: Project) => {
    // Associate project with current user
    const projectWithUser = {
      ...project,
      userId: user?.id,
    };
    saveProject(projectWithUser);
    setProjects((prev) => [...prev, projectWithUser]);
  };

  const handleDeleteProject = (projectId: string) => {
    deleteProject(projectId);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    // Also delete project transactions
    localStorage.removeItem(`gull-transactions-${projectId}`);
  };

  const header = (
    <div className="py-4 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          GULL
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Accounting Management System
          {isOfflineMode() && (
            <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
              🔒 Offline Mode
            </span>
          )}
        </p>
      </div>
      <div className="flex items-center space-x-3">
        {/* Admin Panel Button */}
        {isAdmin && (
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Admin Panel</span>
            <span className="text-xs opacity-75">👑</span>
          </button>
        )}

        {user && <ProfileDropdown />}
        <ThemeToggle />
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout header={header}>
        <LoadingSpinner text="Loading projects..." />
      </Layout>
    );
  }

  return (
    <Layout header={header}>
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Welcome to GULL
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage your accounting projects with precision and ease
          </p>
        </div>

        {/* Project Form */}
        <div className="mb-8">
          <ProjectForm onSubmit={handleCreateProject} />
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Your Projects
              </h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  statistics={{
                    totalEntries: 0,
                    akraEntries: 0,
                    ringEntries: 0,
                    firstTotal: 0,
                    secondTotal: 0,
                    uniqueNumbers: 0,
                  }}
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create your first project to get started
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProjectSelection;
