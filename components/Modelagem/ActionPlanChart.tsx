import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { RiskItem } from './models';
import 'chart.js'; // Import 'chart.js' to access Chart.defaults.global
import 'chartjs-plugin-datalabels'; // Import the datalabels plugin

interface ActionPlanChartProps {
  actionData: RiskItem[];
}

const ActionPlanChart: React.FC<ActionPlanChartProps> = ({ actionData }) => {
   // Filter options
  const filterOptions = ['todos', 'aprovado', 'reprovado', 'solução em análise'];
  const defaultFilter = 'todos'; // Default filter value
  // Find the index of the default filter in the filterOptions array
  const defaultFilterIndex = filterOptions.indexOf(defaultFilter);

  const [selectedFilter, setSelectedFilter] = useState<string>(
    defaultFilterIndex !== -1 ? defaultFilter : 'todos'
  );
  const [countplanApproval, setCountplanApproval] = useState<number>(0); // Initialize countplanApproval to 0
  const [chartData, setChartData] = useState<any>(null); // Initialize chartData to null

  const chartHeight = 400;
  const chartWidth = 400;
  console.log('actionData: ', actionData);
  // Function to update chart data based on selected filter
  const updateChartData = () => {
  const filteredData = selectedFilter === 'todos'
    ? actionData
    : actionData.filter(action => action.planApproval === selectedFilter);

  const counts: { [key: string]: number } = {
    'aprovado': 0,
    'reprovado': 0,
    'solução em análise': 0,
  };

  filteredData.forEach(action => {
    const approval = action.planApproval.toLowerCase();
    if (counts.hasOwnProperty(approval)) {
      counts[approval]++;
    }
  });

  const data = {
    labels: ['aprovado', 'reprovado', 'solução em análise'],
    datasets: [
      {
        data: [counts.aprovado, counts.reprovado, counts['solução em análise']],
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
      action => action.planApproval === 'reprovado' || action.planApproval === 'aprovado' || action.planApproval === 'Solução em análise'
    ).length;
  };

  return (
    <div className='mt-2 w-full ml-2 border'>
      <h2 className=' border-b p-1.5 text-xs  text-white'>Status</h2>
      <div className='mb-4 '>
        <label htmlFor='filter'>Tipo:</label>
        <select
          id='filter'
          className='ml-2 bg-black p-2 my-2 border-b-4'
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          {filterOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className='w-full flex justify-center items-center'>

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
