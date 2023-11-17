  "use client";
  import React, { useState, useEffect } from 'react';
  import ActionPlanChart from './ActionPlanChart'; // Import the chart component
  import ActionPlanConfirmation from './ActionPlanConfirmation';
  import { RiskItem } from './models'; 
  import ChecklistAplicados from './ChecklistAplicados';

  const ActionPlanPage: React.FC = () => {
    const [chartData, setChartData] = useState<RiskItem[]>([]); const [checklistOpen, setChecklistOpen] = useState<boolean>(false);
    
    useEffect(() => { fetchChartData(); }, []);

    const fetchChartData = async () => {
      try {
        const response = await fetch('https://checkend.onrender.com/api/chartData'); // Adjust the URL accordingly

        if (response.ok) { const data = await response.json(); setChartData(data);
        } else { console.error('Error fetching chart data'); }
      } catch (error) { console.error('Error:', error); }
    };

    const toggleChecklist = () => { setChecklistOpen(!checklistOpen); };

    return (
      <div className='text-center w-full border text-xs'>
          <h1 className='bg-cyan-300 text-black flex justify-center border-b p-2 text-sm uppercase font-semibold'>Planos de Ação</h1>
        
          <div>
            <button
              className='cursor-pointer border-b-2 border text-white p-2 w-full hover:bg-white hover:border-black/80 hover:text-black'
              onClick={toggleChecklist}
            >
              {checklistOpen ? 'Fechar Checklists Aplicados ⬆' : 'Abrir Checklists Aplicados ⬇'}
            </button>
          </div>
  
          <div className={`transition-max-h duration-500 ease-in-out overflow-hidden ${
            checklistOpen ? 'max-h-screen' : 'max-h-0'
          }`}>
            {checklistOpen && <ChecklistAplicados />}
          </div>
        
          <div className='flex mb-2'> <ActionPlanChart actionData={chartData} />  <ActionPlanConfirmation />  </div>
      </div>
    );
  };

  export default ActionPlanPage;
