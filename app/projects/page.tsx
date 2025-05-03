import { Projects } from 'app/components/projects';

const projectsList = [
  {
    title: 'Personal Portfolio',
    description:
      'A modern portfolio site built with Next.js, TypeScript, and Tailwind CSS. Features a blog, contact form, and project showcase.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel']
  }
];

export default function ProjectsPage() {
  return (
    <section className="w-full">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">My Projects</h1>

      <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-10">
        A showcase of my recent work, side projects, and open source contributions.
      </p>

      <Projects items={projectsList} />
    </section>
  );
}
