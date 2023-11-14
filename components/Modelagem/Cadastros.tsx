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
  
  const openModal = () => {
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
  };

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
    responsibleChecklist: '',
    responsiblePlan: '',
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
      responsibleChecklist: '',
      responsiblePlan: '',
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
      formData.append('json_data', JSON.stringify(newRisk));
      formData.append('planFiles', value);
  
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
    if (newRisk.planFiles instanceof File) {
      formData.append('planFiles', newRisk.planFiles);
    }
    // Append the JSON data (newRisk) as a field named 'json_data'
    formData.append('json_data', JSON.stringify(newRisk));

    try {
      const response = await fetch('https://checkend.onrender.com/api/riskItems', {
        method: 'POST',
        body: formData, // Send the FormData object with the file to the server
        
      });

      if (response.ok) {
        openModal();
        resetNewRisk(); // Reset input fields after successful addition
        const filePreviewElement = document.getElementById('filePreview');
        if (filePreviewElement) {
          filePreviewElement.innerHTML = '';
        }
      } else {
        // Handle errors
        console.error('Error adding risk to the database');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchRiskItems = async () => {
    try {
      const response = await fetch(`https://checkend.onrender.com/api/riskItems?page=${currentPage}`);

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

  function formatDate(dateString: string | number | Date) {
    // Parse the input date string
    const inputDate = new Date(dateString);
  
    // Check if the input date is valid
    if (isNaN(inputDate.getTime())) {
      // Return an empty string or an error message if the date is invalid
      return '';
    }
  
    // Format the date as "DD/MM/YYYY"
    const day = String(inputDate.getDate()).padStart(2, '0');
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const year = inputDate.getFullYear();
  
    return `${day}/${month}/${year}`;
  }
  

  useEffect(() => {
    fetchRiskItems(); // Fetch risk items when the component mounts
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  
  return (
    <div className=' w-full'>
    <h1 className='bg-cyan-300 border text-black flex justify-center border-b p-2 text-sm uppercase font-semibold w-full'>Checklist</h1>
    <div className=' w-full text-xs text-center '>
      
      <div className=''>
        <h2 className='p-1.5 text-xs text-white border mt-2'>Cadastro</h2>
        <div className='flex p-2 justify-around border'>
          
          <div>
            <label>
              Titulo
              <input
                className='bg-white/10 border-b-4 m-2 ml-2'
                type="text"
                value={newRisk.title}
                onChange={(e) => handleNewRiskChange('title', e.target.value)}
              />
            </label>
          </div>
          
          <div>
            <label>
              Chance
              <select
                className='bg-white/10 border-b-4 m-2 ml-2'
                value={newRisk.likelihood}
                onChange={(e) => handleNewRiskChange('likelihood', e.target.value)}
              >
                <option className='bg-black border-b-4 m-2' value="Pequena">Pequena</option>
                <option className='bg-black border-b-4 m-2' value="Media">Media</option>
                <option className='bg-black border-b-4 m-2' value="Alta">Alta</option>
              </select>
            </label>
          </div>
          
          <div>
            <label>
              Impacto
              <select
                className='bg-white/10 border-b-4 m-2 ml-2'
                value={newRisk.impact}
                onChange={(e) => handleNewRiskChange('impact', e.target.value)}
              >
                <option className='bg-black border-b-4 m-2' value="Pequeno">Pequeno</option>
                <option className='bg-black border-b-4 m-2' value="Medio">Medio</option>
                <option className='bg-black border-b-4 m-2' value="Alto">Alto</option>
              </select>
            </label>
          </div>

          <div>
            <label>
              data
              <input
                className='bg-white text-black border-b-4 border-slate-400 m-2 p-0.5 rounded ml-2'
                type="date" // Use type="date" for date input
                value={newRisk.date}
                onChange={(e) => handleNewRiskChange('date', e.target.value)}
              />
            </label>
          </div>
          
        </div>
        
        <div className='flex p-2 justify-around border'>
          <div className='flex-row justify-between flex '>
            <div className='flex-col flex'>
              <label>
                  Descrição do Risco
              </label>           
              <textarea 
                className='bg-white/10 border-b-4 m-2 mt-6 ml-2 p-10'
                value={newRisk.description}
                onChange={(e) => handleNewRiskChange('description', e.target.value)}
              /> 
            </div>
            <div className='flex-col flex'>
              <label> Plano de Mitigação (opcional) </label>
              <textarea 
                className='bg-white/10 border-b-4 m-2 mt-6 ml-2 p-10 '
                value={newRisk.plandescription}
                onChange={(e) => handleNewRiskChange('plandescription', e.target.value)}
              /> 
            </div>
            <div className='flex-col flex'>
              <label className='mt-2'> Documento </label>
              <div className='bg-white/90 h-56 m-2 ml-2 p-10 rounded  border-b-4 border-slate-400 text-black flex flex-col' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <input
                className='bg-white/10 border-b-4 m-2 pb-10 p-2'
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
                        imgPreview.style.maxWidth = '150px';
                        imgPreview.style.maxHeight = '150px';
                        filePreview.appendChild(imgPreview);
                      }  else if (selectedFile.type === 'application/pdf') {
                        filePreview.innerHTML = '';
                        const pdfIcon = document.createElement('i');
                        pdfIcon.className = 'fas fa-file-pdf';
                        const pdfText = document.createTextNode(' PDF');
                        filePreview.appendChild(pdfIcon);
                        filePreview.appendChild(pdfText);
                      } else {
                        filePreview.textContent = selectedFile.name;
                      }
                    }
                  }
                }}
              />
            </div>
            <div id="filePreview"></div>
          </div>

          </div>
            
          </div>
        
        <div className='flex flex-row justify-around p-2 border'>
          <div className='flex flex-col'>
            <h3 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='p-2 justify-center flex flex-row  align-center'> Responsaveis pelo preenchimento</h3>
            <div className='flex flex-row text-start'>
              
              <div style={{ display: 'flex ml-7', alignItems: 'center' }}>
                <label style={{ flex: '1' }}>
                  Checklist
                </label>
                <input
                  className='bg-white/10 border-b-4 m-2 ml-2'
                  type="text"
                  value={newRisk.responsibleChecklist}
                  onChange={(e) => handleNewRiskChange('responsibleChecklist', e.target.value)}
                />
              </div>
              
              <div style={{ display: 'flex ml-1', alignItems: 'center' }}>
                <label style={{ flex: '1' }}>
                  Plano de Ação
                </label>
                <input 
                  className='bg-white/10 border-b-4 m-2 ml-2'
                  type="text"
                  value={newRisk.responsiblePlan}
                  onChange={(e) => handleNewRiskChange('responsiblePlan', e.target.value)}
                />
              </div>
            
            </div>
          </div>
          <div>
            <button className='border m-1 mt-7 p-2 border-b-4 ' onClick={addRiskToBackend}>Adicionar Risco</button>
          </div>
        </div>  
        
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-sm text-blue bg-white/5">Adicionado com sucesso!</h2>
        </Modal>
      </div>

      <div className='m-2'>
          <h2 className='mt-8 p-1.5 text-xs text-black bg-cyan-300'>Lista de Agendamentos</h2>
          <input
          className='text-black p-2 w-full'
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
                      className='w-1/2 text-center bg-white/10 border-b-4 m-2'
                      type='text'
                      value={risk.title}
                      onChange={(e) =>
                        handleRiskItemChange(risk.id, 'title', e.target.value)
                      }
                    />
                    <input
                      className='w-1/2 text-center bg-white/10 border-b-4 m-2'
                      type='text'
                      value={risk.plandescription}
                      onChange={(e) =>
                        handleRiskItemChange(
                          risk.id,
                          'plandescription',
                          e.target.value
                        )
                      }
                    />
                    <input
                      className='w-1/2 text-center bg-white/10 border-b-4 m-2'
                      type='text'
                      value={formatDate(risk.date)}
                      onChange={(e) =>
                        handleRiskItemChange(risk.id, 'date', e.target.value)
                      }
                    />
                    <select
                      className='w-1/2 text-center bg-white/10 border-b-4 m-2'
                      value={risk.impact}
                      onChange={(e) =>
                        handleRiskItemChange(risk.id, 'impact', e.target.value)
                      }
                    >
                      <option className='bg-black border-b-4 m-2' value='Pequeno'>
                        Pequeno
                      </option>
                      <option className='bg-black border-b-4 m-2' value='Medio'>
                        Medio
                      </option>
                      <option className='bg-black border-b-4 m-2' value='Alto'>
                        Alto
                      </option>
                    </select>
                    <select
                      className='w-1/2 text-center bg-white/10 border-b-4 m-2'
                      value={risk.likelihood}
                      onChange={(e) =>
                        handleRiskItemChange(risk.id, 'likelihood', e.target.value)
                      }
                    >
                      <option className='bg-black border-b-4 m-2' value='Pequena'>
                        Pequena
                      </option>
                      <option className='bg-black border-b-4 m-2' value='Media'>
                        Media
                      </option>
                      <option className='bg-black border-b-4 m-2' value='Alta'>
                        Alta
                      </option>
                    </select>

                    <a
                      href={`https://checkend.onrender.com/api/downloadPlanFile/${risk.id}`}
                      className='w-1/2 text-center bg-white/10 border-b-4 m-2'  
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
     
        <div>
        {/* Pagination controls */}
        <button className='mr-2 mt-2 border-b-4 border p-2' disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
          Anterior
        </button>
        <button className='border border-b-4 mt-2 p-2' onClick={() => handlePageChange(currentPage + 1)}>
          Proximo
        </button>
      </div>
      </div>
    </div>
  );
};

export default RiskManagementForm;
