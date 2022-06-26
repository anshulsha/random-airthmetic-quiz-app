import { useEffect, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import "./timer.css";

const renderTime = ({ remainingTime }, appId) => {
  if (remainingTime === 0) {
    return <div className="timer">Too late...</div>;
  }
  return (
    <div className="timer">
      <div className="text">Remaining</div>
      <div className="value">{remainingTime}</div>
      <div className="text">seconds</div>
    </div>
  );
};

const Timer = ({ submit, count, noOfQuestions, appId, duration }) => {
  useEffect(() => {
    window.localStorage.setItem(`timer-${appId}`, JSON.stringify(duration));
  }, [duration]);
  const [key, setKey] = useState(0);
  useEffect(() => {
    if (count > key) {
      setKey((prevKey) => prevKey + 1);
    }
  }, [count]);
  return (
    <div className="timer-wrapper">
      <CountdownCircleTimer
        key={key}
        isPlaying={true}
        duration={duration}
        colors={[
          "#81c784",
          "#42a5f5",
          "#004777",
          "#F7B801",
          "#A30000",
          "#A30000",
        ]}
        colorsTime={[14, 9, 7, 5, 2, 0]}
        size={140}
        onComplete={() => {
          submit();
          localStorage.setItem(`timer-${appId}`, JSON.stringify(20));
        }}
        onUpdate={(remainingTime) => {
          localStorage.setItem(`timer-${appId}`, JSON.stringify(remainingTime));
        }}
      >
        {/* {({ remainingTime }) => renderTime({ remainingTime }, appId)} */}
        {renderTime}
      </CountdownCircleTimer>
    </div>
  );
};

export default Timer;
