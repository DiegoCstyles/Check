"use client";
import React, { useEffect, useState } from 'react'; import { Bar, PolarArea, Bubble } from 'react-chartjs-2';
import { AppliedChecklist, RiskItem } from './models';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderWidth: number;
    backgroundColor: string;
  }[];
}

interface User {
  id: number;
  email: string;
  password: string;
  name: string;
}

function formatDate(dateString: string | number | Date) {
  // Parse the input date string
  const inputDate = new Date(dateString);

  // Check if the input date is valid
  if (isNaN(inputDate.getTime())) { return ''; }

  // Format the date as "DD/MM/YYYY"
  const day = String(inputDate.getDate()).padStart(2, '0');
  const month = String(inputDate.getMonth() + 1).padStart(2, '0');
  const year = inputDate.getFullYear();

  return `${day}/${month}/${year}`;
}

const AppliedChecklistsChart = () => {
  const [itemRisk, setitemRisk] = useState<RiskItem[]>([]);

  const [chartDataUserRanking, setChartDataUserRanking] = useState<ChartData>({
    labels: [],
    datasets: [{
      label: 'Ranking de usuarios aplicadores',
      data: [],
      borderWidth: 1,
      backgroundColor: 'rgb(103, 232, 149)',
    }],
  });

  useEffect(() => {
    const fetchRiskItems = async () => {
      try {
        console.log('cheguei');
        const response = await fetch(`https://checkend.onrender.com/api/riskItemsLastApproval`);
        console.log('response:', response);
        if (response.ok) {
          const data = await response.json(); setitemRisk(data); // Update the riskItems state with the fetched data
          console.log('data: ', data);
        } else { console.error('Error fetching risk item from the database'); }
      } catch (error) { console.error('Error:', error); }
    };
    
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

    const getChecklists = async (): Promise<AppliedChecklist[]> => {
      try {
        const response = await fetch('https://checkend.onrender.com/api/getChecklists', {
          method: 'GET',
        });
    
        if (response.ok) {
          const data = await response.json();
          return data;
        } else {
          console.error('Error fetching checklists');
          throw new Error('Error fetching checklists'); // Throw an exception on error
        }
      } catch (error) {
        console.error('Error:', error);
        throw error; // Re-throw the error
      }
    };

    const fetchData = async () => {
      try { 
        const usersInfo: User[] = await getUsers();
        
        const userNames = usersInfo.map((user) => user.name);
        
        const checklists: AppliedChecklist[] | null = await getChecklists();
          
         if (usersInfo && checklists) {
          const counts = userNames.map((userName) => {
            const userId = usersInfo.find((user) => user.name === userName)?.id;
            if (userId) {
              // Assuming checklist data has a structure like { user_id, ...otherProperties }
              const userChecklists = checklists.filter((checklist: AppliedChecklist) => checklist.user_id === userId);
              const count = userChecklists.length;
              return count;
            }
            return 0;
          });
            
          setChartDataUserRanking({
            labels: userNames,
            datasets: [{
              label: 'Ranking de usuarios aplicadores',
              data: counts,
              borderWidth: 1,
              backgroundColor: 'rgb(103, 232, 149)',
            }],
          });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
    fetchRiskItems();
  }, []); 


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
        <div className='flex flex-row border-t-4 w-full h-full'>
          <div className='flex flex-col w-1/2 pr-1'>
            <div className='h-1/6 bg-black uppercase font-semibold p-1.5 flex justify-center mt-2'>Reprovado</div>
            <div className='h-5/6 bg-red-500/50 p-1'>Valores</div>
          </div>
          <div className='flex flex-col w-1/2 pl-1'>
            <div className='h-1/6 bg-black uppercase font-semibold p-1.5 flex justify-center mt-2'>Aprovado</div>
            <div className='h-5/6 bg-green-500/50 p-1 m-14'>
              {itemRisk.map((risk) => (
                  <li key={risk.id} style={{ listStyleType: 'none' }}>
                    <div className='flex flex-col justify-between text-xs text-center p-0.5'>
                      <input
                        className='w-full text-center bg-white/10 border-b-4 p-1.5'
                        type='text'
                        value={risk.title}
                      />
                      <p className='w-full text-center bg-black uppercase font-semibold text-white p-1'>Responsável</p>
                      <div className="flex flex-row">
                        <input
                          className='w-1/2 text-center bg-white/10 border-b-4 p-1 uppercase font-semibold'
                          type='text'
                          value={'Checklist: ' + risk.responsiblechecklist}
                        />
                        <input
                          className='w-1/2 text-center bg-white/10 border-b-4 p-1 uppercase font-semibold'
                          type='text'
                          value={'Plano: ' + risk.responsibleplan}
                        />
                      </div>
                      <div className="flex flex-row w-full">
                        <p className='w-1/5 text-center bg-cyan-300 uppercase font-semibold text-white p-0.5'>Descrição</p>
                        <textarea 
                          className='bg-black border-b-4 p-2 pb-6 w-4/5'
                          value={risk.description} 
                        /> 
                      </div>
                      <div className="flex flex-row w-full">
                        <p className='w-1/5 text-center bg-cyan-300 uppercase font-semibold text-white p-0.5'>Plano de mitigação</p>
                        <textarea 
                          className='bg-black border-b-4 p-2 pb-7 w-4/5'
                          value={risk.plandescription} 
                        /> 
                      </div>
                      <div className="flex flex-row">
                        <input
                          className='w-1/4 text-center bg-yellow-500 text-black border-b-4 p-1 uppercase font-semibold'
                          type='text'
                          value={formatDate(risk.date)}
                        />
                        <input
                          className='w-1/4 text-center bg-white/10 border-b-4 p-1'
                          type='text'
                          value={'IMPACTO: ' + risk.impact}
                        />
                        <input
                          className='w-1/4 text-center bg-white/10 border-b-4 p-1'
                          type='text'
                          value={'CHANCE: ' + risk.likelihood}
                        />
                        <a
                          href={`https://checkend.onrender.com/api/downloadPlanFile/${risk.id}`}
                          className='w-1/4 text-center bg-white/10 border-b-4 p-1 uppercase hover:bg-white hover:border-black/80 hover:text-black'  
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          Plano
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppliedChecklistsChart;
