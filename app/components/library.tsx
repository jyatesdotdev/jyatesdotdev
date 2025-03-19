'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface LibraryItem {
  title: string;
  description: string;
  url: string;
  category: string;
  dateAdded: string;
}

interface LibraryProps {
  items: LibraryItem[];
}

export function Library({ items }: LibraryProps) {
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Get unique categories
  const uniqueCategories = Array.from(new Set(items.map(item => item.category)));
  const categories = ['all', ...uniqueCategories];

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = itemRefs.current.findIndex(ref => ref === entry.target);
            if (index !== -1) {
              setActiveItemIndex(index);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    itemRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      itemRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const filteredItems =
    selectedCategory === 'all' ? items : items.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Library Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item, index) => (
          <div
            key={index}
            ref={el => (itemRefs.current[index] = el)}
            className={`flex flex-col rounded-lg overflow-hidden transition-all duration-500 ease-in-out
              ${activeItemIndex === index ? 'shadow-lg scale-[1.01]' : 'shadow-md'}`}
          >
            <div className="flex-1 p-5 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm rounded-md">
                  {item.category}
                </span>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  {new Date(item.dateAdded).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                {item.title}
              </h3>

              <p className="text-neutral-800 dark:text-neutral-200 mb-4">{item.description}</p>

              <Link
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Visit Resource
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
