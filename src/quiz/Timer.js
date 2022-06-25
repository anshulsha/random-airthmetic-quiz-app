import { useEffect, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import "./timer.css";

const renderTime = ({ remainingTime }) => {
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

const Timer = ({ submit, count, noOfQuestions }) => {
  const [key, setKey] = useState(0);
  useEffect(() => {
    if (count > key) setKey((prevKey) => prevKey + 1);
  }, [count]);
  return (
    <div className="timer-wrapper">
      <CountdownCircleTimer
        key={key}
        isPlaying={true}
        duration={20}
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
          return {
            shouldRepeat: count > noOfQuestions - 2 ? false : true,
            delay: 1,
          };
        }}
      >
        {renderTime}
      </CountdownCircleTimer>
    </div>
  );
};

export default Timer;
