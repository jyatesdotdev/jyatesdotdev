import { Timeline } from 'app/components/timeline';
import { careerItems } from '../data/career';

export const metadata = {
  title: 'Career',
  description: 'A history of my career and a description of my responsibilities.',
};

export default function CareerPage() {
  return (
    <section className="w-full">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">Career Timeline</h1>
      <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-10">
        A chronological overview of my professional journey and key achievements.
      </p>
      <Timeline items={careerItems} />
    </section>
  );
}
