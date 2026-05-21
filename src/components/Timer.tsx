import { useEffect, useRef, useState } from 'react';

type TimerProps = {
  totalSeconds: number;
  onExpire: () => void;
  running?: boolean;
};

export function Timer({ totalSeconds, onExpire, running = true }: TimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [expired, setExpired] = useState(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setRemaining(totalSeconds);
    setExpired(false);
  }, [totalSeconds]);

  useEffect(() => {
    if (!running || expired) return;

    if (remaining <= 0) {
      setExpired(true);
      onExpireRef.current();
      return;
    }

    const id = window.setInterval(() => {
      setRemaining((r) => r - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [remaining, running, expired]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  let className = 'timer';
  if (remaining <= 60 && remaining > 30) className += ' warning';
  if (remaining <= 30) className += ' critical';

  return (
    <div className={className} role="timer" aria-live="polite">
      <span aria-hidden="true">⏱</span>
      <span>{display}</span>
    </div>
  );
}
