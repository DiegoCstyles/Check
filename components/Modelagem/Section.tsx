"use client";
import React, { useEffect, useRef, useState } from 'react';
import { memo } from 'react';
import { RiskItem } from './models';
import Chart from 'chart.js/auto';
// Import the necessary component
import axios from 'axios';
import { NewsDisplay } from '@/components';

let existingChart: { destroy: () => void; }; // Declare the variable outside the component function

const Navbar = () => {
  const [riskItems, setRiskItems] = useState<RiskItem[]>([]);
  const [riskItemsUsage, setRiskItemsUsage] = useState<RiskItem[]>([]);
  const [lastRiskItems, setLastRiskItems] = useState<RiskItem[]>([]);
  const [scenario, setScenario] = useState<string | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null); // New state for the selected risk
  const [inputValue, setInputValue] = useState<string>('');
  
  // Define the function to convert Kelvin to Celsius
  const convertKelvinToCelsius = (kelvin: number | undefined) => {
  if (kelvin === undefined) {
    return 'N/A'; // or handle the case when kelvin is undefined
  }
  return (kelvin - 273.15).toFixed(2);
  };

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    rain?: {
      '3h': number;
    };
    sys: {
      pod: string;
    };
    dt_txt: string;
  }[];
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
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=pt_br`;
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

  const generateScenario = async (riskData: any, inputValue: string) => {
    try {
      const response = await axios.post('https://checkend.onrender.com/api/generateScenario', {
        riskData,
        inputValue, // Pass the inputValue in the request
      });
      // Handle the generated scenario as needed
      return response.data;
    } catch (error) {
      console.error('Error generating scenario:', error);
      return 'Error generating scenario.';
    }
  };


  const fetchRiskItems = async (itemsPerPage = 4): Promise<RiskItem[]> => {
    try {
      const response = await fetch(`https://checkend.onrender.com/api/riskItems?itemsPerPage=${itemsPerPage}`);

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error('Error fetching risk items from the database');
        return []; 
      }
    } catch (error) {
      console.error('Error:', error);
      return []; 
    }
  };
  
  const fetchRiskItemsUsage = async () => {
    try {
      const response = await fetch(`https://checkend.onrender.com/api/riskItemsUsage`);
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

  // Update the selected risk when the <select> value changes
  const handleRiskSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    console.log('Selected Risk:', selectedValue);
    setSelectedRisk(selectedValue);
  };

  // Function to format date
  const formatDate = (dt_txt: string) => {
    const date = new Date(dt_txt);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
  };

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
  const fetchData = async () => {
    try {
      // Fetch the last risk items
      await fetchLastRiskItems();
      await fetchRiskItemsUsage();
      // Fetch weather data
      await fetchWeatherData();

      // Fetch risk items data
      const riskItemsData = await fetchRiskItems(8);
      setRiskItems(riskItemsData); // Now it's safe to set the state with the data

      // Filter riskItemsData based on the selectedRisk value
      const selectedRiskData = riskItemsData.filter((risk) => risk.id.toString() === selectedRisk);

      // Generate scenarios based on risk data
      const scenarioPromises = selectedRiskData.map(async (risk) => {
        const scenarioResult = await generateScenario(risk, inputValue);
        return scenarioResult;
      });

      // Wait for all scenarios to resolve
      const scenarios = await Promise.all(scenarioPromises);

      // Use the first scenario (you might want to handle multiple scenarios differently)
      const selectedScenario = scenarios[0];
      const formattedScenario = selectedScenario.replace(/\./g, '.\n');

      // Set the scenario state
      setScenario(formattedScenario);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData(); // Trigger fetchData when selectedRisk changes
}, [selectedRisk]);

  return (
      <div className='w-full h-screen border' style={{ overflowX: 'hidden' }}>
        <h1 className='bg-cyan-300 border text-black flex justify-center border-b p-2 text-sm uppercase font-semibold'>Home</h1>
        
        <div className="flex flex-row h-1/2">
          <div className='w-1/3 bg-black/10 border'>
            <section className='text-center text-sm text-cyan-300 border-b-4 bg-slate-500/30 p-1.5 uppercase'>Insights 🌦</section>
            {weatherData && weatherData.list && (
              <div className="p-5 text-start bg-white/10 h-full">
                <p className="text-white p-1">Cidade: Lorena</p>
                {weatherData.list.map((forecast, index) => (
                  <div key={index}>
                    <p className="text-white p-1">Data: {formatDate(forecast.dt_txt)}</p>
                    <p className="text-white p-1">Estado do tempo: {forecast.weather[0]?.description}</p>
                    <p className="text-white p-1">Umidade: {forecast.main?.humidity} g/m³</p>
                    <p className="text-white p-1">Temperatura: {convertKelvinToCelsius(forecast.main?.temp)} °C</p>
                  </div>
                ))}
              </div>
            )}
            {weatherData && (
              <div className="p-5 text-start bg-white/10 h-full">
                <p className="text-white p-1">Cidade: Lorena</p>
                {weatherData.list.map((forecast, index) => (
                  <div key={index}>
                    <p className="text-white p-1">Data: {new Date(forecast.dt * 1000).toLocaleDateString()}</p>
                    <p className="text-white p-1">Estado do tempo: {forecast.weather[0]?.description}</p>
                    <p className="text-white p-1">Umidade: {forecast.main?.humidity} g/m³</p>
                    <p className="text-white p-1">Temperatura: {convertKelvinToCelsius(forecast.main?.temp)} °C</p>
                    {/* Add more weather details as needed */}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className='w-2/3 bg-black/10 border'>
            <section className='text-center text-sm text-cyan-300 border-b-4 bg-slate-500/30  p-1.5 uppercase'>Assistente</section>
              <p className="h-full text-white text-xs bg-black text-justify p-3">
                {scenario  && (
                  <ul className="text-black font-semibold h-60 bg-white/90 border-t-4 p-2">
                    {scenario.split(/•|-/).map((item, index) => (
                      <li key={index}>{item.trim()}</li>
                    ))}
                  </ul>
                )}
                <div className='flex flex-row w-full'>
                  <select
                    className='bg-white/10 border-b-4 mt-3 p-1 w-1/3'
                    value={selectedRisk || ''}
                    onChange={handleRiskSelectChange} // Update the selected risk on change
                  >
                    {riskItems.map((risk) => (
                      <option className='bg-black border-b-4' key={risk.id} value={risk.id.toString()}>
                        {risk.title}
                      </option>
                    ))}
                  </select>
                  <input
                    className='mt-3 text-black p-2 w-full bg-white/80 w-2/3'
                    type='text'
                    placeholder='Pergunte sobre o risco...'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)} 
                  />
                </div>
              </p>
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
