import { useState, useEffect } from "react";
import { Typography, CardContent, Card } from "@mui/material";

import Quiz from "./quiz/quiz";
import "./app.css";

function App() {
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  let a = 0;
  let b = 0;
  let c = 0;
  let d = 0;
  const cummulativeScore1 = (obtainedScore, TotalScore) => {
    a = obtainedScore;
    b = TotalScore;
    setScore((prev) => prev + a);
    setTotal((prev) => prev + b);
  };
  const cummulativeScore2 = (obtainedScore, TotalScore) => {
    c = obtainedScore;
    d = TotalScore;
    setScore((prev) => prev + c);
    setTotal((prev) => prev + d);
  };

  return (
    <>
    <Card variant="outlined" className="main">
      <CardContent style={{ width: "100%" }}>
        <Typography variant="h5" component="div">
          Cummulative Score: {score}/{total}
        </Typography>
      </CardContent>
    </Card>
      <div className="main">
        <div className="quiz-1">
          <Quiz questionNo={1} cummulativeScore={cummulativeScore1} />
        </div>
        <div className="quiz-2">
          <Quiz questionNo={1} cummulativeScore={cummulativeScore2} />
        </div>
      </div>
    </>
  );
}

export default App;
