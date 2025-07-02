import XLSX from 'xlsx'
import ExcelRecord from '../Models/ExcelRecord.js'
import { generateInsights } from '../utils/insights.js'
import { logUserAction } from '../utils/logUserAction.js';


export const uploadExcel = async (req, res) => {
    if (!req.file.originalname.match(/\.(xlsx)$/)) {
        return res.status(400).json({ message: 'Only .xlsx files are allowed' });
    }

    try {
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const insights = generateInsights(jsonData);

        const newRecord = await ExcelRecord.create({
            user: req.user._id,
            fileName: req.file.originalname,
            sizeKB: +(req.file.size / 1024).toFixed(2),
            data: jsonData,
            insights,
        });

        await logUserAction(req.user._id, newRecord._id, 'upload');

        res.status(201).json({ success: true, record: newRecord });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error parsing file', error: err.message });
    }
};


export const viewUploads = async (req, res) => {
    try {
        const uploads = await ExcelRecord.find({ user: req.user.id });

        if (uploads.length === 0) {
            return res.status(404).json({ message: 'No uploads found for this user' });
        }
        return res.status(200).json({ success: true, uploads });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error while fetching uploads.' });
    }
}

export const getSingleUpload = async (req, res) => {
    try {
        const { id } = req.params;

        const record = await ExcelRecord.findOne({
            _id: id,
            user: req.user.id,
        });

        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        await logUserAction(req.user._id, id, 'view');

        res.status(200).json({ success: true, record });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch record' });
    }
};

export const downloadExcel = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await ExcelRecord.findOne({ _id: id, user: req.user.id });

        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        const worksheet = XLSX.utils.json_to_sheet(record.data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

        await logUserAction(req.user._id, id, 'download');

        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${encodeURIComponent(record.fileName)}"`
        );

        res.setHeader('Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to download Excel' });
    }
};

export const downloadJson = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await ExcelRecord.findOne({ _id: id, user: req.user.id });

        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        await logUserAction(req.user._id, id, 'download');

        res.setHeader('Content-Disposition', `attachment; filename=${record.fileName}.json`);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(record.data, null, 2));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to download JSON' });
    }
};

export const saveAnalysis = async (req, res) => {
    try {
        const { id } = req.params;
        const { chartType, xAxis, yAxis, filters } = req.body;

        const record = await ExcelRecord.findOne({
            _id: id,
            user: req.user.id,
        });

        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        const newAnalysis = { chartType, xAxis, yAxis, filters };
        record.analysis.push(newAnalysis);
        await record.save();

        res.status(201).json({ success: true, message: 'Analysis saved', analysis: newAnalysis });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to save analysis' });
    }
};

export const getAnalysisSessions = async (req, res) => {
    try {
        const { id } = req.params;

        const record = await ExcelRecord.findOne({
            _id: id,
            user: req.user.id,
        }).select('analysis');

        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        res.status(200).json({ success: true, analysis: record.analysis });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve analysis' });
    }
};




