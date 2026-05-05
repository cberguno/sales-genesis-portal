import React from 'react';
import { cn } from '@/lib/utils';

interface ScoreBadgeProps {
  score: number;
  className?: string;
  size?: 'sm' | 'md';
}

export function ScoreBadge({ score, className, size = 'md' }: ScoreBadgeProps) {
  const getColor = () => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 ring-emerald-500/20';
    if (score >= 60) return 'text-amber-400 bg-amber-500/10 ring-amber-500/20';
    if (score >= 40) return 'text-orange-400 bg-orange-500/10 ring-orange-500/20';
    return 'text-red-400 bg-red-500/10 ring-red-500/20';
  };

  const sizeClass = size === 'sm'
    ? 'text-xs px-1.5 py-0.5 min-w-[2rem]'
    : 'text-xs px-2 py-1 min-w-[2.5rem]';

  return (
    <span className={cn(
      'inline-flex items-center justify-center rounded-md font-semibold ring-1 tabular-nums',
      getColor(),
      sizeClass,
      className,
    )}>
      {score}
    </span>
  );
}
