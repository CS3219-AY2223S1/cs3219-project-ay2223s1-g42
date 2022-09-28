import { CountdownCircleTimer } from "react-countdown-circle-timer";

type Props = {
  isPlaying: boolean;
  duration: number;
  onComplete: () => void;
};

const MatchCountdownTimer = ({ isPlaying, duration, onComplete }: Props) => {
  return (
    <CountdownCircleTimer
      isPlaying={isPlaying}
      duration={duration}
      size={120}
      strokeWidth={6}
      colors={["#171717", "#171717"]}
      colorsTime={[duration / 2, duration / 2]}
      onComplete={onComplete}
    >
      {({ remainingTime }) => (
        <span className="font-sans text-2xl">{remainingTime}</span>
      )}
    </CountdownCircleTimer>
  );
};

export { MatchCountdownTimer };
