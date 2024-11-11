import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./QuestionPage.css";
import Calculator from "./Calculator";
import Navbar from "./Navbar";

const QuestionPage = ({ questions, answers, setAnswers, setExamSubmitted }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [attemptedQuestions, setAttemptedQuestions] = useState(0);
  const navigate = useNavigate();

  // Submit exam function
  const submitExam = useCallback(() => {
    setExamSubmitted(true);
    console.log(`User submit time: ${120 - timeLeft} seconds`);
    console.log(`Number of attempted questions: ${attemptedQuestions}`);
     
    
    navigate("/feedback", {
      state: {
       time: 120 - timeLeft,
       questionsAttempted: attemptedQuestions
      },
    });
  }, [navigate, setExamSubmitted, attemptedQuestions, timeLeft]);

  // Handle Timer Countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      submitExam();
    } else {
      const intervalId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [timeLeft, submitExam]);

  const handleOptionChange = (e) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = { ...prevAnswers, [currentQuestionIndex]: e.target.value };
      setAttemptedQuestions(Object.values(updatedAnswers).filter(Boolean).length);
      return updatedAnswers;
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      submitExam();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const question = questions[currentQuestionIndex];

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-lg-9 col-md-10 col-sm-12 question-container">
            <div className="timer">
              <h4 className="t1">Time Left: {formatTime(timeLeft)}</h4>
            </div>
            <h2>Question {currentQuestionIndex + 1} of {questions.length}</h2>
            <h3>{question?.question}</h3>
            {question?.options?.map((option, index) => (
              <label key={index} className="option-label">
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value={option}
                  checked={answers[currentQuestionIndex] === option}
                  onChange={handleOptionChange}
                />
                {option}
              </label>
            ))}
            <div className="navigation-buttons">
              <button
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                className="previous-button"
              >
                Previous
              </button>
              <button onClick={nextQuestion} className="next-button">
                {currentQuestionIndex < questions.length - 1 ? "Next" : "Submit"}
              </button>
            </div>
          </div>
          <div className="col-lg-3 col-md-7 col-sm-12 calculator-container">
            <h3 className="cal_title">Calculator</h3>
            <Calculator />
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(QuestionPage);
