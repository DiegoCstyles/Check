"use client";
import { useState, memo } from 'react';
import { HomeSection, CadastrosSection, PlanosAcaoSection, RelatoriosSection } from '@/components';

const Navbar = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const handlePageChange = (page: string) => { setCurrentPage(page); };

  return (
    <nav className='w-full flex'>
      <div className="flex flex-col w-20 h-full bg-white/10 transition-opacity duration-300 hover:opacity-100 hover:w-40 group  opacity-60">
        <p className="p-2 m-1 text-center dark:text-cyan-300 font-black text-base tracking-tight">CHECK.</p>
        <div className='group-hover:visible invisible '>
          <div
            className={`flex items-center p-2 border-b-4 text-white text-sm ${currentPage === 'home' ? 'bg-white/50' : ''}`}
            onClick={() => handlePageChange('home')}
          >
            <span className="group-hover:visible group-hover:w-24 w-0 invisible text-xs ml-2">Home</span>
            {/* Checklist icon */}
            <div className='grow '></div><svg className="w-5 h-6 mr-1 visible" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 9h12l3-9M9 19V9m6 10V9" /></svg><div className='grow '></div>
          </div>

          <div
            className={`flex items-center p-2 border-b-4 text-white text-sm ${currentPage === 'cadastros' ? 'bg-white/50 ' : ''}`}
            onClick={() => handlePageChange('cadastros')}
          >
            <span className="group-hover:visible group-hover:w-24 w-0 invisible text-xs ml-2 ">Cadastros</span>
            <div className='grow '></div> <svg className="w-5 h-6 mr-1 visible flex items-center justify-center " fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 10h-4a1 1 0 00-1 1v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5a1 1 0 00-1-1H3" />
            </svg> <div className='grow '></div>
          </div>
          
          <div
            className={`flex items-center p-2 border-b-4 text-white text-sm ${currentPage === 'planos de ação' ? 'bg-white/50' : ''}`}
            onClick={() => handlePageChange('planos de ação')}
          >
            <span className="group-hover:visible group-hover:w-24 w-0 invisible text-xs ml-2">Planos de Ação</span>
            <div className='grow '></div><svg className="w-5 h-6 mr-1 visible" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg><div className='grow '></div>
          </div>
          
          <div
            className={`flex items-center p-2 border-b-4 text-white text-sm ${currentPage === 'relatorios' ? 'bg-white/50' : ''}`}
            onClick={() => handlePageChange('relatorios')}
          >
            <span className="group-hover:visible group-hover:w-24 w-0 invisible text-xs ml-2">Relatórios</span>
            <div className='grow '></div> <svg className="w-5 h-6 mr-1 visible" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 6H8a2 2 0 00-2 2v11a2 2 0 002 2h13a2 2 0 002-2V8a2 2 0 00-2-2z" />
            </svg> <div className='grow '></div>
          </div>

          <div className='grow '></div>
           <div
            className={`flex items-center p-2 border-b-4 text-white text-sm ${currentPage === 'sair' ? 'bg-white/50' : ''}`}
            onClick={() => handlePageChange('sair')}
            style={{ order: 9999 }} 
          >
            <span className="group-hover:visible group-hover:w-24 w-0 invisible text-xs ml-2">Sair</span>
            <div className='grow '></div><svg className="w-5 h-6 mr-1 visible" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg><div className='grow '></div>
          </div>
          
        </div>
      </div>
      
      {currentPage === 'home' && <HomeSection />} {currentPage === 'cadastros' && <CadastrosSection />}
      {currentPage === 'planos de ação' && <PlanosAcaoSection />} {currentPage === 'relatorios' && <RelatoriosSection />}
      {currentPage === 'sair' && <PlanosAcaoSection />}
  
    </nav>
  );
};

export default memo(Navbar);
