'use client';

import { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AccordionItem {
  question: string;
  answer: string | ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  allowMultiple?: boolean;
}

const Accordion = ({
  items,
  className = '',
  allowMultiple = true,
}: AccordionProps): JSX.Element => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number): void => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      if (!allowMultiple) {
        newOpenItems.clear();
      }
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className={cn('w-full space-y-2', className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg overflow-hidden"
        >
          <button
            type="button"
            onClick={() => toggleItem(index)}
            className="w-full px-6 py-4 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors duration-200"
            aria-expanded={openItems.has(index)}
          >
            <span className="font-medium text-gray-900 text-lg">
              {item.question}
            </span>
            <div className="flex-shrink-0 ml-4">
              <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                <svg
                  className={cn(
                    'w-3 h-3 text-white transition-transform duration-200',
                    openItems.has(index) ? 'rotate-0' : 'rotate-0'
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {openItems.has(index) ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M18 12H6"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  )}
                </svg>
              </div>
            </div>
          </button>
          <div
            className={cn(
              'transition-all duration-300 ease-in-out overflow-hidden',
              openItems.has(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div className="px-6 pb-4 text-gray-600 leading-relaxed">
              {typeof item.answer === 'string' ? (
                <p>{item.answer}</p>
              ) : (
                item.answer
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
