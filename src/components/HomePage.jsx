// HomePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import Navbar from './Navbar';

const HomePage = ({ setQuestions }) => {
  const navigate = useNavigate();
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [examsTests, setExamsTests] = useState({}); // State to hold exam tests data

  // Load the JSON data on component mount
  useEffect(() => {
    const fetchExamsTests = async () => {
      try {
        const response = await fetch('/examsTests.json'); // Update the path as needed
        const data = await response.json();
        setExamsTests(data); // Set the examsTests state with the fetched data
      } catch (error) {
        console.error("Failed to load exams tests data:", error);
      }
    };

    fetchExamsTests();
  }, []);

  const data = {
    "Regulatory Body Exams": ["SEBI", "RBI", "NABARD", "IRDAI"],
    "Banking & Insurance": ["IBPS Clerk","IBPS PO","SBI PO", "SBI Clerk", "RBI Grade B/Assistant", "LIC AAO/ADO", "NIACL AO"],
    "SSC Exams": ["SSC CGL", "SSC CHSL", "SSC JE", "SSC GD", "SSC MTS"],
    "Railways": ["RRB NTPC", "RRB Group D", "RPF"],
    "Defence Exams": ["CDS", "AFCAT", "NDA"],
    "Police Exams": ["SI", "Constable"],
    "State Exams": ["State PSC", "State Subordinate Services"],
    "Central Exams": ["CGL"]
  };

  // Map test types to JSON files
  const fileMap = {
    tests1_app: "/test1.json",
    tests2_app: "/test2.json",
    tests3_res: "/test3.json",
    tests4_res: "/test4.json",
    // Add remaining mappings as needed
  };

  const handleSectorChange = (event) => {
    setSelectedSector(event.target.value);
    setSelectedExam('');
    setSelectedSubject('');
  };

  const handleExamChange = (event) => {
    setSelectedExam(event.target.value);
    setSelectedSubject('');
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const handleStartExam = async (examType) => {
    const filePath = fileMap[examType];
    if (!filePath) return console.error("Exam type not found");

    try {
      const response = await fetch(filePath);
      const data = await response.json();
      setQuestions(data.questions);
      navigate('/exam');
    } catch (error) {
      console.error("Failed to load exam data:", error);
    }
  };

  const getFilteredTests = () => {
    if (!selectedExam) return [];

    return examsTests[selectedExam]?.filter((test) => {
      if (!selectedSubject) return true;
      if (selectedSubject === 'Aptitude') return test.endsWith('_app');
      if (selectedSubject === 'Reasoning') return test.endsWith('_res');
      if (selectedSubject === 'English') return test.endsWith('_eng');
      if (selectedSubject === 'Current Affairs') return test.endsWith('_cur');
      return false;
    }) || [];
  };

  return (
    <div className="home-container">
      <Navbar/>
    <div className="filter-section">
  
  <div>
    <label>Sector: </label>
    <select value={selectedSector} onChange={handleSectorChange}>
      <option value="">Select Sector</option>
      {Object.keys(data).map((sector) => (
        <option key={sector} value={sector}>{sector}</option>
      ))}
    </select>
  </div>

  <div>
    <label>Exam: </label>
    <select value={selectedExam} onChange={handleExamChange} disabled={!selectedSector}>
      <option value="">Select Exam</option>
      {selectedSector && data[selectedSector].map((exam) => (
        <option key={exam} value={exam}>{exam}</option>
      ))}
    </select>
  </div>

  <div>
    <label>Subject: </label>
    <select value={selectedSubject} onChange={handleSubjectChange} disabled={!selectedExam}>
      <option value="">All Subjects</option>
      <option value="Aptitude">Aptitude</option>
      <option value="Reasoning">Reasoning</option>
      <option value="English">English</option>
      <option value="Current Affairs">Current Affairs</option>
    </select>
  </div>
</div>


<div className="tests-section">
  {selectedExam && (
    <>
      <h4 className="hfour">Tests for {selectedExam}</h4>
      <div className="exam-cards-container">
        {getFilteredTests().map((test) => (
          <div className="exam-card" key={test}>
            <h2>{test.replace(/_/g, ' ')}</h2>
            <button onClick={() => handleStartExam(test)}>Start Exam</button>
          </div>
        ))}
      </div>
    </>
  )}
</div>


    </div>
  );
};

export default HomePage;
