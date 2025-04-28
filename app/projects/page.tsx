import { Projects } from 'app/components/projects';

const projectsList = [
  {
    title: 'Personal Portfolio',
    description:
      'A modern portfolio site built with Next.js, TypeScript, and Tailwind CSS. Features a blog, contact form, and project showcase.',
    imageUrl: '/images/projects/portfolio.jpg',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com/username/portfolio',
    featured: true,
  },
  {
    title: 'E-commerce Platform',
    description:
      'A full-featured online store with product catalog, shopping cart, and secure checkout process.',
    imageUrl: '/images/projects/ecommerce.jpg',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    demoUrl: 'https://example-shop.com',
    githubUrl: 'https://github.com/username/ecommerce',
  },
  {
    title: 'Task Management App',
    description:
      'A productivity application for managing tasks, projects, and team collaboration with real-time updates.',
    imageUrl: '/images/projects/taskapp.jpg',
    technologies: ['Vue.js', 'Firebase', 'Vuex', 'Tailwind CSS'],
    demoUrl: 'https://task-app-demo.com',
    githubUrl: 'https://github.com/username/task-app',
  },
  {
    title: 'Weather Dashboard',
    description:
      'A responsive weather application that provides current conditions and forecasts for locations worldwide.',
    imageUrl: '/images/projects/weather.jpg',
    technologies: ['JavaScript', 'OpenWeather API', 'Chart.js', 'CSS3'],
    demoUrl: 'https://weather-dash.example.com',
    githubUrl: 'https://github.com/username/weather-app',
  },
  {
    title: 'Fitness Tracker',
    description:
      'A mobile-friendly fitness application for tracking workouts, nutrition, and progress over time.',
    imageUrl: '/images/projects/fitness.jpg',
    technologies: ['React Native', 'Firebase', 'Redux', 'Expo'],
    demoUrl: 'https://fitness-app.example.com',
    githubUrl: 'https://github.com/username/fitness-app',
  },
  {
    title: 'Recipe Finder',
    description:
      'A web application that helps users discover recipes based on available ingredients and dietary preferences.',
    imageUrl: '/images/projects/recipe.jpg',
    technologies: ['Angular', 'Node.js', 'MongoDB', 'Bootstrap'],
    demoUrl: 'https://recipe-finder.example.com',
    githubUrl: 'https://github.com/username/recipe-finder',
  },
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
