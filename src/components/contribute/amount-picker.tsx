'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface AmountPickerProps {
  presets: readonly number[];
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  currencyLabel?: string;
  minCustom?: number;
}

export function AmountPicker({
  presets,
  value,
  onChange,
  currencyLabel = 'LKR',
  minCustom = 1,
}: AmountPickerProps) {
  const isPreset = typeof value === 'number' && presets.includes(value);
  const [customMode, setCustomMode] = useState<boolean>(!isPreset && value !== undefined);
  const [customRaw, setCustomRaw] = useState<string>(
    !isPreset && value !== undefined ? String(value) : ''
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {presets.map((amount) => {
          const selected = value === amount && !customMode;
          return (
            <Button
              key={amount}
              type="button"
              variant={selected ? 'default' : 'outline'}
              className={cn('h-12 text-base font-medium', selected && 'ring-2 ring-primary')}
              onClick={() => {
                setCustomMode(false);
                setCustomRaw('');
                onChange(amount);
              }}
            >
              {currencyLabel} {amount.toLocaleString()}
            </Button>
          );
        })}
        <Button
          type="button"
          variant={customMode ? 'default' : 'outline'}
          className={cn('h-12 text-base font-medium', customMode && 'ring-2 ring-primary')}
          onClick={() => {
            setCustomMode(true);
            onChange(customRaw ? Number(customRaw) : undefined);
          }}
        >
          Custom amount
        </Button>
      </div>

      {customMode && (
        <div className="space-y-2">
          <Label htmlFor="custom-amount">Custom amount ({currencyLabel})</Label>
          <Input
            id="custom-amount"
            inputMode="numeric"
            placeholder="e.g. 7500"
            value={customRaw}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^\d]/g, '');
              setCustomRaw(raw);
              if (!raw) {
                onChange(undefined);
                return;
              }
              const n = Number(raw);
              onChange(Number.isFinite(n) && n >= minCustom ? n : undefined);
            }}
          />
        </div>
      )}
    </div>
  );
}
