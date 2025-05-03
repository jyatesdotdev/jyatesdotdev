'use client';

import Image from 'next/image';
import Link from 'next/link';

interface ProjectItem {
  title: string;
  description: string;
  imageUrl?: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

interface ProjectsProps {
  items: ProjectItem[];
}

export function Projects({ items }: ProjectsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((project, index) => (
        <div
          key={index}
          className={`flex flex-col rounded-lg overflow-hidden transition-all duration-500 ease-in-out shadow-md
            ${project.featured ? 'md:col-span-2' : ''}`}
        >
          {project.imageUrl &&
            <div className="relative h-48 w-full">
              <Image
                src={project.imageUrl}
                alt={`Screenshot of ${project.title}`}
                fill
                className="object-cover"
              />
            </div>
          }

          <div className="flex-1 p-5 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              {project.title}
            </h3>

            <p className="text-neutral-800 dark:text-neutral-200 mb-4">{project.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-sm rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex gap-3 mt-auto">
              {project.demoUrl && (
                <Link
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  Live Demo
                </Link>
              )}
              {project.githubUrl && (
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-md text-sm font-medium hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                >
                  View Code
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
