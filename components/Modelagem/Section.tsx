"use client";
import React, { useEffect, useRef, useState } from 'react';
import { memo } from 'react';
import { RiskItem } from './models';
import Chart from 'chart.js/auto';
// Import the necessary component
import { NewsDisplay } from '@/components';

let existingChart: { destroy: () => void; }; // Declare the variable outside the component function

const Navbar = () => {
  const [riskItems, setRiskItems] = useState<RiskItem[]>([]);
  const [riskItemsUsage, setRiskItemsUsage] = useState<RiskItem[]>([]);
  const [lastRiskItems, setLastRiskItems] = useState<RiskItem[]>([]);

  interface WeatherData {
    name?: string;
    main?: {
      temp?: number;
    };
    // Add more properties as needed
  }

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
  const calculateAverages = () => {
    // Check if riskItems is empty
    if (riskItemsUsage.length === 0) {
      return {
        altoRiscoCounts: [],
        medioRiscoCounts: [],
        baixoRiscoCounts: [],
      };
    }
    const averages = {
      'Alto Risco': Array.from({ length: 12 }, () => ({ sum: 0, count: 0 })),
      'Medio Risco': Array.from({ length: 12 }, () => ({ sum: 0, count: 0 })),
      'Baixo Risco': Array.from({ length: 12 }, () => ({ sum: 0, count: 0 })),
    };

    riskItemsUsage.forEach((risk) => {
      
      const likelihoodMap: { [key: string]: number } = {
        "Pequena": 5,
        "Media": 10,
        "Alta": 15,
      };
      
      const ImpactMap: { [key: string]: number } = {
        "Pequeno": 10,
        "Medio": 20,
        "Alto": 30,
      };
      
      // Convert from string to number using the mapping
      const likelihoodValue = likelihoodMap[risk.likelihood] || 0;
      const impactValue = ImpactMap[risk.impact] || 0;
      const riskMonth = new Date(risk.date.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1')).getMonth();
    
      const average = (impactValue + likelihoodValue) / 2;

      if (average >= 19) {
        averages['Alto Risco'][riskMonth].sum += average;
        averages['Alto Risco'][riskMonth].count += 1;
      } else if (average >= 13) {
        averages['Medio Risco'][riskMonth].sum += average;
        averages['Medio Risco'][riskMonth].count += 1;
      } else {
        averages['Baixo Risco'][riskMonth].sum += average;
        averages['Baixo Risco'][riskMonth].count += 1;
      }
    });
    
  const altoRiscoCounts = averages['Alto Risco'].map(data => data.count);
  const medioRiscoCounts = averages['Medio Risco'].map(data => data.count);
  const baixoRiscoCounts = averages['Baixo Risco'].map(data => data.count);

  return { altoRiscoCounts, medioRiscoCounts, baixoRiscoCounts };
  };

  // Fetch weather data
  const fetchWeatherData = async () => {
    const apiKey = '8a94c31dec76eddbdd1b3618ea56e043';
    const city = 'Lorena'; // Replace with the desired city
    const apiUrl = `https://api.openweathermap.org/data/3.0/weather?q=${city}&appid=${apiKey}&lang=pt_br`;
    console.log('url: ',apiUrl);
    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
      } else {
        console.error('Error fetching weather data:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchRiskItems = async (itemsPerPage = 4) => {
    try {
      const response = await fetch(`https://checkend.onrender.com/api/riskItems?itemsPerPage=${itemsPerPage}`);

      if (response.ok) {
        const data = await response.json();
        setRiskItems(data);
      } else {
        console.error('Error fetching risk items from the database');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchRiskItemsUsage = async () => {
    try {
      console.log('here on the before fetch');
      const response = await fetch(`https://checkend.onrender.com/api/riskItemsUsage`);
      console.log('here on the after fetch');
      if (response.ok) {
        const data = await response.json();
        setRiskItemsUsage(data);
      } else {
        console.error('Error fetching risk items usage from the database');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchLastRiskItems = async () => {
    try {
      const response = await fetch(`https://checkend.onrender.com/api/lastRiskItems`);

      if (response.ok) {
        const data = await response.json();
        setLastRiskItems(data);
      } else {
        console.error('Error fetching risk items from the database');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Set type for ref

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    // Check if there's an existing chart and destroy it
    if (existingChart) {
      existingChart.destroy();
    }
    if (ctx) {
      const averages = calculateAverages();
      
      // Create a new Chart.js chart
      const lineGraphData = {
        labels: monthLabels,
        datasets: [
          {
            label: 'Alto Risco',
            data: averages.altoRiscoCounts,
            borderColor: 'rgb(255, 0, 0)',
            borderWidth: 2,
          },
          {
            label: 'Medio Risco',
            data: averages.medioRiscoCounts,
            borderColor: 'rgb(255, 165, 0)',
            borderWidth: 2,
          },
          {
            label: 'Baixo Risco',
            data: averages.baixoRiscoCounts,
            borderColor: 'rgb(0, 174, 255)',
            borderWidth: 2,
          },
        ],
      };

      existingChart = new Chart(ctx, {
        type: 'line',
        data: lineGraphData,
        options: { color: 'white' },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [riskItemsUsage]);

  useEffect(() => {
    fetchLastRiskItems();
    fetchRiskItemsUsage();
    fetchRiskItems(4);
    fetchWeatherData();
  }, []);

  return (
      <div className='w-full h-screen border' style={{ overflowX: 'hidden' }}>
        <h1 className='bg-cyan-300 border text-black flex justify-center border-b p-2 text-sm uppercase font-semibold'>Home</h1>
        
        <div className="flex flex-row h-1/2">
          <div className='w-1/2 bg-black/10 border'>
            <section className='text-center text-sm text-cyan-300 border-b-4 bg-slate-500/30 p-1.5 uppercase'>Insights</section>
            {weatherData && (
              <div className="p-5">
                <p className="text-white">City: {weatherData.name}</p>
                <p className="text-white">Temperature: {weatherData.main?.temp} °C</p>
                {/* Add more weather details as needed */}
              </div>
            )}
          </div>
          <div className='w-1/2 bg-black/10 border'>
            <section className='text-center text-sm text-cyan-300 border-b-4 bg-slate-500/30  p-1.5 uppercase'>Insights</section>
          </div>
        </div>
        
          <div className='flex flex-row bg-black/10 border justify-between h-1/2'>
            <section className='text-center text-sm text-cyan-300 border-b-4 bg-slate-500/30'>
              <h1 className='text-center p-1.5 text-xs text-black uppercase font-semibold text-black bg-yellow-500'>Ultimos checklists Criados</h1>
              <ul className='text-slate-400 mb-1 p-5'>
                <div className='flex border-b-2 justify-center text-xs text-white'>
                  <li className='text-center mr-2 w-32 px-2 py-1 '>Titulo</li>
                  <li className='text-center mr-2 w-32 px-2 py-1 '>Descrição</li>
                </div>
                {lastRiskItems.map((risk) => (
                  <li key={risk.id}>
                    <div className='flex justify-center text-center'>
                      <p className='text-center mr-2 w-32 px-2 py-1 text-xs bg-black/10'> {risk.title} </p>
                      <p className='text-center mr-2 w-32 px-2 py-1 text-xs 0 bg-black/10'> {risk.description} </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
            <section className='text-center text-sm text-cyan-300 border-b-4 bg-slate-500/30 w-full'>
              <h1 className='text-center p-1.5 text-xs text-black uppercase font-semibold text-black bg-yellow-500'>Resumo de riscos anuais</h1>
              <canvas ref={canvasRef} id="lineGraph" width="400" height="200"></canvas>
            </section>
            <section className='text-center text-sm text-cyan-300 border-b-4 bg-slate-500/30'>
              <h1 className='text-center p-1.5 text-xs text-black uppercase font-semibold text-black bg-yellow-500'>Historico de checklists</h1>
              <ul className='text-slate-400 mb-1 p-5'>
                <div className='flex border-b-2 justify-center text-xs text-white'>
                  <li className='text-center mr-2 w-32 px-2 py-1'>Titulo</li>
                  <li className='text-center mr-2 w-32 px-2 py-1'>Impacto</li>
                  <li className='text-center w-32 px-2 py-1'>Chance</li>
                </div>
                {riskItems.map((risk) => (
                  <li key={risk.id}>
                    <div className='flex justify-center text-center'>
                      <p className='text-center mr-2 w-32 px-2 py-1 text-xs bg-black/10'> {risk.title} </p>
                      <p className='text-center mr-2 w-32 px-2 py-1 text-xs 0 bg-black/10'> {risk.impact} </p>
                      <p className='text-center w-32 px-2 py-1 text-xs bg-black/10'> {risk.likelihood} </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        
      </div>
  );
};

export default memo(Navbar);
