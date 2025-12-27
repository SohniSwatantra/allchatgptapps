'use client';

export const GridBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen">
      {/* Light mode grid pattern */}
      <div
        className="pointer-events-none fixed inset-0 z-0 dark:hidden"
        style={{
          backgroundImage: `
            linear-gradient(to right, #eef0f2 1px, transparent 1px),
            linear-gradient(to bottom, #eef0f2 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
        }}
      />
      {/* Light mode stronger grid lines */}
      <div
        className="pointer-events-none fixed inset-0 z-0 dark:hidden"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(17, 24, 39, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(17, 24, 39, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '432px 432px',
        }}
      />

      {/* Dark mode grid pattern */}
      <div
        className="pointer-events-none fixed inset-0 z-0 hidden dark:block"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
        }}
      />
      {/* Dark mode stronger grid lines */}
      <div
        className="pointer-events-none fixed inset-0 z-0 hidden dark:block"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, 0.16) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.16) 1px, transparent 1px)
          `,
          backgroundSize: '432px 432px',
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
