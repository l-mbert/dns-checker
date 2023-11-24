'use client';

import { Dispatch, ReactNode, SetStateAction } from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '@/lib/utils';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

export function Switch({
  fn,
  id = '',
  trackDimensions,
  thumbDimensions,
  thumbTranslate,
  checked = true,
  disabled = false,
  disabledTooltip,
}: {
  fn: (value: boolean) => void;
  id?: string;
  trackDimensions?: string;
  thumbDimensions?: string;
  thumbTranslate?: string;
  checked?: boolean;
  disabled?: boolean;
  disabledTooltip?: string | ReactNode;
}) {
  if (disabledTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative inline-flex h-4 w-8 flex-shrink-0 cursor-not-allowed rounded-full border-2 border-transparent bg-gray-200 radix-state-checked:bg-gray-300">
              <div className="h-3 w-3 transform rounded-full bg-white shadow-lg" />
            </div>
          </TooltipTrigger>
          <TooltipContent sideOffset={4} side="top">
            {disabledTooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <SwitchPrimitive.Root
      checked={checked}
      name={id}
      onCheckedChange={(checked) => fn(checked)}
      disabled={disabled}
      id={id}
      className={cn(
        disabled
          ? 'cursor-not-allowed bg-gray-300'
          : 'cursor-pointer focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 radix-state-checked:bg-gray-500 radix-state-unchecked:bg-gray-200',
        'relative inline-flex h-4 w-8 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
        trackDimensions
      )}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          `radix-state-checked:${thumbTranslate}`,
          'radix-state-unchecked:translate-x-0',
          `pointer-events-none h-3 w-3 translate-x-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`,
          thumbDimensions,
          thumbTranslate
        )}
      />
    </SwitchPrimitive.Root>
  );
}
