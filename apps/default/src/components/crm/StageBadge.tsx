import React from 'react';
import { cn } from '@/lib/utils';
import { STAGE_BG } from '@/types/crm';

interface StageBadgeProps {
  stage: string;
  className?: string;
}

export function StageBadge({ stage, className }: StageBadgeProps) {
  const colorClass = STAGE_BG[stage] || 'bg-gray-500/15 text-gray-400';
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
      colorClass,
      className,
    )}>
      {stage}
    </span>
  );
}
