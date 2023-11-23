"use client";
import React, { useState, useEffect } from 'react';
import { RiskItem  } from './models';

interface Question {
  id: number;
  subject: string;
  question: string;
  value: number;
}

const AppliedChecklistsPage: React.FC = () => {
  const [RiskItems, setRiskItems] = useState<RiskItem[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

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

  
  // Group questions by subject
  const groupedQuestions: Record<string, Question[]> = questions.reduce((acc, question) => {
    if (!acc[question.subject]) {
      acc[question.subject] = [];
    }
    acc[question.subject].push(question);
    return acc;
  }, {});

  return (
    <div className='flex justify-between ml-2 w-full'>
    {/* Checklist Questions */}
      <div className="checklist-questions border justify-center p-5 w-2/3">
        <h2 className='text-sm border-b-4'>Inspeção de segurança do trabalho</h2>
        <ol className='text-xs'>
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
              <h3 className='border-b p-1 text-xs text-white'>{subject}</h3>
              {subjectQuestions.map((question) => (
                <div key={question.id}>
                  <div className="flex flex-row justify-between">
                    <li className='p-1'>{question.question}</li>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <h3 className='border-b p-1 text-xs text-white'>Ficha de controle de EPI&apos;s</h3>
          <div className="flex flex-row justify-between">
            <li className='p-1'>Possui ficha de controle?</li>
            <div>
              <button className="answer-button hover:bg-black positive border bg-green-400 p-1 ml-1">Sim</button>
              <button className="answer-button hover:bg-black negative border bg-red-500 p-1">Não</button>
              <button className="answer-button hover:bg-black negative border bg-yellow-500 p-1">NA</button>
            </div>
          </div>
          <div className="flex flex-row justify-between"> 
            <li className='p-1'>Encontra-se em dia?</li>
            <div>
              <button className="answer-button hover:bg-black positive border bg-green-400 p-1 ml-1">Sim</button>
              <button className="answer-button hover:bg-black negative border bg-red-500 p-1">Não</button>
              <button className="answer-button hover:bg-black negative border bg-yellow-500 p-1">NA</button>
            </div>
          </div>
          
          <h3 className='border-y p-1 text-xs text-white'>Equipamento de proteção individual - EPI&apos;s</h3>
          <div className="flex flex-row justify-between">
            <li className='p-1'>Possui estoque de EPI&apos;s en quantidade suficiente para atender os empregados?</li>
            <div>
              <button className="answer-button hover:bg-black positive border bg-green-400 p-1 ml-1">Sim</button>
              <button className="answer-button hover:bg-black negative border bg-red-500 p-1">Não</button>
              <button className="answer-button hover:bg-black negative border bg-yellow-500 p-1">NA</button>
            </div>
          </div>
          <div className="flex flex-row justify-between"> 
            <li className='p-1'>Os EPI&apos;s estão adequadamente higienizados?</li>
            <div>
              <button className="answer-button hover:bg-black positive border bg-green-400 p-1 ml-1">Sim</button>
              <button className="answer-button hover:bg-black negative border bg-red-500 p-1">Não</button>
              <button className="answer-button hover:bg-black negative border bg-yellow-500 p-1">NA</button>
            </div>
          </div>
           <div className="flex flex-row justify-between"> 
            <li className='p-1'>Os funcionários foram orientados para cuidar devidamente dos EPIs?</li>
            <div>
              <button className="answer-button hover:bg-black positive border bg-green-400 p-1 ml-1">Sim</button>
              <button className="answer-button hover:bg-black negative border bg-red-500 p-1">Não</button>
              <button className="answer-button hover:bg-black negative border bg-yellow-500 p-1">NA</button>
            </div>
          </div>
          
          <h3 className='border-y p-1 text-xs text-white'>P.P.R.A (Programa Prevensão Riscos Ambientais)</h3>
          <div className="flex flex-row justify-between">
            <li className='p-1'>Possui PPRA implantado?</li>
            <div>
              <button className="answer-button hover:bg-black positive border bg-green-400 p-1 ml-1">Sim</button>
              <button className="answer-button hover:bg-black negative border bg-red-500 p-1">Não</button>
              <button className="answer-button hover:bg-black negative border bg-yellow-500 p-1">NA</button>
            </div>
          </div>
          <div className="flex flex-row justify-between"> 
            <li className='p-1'>A revisão está em dia?</li>
            <div>
              <button className="answer-button hover:bg-black positive border bg-green-400 p-1 ml-1">Sim</button>
              <button className="answer-button hover:bg-black negative border bg-red-500 p-1">Não</button>
              <button className="answer-button hover:bg-black negative border bg-yellow-500 p-1">NA</button>
            </div>
          </div>
          <div className="flex flex-row justify-between"> 
            <li className='p-1'>O cronograma de ações está sendo cumprido no prazo estipulado?</li>
            <div>
              <button className="answer-button hover:bg-black positive border bg-green-400 p-1 ml-1">Sim</button>
              <button className="answer-button hover:bg-black negative border bg-red-500 p-1">Não</button>
              <button className="answer-button hover:bg-black negative border bg-yellow-500 p-1">NA</button>
            </div>
          </div>
           <div className="flex flex-row justify-between"> 
            <li className='p-1'>O PPRA atende a realidade da empresa atualmente?</li>
            <div>
              <button className="answer-button hover:bg-black positive border bg-green-400 p-1 ml-1">Sim</button>
              <button className="answer-button hover:bg-black negative border bg-red-500 p-1">Não</button>
              <button className="answer-button hover:bg-black negative border bg-yellow-500 p-1">NA</button>
            </div>
          </div>

          <h3 className='border-y p-1 text-xs text-white'>P.C.M.S.O (Programa Controle Médico Saúde Ocupacional)</h3>
          <div className="flex flex-row justify-between">
            <li className='p-1'>Possui PCMSO implantado, e em dia?</li>
            <div>
              <button className="answer-button hover:bg-black positive border bg-green-400 p-1 ml-1">Sim</button>
              <button className="answer-button hover:bg-black negative border bg-red-500 p-1">Não</button>
              <button className="answer-button hover:bg-black negative border bg-yellow-500 p-1">NA</button>
            </div>
          </div>
          <div className="flex flex-row justify-between"> 
            <li className='p-1'>Os ASO&apos;s estão em dia?</li>
            <div>
              <button className="answer-button hover:bg-black positive border bg-green-400 p-1 ml-1">Sim</button>
              <button className="answer-button hover:bg-black negative border bg-red-500 p-1">Não</button>
              <button className="answer-button hover:bg-black negative border bg-yellow-500 p-1">NA</button>
            </div>
          </div>
          <div className="flex flex-row justify-between"> 
            <li className='p-1'>Os ASO&apos;s contemplam os riscos cadastrados no PCMSO?</li>
            <div>
              <button className="answer-button hover:bg-black positive border bg-green-400 p-1 ml-1">Sim</button>
              <button className="answer-button hover:bg-black negative border bg-red-500 p-1">Não</button>
              <button className="answer-button hover:bg-black negative border bg-yellow-500 p-1">NA</button>
            </div>
          </div>
           <div className="flex flex-row justify-between"> 
            <li className='p-1'>O cronograma de ações está sendo cumprido no prazo estipulado?</li>
            <div>
              <button className="answer-button hover:bg-black positive border bg-green-400 p-1 ml-1">Sim</button>
              <button className="answer-button hover:bg-black negative border bg-red-500 p-1">Não</button>
              <button className="answer-button hover:bg-black negative border bg-yellow-500 p-1">NA</button>
            </div>
          </div>
           <div className="flex flex-row justify-between"> 
              <li className='p-1'>O PCMSO atende a realidade da empresa atualmente?</li>
            <div>
              <button className="answer-button hover:bg-black positive border bg-green-400 p-1 ml-1">Sim</button>
              <button className="answer-button hover:bg-black negative border bg-red-500 p-1">Não</button>
              <button className="answer-button hover:bg-black negative border bg-yellow-500 p-1">NA</button>
            </div>
          </div>
          
        </ol>
      </div>
      
      <div className="applied-checklists-page border p-5 w-1/3">
        <h1 className='border-b-4'>Checklist Aplicados</h1>
        <ul className="applied-checklist-list">
          {RiskItems.map((risk) => (
            <li key={risk.id} className="applied-checklist-item">
              <p className='mr-2 px-2 py-1 text-xs flex justify-between'>
                <span className='p-2 text-start text-center bg-black/10'>{risk.title}</span>
                <span className='p-2 text-start text-center bg-black/10'>{risk.date}</span>
                <button className='border m-1 p-1 border-b-4 hover:bg-white hover:border-black/80 hover:text-black' >Selecionar</button>
              </p>
            </li>
          ))}
        </ul>
      </div>
  
    </div>
  );
};

export default AppliedChecklistsPage;
