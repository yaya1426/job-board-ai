interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={`animate-pulse bg-gray-200 ${variants[variant]} ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="space-y-4">
        <Skeleton height="24px" width="60%" />
        <Skeleton height="16px" width="40%" />
        <Skeleton height="16px" width="100%" />
        <Skeleton height="16px" width="90%" />
        <div className="flex gap-2 mt-4">
          <Skeleton height="32px" width="100px" />
          <Skeleton height="32px" width="100px" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton height="48px" width="100%" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="space-y-2">
        <Skeleton height="20px" width="40%" />
        <Skeleton height="36px" width="60%" />
      </div>
    </div>
  );
}
