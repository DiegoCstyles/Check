"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer")); // Import multer for handling file uploads
const bodyParser = require('body-parser');
const streamifier = require('streamifier'); // Import the 'streamifier' package
// Import the 'mime-types' library
const mimeTypes = require('mime-types');
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Increase the request size limit (e.g., 50MB)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const db = new sqlite3_1.default.Database('database.db', err => {
    if (err) {
        console.error('Error connecting to the database:', err);
    }
    else {
        console.log('Connected to the database');
    }
});
// Configure multer to handle file uploads
const storage = multer_1.default.memoryStorage(); // Store file data in memory
const upload = (0, multer_1.default)({ storage: storage });
app.post('/api/riskItems', upload.single('planFiles'), (req, res) => {
    console.log('Raw Request Body:', req.body);
    const newRisk = JSON.parse(req.body.json_data || '{}');
    const planFiles = req.file ? req.file.buffer : null; // Get the uploaded file data
    const planFilesName = req.file ? req.file.originalname : '';
    if (newRisk) {
        const insertQuery = `
      INSERT INTO risk_items (title, description, planDescription, planFiles, planFilesName, planApproval, likelihood, impact, date, responsibleChecklist, responsiblePlan, completed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
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
            const createdRisk = {
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
app.get('/api/riskItems', (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 5; // Default to 10 items per page
    const offset = (page - 1) * itemsPerPage;
    const fetchQuery = `
    SELECT id, title, description, planDescription, planFiles, likelihood, impact, date, responsibleChecklist, responsiblePlan, completed
    FROM risk_items
    LIMIT ? OFFSET ?
  `;
    db.all(fetchQuery, [itemsPerPage, offset], (err, rows) => {
        if (err) {
            console.error('Error fetching risk items:', err);
            return res.status(500).json({ error: 'Failed to fetch risk items from database' });
        }
        const riskItems = rows.map(row => ({
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
        }));
        res.json(riskItems);
    });
});
// New endpoint to fetch the last risk items
app.get('/api/lastRiskItems', (req, res) => {
    const numberOfLastItems = 5; // Adjust as needed
    const fetchQuery = `
    SELECT id, title, description, planDescription, planFiles, likelihood, impact, date, responsibleChecklist, responsiblePlan, completed
    FROM risk_items
    ORDER BY id DESC
    LIMIT ?
  `;
    db.all(fetchQuery, [numberOfLastItems], (err, rows) => {
        if (err) {
            console.error('Error fetching risk items:', err);
            return res.status(500).json({ error: 'Failed to fetch risk items from database' });
        }
        const lastRiskItems = rows.map(row => ({
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
        }));
        res.json(lastRiskItems);
    });
});
// Update endpoint to modify a risk item
app.put('/api/riskItems/:id', (req, res) => {
    const id = req.params.id;
    const updateField = req.body; // This should be an object containing the field to update and its new value
    if (!id || !updateField) {
        return res.status(400).json({ error: 'Invalid request data' });
    }
    // Update the risk item in the database
    const updateQuery = `
    UPDATE risk_items
    SET ${Object.keys(updateField)[0]} = ?
    WHERE id = ?
  `;
    db.run(updateQuery, [Object.values(updateField)[0], id], (err) => {
        if (err) {
            console.error('Error updating risk item:', err);
            return res.status(500).json({ error: 'Failed to update risk item in the database' });
        }
        res.status(200).json({ message: 'Risk item updated successfully' });
    });
});
// New endpoint to fetch all applied checklists
app.get('/api/appliedChecklists', (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 5; // Default to 5 items per page
    const offset = (page - 1) * itemsPerPage;
    const fetchQuery = `
    SELECT id, title, dateApplied
    FROM applied_checklists
    LIMIT ? OFFSET ?
  `;
    db.all(fetchQuery, [itemsPerPage, offset], (err, rows) => {
        if (err) {
            console.error('Error fetching applied checklists:', err);
            return res.status(500).json({ error: 'Failed to fetch applied checklists from database' });
        }
        const appliedChecklists = rows.map(row => ({
            id: row.id,
            title: row.title,
            dateApplied: row.dateApplied,
        }));
        res.json(appliedChecklists);
    });
});
// Endpoint to add a new applied checklist
app.post('/api/appliedChecklists', (req, res) => {
    const newAppliedChecklist = req.body;
    if (newAppliedChecklist) {
        const insertQuery = `
      INSERT INTO applied_checklists (title, dateApplied)
      VALUES (?, ?)
    `;
        db.run(insertQuery, [newAppliedChecklist.title || '', newAppliedChecklist.dateApplied || ''], function (err) {
            if (err) {
                console.error('Error adding applied checklist to the database:', err);
                return res.status(500).json({ error: 'Failed to add applied checklist to database' });
            }
            const createdAppliedChecklist = {
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
app.get('/api/chartData', (req, res) => {
    const fetchQuery = `
    SELECT planApproval
    FROM risk_items
  `;
    db.all(fetchQuery, (err, rows) => {
        if (err) {
            console.error('Error fetching chart data:', err);
            return res.status(500).json({ error: 'Failed to fetch chart data from the database' });
        }
        const chartData = rows.map(row => ({
            planApproval: row.planApproval,
        }));
        res.json(chartData);
    });
});
app.get('/api/downloadPlanFile/:id', async (req, res) => {
    const riskId = req.params.id;
    // Check if riskId is valid (you may want to add additional validation)
    if (!riskId) {
        return res.status(400).json({ error: 'Invalid request data' });
    }
    // Query the database to retrieve the Blob or string data for the specific risk item
    const fetchQuery = `
    SELECT planFiles, planFilesName
    FROM risk_items
    WHERE id = ?
  `;
    db.get(fetchQuery, [riskId], async (err, row) => {
        if (err) {
            console.error('Error fetching planFiles from the database:', err);
            return res.status(500).json({ error: 'Failed to fetch planFiles from the database' });
        }
        // Perform a null/undefined check on row
        if (!row) {
            return res.status(404).json({ error: 'Risk item not found' });
        }
        // Use type assertions to inform TypeScript about the expected structure
        const riskItem = row;
        if (!riskItem.planFiles && typeof riskItem.planFiles !== 'string') {
            return res.status(404).json({ error: 'Plan file not found' });
        }
        if (typeof riskItem.planFiles === 'string') {
            // Handle the case where 'planFiles' is stored as a string (e.g., file path)
            const planFilePath = riskItem.planFiles;
            // Determine the file extension
            const fileExtension = planFilePath.split('.').pop();
            // Set the appropriate response headers for downloading based on the file extension
            if (fileExtension === 'pdf') {
                res.setHeader('Content-Disposition', `attachment; filename="Plan_${riskId}.pdf`);
                res.setHeader('Content-Type', 'application/pdf');
            }
            else if (fileExtension === 'png') {
                res.setHeader('Content-Disposition', `attachment; filename="Plan_${riskId}.png"`);
                res.setHeader('Content-Type', 'image/png');
            }
            else {
                console.error('Unsupported file type:', fileExtension);
                return res.status(500).json({ error: 'Unsupported file type' });
            }
            // Use 'node-fetch' to fetch the file and stream it to the response
            try {
                const nodeFetch = await Promise.resolve().then(() => __importStar(require('node-fetch')));
                const fileResponse = await nodeFetch.default(planFilePath);
                // Check if the status code is not OK
                if (!fileResponse.ok) {
                    console.error('Error fetching file:', fileResponse.statusText);
                    return res.status(500).json({ error: 'Failed to fetch the file' });
                }
                // Check if the response body is not null before piping it
                if (fileResponse.body) {
                    fileResponse.body.pipe(res);
                }
                else {
                    console.error('File response body is null');
                    res.status(500).json({ error: 'File response body is null' });
                }
            }
            catch (error) {
                console.error('Error fetching and streaming file:', error);
                res.status(500).json({ error: 'Failed to fetch and stream the file' });
            }
        }
        else {
            // Handle the case where 'planFiles' is stored as a Blob
            const planFilesData = riskItem.planFiles;
            // Determine the content type based on the Blob data
            const fileName = riskItem.planFilesName; // Replace with the actual file name
            const contentType = getContentTypeFromBlob(planFilesData, fileName);
            // Set the appropriate response headers for downloading based on the content type
            if (contentType === 'application/pdf') {
                res.setHeader('Content-Disposition', `attachment; filename="Plan_${riskId}.pdf`);
                res.setHeader('Content-Type', contentType);
            }
            else if (contentType === 'image/png') {
                res.setHeader('Content-Disposition', `attachment; filename="Plan_${riskId}.png"`);
                res.setHeader('Content-Type', contentType);
            }
            else {
                console.error('Unsupported file type: blob', contentType);
                return res.status(500).json({ error: 'Unsupported file type' });
            }
            // Convert the Blob to a Readable stream using 'streamifier'
            const readableStream = streamifier.createReadStream(planFilesData);
            // Pipe the Readable stream to the response
            readableStream.pipe(res);
        }
    });
});
// Function to determine content type from Blob
function getContentTypeFromBlob(blob, fileName) {
    // Check if the Blob has a type property (MIME type)
    if (blob.type) {
        return blob.type;
    }
    // Extract the file extension from the file name
    const fileExtension = fileName.split('.').pop();
    // Determine the content type based on the file extension
    const contentType = mimeTypes.lookup(fileExtension) || 'application/octet-stream';
    return contentType;
}
app.post('/api/approveRiskItem/:riskId', (req, res) => {
    const { riskId } = req.params;
    if (!riskId) {
        return res.status(400).json({ error: 'Invalid request data' });
    }
    const updateQuery = `
    UPDATE risk_items
    SET planApproval = 'aprovado'
    WHERE id = ?
  `;
    db.run(updateQuery, [riskId], function (err) {
        if (err) {
            console.error('Error approving plan to the database:', err);
            return res.status(500).json({ error: 'Failed to approve plan to database' });
        }
        res.status(200).json({ message: 'Plan approved successfully' });
    });
});
app.post('/api/rejectRiskItem/:riskId', (req, res) => {
    const { riskId } = req.params;
    if (!riskId) {
        return res.status(400).json({ error: 'Invalid request data' });
    }
    const updateQuery = `
    UPDATE risk_items
    SET planApproval = 'reprovado'
    WHERE id = ?
  `;
    db.run(updateQuery, [riskId], function (err) {
        if (err) {
            console.error('Error disapproved plan to the database:', err);
            return res.status(500).json({ error: 'Failed to disapprove plan to database' });
        }
        res.status(200).json({ message: 'Plan disapproved successfully' });
    });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
