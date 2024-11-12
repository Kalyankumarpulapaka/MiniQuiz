import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

import "./FeedbackPage.css";
import Navbar from "./Navbar";

function FeedbackPage({ questions, answers, score, setScore, resetExamState }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [time, setTime] = useState(0);
  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const output = questionsAttempted > 0 ? (time / questionsAttempted).toFixed(2) : 0;

  useEffect(() => {
    if (location.state) {
      const { time, questionsAttempted } = location.state;
      setTime(time || 0);
      setQuestionsAttempted(questionsAttempted || 0);
    }
  }, [location.state]);

  useEffect(() => {
    let calculatedScore = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.answer) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [questions, answers, setScore]);



  const handleDownloadPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");
  
    // Define margins
    const marginLeft = 15;
    const marginRight = 15;
    const topMargin = 20;
    const bottomMargin = 20;
  
    // Define page width and height
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
  
    // Define maximum content area (excluding margins)
    const contentWidth = pageWidth - marginLeft - marginRight;
  
    // Initialize Y position and check space
    let yPosition = topMargin;
    const lineHeight = 8;
    const maxYPosition = pageHeight - bottomMargin;
  
    // Function to check and add a new page if content exceeds the page
    const checkAndAddPage = (contentHeight) => {
      if (yPosition + contentHeight > maxYPosition) {
        pdf.addPage();
        yPosition = topMargin;
      }
    };
  
    // Function to wrap text and avoid overflow
    const wrapText = (text, maxWidth) => {
      const words = text.split(" ");
      let line = "";
      const lines = [];
  
      words.forEach((word) => {
        const testLine = line + word + " ";
        const testWidth = pdf.getTextWidth(testLine);
  
        if (testWidth > maxWidth) {
          lines.push(line.trim());
          line = word + " ";
        } else {
          line = testLine;
        }
      });
  
      lines.push(line.trim());
      return lines;
    };
  
    // Title and score section
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Score: ${score}/${questions.length}`, marginLeft, yPosition);
    yPosition += lineHeight + 10; // Adding space after title
  
    pdf.setFontSize(10);
    pdf.text(`Percentage: ${((score / questions.length) * 100).toFixed(2)}%`, marginLeft, yPosition);
    yPosition += lineHeight;
  
    const speed = parseFloat(output) || 0;
    pdf.text(`Speed: ${speed.toFixed(2)} sec per question`, marginLeft, yPosition);
    yPosition += lineHeight;
  
    pdf.text(`Attempted Questions: ${questionsAttempted}`, marginLeft, yPosition);
    yPosition += lineHeight + 10;
  
    // Loop through each question
    questions.forEach((question, index) => {
      const userAnswer = answers[index] === undefined ? "Unattempted" : answers[index];
      const correctAnswer = question.answer;
      const status = userAnswer === correctAnswer ? "Correct" : "Incorrect";
      const explanationSteps = question.explanation.join(" ").split(/(?=Step \d+:)/);
  
      // Wrap and check space for the question text
      pdf.setFont("helvetica", "bold");
      const questionLines = wrapText(`${index + 1}. ${question.question}`, contentWidth);
      checkAndAddPage(questionLines.length * lineHeight);
      questionLines.forEach((line) => {
        pdf.text(line, marginLeft, yPosition);
        yPosition += lineHeight;
      });
  
      // Wrap and check space for user answer, correct answer, and status
      pdf.setFont("helvetica", "normal");
  
      const answerLines = wrapText(`Your Answer: ${userAnswer}`, contentWidth);
      checkAndAddPage(answerLines.length * lineHeight);
      answerLines.forEach((line) => {
        pdf.text(line, marginLeft, yPosition);
        yPosition += lineHeight;
      });
  
      const correctAnswerLines = wrapText(`Correct Answer: ${correctAnswer}`, contentWidth);
      checkAndAddPage(correctAnswerLines.length * lineHeight);
      correctAnswerLines.forEach((line) => {
        pdf.text(line, marginLeft, yPosition);
        yPosition += lineHeight;
      });
  
      const statusLines = wrapText(`Status: ${status}`, contentWidth);
      checkAndAddPage(statusLines.length * lineHeight);
      statusLines.forEach((line) => {
        pdf.text(line, marginLeft, yPosition);
        yPosition += lineHeight;
      });
  
      // Wrap and check space for explanation steps
      explanationSteps.forEach((step) => {
        const stepLines = wrapText(step.trim(), contentWidth);
        checkAndAddPage(stepLines.length * lineHeight);
        stepLines.forEach((line) => {
          pdf.text(line, marginLeft, yPosition);
          yPosition += lineHeight;
        });
      });
  
      // Add extra space after each question
      yPosition += 10;
    });
  
    // Save the PDF
    pdf.save("Scorecard.pdf");
  };
  
 



  // Handle back to home
  const handleBackToHome = () => {
    resetExamState();
    navigate("/");
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="feedback-container">
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
                <th>Attempted Questions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{score}/{questions.length}</td>
                <td>{((score / questions.length) * 100).toFixed(2)}%</td>
                <td>{output} sec per question</td>
                <td>{questionsAttempted}</td>
              </tr>
            </tbody>
          </table>

          {questions.map((question, index) => (
            <div key={index} className="question-review">
              <h3>{index + 1}. {question.question}</h3>
              <p className={answers[index] === question.answer ? "correct" : "incorrect"}>
                Your Answer: {answers[index] === undefined ? "Unattempted" : answers[index]}
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
