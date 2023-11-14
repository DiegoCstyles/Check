"use client";
import React, { useState, useEffect } from 'react';
import { AppliedChecklist } from './models';

const AppliedChecklistsPage: React.FC = () => {
  const [appliedChecklists, setAppliedChecklists] = useState<AppliedChecklist[]>([]);

  const fetchAppliedChecklists = async () => {
    try {
      const response = await fetch('https://checkend.onrender.com/api/appliedChecklists');

      if (response.ok) {
        const data = await response.json();
        setAppliedChecklists(data);
      } else {
        console.error('Error fetching applied checklists');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchAppliedChecklists();
  }, []);

  return (
    <div className='flex justify-between m-2'>
    {/* Checklist Questions */}
      <div className="checklist-questions border w-full justify-center p-5">
        <h2 className='text-sm border-b-4'>Questionário de Checklist</h2>
        <ol className='text-xs'>
          <li className='p-1'>As rodas foram inspecionadas quanto a danos visíveis?</li>
          <button className="answer-button positive border bg-green-400 p-1 mr-1 ml-1">Sim</button>
            <button className="answer-button negative border bg-red-500 p-1">Não</button>
          <li className='p-1'>Todos os parafusos das rodas estão devidamente apertados?</li>
          <button className="answer-button positive border bg-green-400 p-1 mr-1 ml-1">Sim</button>
            <button className="answer-button negative border bg-red-500 p-1">Não</button>
          <li className='p-1'>O alinhamento das rodas foi verificado?</li>
          <button className="answer-button positive border bg-green-400 p-1 mr-1 ml-1">Sim</button>
            <button className="answer-button negative border bg-red-500 p-1">Não</button>
          <li className='p-1'>Os pneus estão na pressão correta?</li>
          <button className="answer-button positive border bg-green-400 p-1 mr-1 ml-1">Sim</button>
            <button className="answer-button negative border bg-red-500 p-1">Não</button>
          <li className='p-1'>As válvulas dos pneus estão em boas condições?</li>
          <button className="answer-button positive border bg-green-400 p-1 mr-1 ml-1">Sim</button>
            <button className="answer-button negative border bg-red-500 p-1">Não</button>
          <li className='p-1'>O balanço das rodas foi verificado?</li>
          <button className="answer-button positive border bg-green-400 p-1 mr-1 ml-1">Sim</button>
            <button className="answer-button negative border bg-red-500 p-1">Não</button>
          <li className='p-1'>Os freios foram inspecionados quanto ao desgaste?</li>
          <button className="answer-button positive border bg-green-400 p-1 mr-1 ml-1">Sim</button>
            <button className="answer-button negative border bg-red-500 p-1">Não</button>
          <li className='p-1'>Os rolamentos das rodas foram lubrificados?</li>
          <button className="answer-button positive border bg-green-400 p-1 mr-1 ml-1">Sim</button>
          <button className="answer-button negative border bg-red-500 p-1">Não</button>
          {/* Adicione mais perguntas relevantes aqui */}
        </ol>
      </div>
      
      <div className="applied-checklists-page border ml-2 p-5">
        <h1 className='border-b-4'>Checklist Aplicados</h1>
        <ul className="applied-checklist-list">
          {appliedChecklists.map((checklist) => (
            <li key={checklist.id} className="applied-checklist-item">
              <p className='text-center mr-2 px-2 py-1 text-xs '>
                <span className='p-2'>{checklist.title}</span>
                <span className='p-2'>{checklist.dateApplied}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
  
    </div>
  );
};

export default AppliedChecklistsPage;
