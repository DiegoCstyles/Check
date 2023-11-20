"use client";
import React from 'react'; import { Bar, PolarArea, Bubble } from 'react-chartjs-2';
import faker from 'faker';

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
    datasets: [
      {
        label: 'Alto Risco',
        data: Array.from({ length: 50 }, () => ({
          x: faker.datatype.number({ min: -100, max: 100 }),
          y: faker.datatype.number({ min: -100, max: 100 }),
          r: faker.datatype.number({ min: 5, max: 20 }),
        })),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Baixo Risco',
        data: Array.from({ length: 50 }, () => ({
          x: faker.datatype.number({ min: -100, max: 100 }),
          y: faker.datatype.number({ min: -100, max: 100 }),
          r: faker.datatype.number({ min: 5, max: 20 }),
        })),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const chartHeight = 200; const chartWidth = 200;
  return (
    <div className='w-full border bg-slate-500/30'>
      <h1 className='bg-cyan-300 border text-black flex justify-center border-b p-2 text-sm uppercase font-semibold'>Relatorios</h1>
      <div className='m-2 text-xs text-center border flex flex-col'>
        <Bubble
          className='bg-black/10 w-10 h-10'
          data={chartDataWorstScore}
          options={{
            indexAxis: 'x', // Set the axis to horizontal
            responsive: true,
            color: 'white', 
            maintainAspectRatio: false,
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
        <PolarArea
          className='bg-black/10 w-10 h-10'
          data={chartDataBestScore}
          options={{
            indexAxis: 'x', // Set the axis to horizontal
            responsive: true,
            color: 'white',
            maintainAspectRatio: false,
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
  );
};

export default AppliedChecklistsChart;
