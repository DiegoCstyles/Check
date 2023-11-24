"use client";
import React, { useState, useEffect } from 'react';
import { RiskItem, AppliedChecklist } from './models';

interface Question {
  id: number;
  subject: string;
  question: string;
  value: number;
}

const AppliedChecklistsPage: React.FC = () => {
  const [RiskItems, setRiskItems] = useState<RiskItem[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedRiskId, setSelectedRiskId] = useState<number | null>(null);
  const [selectedRiskValue, setSelectedRiskValue] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: number]: boolean }>({});

  const [ApplyRisk, setApplyRisk] = useState<AppliedChecklist>({
    id: 0,
    dateapplied: '',
    score: 0,
    risk_id: selectedRiskId !== null ? selectedRiskId : 0,
  });

  const resetApplyRisk = () => {
    setApplyRisk({
      id: 0,
      dateapplied: '',
      score: 0,
      risk_id: 0,
    });
  };  

   // Function to calculate the total score based on selected questions
  const calculateTotalScore = (): number => {
    let totalScore = 0;

    // Iterate through questions and sum their values
    for (const [, subjectQuestions] of Object.entries(groupedQuestions)) {
      subjectQuestions.forEach((question) => {
        if (selectedAnswers[question.id]) {
          totalScore += question.value;
        }
      });
    }

    return totalScore;
  };

  const applyRiskToBackend = async () => {
    try {
      const totalScore = calculateTotalScore();
      
      const response = await fetch('https://checkend.onrender.com/api/applyrisk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...ApplyRisk,
          score: totalScore,
        }),
      });
  
      if (response.ok) {
         resetApplyRisk(); // Reset input fields after successful addition
      } else {
        // Handle errors
        console.error('Error applying risk to the database');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`https://checkend.onrender.com/api/questions`);

      if (response.ok) {
        const data = await response.json(); setQuestions(data); // Update the riskItems state with the fetched data
      } else { console.error('Error fetching question from the database'); }
    } catch (error) { console.error('Error:', error); }
  };

  const fetchRiskItems = async (itemsPerPage = 10) => {
    try {
      const response = await fetch(`https://checkend.onrender.com/api/riskItems?itemsPerPage=${itemsPerPage}`);

      if (response.ok) {
        const data = await response.json(); setRiskItems(data); // Update the riskItems state with the fetched data
      } else { console.error('Error fetching risk items from the database'); }
    } catch (error) { console.error('Error:', error); }
  };

  useEffect(() => { fetchRiskItems(); fetchQuestions();}, []);
  
  const handleSelectRisk = (riskId: number | null) => {
    console.log('Selected Risk ID:', riskId);
    setSelectedRiskId(riskId);
    const selectedRisk = RiskItems.find((risk) => risk.id === riskId);
    const valueToDisplay = selectedRisk?.title || null; // Use 'title' or another property
    setSelectedRiskValue(valueToDisplay);
    setApplyRisk({
      id: 0,
      dateapplied: '',
      score: 10,
      risk_id: riskId !== null ? riskId : 0,
    });
  };

  // Handler for the 'Sim' button click
  const handleSimButtonClick = (questionId: number) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: true,
    }));
  };

  // Group questions by subject
  const groupedQuestions: Record<string, Question[]> = questions.reduce((acc, question) => {
    if (!acc[question.subject]) {
      acc[question.subject] = [];
    }
    acc[question.subject].push(question);
    return acc;
  }, {} as Record<string, Question[]>); 

  return (
    <div className='flex justify-between ml-2 w-full'>
      <div className="applied-checklists-page border p-5 w-1/3">
        <h1 className='border-b-4 p-1 uppercase bg-yellow-500 text-black text-xs font-semibold border-t border-x'>Checklists</h1>
        <ul className="applied-checklist-list border bg-black">
          {RiskItems.map((risk) => (
            <li key={risk.id} className="applied-checklist-item bg-white/10">
              <p className='mr-2 px-2 py-1 text-xs flex justify-between text-center'>
                <span className='p-2 w-1/3 text-center'>{risk.title}</span>
                <span className='p-2 w-1/3 text-center'>{risk.date}</span>
                <button 
                  className='border w-1/3 m-1 p-1 border-b-4 hover:bg-white hover:border-black/80 hover:text-black' 
                  onClick={() => handleSelectRisk(risk.id)}>
                   Selecionar
                </button>
              </p>
            </li>
          ))}
          {selectedRiskValue !== null && (
            <div>
              <p className='p-2 bg-white/30 text-white'>Risco selecionado: {selectedRiskValue} | codigo: {selectedRiskId}</p>
              <button 
                    className='border w-full p-1 border-b-4 hover:bg-white hover:border-black/80 hover:text-black' 
                    onClick={() => handleSelectRisk(null)}>
                     Cancelar
              </button>
            </div>
          )}
        </ul> 
      </div>
      
     {/* Checklist Questions */}
      <div className="checklist-questions border justify-center p-5 w-2/3" style={{ display: selectedRiskId ? 'block' : 'none' }}>
        <h2 className='text-xs font-semibold p-1 border-b-4 uppercase bg-yellow-500 text-black border-t border-x'>Inspeção de segurança do trabalho</h2>
        <ol className='text-xs border bg-black'>
          <label>
                Local de Inspeção
                <input
                  className='bg-white/10 border-b-4 m-2 ml-2 p-1'
                  type="text"
                />
          </label>
          <label>
                Participantes
                <input
                  className='bg-white/10 border-b-4 m-2 ml-2 p-1'
                  type="text"
                />
          </label>
          <h2 className='border-b p-1.5 text-sm text-white'>Assunto</h2>
           {Object.entries(groupedQuestions).map(([subject, subjectQuestions]) => (
            <div key={subject}>
              <h3 className='border-y p-1 text-xs text-white'>{subject}</h3>
              {subjectQuestions.map((question) => (
                <div key={question.id}>
                  <div className="flex flex-row justify-between bg-white/30">
                    <li className='p-1'>{question.question}</li>
                    <div>
                      <button 
                        className="answer-button hover:bg-black positive border bg-green-400 p-1 ml-1"
                        onClick={() => handleSimButtonClick(question.id)}>
                        Sim
                      </button>
                      <button className="answer-button hover:bg-black negative border bg-red-500 p-1">Não</button>
                      <button className="answer-button hover:bg-black negative border bg-yellow-500 p-1">NA</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          <button 
            className='border w-full p-2 border-b-4 hover:bg-white hover:border-black/80 hover:text-black' 
            onClick={applyRiskToBackend}>
            Aplicar checklist
          </button>
        </ol>
      </div>
  
    </div>
  );
};

export default AppliedChecklistsPage;
