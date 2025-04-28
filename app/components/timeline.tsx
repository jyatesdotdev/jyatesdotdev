'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface TimelineItem {
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string[];
  location?: string;
  logo?: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  // Group timeline items by company
  const groupedItems = items.reduce((acc, item) => {
    const existingGroup = acc.find(group => group[0].company === item.company);
    if (existingGroup) {
      existingGroup.push(item);
    } else {
      acc.push([item]);
    }
    return acc;
  }, [] as TimelineItem[][]);

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 h-full w-1 bg-gradient-to-b from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800 rounded-full" />

      {groupedItems.map((group, groupIndex) => {
        // Sort positions within company by date (most recent first)
        const sortedGroup = [...group].sort((a, b) => {
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        });

        // Get earliest start date and latest end date for the company
        const earliestStartDate = sortedGroup[sortedGroup.length - 1].startDate;
        const latestEndDate = sortedGroup[0].endDate || 'Present';

        return (
          <div
            key={groupIndex}
            ref={el => (itemRefs.current[groupIndex] = el)}
            className={`relative mb-12 pl-12 transition-all duration-500 ease-in-out ${
              0 === groupIndex ? 'opacity-100 translate-x-0' : 'opacity-80'
            }`}
          >
            {/* Timeline dot */}
            <div
              className={`absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 border-white dark:border-black shadow-md transition-all duration-300 ${
                0 === groupIndex
                  ? 'bg-blue-500 dark:bg-blue-400 scale-125'
                  : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            />

            <div className="flex items-start gap-5 group">
              {sortedGroup[0].logo && (
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={sortedGroup[0].logo}
                    alt={`${sortedGroup[0].company} logo`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex-1 rounded-lg p-5 bg-white dark:bg-neutral-900 shadow-sm border border-neutral-100 dark:border-neutral-800 transition-all duration-300 hover:shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {sortedGroup[0].company}
                  </h3>
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                    {earliestStartDate} - {latestEndDate}
                  </span>
                </div>

                {sortedGroup[0].location && (
                  <p className="mb-3 text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {sortedGroup[0].location}
                  </p>
                )}

                {/* Display each position within the company */}
                <div className="space-y-4">
                  {sortedGroup.map((position, posIndex) => (
                    <div
                      key={posIndex}
                      className={
                        posIndex > 0
                          ? 'pt-4 border-t border-neutral-100 dark:border-neutral-800'
                          : ''
                      }
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h4 className="font-medium text-neutral-800 dark:text-neutral-200">
                          {position.title}
                        </h4>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                          {position.startDate} - {position.endDate || 'Present'}
                        </span>
                      </div>

                      <ul className="mt-2 list-disc list-inside text-neutral-800 dark:text-neutral-200 leading-relaxed space-y-1">
                        {position.description.map((desc, i) => (
                          <li key={i}>{desc}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
