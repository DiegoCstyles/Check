"use client";
import React from 'react'; import { Bar, PolarArea, Bubble } from 'react-chartjs-2';

const AppliedChecklistsChart = () => {

  const getUsers = async () => {
    try {
      const response = await fetch('https://checkend.onrender.com/api/getUsers', {
        method: 'GET',
      });
  
      if (response.ok) {
        const data = await response.json();
        return data; // Assuming the response contains user information, adjust accordingly
      } else {
        console.error('Error fetching user information');
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  let chartDataUserRanking; 

  (async () => {
    try {
      const usersInfo = await getUsers();
  
      const chartDataUserRanking = {
        labels: usersInfo.name,
        datasets: [{
          label: 'Ranking de usuarios aplicadores',
          data: [12],
          borderWidth: 1,
          backgroundColor: 'rgb(103 232 149)',
        }],
      };
  
      // Rest of your code that uses chartDataUserRanking
  
    } catch (error) {
      console.error('Error:', error);
    }
  })();


  return (
    <div className='w-full h-screen border bg-slate-500/30'>
      <h1 className='bg-cyan-300 border text-black flex justify-center border-b p-2 text-sm uppercase font-semibold'>Relatorios</h1>
      <div className='h-auto m-2 text-xs text-center border flex flex-col'>
        <div className="flex flex-row justify-around">
         <div className="chart-container bg-black/10 mt-2" style={{ width: '400px', height: '225px' }}>
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
          <div className="chart-container bg-black/10 mt-2" style={{ width: '400px', height: '225px' }}>
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
          <div className="chart-container bg-black/10 mt-2" style={{ width: '400px', height: '225px' }}>
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
        <div className='w-full bg-yellow-500 uppercase font-semibold text-black p-2'>Ultimos Checklists</div>
        <div className='flex flex-row border-t-4 w-full h-80'>
          <div className='w-1/2 bg-red-500/50 uppercase font-semibold p-2'>Reprovado</div>
          <div className='w-1/2 bg-green-500/50 uppercase font-semibold p-2'>Aprovado</div>
        </div>
      </div>
    </div>
  );
};

export default AppliedChecklistsChart;
