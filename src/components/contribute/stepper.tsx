'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepperProps {
  steps: string[];
  current: number;
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <ol className="flex w-full items-center gap-2 overflow-x-auto pb-2">
      {steps.map((label, idx) => {
        const isDone = idx < current;
        const isActive = idx === current;
        return (
          <li
            key={label}
            className="flex shrink-0 items-center gap-2 text-xs sm:text-sm"
          >
            <span
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold',
                isDone && 'border-primary bg-primary text-primary-foreground',
                isActive && 'border-primary text-primary',
                !isDone && !isActive && 'border-border text-muted-foreground'
              )}
            >
              {isDone ? <Check className="h-4 w-4" /> : idx + 1}
            </span>
            <span
              className={cn(
                'whitespace-nowrap',
                isActive ? 'font-medium text-foreground' : 'text-muted-foreground'
              )}
            >
              {label}
            </span>
            {idx < steps.length - 1 && (
              <span className="mx-1 h-px w-6 bg-border sm:w-10" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
