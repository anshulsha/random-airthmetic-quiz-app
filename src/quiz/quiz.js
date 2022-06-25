import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
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

const randomQuestion = (operators) => {
  const num1 = parseInt(Math.random() * 10);
  let num2 = parseInt(Math.random() * 10);

  const randomOperator = parseInt(Math.random() * 10) % operators.length;
  const op = operators[randomOperator];
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

const Quiz = ({ cummulativeScore }) => {
  const answerRef = useRef(null);
  const addRef = useRef(null);
  const subRef = useRef(null);
  const mulRef = useRef(null);
  const divRef = useRef(null);
  const noOfQuestions = useRef();
  const [startQuiz, setStartQuiz] = useState(false);
  const [operator, setOperator] = useState([]);
  const [noOfQuestionsState, setNoOfQuestionsState] = useState();

  const [arr, setArr] = useState([]);
  const { num1, num2, op } = randomQuestion(operator);
  const [count, setCount] = useState(0);
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
    const answerObj = {
      question: `${num1} ${op} ${num2}`,
      answer: parseInt(checkAnswer(op)),
      yourAnswer: parseInt(answerRef.current.value),
      correct: parseInt(checkAnswer(op)) === parseInt(answerRef.current.value),
    };
    setArr([...arr, answerObj]);
    answerRef.current.value = "";
    answerRef.current.focus();

    setCount(count + 1);

    if (noOfQuestionsState - 2 < count || type === "end") {
      setStartQuiz(false);
    }
  };

  useEffect(() => {
    if (noOfQuestionsState !== undefined && startQuiz === false ) {
        cummulativeScore(calculateScore(), parseInt(noOfQuestionsState));
    }
  }, [startQuiz]);

  const resetHandler = () => {
    setArr([]);
    setCount(0);
    answerRef.current.value = "";
    setStartQuiz(false);
  };

  const startHandler = () => {
    setArr([]);
    setCount(0);
    setStartQuiz(1);

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
    temp.length === 0
      ? alert("Please select atleast one operator")
      : setStartQuiz(0);

    if (noOfQuestions.current.value > 0) {
      setStartQuiz(true);
    } else {
      alert("Please enter number of questions to proceed!");
      setStartQuiz(0);
    }
  };

  const scoreCard = (
    <>
      <div className="card">
        <CardContent style={{ width: "100%" }}>
          {(!startQuiz && noOfQuestionsState === undefined) ||
          noOfQuestionsState === "" ? (
            <Typography variant="h5" component="div">
              Click To Start Quiz!
            </Typography>
          ) : (
            <Typography variant="h5" component="div">
              Score: {calculateScore()}/{noOfQuestionsState}
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
        <Timer
          submit={onSubmit}
          count={count}
          noOfQuestions={noOfQuestionsState}
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
          control={<Checkbox defaultChecked={true} />}
          label="+"
          labelPlacement="start"
          inputRef={addRef}
        />
        <FormControlLabel
          value="end"
          control={<Checkbox defaultChecked={true} />}
          label="-"
          labelPlacement="start"
          inputRef={subRef}
        />
        <FormControlLabel
          value="end"
          control={<Checkbox defaultChecked={true} />}
          label="*"
          labelPlacement="start"
          inputRef={mulRef}
        />
        <FormControlLabel
          value="end"
          control={<Checkbox defaultChecked={true} />}
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
