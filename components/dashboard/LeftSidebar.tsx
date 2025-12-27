'use client';

import { Info, Heart, MessageCircle } from 'lucide-react';
import { statistics, posts } from '@/data/dashboard/sampleData';

export const LeftSidebar = () => {
  return (
    <aside className="space-y-6">
      {/* Statistics Section */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-secondary-500 dark:text-secondary-400">
            2025 Statistics
          </span>
          <Info className="h-3.5 w-3.5 text-secondary-400 dark:text-secondary-500" />
        </div>
        <div className="grid gap-3">
          {statistics.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-secondary-200 bg-white p-4 dark:border-secondary-700 dark:bg-secondary-800/50"
            >
              <div className="text-xl font-bold text-secondary-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-xs text-secondary-500 dark:text-secondary-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Posts Section */}
      <div>
        <div className="mb-3">
          <span className="text-xs font-medium uppercase tracking-wider text-secondary-500 dark:text-secondary-400">
            Latest Posts
          </span>
        </div>
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-xl border border-secondary-200 bg-white p-3 dark:border-secondary-700 dark:bg-secondary-800/50"
            >
              {/* Author Row */}
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-300 to-primary-500 text-xs font-medium text-white">
                  {post.author.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-secondary-900 dark:text-white">
                  {post.author.name}
                </span>
                <span className="text-xs text-secondary-400">{post.timeAgo}</span>
              </div>

              {/* Content */}
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                {post.content.split('@').map((part, i) =>
                  i === 0 ? (
                    part
                  ) : (
                    <span key={i}>
                      <span className="text-primary-600 dark:text-primary-400">
                        @{part.split(' ')[0]}
                      </span>
                      {part.substring(part.indexOf(' '))}
                    </span>
                  )
                )}
              </p>

              {/* Actions */}
              <div className="mt-3 flex items-center gap-4">
                <button className="flex items-center gap-1 text-xs text-secondary-400 transition-colors hover:text-primary-500">
                  <Heart className="h-3.5 w-3.5" />
                  {post.likes}
                </button>
                <button className="flex items-center gap-1 text-xs text-secondary-400 transition-colors hover:text-primary-500">
                  <MessageCircle className="h-3.5 w-3.5" />
                  {post.comments}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
