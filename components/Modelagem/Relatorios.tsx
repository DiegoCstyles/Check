"use client";
import React, { useEffect, useState } from 'react'; import { Bar, PolarArea, Bubble } from 'react-chartjs-2';
import { AppliedChecklist, RiskItem } from './models';
import Modal from './Modal'; 

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

type ResultCounts = {
  "não avaliado": number;
  "sem resultados": number;
  "parcial": number;
  "efetivo": number;
};

function getMonthYearFromDate(dateString: string) {
  const date = new Date(dateString);
  const month = date.getMonth() + 1; // Months are 0-based, so we add 1
  const year = date.getFullYear();
  return `${year}-${month.toString().padStart(2, '0')}`;
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
  const [itemRiskApproved, setitemRiskApproved] = useState<RiskItem[]>([]);
  const [itemRiskReproved, setitemRiskReproved] = useState<RiskItem[]>([]);
  const [AppliedChecklists, setAppliedChecklists] = useState<AppliedChecklist[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [userNames, setUserNames] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  const openModal = () => { setModalOpen(true); }; 
  const closeModal = () => { setModalOpen(false); };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSelectedMonth = event.target.value;
    setSelectedMonth(newSelectedMonth);
  };

  const [chartDataUserRanking, setChartDataUserRanking] = useState<ChartData>({
    labels: [],
    datasets: [{
      label: 'Ranking de usuarios aplicadores',
      data: [],
      borderWidth: 1,
      backgroundColor: 'rgb(103, 232, 149)',
    }],
  });
  
  const [chartDataResults, setChartDataResults] = useState<ChartData>({
  labels: [],
  datasets: [
    {
      label: 'Avaliações do mês',
      data: [],
      borderWidth: 1,
      backgroundColor: 'rgb(153, 132, 249)',
    },
  ],
});


  const addresultToBackend = async (checklistId: string, results: string) => {
    try {
      const response = await fetch(`https://checkend.onrender.com/api/updateChecklistResults/${checklistId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ results }),
      });

      if (response.ok) {
        openModal();
      } else {
        console.error('Error submitting results');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }; 

  const fetchAppliedChecklists = async () => {
      try {
        const response = await fetch(`https://checkend.onrender.com/api/getAppliedChecklists`);
        if (response.ok) {
          const data = await response.json(); setAppliedChecklists(data); // Update the riskItems state with the fetched data
        } else { console.error('Error fetching risk item from the database'); }
      } catch (error) { console.error('Error:', error); }
    };
  
  const handleSubmeter = async (checklistId: string, results: string) => {
    try {
      // Your existing code for submitting results
      await addresultToBackend(checklistId, results);

      // After successful submission, refetch data
      await fetchAppliedChecklists();
    } catch (error) {
      console.error('Error submitting results and fetching data:', error);
    }
  };

  useEffect(() => {
    const fetchRiskItemApproved = async () => {
      try {
        const response = await fetch(`https://checkend.onrender.com/api/riskItemsLastApproval`);
        if (response.ok) {
          const data = await response.json(); setitemRiskApproved(data); // Update the riskItems state with the fetched data
        } else { console.error('Error fetching risk item from the database'); }
      } catch (error) { console.error('Error:', error); }
    };

    const fetchRiskItemReproved = async () => {
      try {
        const response = await fetch(`https://checkend.onrender.com/api/riskItemsLastReproval`);
        if (response.ok) {
          const data = await response.json(); setitemRiskReproved(data); // Update the riskItems state with the fetched data
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
        
        const names: string[] = usersInfo.map((user) => user.name);
        setUserNames(names);
        
        const checklists: AppliedChecklist[] | null = await getChecklists();

        const filteredChecklists = checklists.filter(
          (checklist: AppliedChecklist) =>
            getMonthYearFromDate(checklist.dateapplied) === selectedMonth
        );
        console.log('filteredChecklists', filteredChecklists);
        
         if (usersInfo && checklists) {
          const filteredChecklists = checklists.filter(
            (checklist: AppliedChecklist) =>
              getMonthYearFromDate(checklist.dateapplied) === selectedMonth
          );
           
          const counts = names.map((userName) => {
            const userId = usersInfo.find((user) => user.name === userName)?.id;
            if (userId) {
              const userChecklists = filteredChecklists.filter((checklist: AppliedChecklist) => checklist.user_id === userId);
              const count = userChecklists.length;
              return count;
            }
            return 0;
          });

          setChartDataUserRanking({
            labels: names,
            datasets: [{
              label: 'Ranking de usuarios aplicadores',
              data: counts,
              borderWidth: 1,
              backgroundColor: 'rgb(103, 232, 149)',
            }], 
          });

           // Update counts for each result
          const resultCounts = filteredChecklists.reduce((counts, checklist) => {
            const resultValue = checklist.results.toLowerCase();
            if (resultValue === "não avaliado" || resultValue === "sem resultados" || resultValue === "parcial" || resultValue === "efetivo") {
              counts[resultValue as keyof ResultCounts] = (counts[resultValue as keyof ResultCounts] || 0) + 1;
            }
            return counts;
          }, {} as ResultCounts);

           // Access counts for each result
          const countNaoAvaliado = resultCounts["não avaliado"] || 0;
          const countSemResultados = resultCounts["sem resultados"] || 0;
          const countParcial = resultCounts["parcial"] || 0;
          const countEfetivo = resultCounts["efetivo"] || 0;

          setChartDataResults({
            labels: ['Nao Avaliado', 'Sem Resultados', 'Parcial', 'Efetivo'],
            datasets: [
              {
                label: 'Avaliações do mês',
                data: [countNaoAvaliado, countSemResultados, countParcial, countEfetivo],
                borderWidth: 1,
                backgroundColor: 'rgb(153, 132, 249)',
              },
            ],
          });

        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
    fetchRiskItemApproved();
    fetchRiskItemReproved();
    fetchAppliedChecklists();
  }, [selectedMonth]); 


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
          <div className="chart-container bg-black/10 mt-2 flex flex-row justify-between" style={{ width: '400px', height: '225px' }}>
            <div className="text-black uppercase text-sm">
              <p className="p-1 text-center bg-yellow-500 uppercase font-semibold text-black border-b-4 border-black/80">Aplicadores</p>
              {chartDataUserRanking.datasets[0].data.map((value, index) => (
                <p key={index} className="p-1 text-start bg-white border-b-4 border-black/80">
                  {userNames[index]} - {value}
                </p>
              ))}
            </div>
            <div className="text-white text-center flex flex-col text-sm">
               <p className="p-1 bg-yellow-500 uppercase font-semibold text-black border-b-4 border-black/80">Filtros</p>
              <select
                value={selectedMonth}
                onChange={handleMonthChange}
                className="p-1 bg-white/10 border-b-4 border-black/80"
              >
                <option className='bg-black' value="2023-01">Janeiro</option>
                <option className='bg-black' value="2023-02">Fevereiro</option>
                <option className='bg-black' value="2023-03">Março</option>
                <option className='bg-black' value="2023-04">Abril</option>
                <option className='bg-black' value="2023-05">Maio</option>
                <option className='bg-black' value="2023-06">Junho</option>
                <option className='bg-black' value="2023-07">Julho</option>
                <option className='bg-black' value="2023-08">Agosto </option>
                <option className='bg-black' value="2023-09">Setembro </option>
                <option className='bg-black' value="2023-10">Outubro</option>
                <option className='bg-black' value="2023-11">Novembro </option>
                <option className='bg-black' value="2023-12">Dezembro</option>
              </select>
               <p className="p-1 bg-yellow-500 uppercase font-semibold text-black border-b-4 border-black/80">Pontuação</p>
               <p className="p-1 bg-white/10 border-b-4 border-black/80">mínimo</p>
               <p className="p-1 bg-white/10 border-b-4 border-black/80">máximo</p>
            </div> 
            <div className="text-black text-start uppercase flex flex-col text-sm">
               <p className="p-1 text-center bg-yellow-500 uppercase font-semibold text-black border-b-4 border-black/80">Avaliações</p>
               <p className="p-1 bg-white border-b-4 border-black/80">Não avaliado {chartDataResults.datasets[0].data[0]}</p>
               <p className="p-1 bg-white border-b-4 border-black/80">Sem resultados {chartDataResults.datasets[0].data[1]}</p>
               <p className="p-1 bg-white border-b-4 border-black/80">Parcial {chartDataResults.datasets[0].data[2]}</p>
               <p className="p-1 bg-white border-b-4 border-black/80">Efetivo {chartDataResults.datasets[0].data[3]}</p>
            </div> 
          </div>
          <div className="chart-container bg-black/10 mt-2" style={{ width: '400px', height: '225px' }}>
            <Bar
              data={chartDataResults}
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
           </div>
        </div>
         {AppliedChecklists.map((resultAppliedChecklists) => (
          <li key={resultAppliedChecklists.id} style={{ listStyleType: 'none' }}>
            <div className='flex flex-row w-full justify-between text-xs text-center p-0.5'>
              
              <label className='w-1/12 bg-white border-b-4 border-black/80 uppercase font-semibold text-black p-1'>Avaliação do checklist</label>
              <div className='w-2/12 flex flex-col'>
                <label className='bg-black p-0.5'>Codigo de Risco</label>
                <input
                  className='text-center bg-white/10 border-b-4 p-0.5'
                  type='text'
                  value={resultAppliedChecklists.risk_id}
                />
              </div>
              <div className='w-2/12 flex flex-col'>
                <label className='bg-black p-0.5'>Participantes</label>
                <input
                  className='text-center bg-white/10 border-b-4 p-0.5'
                  type='text'
                  value={resultAppliedChecklists.participants}
                />
              </div>
              <div className='w-2/12 flex flex-col'>
                <label className='bg-black p-0.5'>Local</label>
                <input
                  className='text-center bg-white/10 border-b-4 p-0.5'
                  type='text'
                  value={resultAppliedChecklists.location}
                />
              </div>
              <div className='w-2/12 flex flex-col'>
                <label className='bg-black p-0.5'>Pontuação</label>
                <input
                  className='text-center bg-white/10 border-b-4 p-0.5'
                  type='text'
                  value={resultAppliedChecklists.score}
                />
              </div>
              
              <div className='w-fit flex flex-col'>
                <label className='bg-black p-0.5'>Resultados da implementação</label>
                  <select
                    className='bg-white/10 p-0.5'
                    placeholder='selecionar...'
                    value={resultAppliedChecklists.results}
                    onChange={(event) => {
                      const updatedChecklists = AppliedChecklists.map(checklist => {
                        if (checklist.id === resultAppliedChecklists.id) {
                          return {
                            ...checklist,
                            results: event.target.value,
                          };
                        }
                        return checklist;
                      });
                      setAppliedChecklists((prevChecklists) =>
                        prevChecklists.map((checklist) =>
                          checklist.id === resultAppliedChecklists.id
                            ? { ...checklist, results: event.target.value }
                            : checklist
                        )
                      );
                    }}
                  >
                    <option className='bg-black' value="Sem resultados">Sem resultados</option>
                    <option className='bg-black' value="Parcial">Parcial</option>
                    <option className='bg-black' value="Efetivo">Efetivo</option>
                  </select>
                
              </div>
              <button className='w-1/12 border p-1 border-b-4 bg-black hover:bg-white hover:border-black/80 hover:text-black'  
                onClick={() => handleSubmeter(resultAppliedChecklists.id.toString(), resultAppliedChecklists.results)}
              >
                Submeter
              </button>
              <Modal isOpen={isModalOpen} onClose={closeModal}><h2 className="text-sm text-blue bg-white/5">Avaliação concluida!</h2></Modal>
            </div>
          </li>
        ))}
        <div className='w-full bg-yellow-500 uppercase font-semibold text-black p-1 mt-2'>Ultimos Checklists</div>
        <div className='flex flex-row border-t-4 w-full h-full'>
          <div className='flex flex-col w-1/2 pr-1'>
            <div className='h-1/6 bg-black uppercase font-semibold p-1.5 flex justify-center mt-2'>❌ Reprovado</div>
            <div className='h-5/6 bg-red-500/50 p-1 m-1.5'>
              {itemRiskReproved.map((riskR) => (
                  <li key={riskR.id} style={{ listStyleType: 'none' }}>
                    <div className='flex flex-col justify-between text-xs text-center p-0.5'>
                      <input
                        className='w-full text-center bg-white/10 border-b-4 p-1.5'
                        type='text'
                        value={riskR.title}
                      />
                      <p className='w-full text-center bg-black uppercase font-semibold text-white p-1'>Responsável</p>
                      <div className="flex flex-row">
                        <input
                          className='w-1/2 text-center bg-white/10 border-b-4 p-1 uppercase font-semibold'
                          type='text'
                          value={'Checklist: ' + riskR.responsiblechecklist}
                        />
                        <input
                          className='w-1/2 text-center bg-white/10 border-b-4 p-1 uppercase font-semibold'
                          type='text'
                          value={'Plano: ' + riskR.responsibleplan}
                        />
                      </div>
                      <div className="flex flex-row w-full">
                        <p className='w-1/5 text-center flex items-center justify-center bg-white border-b-4 border-black/80 uppercase font-semibold text-black p-0.5'>Descrição</p>
                        <textarea 
                          className='bg-black border-b-4 p-2 pb-6 w-4/5'
                          value={riskR.description} 
                        /> 
                      </div>
                      <div className="flex flex-row w-full">
                        <p className='w-1/5 text-center flex items-center justify-center bg-white border-b-4 border-black/80 uppercase font-semibold text-black p-0.5'>Plano de mitigação</p>
                        <textarea 
                          className='bg-black border-b-4 p-2 pb-7 w-4/5'
                          value={riskR.plandescription} 
                        /> 
                      </div>
                      <div className="flex flex-row">
                        <input
                          className='w-1/4 text-center bg-yellow-500 text-black border-b-4 p-1 uppercase font-semibold'
                          type='text'
                          value={formatDate(riskR.date)}
                        />
                        <input
                          className='w-1/4 text-center bg-white/10 border-b-4 p-1'
                          type='text'
                          value={'IMPACTO: ' + riskR.impact}
                        />
                        <input
                          className='w-1/4 text-center bg-white/10 border-b-4 p-1'
                          type='text'
                          value={'CHANCE: ' + riskR.likelihood}
                        />
                        <a
                          href={`https://checkend.onrender.com/api/downloadPlanFile/${riskR.id}`}
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
          <div className='flex flex-col w-1/2 pl-1'>
            <div className='h-1/6 bg-black uppercase font-semibold p-1.5 flex justify-center mt-2'>✔ Aprovado</div>
            <div className='h-5/6 bg-green-500/50 p-1 m-1.5'>
              {itemRiskApproved.map((riskA) => (
                  <li key={riskA.id} style={{ listStyleType: 'none' }}>
                    <div className='flex flex-col justify-between text-xs text-center p-0.5'>
                      <input
                        className='w-full text-center bg-white/10 border-b-4 p-1.5'
                        type='text'
                        value={riskA.title}
                      />
                      <p className='w-full text-center bg-black uppercase font-semibold text-white p-1'>Responsável</p>
                      <div className="flex flex-row">
                        <input
                          className='w-1/2 text-center bg-white/10 border-b-4 p-1 uppercase font-semibold'
                          type='text'
                          value={'Checklist: ' + riskA.responsiblechecklist}
                        />
                        <input
                          className='w-1/2 text-center bg-white/10 border-b-4 p-1 uppercase font-semibold'
                          type='text'
                          value={'Plano: ' + riskA.responsibleplan}
                        />
                      </div>
                      <div className="flex flex-row w-full">
                        <p className='w-1/5 text-center flex items-center justify-center bg-white border-b-4 border-black/80 uppercase font-semibold text-black p-0.5'>Descrição</p>
                        <textarea 
                          className='bg-black border-b-4 p-2 pb-6 w-4/5'
                          value={riskA.description} 
                        /> 
                      </div>
                      <div className="flex flex-row w-full">
                        <p className='w-1/5 text-center flex items-center justify-center bg-white border-b-4 border-black/80 uppercase font-semibold text-black p-0.5'>Plano de mitigação</p>
                        <textarea 
                          className='bg-black border-b-4 p-2 pb-7 w-4/5'
                          value={riskA.plandescription} 
                        /> 
                      </div>
                      <div className="flex flex-row">
                        <input
                          className='w-1/4 text-center bg-yellow-500 text-black border-b-4 p-1 uppercase font-semibold'
                          type='text'
                          value={formatDate(riskA.date)}
                        />
                        <input
                          className='w-1/4 text-center bg-white/10 border-b-4 p-1'
                          type='text'
                          value={'IMPACTO: ' + riskA.impact}
                        />
                        <input
                          className='w-1/4 text-center bg-white/10 border-b-4 p-1'
                          type='text'
                          value={'CHANCE: ' + riskA.likelihood}
                        />
                        <a
                          href={`https://checkend.onrender.com/api/downloadPlanFile/${riskA.id}`}
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
