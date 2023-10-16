import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js'; // Import 'chart.js' to access Chart.defaults.global
import 'chartjs-plugin-datalabels'; // Import the datalabels plugin
var ActionPlanChart = function (_a) {
    var actionData = _a.actionData;
    // Filter options
    var filterOptions = ['todos', 'aprovado', 'reprovado', 'solução em análise'];
    var defaultFilter = 'todos'; // Default filter value
    // Find the index of the default filter in the filterOptions array
    var defaultFilterIndex = filterOptions.indexOf(defaultFilter);
    var _b = useState(defaultFilterIndex !== -1 ? defaultFilter : 'todos'), selectedFilter = _b[0], setSelectedFilter = _b[1];
    var _c = useState(0), countplanApproval = _c[0], setCountplanApproval = _c[1]; // Initialize countplanApproval to 0
    var _d = useState(null), chartData = _d[0], setChartData = _d[1]; // Initialize chartData to null
    var chartHeight = 400;
    var chartWidth = 400;
    // Function to update chart data based on selected filter
    var updateChartData = function () {
        var filteredData = selectedFilter === 'todos'
            ? actionData
            : actionData.filter(function (action) { return action.planApproval === selectedFilter; });
        var aprovadoCount = filteredData.filter(function (action) { return action.planApproval === 'aprovado'; }).length;
        var reprovadoCount = filteredData.filter(function (action) { return action.planApproval === 'reprovado'; }).length;
        var analiseCount = filteredData.filter(function (action) { return action.planApproval === 'solução em análise'; }).length;
        var data = {
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
    useEffect(function () {
        var count = countSolucaoEmAnaliseInFilteredData();
        updateChartData();
        setCountplanApproval(count);
    }, [actionData, selectedFilter]);
    // Function to count occurrences of "Solução em análise" in the filtered data
    var countSolucaoEmAnaliseInFilteredData = function () {
        return actionData.filter(function (action) { return action.planApproval === 'reprovado' || action.planApproval === 'aprovado' || action.planApproval === 'Solução em análise'; }).length;
    };
    return (<div className='mt-2 w-full ml-2 border'>
      <h2 className=' border-b p-1.5 text-xs  text-white'>Status</h2>
      <div className='mb-4 '>
        <label htmlFor='filter'>Tipo:</label>
        <select id='filter' className='ml-2 bg-black p-2 my-2 border-b-4' value={selectedFilter} onChange={function (e) { return setSelectedFilter(e.target.value); }}>
          {filterOptions.map(function (option) { return (<option key={option} value={option}>
              {option}
            </option>); })}
        </select>
      </div>
      <div className='w-full flex justify-center items-center'>

        <div className='p-4' style={{ width: chartWidth, height: chartHeight }}>
          {chartData ? ( // Check if chartData is not null
        <>
            <Pie data={chartData} options={{
                plugins: {
                    datalabels: {
                        display: true,
                        color: 'white',
                        font: {
                            weight: 'bold',
                        },
                    },
                },
                responsive: true,
                maintainAspectRatio: false,
            }}/>
            </>) : (<p>Loading chart data...</p> // You can display a loading message or handle it as you prefer
        )}
        </div>

      </div>
    </div>);
};
export default ActionPlanChart;
