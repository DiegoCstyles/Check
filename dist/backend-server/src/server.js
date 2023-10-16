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
import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import multer from 'multer'; // Import multer for handling file uploads
var bodyParser = require('body-parser');
var streamifier = require('streamifier'); // Import the 'streamifier' package
// Import the 'mime-types' library
var mimeTypes = require('mime-types');
var app = express();
var port = process.env.PORT || 5000;
// Increase the request size limit (e.g., 50MB)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(cors());
var db = new sqlite3.Database('database.db', function (err) {
    if (err) {
        console.error('Error connecting to the database:', err);
    }
    else {
        console.log('Connected to the database');
    }
});
// Configure multer to handle file uploads
var storage = multer.memoryStorage(); // Store file data in memory
var upload = multer({ storage: storage });
app.post('/api/riskItems', upload.single('planFiles'), function (req, res) {
    console.log('Raw Request Body:', req.body);
    var newRisk = JSON.parse(req.body.json_data || '{}');
    var planFiles = req.file ? req.file.buffer : null; // Get the uploaded file data
    var planFilesName = req.file ? req.file.originalname : '';
    if (newRisk) {
        var insertQuery = "\n      INSERT INTO risk_items (title, description, planDescription, planFiles, planFilesName, planApproval, likelihood, impact, date, responsibleChecklist, responsiblePlan, completed)\n      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n    ";
        db.run(insertQuery, [
            newRisk.title || '',
            newRisk.description || '',
            newRisk.planDescription || '',
            planFiles,
            planFilesName,
            newRisk.planApproval || '',
            newRisk.likelihood || '',
            newRisk.impact || '',
            newRisk.date || '',
            newRisk.responsibleChecklist || '',
            newRisk.responsiblePlan || '',
            newRisk.completed ? 1 : 0,
        ], function (err) {
            if (err) {
                console.error('Error adding risk item to the database:', err);
                return res.status(500).json({ error: 'Failed to add risk item to database' });
            }
            var createdRisk = {
                id: this.lastID,
                title: newRisk.title,
                description: newRisk.description,
                planDescription: newRisk.planDescription,
                planFiles: planFiles,
                planFilesName: planFilesName,
                planApproval: newRisk.planApproval,
                likelihood: newRisk.likelihood,
                impact: newRisk.impact,
                date: newRisk.date,
                responsibleChecklist: newRisk.responsibleChecklist,
                responsiblePlan: newRisk.responsiblePlan,
                completed: newRisk.completed,
            };
            res.status(201).json(createdRisk);
        });
    }
    else {
        res.status(400).json({ error: 'Invalid request data' });
    }
});
// New endpoint to fetch all risk items
app.get('/api/riskItems', function (req, res) {
    var page = parseInt(req.query.page) || 1; // Default to page 1
    var itemsPerPage = parseInt(req.query.itemsPerPage) || 5; // Default to 10 items per page
    var offset = (page - 1) * itemsPerPage;
    var fetchQuery = "\n    SELECT id, title, description, planDescription, planFiles, likelihood, impact, date, responsibleChecklist, responsiblePlan, completed\n    FROM risk_items\n    LIMIT ? OFFSET ?\n  ";
    db.all(fetchQuery, [itemsPerPage, offset], function (err, rows) {
        if (err) {
            console.error('Error fetching risk items:', err);
            return res.status(500).json({ error: 'Failed to fetch risk items from database' });
        }
        var riskItems = rows.map(function (row) { return ({
            id: row.id,
            title: row.title,
            description: row.description,
            planDescription: row.planDescription,
            planFiles: row.planFiles,
            likelihood: row.likelihood,
            impact: row.impact,
            date: row.date,
            responsibleChecklist: row.responsibleChecklist,
            responsiblePlan: row.responsiblePlan,
            completed: row.completed,
        }); });
        res.json(riskItems);
    });
});
// New endpoint to fetch the last risk items
app.get('/api/lastRiskItems', function (req, res) {
    var numberOfLastItems = 5; // Adjust as needed
    var fetchQuery = "\n    SELECT id, title, description, planDescription, planFiles, likelihood, impact, date, responsibleChecklist, responsiblePlan, completed\n    FROM risk_items\n    ORDER BY id DESC\n    LIMIT ?\n  ";
    db.all(fetchQuery, [numberOfLastItems], function (err, rows) {
        if (err) {
            console.error('Error fetching risk items:', err);
            return res.status(500).json({ error: 'Failed to fetch risk items from database' });
        }
        var lastRiskItems = rows.map(function (row) { return ({
            id: row.id,
            title: row.title,
            description: row.description,
            planDescription: row.planDescription,
            planFiles: row.planFiles,
            likelihood: row.likelihood,
            impact: row.impact,
            date: row.date,
            responsibleChecklist: row.responsibleChecklist,
            responsiblePlan: row.responsiblePlan,
            completed: row.completed,
        }); });
        res.json(lastRiskItems);
    });
});
// Update endpoint to modify a risk item
app.put('/api/riskItems/:id', function (req, res) {
    var id = req.params.id;
    var updateField = req.body; // This should be an object containing the field to update and its new value
    if (!id || !updateField) {
        return res.status(400).json({ error: 'Invalid request data' });
    }
    // Update the risk item in the database
    var updateQuery = "\n    UPDATE risk_items\n    SET ".concat(Object.keys(updateField)[0], " = ?\n    WHERE id = ?\n  ");
    db.run(updateQuery, [Object.values(updateField)[0], id], function (err) {
        if (err) {
            console.error('Error updating risk item:', err);
            return res.status(500).json({ error: 'Failed to update risk item in the database' });
        }
        res.status(200).json({ message: 'Risk item updated successfully' });
    });
});
// New endpoint to fetch all applied checklists
app.get('/api/appliedChecklists', function (req, res) {
    var page = parseInt(req.query.page) || 1; // Default to page 1
    var itemsPerPage = parseInt(req.query.itemsPerPage) || 5; // Default to 5 items per page
    var offset = (page - 1) * itemsPerPage;
    var fetchQuery = "\n    SELECT id, title, dateApplied\n    FROM applied_checklists\n    LIMIT ? OFFSET ?\n  ";
    db.all(fetchQuery, [itemsPerPage, offset], function (err, rows) {
        if (err) {
            console.error('Error fetching applied checklists:', err);
            return res.status(500).json({ error: 'Failed to fetch applied checklists from database' });
        }
        var appliedChecklists = rows.map(function (row) { return ({
            id: row.id,
            title: row.title,
            dateApplied: row.dateApplied,
        }); });
        res.json(appliedChecklists);
    });
});
// Endpoint to add a new applied checklist
app.post('/api/appliedChecklists', function (req, res) {
    var newAppliedChecklist = req.body;
    if (newAppliedChecklist) {
        var insertQuery = "\n      INSERT INTO applied_checklists (title, dateApplied)\n      VALUES (?, ?)\n    ";
        db.run(insertQuery, [newAppliedChecklist.title || '', newAppliedChecklist.dateApplied || ''], function (err) {
            if (err) {
                console.error('Error adding applied checklist to the database:', err);
                return res.status(500).json({ error: 'Failed to add applied checklist to database' });
            }
            var createdAppliedChecklist = {
                id: this.lastID,
                title: newAppliedChecklist.title,
                dateApplied: newAppliedChecklist.dateApplied,
            };
            res.status(201).json(createdAppliedChecklist);
        });
    }
    else {
        res.status(400).json({ error: 'Invalid request data' });
    }
});
// New endpoint to fetch data for the chart
app.get('/api/chartData', function (req, res) {
    var fetchQuery = "\n    SELECT planApproval\n    FROM risk_items\n  ";
    db.all(fetchQuery, function (err, rows) {
        if (err) {
            console.error('Error fetching chart data:', err);
            return res.status(500).json({ error: 'Failed to fetch chart data from the database' });
        }
        var chartData = rows.map(function (row) { return ({
            planApproval: row.planApproval,
        }); });
        res.json(chartData);
    });
});
app.get('/api/downloadPlanFile/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var riskId, fetchQuery;
    return __generator(this, function (_a) {
        riskId = req.params.id;
        // Check if riskId is valid (you may want to add additional validation)
        if (!riskId) {
            return [2 /*return*/, res.status(400).json({ error: 'Invalid request data' })];
        }
        fetchQuery = "\n    SELECT planFiles, planFilesName\n    FROM risk_items\n    WHERE id = ?\n  ";
        db.get(fetchQuery, [riskId], function (err, row) { return __awaiter(void 0, void 0, void 0, function () {
            var riskItem, planFilePath, fileExtension, nodeFetch, fileResponse, error_1, planFilesData, fileName, contentType, readableStream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            console.error('Error fetching planFiles from the database:', err);
                            return [2 /*return*/, res.status(500).json({ error: 'Failed to fetch planFiles from the database' })];
                        }
                        // Perform a null/undefined check on row
                        if (!row) {
                            return [2 /*return*/, res.status(404).json({ error: 'Risk item not found' })];
                        }
                        riskItem = row;
                        if (!riskItem.planFiles && typeof riskItem.planFiles !== 'string') {
                            return [2 /*return*/, res.status(404).json({ error: 'Plan file not found' })];
                        }
                        if (!(typeof riskItem.planFiles === 'string')) return [3 /*break*/, 6];
                        planFilePath = riskItem.planFiles;
                        fileExtension = planFilePath.split('.').pop();
                        // Set the appropriate response headers for downloading based on the file extension
                        if (fileExtension === 'pdf') {
                            res.setHeader('Content-Disposition', "attachment; filename=\"Plan_".concat(riskId, ".pdf"));
                            res.setHeader('Content-Type', 'application/pdf');
                        }
                        else if (fileExtension === 'png') {
                            res.setHeader('Content-Disposition', "attachment; filename=\"Plan_".concat(riskId, ".png\""));
                            res.setHeader('Content-Type', 'image/png');
                        }
                        else {
                            console.error('Unsupported file type:', fileExtension);
                            return [2 /*return*/, res.status(500).json({ error: 'Unsupported file type' })];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, import('node-fetch')];
                    case 2:
                        nodeFetch = _a.sent();
                        return [4 /*yield*/, nodeFetch.default(planFilePath)];
                    case 3:
                        fileResponse = _a.sent();
                        // Check if the status code is not OK
                        if (!fileResponse.ok) {
                            console.error('Error fetching file:', fileResponse.statusText);
                            return [2 /*return*/, res.status(500).json({ error: 'Failed to fetch the file' })];
                        }
                        // Check if the response body is not null before piping it
                        if (fileResponse.body) {
                            fileResponse.body.pipe(res);
                        }
                        else {
                            console.error('File response body is null');
                            res.status(500).json({ error: 'File response body is null' });
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error('Error fetching and streaming file:', error_1);
                        res.status(500).json({ error: 'Failed to fetch and stream the file' });
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        planFilesData = riskItem.planFiles;
                        fileName = riskItem.planFilesName;
                        contentType = getContentTypeFromBlob(planFilesData, fileName);
                        // Set the appropriate response headers for downloading based on the content type
                        if (contentType === 'application/pdf') {
                            res.setHeader('Content-Disposition', "attachment; filename=\"Plan_".concat(riskId, ".pdf"));
                            res.setHeader('Content-Type', contentType);
                        }
                        else if (contentType === 'image/png') {
                            res.setHeader('Content-Disposition', "attachment; filename=\"Plan_".concat(riskId, ".png\""));
                            res.setHeader('Content-Type', contentType);
                        }
                        else {
                            console.error('Unsupported file type: blob', contentType);
                            return [2 /*return*/, res.status(500).json({ error: 'Unsupported file type' })];
                        }
                        readableStream = streamifier.createReadStream(planFilesData);
                        // Pipe the Readable stream to the response
                        readableStream.pipe(res);
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
// Function to determine content type from Blob
function getContentTypeFromBlob(blob, fileName) {
    // Check if the Blob has a type property (MIME type)
    if (blob.type) {
        return blob.type;
    }
    // Extract the file extension from the file name
    var fileExtension = fileName.split('.').pop();
    // Determine the content type based on the file extension
    var contentType = mimeTypes.lookup(fileExtension) || 'application/octet-stream';
    return contentType;
}
app.post('/api/approveRiskItem/:riskId', function (req, res) {
    var riskId = req.params.riskId;
    if (!riskId) {
        return res.status(400).json({ error: 'Invalid request data' });
    }
    var updateQuery = "\n    UPDATE risk_items\n    SET planApproval = 'aprovado'\n    WHERE id = ?\n  ";
    db.run(updateQuery, [riskId], function (err) {
        if (err) {
            console.error('Error approving plan to the database:', err);
            return res.status(500).json({ error: 'Failed to approve plan to database' });
        }
        res.status(200).json({ message: 'Plan approved successfully' });
    });
});
app.post('/api/rejectRiskItem/:riskId', function (req, res) {
    var riskId = req.params.riskId;
    if (!riskId) {
        return res.status(400).json({ error: 'Invalid request data' });
    }
    var updateQuery = "\n    UPDATE risk_items\n    SET planApproval = 'reprovado'\n    WHERE id = ?\n  ";
    db.run(updateQuery, [riskId], function (err) {
        if (err) {
            console.error('Error disapproved plan to the database:', err);
            return res.status(500).json({ error: 'Failed to disapprove plan to database' });
        }
        res.status(200).json({ message: 'Plan disapproved successfully' });
    });
});
app.listen(port, function () {
    console.log("Server is running on port ".concat(port));
});
