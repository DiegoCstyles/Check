"use client";
import React, { useState, useEffect } from 'react';
import { RiskItem } from './models';
import Modal from './Modal'; // Import the modal component

const RiskManagementForm: React.FC = () => {
  const [riskItems, setRiskItems] = useState<RiskItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const openModal = () => { setModalOpen(true); }; 
  const closeModal = () => { setModalOpen(false); };

  const [newRisk, setNewRisk] = useState<RiskItem>({
    id: 0,
    title: '',
    description: '',
    plandescription: '',
    planFiles: '', 
    planFilesName: '',
    planapproval: 'solução em análise',
    likelihood: 'Pequena',
    impact: 'Pequeno',
    date: 'DD/MM/AAAA',
    responsiblechecklist: '',
    responsibleplan: '',
    completed: false,
  });

  const resetNewRisk = () => {
    setNewRisk({
      id: 0,
      title: '',
      description: '',
      plandescription: '',
      planFiles: '', 
      planFilesName: '',
      planapproval: 'solução em análise',
      likelihood: 'Pequena',
      impact: 'Pequeno',
      date: 'DD/MM/AAAA',
      responsiblechecklist: '',
      responsibleplan: '',
      completed: false,
    });
  };  

  const handleNewRiskChange = (field: keyof RiskItem, value: string | File | null) => {
    setNewRisk((prevRisk) => ({
      ...prevRisk,
      [field]: value,
    }) as RiskItem);

    if (field === 'planFiles' && value instanceof File) {
      // If the field is 'planFiles' and the value is a File object, update the FormData
      const formData = new FormData();
      formData.append('json_data', JSON.stringify(newRisk)); formData.append('planFiles', value);
      // Now, you can use 'formData' to send the request to the server
    }
  };
  
  const handleRiskItemChange = async (id: number, field: keyof RiskItem, value: string) => {
    setRiskItems((prevRiskItems) =>
      prevRiskItems.map((risk) =>
        risk.id === id
          ? {
              ...risk,
              [field]: value,
            }
          : risk
      )
    );
  
    try {
      await fetch(`https://checkend.onrender.com/api/riskItems/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value }),
      });
    } catch (error) {
      console.error('Error updating risk item:', error);
    }
  };

  const addRiskToBackend = async () => {
    const formData = new FormData();
    if (newRisk.planFiles instanceof File) { formData.append('planFiles', newRisk.planFiles); }
    // Append the JSON data (newRisk) as a field named 'json_data'
    formData.append('json_data', JSON.stringify(newRisk));

    try {
      const response = await fetch('https://checkend.onrender.com/api/riskItems', {
        method: 'POST',
        body: formData, // Send the FormData object with the file to the server
        
      });

      if (response.ok) {
        openModal(); resetNewRisk(); // Reset input fields after successful addition
        const filePreviewElement = document.getElementById('filePreview');
        if (filePreviewElement) { filePreviewElement.innerHTML = ''; }
      } else {
        // Handle errors
        console.error('Error adding risk to the database');
      }
    } catch (error) { console.error('Error:', error); }
  };

  const fetchRiskItems = async (itemsPerPage = 4) => {
    try {
      const response = await fetch(`https://checkend.onrender.com/api/riskItems?page=${currentPage}&itemsPerPage=${itemsPerPage}`);

      if (response.ok) {
        const data = await response.json(); setRiskItems(data); // Update the riskItems state with the fetched data
      } else { console.error('Error fetching risk items from the database'); }
    } catch (error) { console.error('Error:', error); }
  };

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
  
  useEffect(() => {
    fetchRiskItems(4); // Fetch risk items when the component mounts
  }, [currentPage]);

  const handlePageChange = (newPage: number) => { setCurrentPage(newPage); };
  
  return (
    <div className='border w-full bg-slate-500/30'>
      <h1 className='bg-cyan-300 border text-black flex justify-center border-b p-2 text-sm uppercase font-semibold w-full'>Checklist</h1>
      
      <div className=' w-full text-xs text-center '>
        <div className=''>
          <h2 className='p-1.5 text-xs text-white border-b-4 uppercase'>Cadastro</h2>
          <div className='w-full flex p-2 justify-evenly border-y bg-slate-500/30'>
            
            <div className='w-2/5'>
              <label className='bg-black border-b-4 p-1'>Titulo</label>
              <input
                className='bg-white/10 border-b-4 p-1'
                type="text"
                value={newRisk.title}
                onChange={(e) => handleNewRiskChange('title', e.target.value)}
              />
            </div>
            
            <div className='w-1/5'>
              <label className='bg-black border-b-4 p-1'>Chance</label>
                <select
                  className='bg-white/10 border-b-4 p-1'
                  value={newRisk.likelihood}
                  onChange={(e) => handleNewRiskChange('likelihood', e.target.value)}
                >
                  <option className='bg-black border-b-4 p-1' value="Pequena">Pequena</option>
                  <option className='bg-black border-b-4 p-1' value="Media">Media</option>
                  <option className='bg-black border-b-4 p-1' value="Alta">Alta</option>
                </select>
              
            </div>
            
            <div className='w-1/5'>
              <label className='bg-black border-b-4 p-1'>Impacto</label>
                <select
                  className='bg-white/10 border-b-4 p-1'
                  value={newRisk.impact}
                  onChange={(e) => handleNewRiskChange('impact', e.target.value)}
                >
                  <option className='bg-black border-b-4 p-1' value="Pequeno">Pequeno</option>
                  <option className='bg-black border-b-4 p-1' value="Medio">Medio</option>
                  <option className='bg-black border-b-4 p-1' value="Alto">Alto</option>
                </select>
            </div>
  
            <div className='w-1/5'>
              <label className='bg-black border-b-4 p-1'>data</label>
                <input
                  className='bg-white text-black border-b-4 border-slate-400 p-1'
                  type="date" 
                  value={newRisk.date}
                  onChange={(e) => handleNewRiskChange('date', e.target.value)}
                />
            </div>
            
          </div>
          
          <div className='flex p-2 justify-around border-b bg-slate-400/50'>
            <div className='flex-row justify-between flex'>
              
              <div className='flex-col flex'>
                <label className='bg-black border-b-4 p-2 border-r-2'>
                    Descrição do Risco
                </label>           
                <textarea 
                  className='bg-black border-b-4 m-2 mt-2 ml-2 p-2 pb-36'
                  value={newRisk.description}
                  onChange={(e) => handleNewRiskChange('description', e.target.value)}
                /> 
              </div>
              
              <div className='flex-col flex'>
                <label className='bg-black border-b-4 p-2'> Plano de Mitigação (opcional) </label>
                <textarea 
                  className='bg-black border-b-4 m-2 mt-2 ml-2 p-2 pb-36'
                  value={newRisk.plandescription}
                  onChange={(e) => handleNewRiskChange('plandescription', e.target.value)}
                /> 
              </div>
              
              <div className='flex-col flex'>
                <label className='bg-black border-b-4 p-2'> Documento </label>
                <div className='bg-white/90 h-56 m-2 ml-2 p-10 rounded  border-b-4 border-slate-400 text-black flex flex-col' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div id="filePreview"></div>
                  <input
                    className='bg-white/10 border-b-4 m-2 pb-10 p-2 relative z-10'
                    type="file"
                    accept=".pdf, .png, .jpg"
                    name="planFiles"
                    onChange={(e) => {
                      const selectedFile = e.target.files && e.target.files[0];
                      if (selectedFile) {
                        handleNewRiskChange('planFiles', selectedFile);
                        const filePreview = document.getElementById('filePreview');
                        if (filePreview) {
                          if (selectedFile.type === 'image/png' || selectedFile.type === 'image/jpeg') {
                            filePreview.innerHTML = '';
                            const imgPreview = document.createElement('img'); 
                            imgPreview.src = URL.createObjectURL(selectedFile);
                            imgPreview.style.maxWidth = '150px'; imgPreview.style.maxHeight = '150px';
                            filePreview.appendChild(imgPreview);
                          }  else if (selectedFile.type === 'application/pdf') {
                            filePreview.innerHTML = '';
                            const pdfIcon = document.createElement('i');
                            pdfIcon.className = 'fas fa-file-pdf';
                            const pdfText = document.createTextNode(' PDF');
                            filePreview.appendChild(pdfIcon); filePreview.appendChild(pdfText);
                          } else { filePreview.textContent = selectedFile.name; }
                        }
                      }
                    }}
                  />
                </div>
                
              </div>
            </div>
          </div>
          
          <div className='flex flex-row justify-around p-2 border-b-4 bg-slate-500/30'>
            <div className='flex flex-col'>
              <h3 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='p-2 mb-2 justify-center flex flex-row align-center bg-cyan-300 uppercase font-semibold text-black border-b-4'> Responsaveis pelo preenchimento</h3>
              
              <div className='flex flex-row text-start'>
                <div style={{ display: 'flex ml-7', alignItems: 'center' }}>
                  <label className='bg-black border-b-4 p-1' style={{ flex: '1' }}> Checklist </label>
                  <input
                    className='bg-white/10 border-b-4 p-1'
                    type="text"
                    placeholder='...'
                    value={newRisk.responsiblechecklist}
                    onChange={(e) => handleNewRiskChange('responsiblechecklist', e.target.value)}
                  />
                </div>
                
                <div style={{ display: 'flex ml-1', alignItems: 'center' }}>
                  <label className='bg-black border-b-4 p-1' style={{ flex: '1' }}> Plano de Ação </label>
                  <input 
                    className='bg-white/10 border-b-4 p-1'
                    type="text"
                    placeholder='...'
                    value={newRisk.responsibleplan}
                    onChange={(e) => handleNewRiskChange('responsibleplan', e.target.value)}
                  />
                </div>
              
              </div>
            </div>
            
            <div>
              <button className='border m-1 mt-7 p-2 border-b-4 bg-black hover:bg-white hover:border-black/80 hover:text-black' onClick={addRiskToBackend}>Adicionar Risco</button>
            </div>
          </div>  
          <Modal isOpen={isModalOpen} onClose={closeModal}><h2 className="text-sm text-blue bg-white/5">Adicionado com sucesso!</h2></Modal>
        </div>
  
        <div className='m-2 bg-black'>
            <h2 className='mt-8 p-1.5 text-xs text-black uppercase font-semibold text-black bg-yellow-500'>Lista de Agendamentos</h2>
            <input
            className='text-black p-2 w-full bg-white/80'
              type='text'
              placeholder='Procurar...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul className='border text-start'>
              <div className='flex justify-between border-b-4 text-center p-4'>
                <li className='w-1/2'>Titulo</li>
                <li className='w-1/2'>Descrição</li>
                <li className='w-1/2'>Data</li>
                <li className='w-1/2'>Impacto</li>
                <li className='w-1/2'>Chance</li>
                <li className='w-1/2'>Baixar</li>
              </div>
              {riskItems
                .filter((risk) =>
                  risk.title.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((risk) => (
                  <li key={risk.id}>
                    <div className='flex justify-between text-xs text-center p-4'>
                      
                      <input
                        className='w-1/2 text-center bg-white/10 border-b-4 m-2 p-2'
                        type='text'
                        value={risk.title}
                        onChange={(e) =>
                          handleRiskItemChange(risk.id, 'title', e.target.value)
                        }
                      />
                      <input
                        className='w-1/2 text-center bg-white/10 border-b-4 m-2 p-2'
                        type='text'
                        value={risk.description}
                        onChange={(e) =>
                          handleRiskItemChange(
                            risk.id,
                            'description',
                            e.target.value
                          )
                        }
                      />
                      <input
                        className='w-1/2 text-center bg-white/10 border-b-4 m-2 p-2'
                        type='text'
                        value={formatDate(risk.date)}
                        onChange={(e) =>
                          handleRiskItemChange(risk.id, 'date', e.target.value)
                        }
                      />
                      <select
                        className='w-1/2 text-center bg-white/10 border-b-4 m-2 p-2'
                        value={risk.impact}
                        onChange={(e) =>
                          handleRiskItemChange(risk.id, 'impact', e.target.value)
                        }
                      >
                        <option className='bg-black border-b-4 m-2' value='Pequeno'>Pequeno</option>
                        <option className='bg-black border-b-4 m-2' value='Medio'>Medio</option>
                        <option className='bg-black border-b-4 m-2' value='Alto'>Alto</option>
                      </select>
                      <select
                        className='w-1/2 text-center bg-white/10 border-b-4 m-2 p-2'
                        value={risk.likelihood}
                        onChange={(e) => handleRiskItemChange(risk.id, 'likelihood', e.target.value) }
                      >
                        <option className='bg-black border-b-4 m-2' value='Pequena'> Pequena </option>
                        <option className='bg-black border-b-4 m-2' value='Media'> Media </option>
                        <option className='bg-black border-b-4 m-2' value='Alta'> Alta </option>
                      </select>
  
                      <a
                        href={`https://checkend.onrender.com/api/downloadPlanFile/${risk.id}`}
                        className='w-1/2 text-center bg-white/10 border-b-4 m-2 p-2 uppercase hover:bg-white hover:border-black/80 hover:text-black'  
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        Plano
                      </a>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
       
          <div className='w-full'>
          {/* Pagination controls */}
          <button className='w-1/2 border-b-4 border p-2 hover:bg-white hover:border-black/80 hover:text-black' disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
            Anterior
          </button>
          <button className='w-1/2 border border-b-4 p-2 hover:bg-white hover:border-black/80 hover:text-black' onClick={() => handlePageChange(currentPage + 1)}>
            Proximo
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiskManagementForm;
