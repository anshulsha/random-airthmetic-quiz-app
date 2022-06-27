import { useState, useRef, useEffect } from "react";
import { set, useForm } from "react-hook-form";
import {
  Button,
  Card,
  Typography,
  CardActions,
  CardContent,
  TextField,
  Alert,
  AlertTitle,
  FormGroup,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormLabel,
} from "@mui/material";

import "./quiz.css";
import Timer from "./Timer";
import Result from "./result";
// import { Counter } from "./timers";

const Quiz = ({ cummulativeScore, appId }) => {
  // useEffect(() => {
  //   if (localStorage.getItem(`operators-${appId}`) == "")
  //     localStorage.setItem(`operators-${appId}`, []);
  //   if (localStorage.getItem(`arr-${appId}`) == "")
  //     localStorage.setItem(`arr-${appId}`, []);
  //   if (localStorage.getItem(`startQuiz-${appId}`) == null)
  //     localStorage.setItem(`startQuiz-${appId}`, false);
  // }, []);

  const randomQuestion = (operators) => {
    const num1 =
      JSON.parse(window.localStorage.getItem(`num1-${appId}`)) ||
      parseInt(Math.random() * 10);
    let num2 =
      JSON.parse(window.localStorage.getItem(`num2-${appId}`)) ||
      parseInt(Math.random() * 10);

    const randomOperator = operators && (localStorage.getItem(`randomOperator-${appId}`) &&
      JSON.parse(window.localStorage.getItem(`randomOperator-${appId}`)) ||
      parseInt(Math.random() * 10) %  operators.length);
    window.localStorage.setItem(`num1-${appId}`, JSON.stringify(num1));
    window.localStorage.setItem(`num2-${appId}`, JSON.stringify(num2));
    window.localStorage.setItem(
      `randomOperator-${appId}`,
      JSON.stringify(randomOperator)
    );
    const op =  operators && operators[randomOperator];
    while (op === "/" && num2 === 0) {
      num2 = parseInt(Math.random() * 10);
    }
    const obj = {
      num1,
      num2,
      op,
    };
    return obj;
  };
  useEffect(() => {
    window.localStorage.setItem(
      `timer-${appId}`,
      localStorage.getItem(`timer-${appId}`)
    );
  });
  const [reset, setReset] = useState(
    null || JSON.parse(window.localStorage.getItem(`reset-${appId}`))
  );

  const answerRef = useRef(null);
  const addRef = useRef(null);
  const subRef = useRef(null);
  const mulRef = useRef(null);
  const divRef = useRef(null);
  const noOfQuestions = useRef(null);
  const [startQuiz, setStartQuiz] = useState(null);

  const [operator, setOperator] = useState([]);
  const [noOfQuestionsState, setNoOfQuestionsState] = useState();

  const [arr, setArr] = useState([]);
  const { num1, num2, op } = randomQuestion(operator);
  const [count, setCount] = useState(
    0 || JSON.parse(window.localStorage.getItem(`count-${appId}`))
  );

  useEffect(() => {
    if (arr && arr.length > 0)
      setArr(JSON.parse(window.localStorage.getItem(`arr-${appId}`)));
    const quizState = window.localStorage.getItem(`startQuiz-${appId}`);
    if (quizState !== null) {
      setStartQuiz(JSON.parse(quizState));
    }

    const operatorsState = localStorage.getItem(`operators-${appId}`);
    if (operatorsState !== []) {
      setOperator(JSON.parse(operatorsState));
    }

    const arrState = localStorage.getItem(`arr-${appId}`);

    if (arrState !== []) {
      setArr(JSON.parse(arrState));
    }

    if (
      JSON.parse(window.localStorage.getItem(`count-${appId}`)) >=
      JSON.parse(window.localStorage.getItem(`questions-${appId}`))
    ) {
      setStartQuiz(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(`startQuiz-${appId}`, JSON.stringify(startQuiz));
    localStorage.setItem(`operators-${appId}`, JSON.stringify(operator));
    localStorage.setItem(`arr-${appId}`, JSON.stringify(arr));
  });

  useEffect(() => {
    if (arr && arr.length > 0)
      window.localStorage.setItem(`arr-${appId}`, JSON.stringify(arr));
  }, [arr]);

  useEffect(() => {
    window.localStorage.setItem(`startQuiz-${appId}`, startQuiz);
  }, [startQuiz]);

  useEffect(() => {
    window.localStorage.setItem(`operators-${appId}`, JSON.stringify(operator));
  }, [operator]);

  useEffect(() => {
    window.localStorage.setItem(`reset-${appId}`, JSON.stringify(reset));
  }, [reset]);

  useEffect(() => {
    window.localStorage.setItem(`count-${appId}`, JSON.stringify(count));
  }, [count]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const checkAnswer = (op) => {
    switch (op) {
      case "+":
        return num1 + num2;
        break;
      case "-":
        return num1 - num2;
        break;
      case "*":
        return num1 * num2;
        break;
      case "%":
        return num1 % num2;
      case "/":
        return num1 / num2;
      default:
        return false;
    }
  };

  const calculateScore = () => {
    let score = 0;
    arr.forEach((item) => {
      if (item.correct == true) {
        score++;
      }
    });
    return score;
  };

  const onSubmit = (type) => {
    window.localStorage.removeItem(`num1-${appId}`);
    window.localStorage.removeItem(`num2-${appId}`);
    window.localStorage.removeItem(`randomOperator-${appId}`);
    window.localStorage.setItem(`timer-${appId}`, JSON.stringify(21));
    const answerObj = {
      question: `${num1} ${op} ${num2}`,
      answer: parseInt(checkAnswer(op)),
      yourAnswer:
        answerRef.current.value === ""
          ? "Not Attempted"
          : parseInt(answerRef.current.value),
      correct: parseInt(checkAnswer(op)) === parseInt(answerRef.current.value),
    };
    setArr([...arr, answerObj]);
    window.localStorage.setItem(`arr-${appId}`, JSON.stringify(arr));
    answerRef.current.value = "";
    answerRef.current.focus();

    setCount(count + 1);

    if (noOfQuestionsState - 2 < count || type === "end") {
      setStartQuiz(false);
    }
    if (
      JSON.parse(window.localStorage.getItem(`count-${appId}`)) >
      JSON.parse(window.localStorage.getItem(`questions-${appId}`)) - 2
    ) {
      setStartQuiz(false);
    }
  };

  useEffect(() => {
    if (noOfQuestionsState !== undefined && startQuiz === false) {
      cummulativeScore(calculateScore(), parseInt(noOfQuestionsState));
    }
  }, [startQuiz, reset]);

  const resetHandler = (input) => {
    if (input === "reset") {
      setNoOfQuestionsState("");
    }
    setArr([]);
    setCount(0);
    window.localStorage.removeItem(`questions-${appId}`);
    window.localStorage.removeItem(`operators-${appId}`);
    window.localStorage.removeItem(`arr-${appId}`);
    window.localStorage.removeItem(`reset-${appId}`);
    // if (answerRef) answerRef.current.value = "";
    setStartQuiz(false);
    setReset(false);
  };

  const startHandler = () => {
    window.localStorage.removeItem(`arr-${appId}`);
    window.localStorage.setItem(`timer-${appId}`, 20);
    setArr([]);
    setCount(0);
    setStartQuiz(1);
    setReset(true);
    setNoOfQuestionsState(noOfQuestions.current.value);

    const temp = [];
    if (addRef.current.checked) {
      temp.push("+");
      setOperator(temp);
    }
    if (subRef.current.checked) {
      temp.push("-");
      setOperator(temp);
    }
    if (mulRef.current.checked) {
      temp.push("*");
      setOperator(temp);
    }
    if (divRef.current.checked) {
      temp.push("/");
      setOperator(temp);
    }

    if (temp.length === 0) {
      setStartQuiz(false);
      setReset(false);
      return alert("Please select atleast one operator");
    } else setStartQuiz(0);

    if (noOfQuestions.current.value > 0) {
      setStartQuiz(true);
    } else {
      setStartQuiz(0);
      setReset(false);
      return alert("Please enter number of questions to proceed!");
    }
    window.localStorage.setItem(
      `questions-${appId}`,
      noOfQuestions.current.value
    );
  };

  const scoreCard = (
    <>
      <div className="card">
        <CardContent style={{ width: "100%" }}>
          {(!startQuiz && !reset) || noOfQuestionsState === "" ? (
            <>
              <Typography variant="h5" component="div">
                Click To Start Quiz!
              </Typography>
            </>
          ) : (
            <Typography variant="h5" component="div">
              Score: {calculateScore()}/
              {window.localStorage.getItem(`questions-${appId}`)}
            </Typography>
          )}
        </CardContent>
      </div>
    </>
  );

  const card = (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card">
          <CardContent style={{ width: "100%" }}>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Question: <strong>{count + 1}</strong>
            </Typography>
            <Typography variant="h5" component="div">
              {`${num1} ${op} ${num2}`}
            </Typography>
            {op === "/" ? (
              <Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                Please enter <strong>INTEGER</strong> value only!
              </Alert>
            ) : null}
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Your Answer:
            </Typography>
            <TextField size="large" variant="filled" inputRef={answerRef} />
            <CardActions>
              <Button variant="contained" type="submit">
                Next
              </Button>
              <Button
                variant="contained"
                color="success"
                type="button"
                onClick={() => handleSubmit(onSubmit("end"))}
              >
                End Quiz
              </Button>
              <Button
                variant="outlined"
                color="error"
                type="button"
                onClick={resetHandler}
              >
                Reset
              </Button>
            </CardActions>
          </CardContent>
        </div>
      </form>
      <div className="timerWrapper">
        {/* <Counter submit={onSubmit} appId={appId} count={count}/> */}
        <Timer
          submit={onSubmit}
          count={count}
          noOfQuestions={noOfQuestionsState}
          appId={appId}
          duration={JSON.parse(localStorage.getItem(`timer-${appId}`)) - 1}
        />
      </div>
    </>
  );

  const operators = (
    <FormControl>
      <FormLabel component="legend">Select operators to practice</FormLabel>
      <FormGroup row>
        <FormControlLabel
          value="end"
          control={
            <Checkbox
              defaultChecked={
                window.localStorage.getItem(`operators-${appId}`) &&
                JSON.parse(
                  window.localStorage.getItem(`operators-${appId}`)
                )?.includes("+")
                  ? true
                  : false
              }
            />
          }
          label="+"
          labelPlacement="start"
          inputRef={addRef}
        />
        <FormControlLabel
          value="end"
          control={
            <Checkbox
              defaultChecked={
                window.localStorage.getItem(`operators-${appId}`) &&
                JSON.parse(
                  window.localStorage.getItem(`operators-${appId}`)
                )?.includes("-")
                  ? true
                  : false
              }
            />
          }
          label="-"
          labelPlacement="start"
          inputRef={subRef}
        />
        <FormControlLabel
          value="end"
          control={
            <Checkbox
              defaultChecked={
                window.localStorage.getItem(`operators-${appId}`) &&
                JSON.parse(
                  window.localStorage.getItem(`operators-${appId}`)
                )?.includes("*")
                  ? true
                  : false
              }
            />
          }
          label="*"
          labelPlacement="start"
          inputRef={mulRef}
        />
        <FormControlLabel
          value="end"
          control={
            <Checkbox
              defaultChecked={
                window.localStorage.getItem(`operators-${appId}`) &&
                JSON.parse(
                  window.localStorage.getItem(`operators-${appId}`)
                )?.includes("/")
                  ? true
                  : false
              }
            />
          }
          label="/"
          labelPlacement="start"
          inputRef={divRef}
        />
      </FormGroup>
    </FormControl>
  );
  return (
    <>
      {!startQuiz ? (
        <>
          <Card variant="outlined" className="main">
            {operators}
            <TextField
              variant="outlined"
              placeholder="No of questions"
              defaultValue={window.localStorage.getItem(`questions-${appId}`)}
              inputRef={noOfQuestions}
              //   value={20}
            />
          </Card>
          <Card variant="outlined" className="main">
            {scoreCard}
            <Button
              variant="contained"
              color="success"
              type="button"
              onClick={startHandler}
            >
              Start Quiz
            </Button>
            <Button
              variant="contained"
              color="error"
              type="button"
              onClick={() => resetHandler("reset")}
            >
              Reset Quiz
            </Button>
          </Card>
          <Result result={arr} />
        </>
      ) : (
        <Card variant="outlined" className="main">
          {card}
        </Card>
      )}
    </>
  );
};

export default Quiz;
