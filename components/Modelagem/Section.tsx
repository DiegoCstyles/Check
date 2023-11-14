"use client";
import { useEffect, useRef, useState }  from 'react';
import { RiskItem } from './models';
import { NewsDisplay } from '@/components'
import { memo } from 'react';
import Chart from 'chart.js/auto';

let existingChart: { destroy: () => void; }; // Declare the variable outside the component function

const Navbar = () => {
  const [riskItems, setRiskItems] = useState<RiskItem[]>([]);
  const [lastRiskItems, setLastRiskItems] = useState<RiskItem[]>([]);

  const lineGraphData = {
    labels: ['Jan', 'Feb', 'Mar', 'Abr', 'Mai'],
    datasets: [
      {
        label: 'Alto Risco',
        data: [10, 20, 15, 30, 25], // Sample data for the line graph
        borderColor: 'rgb(255, 255, 255)',
        borderWidth: 2,
      },
      {
        label: 'Baixo Risco',
        data: [15, 10, 5, 20, 30], // Sample data for the line graph
        borderColor: 'rgb(0, 174, 255)',
        borderWidth: 2,
      },
    ],
  };

  const fetchRiskItems = async () => {
    try {
      const response = await fetch(`https://checkend.onrender.com/api/riskItems`);

      if (response.ok) {
        const data = await response.json();
        setRiskItems(data); // Update the riskItems state with the fetched data
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
        setLastRiskItems(data); // Update the riskItems state with the fetched data
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
      // Create a new Chart.js chart
      existingChart = new Chart(ctx, {
        type: 'line',
        data: lineGraphData,
        options: {
          color: 'white',
        },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchLastRiskItems();
    fetchRiskItems(); // Fetch risk items when the component mounts  
  },);

    return (
      <>
      <div className=''>
        <h1 className='bg-cyan-300 border text-black flex justify-center border-b p-2 text-sm uppercase font-semibold'>Home</h1>
        <div className='border mx-48 mt-2 flex'>
          
          <div className=' bg-black/10 m-2 border w-1/3'>
            
            <section className='text-center text-sm text-cyan-300 border-b-4 bg-slate-500/30'>Ultimos checklists Criados
            
            </section>
            <ul className='text-slate-400 mb-1 p-5'>
            {lastRiskItems.map((risk) => (
              <li key={risk.id}>
                <div className='flex justify-center text-center'>
                  <p
                    className='text-center mr-2 w-32 px-2 py-1 text-xs '
                  >{risk.title}</p>
                    <p
                    className='text-center mr-2 w-32 px-2 py-1 text-xs 0'
                  >{risk.impact}</p>                
                  <p
                    className='text-center w-32 px-2 py-1 text-xs '
                  >{risk.likelihood}</p>  
                </div>
              </li>
            ))}
            </ul>
            <section className='text-center text-sm text-cyan-300 border-b-4 bg-slate-500/30 '>Resumo de uso diario</section>
            <canvas  ref={canvasRef} id="lineGraph" width="400" height="200"></canvas>
            <section className='text-center text-sm text-cyan-300 border-b-4 bg-slate-500/30 '>Historico de checklists</section>
            <ul className='text-slate-400 mb-1 p-5'>
            {riskItems.map((risk) => (
              <li key={risk.id}>
                <div className='flex justify-center text-center'>
                  <p
                    className='text-center mr-2 w-32 px-2 py-1 text-xs '
                  >{risk.title}</p>
                    <p
                    className='text-center mr-2 w-32 px-2 py-1 text-xs 0'
                  >{risk.impact}</p>                
                  <p
                    className='text-center w-32 px-2 py-1 text-xs '
                  >{risk.likelihood}</p>  
                </div>
              </li>
            ))}
            </ul>
          </div>
          <div className=' bg-black/10 m-2 w-1/3 border'>
            <h2 className='text-center text-sm text-cyan-300 border-b-4 bg-slate-500/30'>Insights</h2>
            
          </div>
          <div className=' bg-black/10 m-2 w-1/3 border'>
            <h2 className='text-center text-sm text-cyan-300 border-b-4 bg-slate-500/30'>Insights</h2>
            
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(Navbar)
