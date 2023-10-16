"use client";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Import the modal component
var RiskManagementForm = function () {
    var _a = useState([]), riskItems = _a[0], setRiskItems = _a[1];
    var _b = useState(1), currentPage = _b[0], setCurrentPage = _b[1];
    var _c = useState(false), isModalOpen = _c[0], setModalOpen = _c[1];
    var _d = useState(null), filePreview = _d[0], setFilePreview = _d[1];
    var _e = useState(''), searchTerm = _e[0], setSearchTerm = _e[1];
    var openModal = function () {
        setModalOpen(true);
    };
    var closeModal = function () {
        setModalOpen(false);
    };
    var _f = useState({
        id: 0,
        title: '',
        description: '',
        planDescription: '',
        planFiles: '',
        planFilesName: '',
        planApproval: 'solução em análise',
        likelihood: 'Pequena',
        impact: 'Pequeno',
        date: 'DD/MM/AAAA',
        responsibleChecklist: '',
        responsiblePlan: '',
        completed: false,
    }), newRisk = _f[0], setNewRisk = _f[1];
    var resetNewRisk = function () {
        setNewRisk({
            id: 0,
            title: '',
            description: '',
            planDescription: '',
            planFiles: '',
            planFilesName: '',
            planApproval: 'solução em análise',
            likelihood: 'Pequena',
            impact: 'Pequeno',
            date: 'DD/MM/AAAA',
            responsibleChecklist: '',
            responsiblePlan: '',
            completed: false,
        });
    };
    var handleNewRiskChange = function (field, value) {
        setNewRisk(function (prevRisk) {
            var _a;
            return (__assign(__assign({}, prevRisk), (_a = {}, _a[field] = value, _a)));
        });
        if (field === 'planFiles' && value instanceof File) {
            // If the field is 'planFiles' and the value is a File object, update the FormData
            var formData = new FormData();
            formData.append('json_data', JSON.stringify(newRisk));
            formData.append('planFiles', value);
            // Now, you can use 'formData' to send the request to the server
        }
    };
    var handleRiskItemChange = function (id, field, value) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setRiskItems(function (prevRiskItems) {
                        return prevRiskItems.map(function (risk) {
                            var _a;
                            return risk.id === id
                                ? __assign(__assign({}, risk), (_a = {}, _a[field] = value, _a)) : risk;
                        });
                    });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch("http://localhost:5000/api/riskItems/".concat(id), {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify((_a = {}, _a[field] = value, _a)),
                        })];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    console.error('Error updating risk item:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var addRiskToBackend = function () { return __awaiter(void 0, void 0, void 0, function () {
        var formData, response, filePreviewElement, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    formData = new FormData();
                    if (newRisk.planFiles instanceof File) {
                        formData.append('planFiles', newRisk.planFiles);
                    }
                    // Append the JSON data (newRisk) as a field named 'json_data'
                    formData.append('json_data', JSON.stringify(newRisk));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch('http://localhost:5000/api/riskItems', {
                            method: 'POST',
                            body: formData, // Send the FormData object with the file to the server
                        })];
                case 2:
                    response = _a.sent();
                    if (response.ok) {
                        openModal();
                        resetNewRisk(); // Reset input fields after successful addition
                        filePreviewElement = document.getElementById('filePreview');
                        if (filePreviewElement) {
                            filePreviewElement.innerHTML = '';
                        }
                    }
                    else {
                        // Handle errors
                        console.error('Error adding risk to the database');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error:', error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var fetchRiskItems = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch("http://localhost:5000/api/riskItems?page=".concat(currentPage))];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    setRiskItems(data); // Update the riskItems state with the fetched data
                    return [3 /*break*/, 4];
                case 3:
                    console.error('Error fetching risk items from the database');
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    console.error('Error:', error_3);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    function formatDate(dateString) {
        // Parse the input date string
        var inputDate = new Date(dateString);
        // Check if the input date is valid
        if (isNaN(inputDate.getTime())) {
            // Return an empty string or an error message if the date is invalid
            return '';
        }
        // Format the date as "DD/MM/YYYY"
        var day = String(inputDate.getDate()).padStart(2, '0');
        var month = String(inputDate.getMonth() + 1).padStart(2, '0');
        var year = inputDate.getFullYear();
        return "".concat(day, "/").concat(month, "/").concat(year);
    }
    useEffect(function () {
        fetchRiskItems(); // Fetch risk items when the component mounts
    }, [currentPage]);
    var handlePageChange = function (newPage) {
        setCurrentPage(newPage);
    };
    return (<div className=' w-full'>
    <h1 className='bg-cyan-300 border text-black flex justify-center border-b p-2 text-sm uppercase font-semibold w-full'>Checklist</h1>
    <div className='m-2 mx-48 border text-xs text-center '>
      
      <div className='m-2 '>
        <h2 className='p-1.5 text-xs text-white border mt-2'>Cadastro</h2>
        <div className='flex p-2 justify-around border'>
          <div>
            <label>
              Titulo
              <input className='bg-white/10 border-b-4 m-2 ml-2' type="text" value={newRisk.title} onChange={function (e) { return handleNewRiskChange('title', e.target.value); }}/>
            </label>
          </div>
          
          <div>
            <label>
              Chance
              <select className='bg-white/10 border-b-4 m-2 ml-2' value={newRisk.likelihood} onChange={function (e) { return handleNewRiskChange('likelihood', e.target.value); }}>
                <option className='bg-black border-b-4 m-2' value="Pequena">Pequena</option>
                <option className='bg-black border-b-4 m-2' value="Media">Media</option>
                <option className='bg-black border-b-4 m-2' value="Alta">Alta</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              Impacto
              <select className='bg-white/10 border-b-4 m-2 ml-2' value={newRisk.impact} onChange={function (e) { return handleNewRiskChange('impact', e.target.value); }}>
                <option className='bg-black border-b-4 m-2' value="Pequeno">Pequeno</option>
                <option className='bg-black border-b-4 m-2' value="Medio">Medio</option>
                <option className='bg-black border-b-4 m-2' value="Alto">Alto</option>
              </select>
            </label>
          </div>
        </div>
        <div className='flex p-2 justify-around border'>
          <div className='flex-col flex '>
            <label>
                Descrição do Risco
            </label>           
            <textarea className='bg-white/10 border-b-4 m-2 mt-6 ml-2 p-10' value={newRisk.description} onChange={function (e) { return handleNewRiskChange('description', e.target.value); }}/> 
            <label className='mt-2'> Documento </label>
            <div className='bg-white/90 h-56 m-2 ml-2 p-10 rounded  border-b-4 border-slate-400 text-black flex flex-col' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <input className='bg-white/10 border-b-4 m-2 pb-10 p-2' type="file" accept=".pdf, .png, .jpg" name="planFiles" onChange={function (e) {
            var selectedFile = e.target.files && e.target.files[0];
            if (selectedFile) {
                handleNewRiskChange('planFiles', selectedFile);
                var filePreview_1 = document.getElementById('filePreview');
                if (filePreview_1) {
                    if (selectedFile.type === 'image/png' || selectedFile.type === 'image/jpeg') {
                        filePreview_1.innerHTML = '';
                        var imgPreview = document.createElement('img');
                        imgPreview.src = URL.createObjectURL(selectedFile);
                        imgPreview.style.maxWidth = '150px';
                        imgPreview.style.maxHeight = '150px';
                        filePreview_1.appendChild(imgPreview);
                    }
                    else if (selectedFile.type === 'application/pdf') {
                        filePreview_1.innerHTML = '';
                        var pdfIcon = document.createElement('i');
                        pdfIcon.className = 'fas fa-file-pdf';
                        var pdfText = document.createTextNode(' PDF');
                        filePreview_1.appendChild(pdfIcon);
                        filePreview_1.appendChild(pdfText);
                    }
                    else {
                        filePreview_1.textContent = selectedFile.name;
                    }
                }
            }
        }}/>
            <div id="filePreview"></div>
          </div>

          </div>
          
            <div className='flex-col flex'>
            
            <label> Plano de Mitigação (opcional) </label>
            <label> Descrição </label>
              <textarea className='bg-white/10 border-b-4 m-2 ml-2 p-10' value={newRisk.planDescription} onChange={function (e) { return handleNewRiskChange('planDescription', e.target.value); }}/> 
            
            <div className='flex-col flex mt-2'>
              <label>
                  data
              </label>
              <input className='bg-white text-black border-b-4 border-slate-400 m-2 rounded ml-2 p-2' type="date" // Use type="date" for date input
     value={newRisk.date} onChange={function (e) { return handleNewRiskChange('date', e.target.value); }}/>
            </div>
            
        </div>
        </div>
        
        <div className='flex flex-row p-2 justify-around border'>
          <h3 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='p-2 justify-center flex flex-row  align-center'> Responsaveis pelo preenchimento</h3>
          <div className='flex flex-col text-start'>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ flex: '1' }}>
              Checklist
            </label>
            <input className='bg-white/10 border-b-4 m-2 ml-2' type="text" value={newRisk.responsibleChecklist} onChange={function (e) { return handleNewRiskChange('responsibleChecklist', e.target.value); }}/>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ flex: '1' }}>
              Plano de Ação
            </label>
            <input className='bg-white/10 border-b-4 m-2 ml-2' type="text" value={newRisk.responsiblePlan} onChange={function (e) { return handleNewRiskChange('responsiblePlan', e.target.value); }}/>
          </div>
        </div>

        </div>    
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-sm text-blue bg-white/5">Adicionado com sucesso!</h2>
        </Modal>
        
        <div>
          <button className='border m-2 p-2 border-b-4 ' onClick={addRiskToBackend}>Adicionar Risco</button>
        </div>
      </div>

      <div className='m-2'>
          <h2 className='mt-8 p-1.5 text-xs text-black bg-cyan-300'>Lista de Agendamentos</h2>
          <input className='text-black p-2 w-full' type='text' placeholder='Procurar...' value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }}/>
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
            .filter(function (risk) {
            return risk.title.toLowerCase().includes(searchTerm.toLowerCase());
        })
            .map(function (risk) { return (<li key={risk.id}>
                  <div className='flex justify-between text-xs text-center p-4'>
                    <input className='w-1/2 text-center bg-white/10 border-b-4 m-2' type='text' value={risk.title} onChange={function (e) {
                return handleRiskItemChange(risk.id, 'title', e.target.value);
            }}/>
                    <input className='w-1/2 text-center bg-white/10 border-b-4 m-2' type='text' value={risk.planDescription} onChange={function (e) {
                return handleRiskItemChange(risk.id, 'planDescription', e.target.value);
            }}/>
                    <input className='w-1/2 text-center bg-white/10 border-b-4 m-2' type='text' value={formatDate(risk.date)} onChange={function (e) {
                return handleRiskItemChange(risk.id, 'date', e.target.value);
            }}/>
                    <select className='w-1/2 text-center bg-white/10 border-b-4 m-2' value={risk.impact} onChange={function (e) {
                return handleRiskItemChange(risk.id, 'impact', e.target.value);
            }}>
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
                    <select className='w-1/2 text-center bg-white/10 border-b-4 m-2' value={risk.likelihood} onChange={function (e) {
                return handleRiskItemChange(risk.id, 'likelihood', e.target.value);
            }}>
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

                    <a href={"http://localhost:5000/api/downloadPlanFile/".concat(risk.id)} className='w-1/2 text-center bg-white/10 border-b-4 m-2' target='_blank' rel='noopener noreferrer'>
                      Plano
                    </a>
                  </div>
                </li>); })}
          </ul>
        </div>
     
        <div>
        {/* Pagination controls */}
        <button className='mr-2 mt-2 border-b-4 border p-2' disabled={currentPage === 1} onClick={function () { return handlePageChange(currentPage - 1); }}>
          Anterior
        </button>
        <button className='border border-b-4 mt-2 p-2' onClick={function () { return handlePageChange(currentPage + 1); }}>
          Proximo
        </button>
      </div>
      </div>
    </div>);
};
export default RiskManagementForm;
