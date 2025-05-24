import { Projects } from 'app/components/projects';
import { projects } from '../data/projects';

export const metadata = {
  title: 'Projects',
  description: 'A list of my past and current projects.',
};

export default function ProjectsPage() {
  return (
    <section className="w-full">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">My Projects</h1>

      <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-10">
        A showcase of my recent work, side projects, and open source contributions.
      </p>

      <Projects items={projects} />
    </section>
  );
}
