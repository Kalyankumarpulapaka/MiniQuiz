// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import QuestionPage from './components/QuestionPage';
import FeedbackPage from './components/FeedbackPage';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App2.css";

function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0); // Define score state
  const [examSubmitted, setExamSubmitted] = useState(false);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<HomePage setQuestions={setQuestions} />} 
        />
        <Route 
          path="/exam" 
          element={
            <QuestionPage 
              questions={questions} 
              answers={answers} 
              setAnswers={setAnswers} 
              setExamSubmitted={setExamSubmitted} 
              examSubmitted={examSubmitted} // Pass it here

            />
          } 
        />
        <Route 
          path="/feedback" 
          element={
            <FeedbackPage 
              questions={questions} 
              answers={answers} 
              score={score}  // Pass score prop
              setScore={setScore} // Pass setScore prop
              resetExamState={() => {
                setAnswers({});
                setExamSubmitted(false);
                setQuestions([]);
              }}
            />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
