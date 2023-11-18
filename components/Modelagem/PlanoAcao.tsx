  "use client";
  import React, { useState, useEffect } from 'react';
  import ActionPlanChart from './ActionPlanChart'; // Import the chart component
  import ActionPlanConfirmation from './ActionPlanConfirmation';
  import { RiskItem } from './models'; 
  import ChecklistAplicados from './ChecklistAplicados';

  const ActionPlanPage: React.FC = () => {
    const [chartData, setChartData] = useState<RiskItem[]>([]); 
    const [checklistOpen, setChecklistOpen] = useState<boolean>(false); const [chartOpen, setChartOpen] = useState<boolean>(false);
    
    useEffect(() => { fetchChartData(); }, []);

    const fetchChartData = async () => {
      try {
        const response = await fetch('https://checkend.onrender.com/api/chartData'); // Adjust the URL accordingly

        if (response.ok) { const data = await response.json(); setChartData(data);
        } else { console.error('Error fetching chart data'); }
      } catch (error) { console.error('Error:', error); }
    };

    const toggleChecklist = () => { setChecklistOpen(!checklistOpen); };
    const toggleChart = () => { setChartOpen(!chartOpen); };

    return (
      <div className='text-center w-full text-xs'>
          <h1 className='bg-cyan-300 text-black flex justify-center border-b p-2 text-sm uppercase font-semibold'>Planos de Ação</h1>

          <div className='flex flex-row'>
            <div>
              <button
                className='cursor-pointer mt-2 border-b-2 border text-white p-2 w-full hover:bg-white hover:border-black/80 hover:text-black'
                onClick={toggleChecklist}
              >
                {checklistOpen ? 'Fechar Checklists Aplicados ⬆' : 'Abrir Checklists Aplicados ⬇'}
              </button>
           

              <div className={`transition-max-h duration-500 ease-in-out overflow-hidden ${
                checklistOpen ? 'max-h-screen' : 'max-h-0'
              }`}>
                {checklistOpen && <ChecklistAplicados />}
              </div>
            </div>
            

            <div>
              <button
                className='cursor-pointer mt-2 border-b-2 border text-white p-2 w-full hover:bg-white hover:border-black/80 hover:text-black'
                onClick={toggleChart}
              >
                {chartOpen ? 'Fechar Avaliação de checklists ⬆' : 'Abrir Avaliação de checklists ⬇'}
              </button>
           

              <div className={`transition-max-h duration-500 ease-in-out overflow-hidden ${
                chartOpen ? 'max-h-screen' : 'max-h-0'
              }`}>
                {chartOpen && (
                  <div>
                    <ActionPlanChart actionData={chartData} />
                    <ActionPlanConfirmation />
                  </div>
                )}
              </div>
            </div>
          </div>
      </div>
    );
  };

  export default ActionPlanPage;
