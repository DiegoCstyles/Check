"use client";
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
import { useEffect, useRef, useState } from 'react';
import { NewsDisplay } from '@/components';
import { memo } from 'react';
import Chart from 'chart.js/auto';
var Navbar = function () {
    var _a = useState([]), riskItems = _a[0], setRiskItems = _a[1];
    var _b = useState([]), lastRiskItems = _b[0], setLastRiskItems = _b[1];
    var lineGraphData = {
        labels: ['Jan', 'Feb', 'Mar', 'Abr', 'Mai'],
        datasets: [
            {
                label: 'Alto Risco',
                data: [10, 20, 15, 30, 25],
                borderColor: 'rgb(255, 255, 255)',
                borderWidth: 2,
            },
            {
                label: 'Baixo Risco',
                data: [15, 10, 5, 20, 30],
                borderColor: 'rgb(0, 174, 255)',
                borderWidth: 2,
            },
        ],
    };
    var fetchRiskItems = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch("http://localhost:5000/api/riskItems")];
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
    var fetchLastRiskItems = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch("http://localhost:5000/api/lastRiskItems")];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    setLastRiskItems(data); // Update the riskItems state with the fetched data
                    return [3 /*break*/, 4];
                case 3:
                    console.error('Error fetching risk items from the database');
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
    var canvasRef = useRef(null); // Set type for ref
    useEffect(function () {
        var _a;
        var ctx = (_a = canvasRef.current) === null || _a === void 0 ? void 0 : _a.getContext('2d');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: lineGraphData,
                options: { color: 'white', },
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(function () {
        fetchLastRiskItems();
        fetchRiskItems(); // Fetch risk items when the component mounts  
    });
    return (<>
      <div className=''>
        <h1 className='bg-cyan-300 border text-black flex justify-center border-b p-2 text-sm uppercase font-semibold'>Home</h1>
        <div className='border mx-48 mt-2 flex'>
          
          <div className=' bg-black/10 m-2 border w-1/3'>
            
            <section className='text-center text-sm text-cyan-300 border-b-4 bg-slate-500/30'>Ultimos checklists Criados
            
            </section>
            <ul className='text-slate-400 mb-1 p-5'>
            {lastRiskItems.map(function (risk) { return (<li key={risk.id}>
                <div className='flex justify-center text-center'>
                  <p className='text-center mr-2 w-32 px-2 py-1 text-xs '>{risk.title}</p>
                    <p className='text-center mr-2 w-32 px-2 py-1 text-xs 0'>{risk.impact}</p>                
                  <p className='text-center w-32 px-2 py-1 text-xs '>{risk.likelihood}</p>  
                </div>
              </li>); })}
            </ul>
            <section className='text-center text-sm text-cyan-300 border-b-4 bg-slate-500/30 '>Resumo de uso diario</section>
            <canvas ref={canvasRef} id="lineGraph" width="400" height="200"></canvas>
            <section className='text-center text-sm text-cyan-300 border-b-4 bg-slate-500/30 '>Historico de checklists</section>
            <ul className='text-slate-400 mb-1 p-5'>
            {riskItems.map(function (risk) { return (<li key={risk.id}>
                <div className='flex justify-center text-center'>
                  <p className='text-center mr-2 w-32 px-2 py-1 text-xs '>{risk.title}</p>
                    <p className='text-center mr-2 w-32 px-2 py-1 text-xs 0'>{risk.impact}</p>                
                  <p className='text-center w-32 px-2 py-1 text-xs '>{risk.likelihood}</p>  
                </div>
              </li>); })}
            </ul>
          </div>
          <div className=' bg-black/10 m-2 w-1/3 border'>
            <h2 className='text-center text-sm text-cyan-300 border-b-4 bg-slate-500/30'>Insights</h2>
            <NewsDisplay />
          </div>
          <div className=' bg-black/10 m-2 w-1/3 border'>
            <h2 className='text-center text-sm text-cyan-300 border-b-4 bg-slate-500/30'>Insights</h2>
            <NewsDisplay />
          </div>
        </div>
      </div>
    </>);
};
export default memo(Navbar);
