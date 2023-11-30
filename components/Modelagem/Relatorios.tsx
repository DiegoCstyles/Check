"use client";
import React from 'react'; import { Bar, PolarArea, Bubble } from 'react-chartjs-2';

const AppliedChecklistsChart = () => {

  const chartDataUserRanking = {
    labels: ['João', 'Ana', 'Marcos', 'Bianca'],
    datasets: [{
      label: 'Ranking de usuarios aplicadores',
      data: [12, 19, 3, 5],
      borderWidth: 1,
      backgroundColor: 'rgb(103 232 149)', // Adjust the color
    }],
  };

  return (
    <div className='w-full h-screen border bg-slate-500/30'>
      <h1 className='bg-cyan-300 border text-black flex justify-center border-b p-2 text-sm uppercase font-semibold'>Relatorios</h1>
      <div className='h-full m-2 text-xs text-center border flex flex-col'>
        <div className="flex flex-row justify-around">
         <div className="chart-container bg-black/10" style={{ width: '400px', height: '250px' }}>
         <Bar
              data={chartDataUserRanking}
              options={{
                indexAxis: 'x', // Set the axis to horizontal
                responsive: true,
                color: 'white', 
                scales: {
                  x: {
                    beginAtZero: true,
                    ticks: {
                      color: 'white', // Change tick label color to white
                    },
                  },
                  y: {
                    ticks: {
                      color: 'white', // Change label color to white
                    },
                  },
                },
              }}
              
            />
           </div>
          <div className="chart-container bg-black/10" style={{ width: '400px', height: '250px' }}>
         <Bar
              data={chartDataUserRanking}
              options={{
                indexAxis: 'x', // Set the axis to horizontal
                responsive: true,
                color: 'white', 
                scales: {
                  x: {
                    beginAtZero: true,
                    ticks: {
                      color: 'white', // Change tick label color to white
                    },
                  },
                  y: {
                    ticks: {
                      color: 'white', // Change label color to white
                    },
                  },
                },
              }}
              
            />
           </div>
          <div className="chart-container bg-black/10" style={{ width: '400px', height: '250px' }}>
         <Bar
              data={chartDataUserRanking}
              options={{
                indexAxis: 'x', // Set the axis to horizontal
                responsive: true,
                color: 'white', 
                scales: {
                  x: {
                    beginAtZero: true,
                    ticks: {
                      color: 'white', // Change tick label color to white
                    },
                  },
                  y: {
                    ticks: {
                      color: 'white', // Change label color to white
                    },
                  },
                },
              }}
              
            />
           </div>
        </div>
        <div className='w-full h-full border-t-4 bg-red'>Ultimo Checklist Reprovado</div>
      </div>
    </div>
  );
};

export default AppliedChecklistsChart;
