import { useState, useEffect } from "react";
import { Typography, CardContent, Card, Button } from "@mui/material";

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

  useEffect(() => {
    const scoreState = window.localStorage.getItem(`score`);
    if (scoreState !== null) {
      setScore(JSON.parse(scoreState));
    }

    const totalState = window.localStorage.getItem(`total`);
    if (totalState !== null) {
      setTotal(JSON.parse(totalState));
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("score", score);
    localStorage.setItem("total", total);
  })

  const resetHandler = (input) => {
    localStorage.setItem("score", JSON.stringify(0));
    localStorage.setItem("total", JSON.stringify(0));
    setScore(0);
    setTotal(0);
  }

  return (
    <>
    <Card variant="outlined" className="main">
      <CardContent style={{ width: "100%" }}>
        <Typography variant="h5" component="div">
          Cummulative Score: {score}/{total}
        </Typography>
        <Button
              variant="contained"
              color="error"
              type="button"
              onClick={() => resetHandler("reset")}
            >
              Reset Quiz
            </Button>
      </CardContent>
    </Card>
      <div className="main">
        <div className="quiz-1">
          <Quiz questionNo={1} cummulativeScore={cummulativeScore1} appId={1}/>
        </div>
        <div className="quiz-2">
          <Quiz questionNo={1} cummulativeScore={cummulativeScore2} appId={2}/>
        </div>
      </div>
    </>
  );
}

export default App;
