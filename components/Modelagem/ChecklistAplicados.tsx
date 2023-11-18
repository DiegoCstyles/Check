"use client";
import React, { useState, useEffect } from 'react';
import { AppliedChecklist } from './models';

const AppliedChecklistsPage: React.FC = () => {
  const [appliedChecklists, setAppliedChecklists] = useState<AppliedChecklist[]>([]);

  const fetchAppliedChecklists = async () => {
    try {
      const response = await fetch('https://checkend.onrender.com/api/appliedChecklists');

      if (response.ok) { const data = await response.json(); setAppliedChecklists(data);
      } else { console.error('Error fetching applied checklists'); }
    } catch (error) { console.error('Error:', error); }
  };

  useEffect(() => { fetchAppliedChecklists(); }, []);

  return (
    <div className='flex justify-between ml-2 w-fit'>
    {/* Checklist Questions */}
      <div className="checklist-questions border w-full justify-center p-5">
        <h2 className='text-sm border-b-4'>Questionário de Checklist</h2>
        <ol className='text-xs'>
          <label>
                Local de Inspeção
                <input
                  className='bg-white/10 border-b-4 m-2 ml-2'
                  type="text"
                />
          </label>
          <label>
                Participantes
                <input
                  className='bg-white/10 border-b-4 m-2 ml-2'
                  type="text"
                />
          </label>
          <li className='p-1'>As rodas foram inspecionadas quanto a danos visíveis?</li>
          <button className="answer-button positive border bg-green-400 p-1 mr-1 ml-1">Sim</button>
          <button className="answer-button negative border bg-red-500 p-1">Não</button>
         

        </ol>
      </div>
      
      <div className="applied-checklists-page border p-5">
        <h1 className='border-b-4'>Checklist Aplicados</h1>
        <ul className="applied-checklist-list">
          {appliedChecklists.map((checklist) => (
            <li key={checklist.id} className="applied-checklist-item">
              <p className='text-center mr-2 px-2 py-1 text-xs '>
                <span className='p-2'>{checklist.title}</span>
                <span className='p-2'>{checklist.dateapplied}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
  
    </div>
  );
};

export default AppliedChecklistsPage;
