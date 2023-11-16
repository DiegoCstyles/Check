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
  const [lastRiskItems, setLastRiskItems] = useState<RiskItem[]>([]);

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
  const calculateAverages = () => {
    const averages: { [key: string]: { sum: number; count: number }[] } = {
      'Alto Risco': Array.from({ length: 12 }, () => ({ sum: 0, count: 0 })),
      'Medio Risco': Array.from({ length: 12 }, () => ({ sum: 0, count: 0 })),
      'Baixo Risco': Array.from({ length: 12 }, () => ({ sum: 0, count: 0 })),
    };

    riskItems.forEach((risk) => {
      
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
      const riskMonth = new Date(risk.date).getMonth();
    
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

    // Calculate the final averages
    const result = {
      'Alto Risco': averages['Alto Risco'].count
        ? averages['Alto Risco'].sum / averages['Alto Risco'].count
        : 0,
      'Medio Risco': averages['Medio Risco'].count
        ? averages['Medio Risco'].sum / averages['Medio Risco'].count
        : 0,
      'Baixo Risco': averages['Baixo Risco'].count
        ? averages['Baixo Risco'].sum / averages['Baixo Risco'].count
        : 0,
    };

    return result;
  };

  const fetchRiskItems = async () => {
    try {
      const response = await fetch(`https://checkend.onrender.com/api/riskItems`);

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
            data: averages['Alto Risco'].map((data) => data.count),
            borderColor: 'rgb(255, 255, 255)',
            borderWidth: 2,
          },
          {
            label: 'Medio Risco',
            data: averages['Medio Risco'].map((data) => data.count),
            borderColor: 'rgb(0, 50, 255)',
            borderWidth: 2,
          },
          {
            label: 'Baixo Risco',
            data: averages['Baixo Risco'].map((data) => data.count),
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
  }, [riskItems]);

  useEffect(() => {
    fetchLastRiskItems();
    fetchRiskItems();
  }, []);

  return (
    <>
      <div className='w-full'>
        <h1 className='bg-cyan-300 border text-black flex justify-center border-b p-2 text-sm uppercase font-semibold'>Home</h1>
        <div className='flex flex-row'>
          <div className='w-1/3 bg-black/10 border'>
            <section className='text-center text-sm text-cyan-300 border-b-4 bg-slate-500/30'>Ultimos checklists Criados</section>
            <ul className='text-slate-400 mb-1 p-5'>
              <div className='flex border-b-2 justify-center text-xs text-white'>
                <li className='text-center mr-2 w-32 px-2 py-1 '>Titulo</li>
                <li className='text-center mr-2 w-32 px-2 py-1 '>Descrição</li>
              </div>
              {lastRiskItems.map((risk) => (
                <li key={risk.id}>
                  <div className='flex justify-center text-center'>
                    <p className='text-center mr-2 w-32 px-2 py-1 text-xs '> {risk.title} </p>
                    <p className='text-center mr-2 w-32 px-2 py-1 text-xs 0'> {risk.description} </p>
                  </div>
                </li>
              ))}
            </ul>
            <section className='text-center text-sm text-cyan-300 border-b-4 bg-slate-500/30 '>Resumo de uso diario</section>
            <canvas ref={canvasRef} id="lineGraph" width="400" height="200"></canvas>
            <section className='text-center text-sm text-cyan-300 border-b-4 bg-slate-500/30 '>Historico de checklists</section>
            <ul className='text-slate-400 mb-1 p-5'>
              <div className='flex border-b-2 justify-center text-xs text-white'>
                <li className='text-center mr-2 w-32 px-2 py-1'>Titulo</li>
                <li className='text-center mr-2 w-32 px-2 py-1'>Impacto</li>
                <li className='text-center w-32 px-2 py-1'>Chance</li>
              </div>
              {riskItems.map((risk) => (
                <li key={risk.id}>
                  <div className='flex justify-center text-center'>
                    <p className='text-center mr-2 w-32 px-2 py-1 text-xs'> {risk.title} </p>
                    <p className='text-center mr-2 w-32 px-2 py-1 text-xs 0'> {risk.impact} </p>
                    <p className='text-center w-32 px-2 py-1 text-xs'> {risk.likelihood} </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className='w-1/3 bg-black/10 border'>
            <section className='text-center text-sm text-cyan-300 border-b-4 bg-slate-500/30'>Insights</section>
            <section className='text-center text-sm text-cyan-300 border-b-4 bg-slate-500/30 '>APIs</section>
          </div>
          <div className='w-1/3 bg-black/10 border'>
            <section className='text-center text-sm text-cyan-300 border-b-4 bg-slate-500/30'>Insights</section>
            <section className='text-center text-sm text-cyan-300 border-b-4 bg-slate-500/30 '>APIs</section>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Navbar);
