import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { RiskItem } from './models';
import 'chart.js'; // Import 'chart.js' to access Chart.defaults.global
import 'chartjs-plugin-datalabels'; // Import the datalabels plugin

interface ActionPlanChartProps { actionData: RiskItem[]; }

const ActionPlanChart: React.FC<ActionPlanChartProps> = ({ actionData }) => {
   // Filter options
  const filterOptions = ['todos', 'aprovado', 'reprovado', 'solução em análise'];
  const defaultFilter = 'todos'; // Default filter value
  // Find the index of the default filter in the filterOptions array
  const defaultFilterIndex = filterOptions.indexOf(defaultFilter);

  const [selectedFilter, setSelectedFilter] = useState<string>( defaultFilterIndex !== -1 ? defaultFilter : 'todos');
  const [countplanApproval, setCountplanApproval] = useState<number>(0); // Initialize countplanApproval to 0
  const [chartData, setChartData] = useState<any>(null); // Initialize chartData to null
  
  const chartHeight = 400; const chartWidth = 400;
  
  // Function to update chart data based on selected filter
 const updateChartData = () => {
  const filteredData = selectedFilter === 'todos'
    ? actionData
     : actionData.filter(action => {
        const lowerCasePlanApproval = action.planapproval && action.planapproval.toLowerCase();
        return lowerCasePlanApproval === selectedFilter.toLowerCase();
      });

  const aprovadoCount = filteredData.filter(action => action.planapproval.toLowerCase() === 'aprovado').length;
  const reprovadoCount = filteredData.filter(action => action.planapproval.toLowerCase() === 'reprovado').length;
  const analiseCount = filteredData.filter(action => action.planapproval.toLowerCase() === 'solução em análise').length;

  const data = {
    labels: ['aprovado', 'reprovado', 'solução em análise'],
    datasets: [
      {
        data: [aprovadoCount, reprovadoCount, analiseCount],
        backgroundColor: ['#4CAF50', '#d33658', '#d8f001'],
        hoverBackgroundColor: ['#4CAF50', '#d33658', '#d8f001'],
      },
    ],
  };
  setChartData(data);
};
  // Call the counting function whenever actionData or selectedFilter changes
  useEffect(() => {
    const count = countSolucaoEmAnaliseInFilteredData();
    updateChartData();
    setCountplanApproval(count);
  }, [actionData, selectedFilter]);

  // Function to count occurrences of "Solução em análise" in the filtered data
  const countSolucaoEmAnaliseInFilteredData = () => {
    return actionData.filter(
      action => action.planapproval === 'reprovado' || action.planapproval === 'aprovado' || action.planapproval === 'Solução em análise'
    ).length;
  };

  return (
    <div className='ml-2 w-1/2 border'>
      <h2 className='border-b p-1.5 text-xs text-black uppercase font-semibold bg-yellow-500'>Status</h2>
      
      <div className='flex flex-row justify-evenly p-2 bg-white/10'>
        <div>
           <label className='bg-white text-black uppercase font-semibold p-2' htmlFor='filter'>Tipo</label>
           <select
             id='filter'
             className=' bg-black p-2 border-b-4'
             value={selectedFilter}
             onChange={(e) => setSelectedFilter(e.target.value)}
           >
             {filterOptions.map(option => ( <option key={option} value={option}> {option} </option> ))}
           </select>
        </div>
        <div>
           <label className='bg-white text-black uppercase font-semibold p-2' htmlFor='filter'>De</label>
           <input
            className='bg-black text-white border-b-4 p-2'
            type="date" 
           />
        </div>
         <div>
           <label className='bg-white text-black uppercase font-semibold p-2' htmlFor='filter'>Até</label>
           <input
            className='bg-black text-white border-b-4 p-2'
            type="date" 
           />
        </div>
      </div>
      
      <div className='w-full flex justify-center items-center bg-black'>
        <div className='p-4' style={{ width: chartWidth, height: chartHeight }}>
          {chartData ? ( // Check if chartData is not null
            <>
            <Pie
              data={chartData} 
              options={{
                plugins: {
                  datalabels: {
                    display: true,
                    color: 'white', // Color of the value text
                    font: {
                      weight: 'bold',
                    },
                  },
                },
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
            <div className="w-full mt-4 text-black uppercase font-semibold flex flex-row text-base">
               <p className="p-4 bg-green-400">Aprovado {chartData.datasets[0].data[0]}</p>
               <p className="p-4 bg-red-400">Reprovado {chartData.datasets[0].data[1]}</p>
               <p className="p-4 bg-yellow-400" >Solução em análise {chartData.datasets[0].data[2]}</p>
            </div> 
            </>
            
          ) : (
            <p>Loading chart data...</p> // You can display a loading message or handle it as you prefer
          )}
         
        </div> 
      </div> 
    </div>
     
  );
};

export default ActionPlanChart;
