import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from './Layout';
import ProjectHeader from './ProjectHeader';
import { getProject } from '../utils/storage';

interface ProjectLayoutProps {
  children: React.ReactNode;
}

/**
 * ProjectLayout Component - Wrapper for all project pages
 * 
 * Provides consistent layout and navigation for:
 * - Dashboard
 * - Akra
 * - Ring
 * - Advanced Filter
 * - History
 * 
 * Includes sidebar navigation and project context
 */
const ProjectLayout: React.FC<ProjectLayoutProps> = ({ children }) => {
  const { id } = useParams<{ id: string }>();
  const project = id ? getProject(id) : null;

  return (
    <Layout
      showSidebar={true}
      header={id && project ? <ProjectHeader projectName={project.name} /> : undefined}
    >
      <div className="transition-opacity duration-300 ease-in-out">
        {children}
      </div>
    </Layout>
  );
};

export default ProjectLayout;

