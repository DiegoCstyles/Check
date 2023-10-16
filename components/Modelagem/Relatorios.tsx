"use client";
import React from 'react';
import { Bar } from 'react-chartjs-2';

const AppliedChecklistsChart = () => {
  const chartData = {
    labels: ['checklist 1', 'checklist 2', 'checklist 3', 'checklist 4', 'checklist 5', 'checklist 6'],
    datasets: [{
      label: 'Media de Pontuação',
      data: [12, 19, 3, 5, 2, 3],
      borderWidth: 1,
      backgroundColor: 'rgb(103 232 249)', // Adjust the color
    }],
  };

  const chartDataUserRanking = {
    labels: ['João', 'Ana', 'Marcos', 'Bianca'],
    datasets: [{
      label: 'Ranking de usuarios aplicadores',
      data: [12, 19, 3, 5],
      borderWidth: 1,
      backgroundColor: 'rgb(103 232 149)', // Adjust the color
    }],
  };

  const chartDataBestScore = {
    labels: ['Unidade 1', 'Unidade 2', 'Unidade 3', 'Unidade 4', 'Unidade 5'],
    datasets: [{
      label: 'Ranking de unidade com melhor nota',
      data: [20, 19, 5, 8, 4],
      borderWidth: 1,
      backgroundColor: 'rgb(103 132 249)', // Adjust the color
    }],
  };

  const chartDataWorstScore = {
    labels: ['Unidade 1', 'Unidade 2', 'Unidade 3', 'Unidade 4', 'Unidade 5'],
    datasets: [{
      label: 'Ranking de unidade com pior nota',
      data: [25, 10, 2, 4, 5],
      borderWidth: 1,
      backgroundColor: 'rgb(203 32 49)', // Adjust the color
    }],
  };

  const chartHeight = 400;
  const chartWidth = 400;
  return (
    <div className='w-full'>
      <h1 className='bg-cyan-300 border text-black flex justify-center border-b p-2 text-sm uppercase font-semibold'>Relatorios</h1>
    <div className='m-2 text-xs text-center'>
      
      <div className="mx-48 chart-container">
        <div className='flex ' style={{ width: chartWidth, height: chartHeight }}>
          <Bar
            className='m-5 '
            data={chartData}
            options={{
              indexAxis: 'y', // Set the axis to horizontal
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
          <Bar
            className='m-5'
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
        <div className='flex' style={{ width: chartWidth, height: chartHeight }}>
            <Bar
              className='m-5'
              data={chartDataBestScore}
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
            
          <Bar
            className='m-5'
            data={chartDataWorstScore}
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
    </div>
    </div>
  );
};

export default AppliedChecklistsChart;
