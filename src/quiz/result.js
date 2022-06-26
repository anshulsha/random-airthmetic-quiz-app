import { useRef } from "react";

import {
  Card,
  Typography,
  CardContent,
  TextField,
} from "@mui/material";

import "./quiz.css";

const Result = ({ result }) => {
  const answerRef = useRef(null);
  const card = (item, index) => (
    <div className="card" key={index}>
      <CardContent style={{ width: "100%" }}>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Question: {index + 1}
        </Typography>
        <Typography variant="h5" component="div">
          {item.question}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Your Answer:
        </Typography>
        <TextField
          size="large"
          variant="outlined"
          inputRef={answerRef}
          value={
            Number.isNaN(item.yourAnswer) ? "Not Attempted" : item.yourAnswer
          }
          style={{
            border: (Number.isNaN(item.yourAnswer) || item.correct === false) ? "1px solid #f44336" : "1px solid #388e3c",
            borderRadius: "5px"
          }}
        />
        {Number.isNaN(item.yourAnswer) || item.correct === false ? (
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Correct Answer: {item.answer}
          </Typography>
        ) : null}
      </CardContent>
    </div>
  );

  return (
    <>
      {result && result?.map((item, index) => (
        <Card variant="outlined" className="main" key={index}>
          {card(item, index)}
        </Card>
      ))}
    </>
  );
};

export default Result;
