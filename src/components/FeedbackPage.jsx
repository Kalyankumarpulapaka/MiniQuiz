import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./FeedbackPage.css";
import Navbar from "./Navbar";

function FeedbackPage({ questions, answers, score, setScore, resetExamState }) {
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to access the state

  // Local state to store time and questionsAttempted
  const [time, setTime] = useState(0);
  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const output = time/questionsAttempted


  useEffect(() => {
    // Check if location.state exists before accessing values
    if (location.state) {
      const { time, questionsAttempted } = location.state;
      setTime(time || 0);
      setQuestionsAttempted(questionsAttempted || 0);
    }
  }, [location.state]); // Re-run the effect when location.state changes

  console.log(time); // Log the values after state is set
  console.log(questionsAttempted);

  useEffect(() => {
    // Calculate score based on answers
    let calculatedScore = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.answer) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);

    // Use replace to prevent navigating back to QuestionPage
    navigate("/feedback", { replace: true });

    // Listen for beforeunload event to handle navigation away
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [questions, answers, setScore, navigate]);

  // Function to handle PDF download
  const handleDownloadPDF = () => {
    const feedbackElement = document.getElementById("feedback-page");
    html2canvas(feedbackElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
      pdf.save("Scorecard.pdf");
    });
  };

  // Function to handle reset and navigation back to home
  const handleBackToHome = () => {
    resetExamState(); // Reset exam state when going back
    navigate("/"); // Navigate back to HomePage
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="feedback-container" id="feedback-page">
          <div className="but">
            <button className="download-button" onClick={handleDownloadPDF}>
              Download PDF
            </button>
            <button className="button" onClick={handleBackToHome}>
              Back to Home
            </button>
          </div>

          <h1>Your Score</h1>
          <table className="score-table">
            <thead>
              <tr>
                <th>Score</th>
                <th>Percentage</th>
                <th>Speed</th>
                <th>Attempted Questions</th> {/* Add attempted questions */}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{score}/{questions.length}</td>
                <td>{((score / questions.length) * 100).toFixed(2)}%</td>
                <td>{output.toFixed(2)} sec per question</td> {/* Use the time value */}
                <td>{questionsAttempted}</td> {/* Display attempted questions */}
              </tr>
            </tbody>
          </table>

          {questions.map((question, index) => (
            <div key={index} className="question-review">
              <h3>
                {index + 1}. {question.question}
              </h3>
              <p
                className={
                  answers[index] === question.answer
                    ? "correct"
                    : answers[index] === undefined
                    ? "unattempted"
                    : "incorrect"
                }
              >
                Your Answer:{" "}
                {answers[index] === undefined ? "" : answers[index]}
                {answers[index] === undefined
                  ? "Unattempted"
                  : answers[index] === question.answer
                  ? "Correct"
                  : "  ( Incorrect)"}
              </p>
              <p>Correct Answer: {question.answer}</p>
              <p>Explanation:</p>
              {question.explanation.map((step, stepIndex) => (
                <p key={stepIndex}>{step}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default FeedbackPage;
