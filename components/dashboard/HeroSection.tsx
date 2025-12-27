'use client';

import { Rocket, Star } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative px-4 py-16 text-center sm:px-6 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-4xl">
        {/* Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight text-secondary-900 sm:text-5xl lg:text-6xl dark:text-white">
          Launch. Get seen.{' '}
          <span className="text-primary-500">Grow.</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl text-base text-secondary-600 sm:text-lg dark:text-secondary-400">
          Discover and share the best ChatGPT apps with the world. Join thousands of makers
          building the future of AI-powered applications.
        </p>

        {/* Social Proof Row */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
          {/* Avatar Stack */}
          <div className="flex items-center">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary-400 bg-gradient-to-br from-primary-200 to-primary-400 text-xs font-medium text-white sm:h-11 sm:w-11"
                >
                  {String.fromCharCode(65 + i - 1)}
                </div>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-5 w-5 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <span className="text-sm text-secondary-600 dark:text-secondary-400">
              join 43,000 makers
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-10">
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-7 py-4 text-base font-semibold text-white shadow-md transition-all hover:bg-primary-600 hover:shadow-lg">
            <Rocket className="h-5 w-5" />
            Get started
          </button>
        </div>
      </div>
    </section>
  );
};
