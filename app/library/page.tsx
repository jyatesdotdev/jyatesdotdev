import { Library } from '../components/library';
import { libraryItems } from '../data/library';

export const metadata = {
  title: 'Library | Your Name',
  description: 'A curated collection of interesting resources, articles, and references.',
};

export default function LibraryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Library</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8">
          A curated collection of interesting resources, articles, and references that I've found
          valuable in my journey as a developer.
        </p>
        <Library items={libraryItems} />
      </div>
    </div>
  );
}
