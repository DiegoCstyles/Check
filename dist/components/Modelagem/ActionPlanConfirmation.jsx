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
var ActionPlanConfirmation = function () {
    var _a = useState([]), riskItems = _a[0], setRiskItems = _a[1];
    var _b = useState(1), currentPage = _b[0], setCurrentPage = _b[1];
    var _c = useState(false), isModalOpen = _c[0], setModalOpen = _c[1];
    var _d = useState(''), approvalStatus = _d[0], setApprovalStatus = _d[1]; // State for approval status
    var openModal = function () {
        setModalOpen(true);
    };
    var closeModal = function () {
        setModalOpen(false);
    };
    var fetchRiskItems = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, error_1;
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
                    error_1 = _a.sent();
                    console.error('Error:', error_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var approveRiskItem = function (riskId) { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch("http://localhost:5000/api/approveRiskItem/".concat(riskId), {
                            method: 'POST',
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    openModal();
                    setApprovalStatus('aprovado'); // Set the approval status to 'aprovado'
                    setRiskItems(function (prevRiskItems) {
                        return prevRiskItems.map(function (risk) {
                            return risk.id === riskId ? __assign(__assign({}, risk), { planApproval: 'aprovado' }) : risk;
                        }).filter(function (risk) { return risk.id !== riskId; });
                    });
                    console.log('After filtering:', riskItems); // Log the state after filtering
                    return [3 /*break*/, 4];
                case 3:
                    console.error('Error approving risk item');
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_2 = _a.sent();
                    console.error('Error:', error_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var rejectRiskItem = function (riskId) { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch("http://localhost:5000/api/rejectRiskItem/".concat(riskId), {
                            method: 'POST',
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    openModal();
                    setApprovalStatus('reprovado'); // Set the approval status to 'reprovado'
                    setRiskItems(function (prevRiskItems) {
                        return prevRiskItems.map(function (risk) {
                            return risk.id === riskId ? __assign(__assign({}, risk), { planApproval: 'reprovado' }) : risk;
                        }).filter(function (risk) { return risk.id !== riskId; });
                    });
                    return [3 /*break*/, 4];
                case 3:
                    console.error('Error rejecting risk item');
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
    useEffect(function () {
        fetchRiskItems(); // Fetch risk items when the component mounts
    }, [currentPage]);
    var handlePageChange = function (newPage) {
        setCurrentPage(newPage);
    };
    return (<div className='text-xs'>
      <h2 className='border-y border-r mt-2 p-1.5 mr-2 text-xs text-black bg-cyan-300'>Confirmação</h2>
      <ul className='border-b border-r p-1 mr-2'>
        {riskItems.map(function (risk) { return (<li className='p-2  flex flex-col text-start border text-xs m-2' key={risk.id}>
            <span className='bg-black p-1 w-full'>{risk.responsiblePlan}</span>
            <span className='bg-slate-500 p-1 w-full'>Data: {risk.date}</span>
            <div className='p-2'>
                <span className=''>ID: {risk.id}</span> 
                <span className=' m-1 w-full'>- Descrição: {risk.planDescription}</span>
            </div>
            <div className='flex flex-row justify-end w-full'>
              <button className="answer-button positive hover:bg-slate-500 bg-black/75 mr-1 p-1" onClick={function () { return approveRiskItem(risk.id); }}>
                Aprovar
              </button>
              <button className="answer-button negative hover:bg-slate-500 bg-black/75 p-1" onClick={function () { return rejectRiskItem(risk.id); }}>
                Reprovar
              </button>
            </div>
          </li>); })}
         <Modal isOpen={isModalOpen} onClose={closeModal}>
          {/* Render different messages based on approval status */}
          {approvalStatus === 'aprovado' ? (<h2 className="text-sm text-blue bg-white/5">Plano Aprovado!</h2>) : approvalStatus === 'reprovado' ? (<h2 className="text-sm text-red bg-white/5">Plano Reprovado!</h2>) : null}
        </Modal>
        <div>
          {/* Pagination controls */}
          <button className='mr-2 mt-2 border-b-4 border p-2' disabled={currentPage === 1} onClick={function () { return handlePageChange(currentPage - 1); }}>
            Anterior
          </button>
          <button className='border border-b-4 mt-2 p-2' onClick={function () { return handlePageChange(currentPage + 1); }}>
            Proximo
          </button>
       </div>
      </ul>
    </div>);
};
export default ActionPlanConfirmation;
