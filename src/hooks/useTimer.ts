import { calculateTimerInfo, formatTimer } from "@/lib/timer";
import { useEffect, useState } from "react";

interface UseTimerProps {
  startTime: string;
  timeLimit: number; // GIÂY (seconds) - ví dụ: 1800 = 30 phút
  onExpired?: () => void; // callback khi het gio --> auto submit
}

interface UseTimerReturn {
  displayTime: string;
  percentage: number;
  isExpired: boolean;
  isWarning: boolean;
}

export function useTimer({
  startTime,
  timeLimit,
  onExpired,
}: UseTimerProps): UseTimerReturn {
  const [timerInfo, setTimerInfo] = useState(() =>
    calculateTimerInfo(startTime, timeLimit),
  );

  useEffect(() => {
    // cap nhat moi giay
    const interval = setInterval(() => {
      const info = calculateTimerInfo(startTime, timeLimit);
      setTimerInfo(info);

      // auto submit khi het gio
      if (info.isExpired && onExpired) {
        onExpired();
        clearInterval(interval); // dung timer
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, timeLimit, onExpired]);

  return {
    displayTime: formatTimer(timerInfo.minutes, timerInfo.seconds),
    percentage: timerInfo.percentage,
    isExpired: timerInfo.isExpired,
    isWarning: timerInfo.isWarning,
  };
}
