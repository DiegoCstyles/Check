import React, { useState, useEffect} from 'react';
import { RiskItem } from './models';
import Modal from './Modal'; // Import the modal component

const ActionPlanConfirmation = () => {
  const [riskItems, setRiskItems] = useState<RiskItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<string>(''); // State for approval status
  const [searchInput, setSearchInput] = useState<string>('');

  const openModal = () => { setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); };

  const fetchRiskItems = async (itemsPerPage = 3) => {
    try {
      const response = await fetch(`https://checkend.onrender.com/api/riskItems?page=${currentPage}&itemsPerPage=${itemsPerPage}`);

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

  const approveRiskItem = async (riskId: number) => {
    try {
      const response = await fetch(`https://checkend.onrender.com/api/approveRiskItem/${riskId}`, {
        method: 'POST',
      });

      if (response.ok) {
        // Assuming the server responds with updated risk data
        const data = await response.json();
        openModal();
        setApprovalStatus('aprovado'); // Set the approval status to 'aprovado'
        setRiskItems((prevRiskItems) =>
          prevRiskItems.map((risk) =>
            risk.id === riskId ? { ...risk, planApproval: 'aprovado' } : risk
          ).filter((risk) => risk.id !== riskId)
        );
      } else {
        console.error('Error approving risk item');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const rejectRiskItem = async (riskId: number) => {
    try {
      const response = await fetch(`https://checkend.onrender.com/api/rejectRiskItem/${riskId}`, {
        method: 'POST',
      });

      if (response.ok) {
        // Assuming the server responds with updated risk data
        const data = await response.json();
        openModal();
        setApprovalStatus('reprovado'); // Set the approval status to 'reprovado'
        setRiskItems((prevRiskItems) =>
          prevRiskItems.map((risk) =>
            risk.id === riskId ? { ...risk, planApproval: 'reprovado' } : risk
          ).filter((risk) => risk.id !== riskId)
        );
      } else {
        console.error('Error rejecting risk item');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchRiskItems(4); // Fetch risk items when the component mounts
  }, [currentPage]);

  const handlePageChange = (newPage: number) => { setCurrentPage(newPage); };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  return (
    <div className='text-xs w-1/2'>
      <h2 className='border-y border-r p-1.5 text-xs text-black uppercase font-semibold bg-green-500/80'>Confirmação</h2>
      <input
          type='text'
          placeholder='Procurar...'
          value={searchInput}
          onChange={handleSearchInputChange}
          className='w-full border text-black p-1.5 bg-white'
      />
      <ul className='border-b border-r p-1 '> 
        {riskItems
          .filter((risk) =>
            risk.responsibleplan.toLowerCase().includes(searchInput.toLowerCase())
          )
          .map((risk) => (
          <li className='p-2 flex flex-col text-start border text-xs m-0.5 bg-green-500' key={risk.id}>
            <span className='bg-black p-2 w-full'>Responsável: {risk.responsibleplan}</span>
            <span className='bg-slate-500/60 p-2 w-full'>Data: {risk.date}</span>
            <div className='w-full bg-black/30 p-2'>
                <span className='w-1/3 mr-1'>ID: {risk.id}</span> 
                <span className='w-2/3'>| Descrição: {risk.plandescription}</span>
            </div>
            <div className='flex flex-row w-full'>
              <a
                href={`https://checkend.onrender.com/api/downloadPlanFile/${risk.id}`}
                className='w-3/5 p-1.5 text-center bg-black/60 border-b-4 hover:bg-white hover:border-black/80 hover:text-black'  
                target='_blank'
                rel='noopener noreferrer'
              >
                Baixar
              </a>

            
              <button
                className="w-1/5 answer-button positive hover:bg-white hover:border-black/80 hover:text-black bg-black/75 p-1.5"
                onClick={() => approveRiskItem(risk.id)}
              >
                Aprovar
              </button>
              <button
                className="w-1/5 answer-button negative hover:bg-white hover:border-black/80 hover:text-black bg-black/75 p-1.5"
                onClick={() => rejectRiskItem(risk.id)}
              >
                Reprovar
              </button>
            </div>
          </li>
        ))}
        
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {/* Render different messages based on approval status */}
          {approvalStatus === 'aprovado' ? (
            <h2 className="text-sm text-blue bg-white/5">Plano Aprovado!</h2>
          ) : approvalStatus === 'reprovado' ? (
            <h2 className="text-sm text-red bg-white/5">Plano Reprovado!</h2>
          ) : null}
        </Modal>
        
        <div className='w-full'>
          {/* Pagination controls */}
          <button className='w-1/2 border-b-4 border p-2 hover:bg-white hover:border-black/80 hover:text-black' disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
            Anterior
          </button>
          <button className='w-1/2 border border-b-4  p-2 hover:bg-white hover:border-black/80 hover:text-black' onClick={() => handlePageChange(currentPage + 1)}>
            Proximo
          </button>
         </div>
      </ul>
    </div>
  );
};

export default ActionPlanConfirmation;
