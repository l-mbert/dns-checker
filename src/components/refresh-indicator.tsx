'use client';

import { useEffect, useLayoutEffect, useState } from 'react';

type RefreshIndicatorProps = {
  refreshIntervalTime?: number;
  onRefresh: () => void;
};

export function RefreshIndicator({ refreshIntervalTime, onRefresh }: RefreshIndicatorProps) {
  const [startTime, setStartTime] = useState(new Date());
  const [secondsUntilNextRefresh, setSecondsUntilNextRefresh] = useState<number>(refreshIntervalTime ?? 0);

  useEffect(() => {
    let _interval: NodeJS.Timeout;
    let _uiInterval: NodeJS.Timeout;
    if (refreshIntervalTime) {
      _interval = setInterval(() => {
        onRefresh();
        setStartTime(new Date());
      }, refreshIntervalTime * 1000);

      // Update UI counter every second
      _uiInterval = setInterval(() => {
        if (refreshIntervalTime === 0) {
          setSecondsUntilNextRefresh(0);
          return;
        }

        const calculatedSecondsUntilNextRefresh = Math.round(
          (refreshIntervalTime * 1000 - (new Date().getTime() - startTime.getTime())) / 1000
        );

        // Fix off by one error
        if (secondsUntilNextRefresh === 0 || calculatedSecondsUntilNextRefresh === -1) {
          setStartTime(new Date());
          setSecondsUntilNextRefresh(refreshIntervalTime);
          return;
        }

        setSecondsUntilNextRefresh(calculatedSecondsUntilNextRefresh);
      }, 1000);
    }

    return () => {
      if (_interval) clearInterval(_interval);
      if (_uiInterval) clearInterval(_uiInterval);
    };
  }, [refreshIntervalTime, startTime, onRefresh]);

  if (!refreshIntervalTime) {
    return null;
  }

  return (
    <div>
      <p className="flex items-center text-gray-500 lg:mt-2">
        Refreshing in{' '}
        <span className="leading-0 mx-1.5 w-[37px] rounded-sm bg-gray-100 px-2 py-1 text-right font-mono tabular-nums">
          {secondsUntilNextRefresh}
        </span>{' '}
        second(s)
      </p>
    </div>
  );
}
