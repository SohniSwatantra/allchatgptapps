'use client';

import { useState } from 'react';
import { Archive, ChevronUp, Crown } from 'lucide-react';
import { products, timeRangeTabs } from '@/data/dashboard/sampleData';
import { cn } from '@/lib/utils';

export const CenterContent = () => {
  const [activeTab, setActiveTab] = useState('Daily');

  return (
    <main className="space-y-6">
      {/* Time Range Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          {timeRangeTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'relative px-3 py-2 text-sm font-medium transition-colors',
                activeTab === tab
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300'
              )}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-4/5 -translate-x-1/2 rounded-full bg-primary-500" />
              )}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-2 text-sm text-secondary-500 transition-colors hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300">
          <Archive className="h-4 w-4" />
          Daily Archives
        </button>
      </div>

      {/* Countdown Info Card */}
      <div className="rounded-xl border border-secondary-200 bg-white p-4 dark:border-secondary-700 dark:bg-secondary-800/50">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-bold text-secondary-900 dark:text-white">
            New launches in
          </h3>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-secondary-100 px-3 py-1.5 text-sm font-semibold text-secondary-600 dark:bg-secondary-700 dark:text-secondary-300">
              13 hours
            </span>
            <span className="rounded-lg bg-secondary-100 px-3 py-1.5 text-sm font-semibold text-secondary-600 dark:bg-secondary-700 dark:text-secondary-300">
              53 mins
            </span>
            <span className="rounded-lg bg-secondary-100 px-3 py-1.5 text-sm font-semibold text-secondary-600 dark:bg-secondary-700 dark:text-secondary-300">
              5 secs
            </span>
          </div>
        </div>
        <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400">
          Products are ranked based on upvotes. Check back tomorrow for new launches.{' '}
          <button className="underline underline-offset-2 hover:text-secondary-700 dark:hover:text-secondary-300">
            More details.
          </button>
        </p>
      </div>

      {/* Product List */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-secondary-900 sm:text-2xl dark:text-white">
          Best products launching today
        </h2>
        <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
          {products.map((product) => (
            <div
              key={product.id}
              className="group flex items-center gap-4 py-4 transition-colors hover:bg-secondary-50 dark:hover:bg-secondary-800/30"
            >
              {/* Product Icon */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-secondary-200 bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-800">
                <span className="text-lg font-bold text-primary-500">
                  {product.name.charAt(0)}
                </span>
              </div>

              {/* Product Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-secondary-900 dark:text-white">
                    {product.name}
                  </h3>
                  {product.rank <= 3 && (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                      <Crown className="h-3 w-3" />
                      #{product.rank}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-sm text-secondary-500 dark:text-secondary-400">
                  {product.description}
                </p>
              </div>

              {/* Upvote Button */}
              <button className="flex shrink-0 flex-col items-center rounded-lg border border-secondary-200 px-3 py-2 text-secondary-500 transition-colors hover:border-primary-300 hover:text-primary-500 dark:border-secondary-700 dark:text-secondary-400 dark:hover:border-primary-500 dark:hover:text-primary-400">
                <ChevronUp className="h-4 w-4" />
                <span className="text-xs font-medium">{product.upvotes}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
