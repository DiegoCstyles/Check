"use client";
import React, { useState, useEffect } from 'react';
import { RiskItem, AppliedChecklist } from './models';
import Modal from './Modal'; // Import the modal component

interface Question {
  id: number;
  subject: string;
  question: string;
  value: number;
}

interface ClickedButtonsState {
  [questionId: number]: boolean;
}

const AppliedChecklistsPage: React.FC = () => {
  const [RiskItems, setRiskItems] = useState<RiskItem[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedRiskId, setSelectedRiskId] = useState<number | null>(null);
  const [selectedRiskValue, setSelectedRiskValue] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: number]: string }>({});
  const [clickedButtons, setClickedButtons] = useState<ClickedButtonsState>({});
  const [searchInput, setSearchInput] = useState<string>('');
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => { setModalOpen(true); }; 
  const closeModal = () => { setModalOpen(false); };

  const [ApplyRisk, setApplyRisk] = useState<AppliedChecklist>({
    id: 0,
    dateapplied: '',
    score: 0,
    location: '',
    participants: '',
    risk_id: selectedRiskId !== null ? selectedRiskId : 0,
  });

  const resetApplyRisk = () => {
    setApplyRisk({
      id: 0,
      dateapplied: '',
      score: 0,
      location: '',
      participants: '',
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
           if (selectedAnswers[question.id] === 'Sim') {
              totalScore += question.value;
            } else if (selectedAnswers[question.id] === 'Não') {
              totalScore -= question.value;
            }
            // Do nothing for 'NA'
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
          location: ApplyRisk.location, 
          participants: ApplyRisk.participants, 
        }),
      });
  
      if (response.ok) {
         setSelectedRiskId(null);
         openModal();
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
      location: '',
      participants: '',
      risk_id: riskId !== null ? riskId : 0,
    });
  };

   const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleAnswerButtonClick = (questionId: number, answer: string) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));

    setClickedButtons((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: !prevAnswers[questionId],
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
        <input
          type='text'
          placeholder='Procurar... 🔎'
          value={searchInput}
          onChange={handleSearchInputChange}
          className='w-full border text-black p-1.5 bg-white'
        />
        <ul className="applied-checklist-list border bg-black">
          {RiskItems
            .filter((risk) =>
              risk.title.toLowerCase().includes(searchInput.toLowerCase())
            )
            .map((risk) => (
            <li key={risk.id} className="applied-checklist-item">
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
              <p className='p-2 bg-white/30 text-white italic'>Risco selecionado: {selectedRiskValue} | codigo: {selectedRiskId}</p>
              <button 
                    className='border w-full p-1 border-b-4 hover:bg-white hover:border-black/80 hover:text-black' 
                    onClick={() => handleSelectRisk(null)}>
                     Cancelar
              </button>
            </div>
          )}
        </ul> 
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}><h2 className="text-sm text-blue bg-white/5">Aplicado com sucesso!</h2></Modal>
     {/* Checklist Questions */}
      <div className="checklist-questions border justify-center p-5 w-2/3" style={{ display: selectedRiskId ? 'block' : 'none' }}>
        <h2 className='text-xs font-semibold p-1 border-b-4 uppercase bg-yellow-500 text-black border-t border-x'>Inspeção de segurança do trabalho</h2>
        <ol className='text-xs border bg-black'>
          <div className='flex flex-row justify-around'>
            <label>
                  Local de Inspeção
                  <input
                    className='bg-white/10 border-b-4 m-2 ml-2 p-1'
                    type="text"
                    value={ApplyRisk.location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApplyRisk({ ...ApplyRisk, location: e.target.value })}
                  />
            </label>
            <label>
                  Participantes
                  <input
                    className='bg-white/10 border-b-4 m-2 ml-2 p-1'
                    type="text"
                    value={ApplyRisk.participants}
                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApplyRisk({ ...ApplyRisk, participants: e.target.value })}
                  />
            </label>
          </div>
          <h2 className='border-b p-1.5 text-sm text-white'>Assunto</h2>
           {Object.entries(groupedQuestions).map(([subject, subjectQuestions]) => (
            <div key={subject}>
              <h3 className='border-y p-1 text-xs text-white'>{subject}</h3>
              {subjectQuestions.map((question) => (
                <div key={question.id}>
                  <div className="flex flex-row justify-between bg-white/10">
                    <li className='p-1'>{question.question}</li>
                    <div>
                      <button
                        className={`answer-button ${selectedAnswers[question.id] === 'Sim' ? 'positive' : ''} ${
                          selectedAnswers[question.id] === 'Sim' && clickedButtons[question.id] ? 'bg-black' : 'bg-green-400 hover:bg-black'
                        } p-1 ml-1`}
                        onClick={() => handleAnswerButtonClick(question.id, 'Sim')}
                      >
                        Sim
                      </button>
                      
                      <button
                        className={`answer-button ${selectedAnswers[question.id] === 'Não' ? 'negative' : ''} ${
                          selectedAnswers[question.id] === 'Não' && clickedButtons[question.id] ? 'bg-black' : 'bg-red-500 hover:bg-black'
                        } p-1`}
                        onClick={() => handleAnswerButtonClick(question.id, 'Não')}
                      >
                        Não
                      </button>
                      
                      <button
                        className={`answer-button ${selectedAnswers[question.id] === 'NA' ? 'negative' : ''} ${
                          selectedAnswers[question.id] === 'NA' && clickedButtons[question.id] ? 'bg-black' : 'bg-yellow-500 hover:bg-black'
                        } p-1`}
                        onClick={() => handleAnswerButtonClick(question.id, 'NA')}
                      >
                        NA
                      </button>
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
