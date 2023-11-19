import React, { useState, useEffect} from 'react';
import { RiskItem } from './models';
import Modal from './Modal'; // Import the modal component

const ActionPlanConfirmation = () => {
  const [riskItems, setRiskItems] = useState<RiskItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<string>(''); // State for approval status

  const openModal = () => { setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); };

  const fetchRiskItems = async (itemsPerPage = 4) => {
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

  return (
    <div className='text-xs w-1/2'>
      <h2 className='border-y border-r p-1.5 text-xs mr-2 text-black bg-cyan-300'>Confirmação</h2>
      
      <ul className='border-b border-r p-1 mr-2'>
        {riskItems.map((risk) => (
          <li className='p-2  flex flex-col text-start border text-xs m-2' key={risk.id}>
            <span className='bg-black p-1 w-full'>{risk.responsibleplan}</span>
            <span className='bg-slate-500 p-1 w-full'>Data: {risk.date}</span>
            <div className='p-2'>
                <span className=''>ID: {risk.id}</span> 
                <span className=' m-1 w-full'>- Descrição: {risk.plandescription}</span>
                
            </div>

            <a
              href={`https://checkend.onrender.com/api/downloadPlanFile/${risk.id}`}
              className='w-full text-center bg-white/10 border-b-4 m-1'  
              target='_blank'
              rel='noopener noreferrer'
            >
              Plano
            </a>

            
            <div className='flex flex-row justify-end w-full'>
              <button
                className="answer-button positive hover:bg-white hover:border-black/80 hover:text-black bg-black/75 mr-1 p-1"
                onClick={() => approveRiskItem(risk.id)}
              >
                Aprovar
              </button>
              <button
                className="answer-button negative hover:bg-white hover:border-black/80 hover:text-black bg-black/75 p-1"
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
        
        <div>
          {/* Pagination controls */}
          <button className='mr-2 mt-2 border-b-4 border p-2 hover:bg-white hover:border-black/80 hover:text-black' disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
            Anterior
          </button>
          <button className='border border-b-4 mt-2 p-2 hover:bg-white hover:border-black/80 hover:text-black' onClick={() => handlePageChange(currentPage + 1)}>
            Proximo
          </button>
         </div>
      </ul>
    </div>
  );
};

export default ActionPlanConfirmation;
