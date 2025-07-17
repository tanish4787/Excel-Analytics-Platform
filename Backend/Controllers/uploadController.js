import XLSX from 'xlsx';
import ExcelRecord from '../models/ExcelRecord.js';
import { generateInsights } from '../utils/insights.js';
import { logUserAction } from '../utils/logUserAction.js';

export const uploadExcel = async (req, res) => {
  if (!req.file?.originalname.match(/\.xlsx$/))
    return res.status(400).json({ message: 'Only .xlsx files allowed' });

  const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
  const insights = generateInsights(data);

  const record = await ExcelRecord.create({
    user: req.user._id,
    fileName: req.file.originalname,
    sizeKB: +(req.file.size / 1024).toFixed(2),
    data,
    insights
  });

  await logUserAction(req.user._id, record._id, 'upload');
  res.status(201).json({ success: true, record });
};

export const viewUploads = async (req, res) => {
  const uploads = await ExcelRecord.find({ user: req.user._id });
  if (!uploads.length)
    return res.status(404).json({ message: 'No uploads found.' });
  res.json({ success: true, uploads });
};

export const getSingleUpload = async (req, res) => {
  const record = await ExcelRecord.findOne({ _id: req.params.id, user: req.user._id });
  if (!record) return res.status(404).json({ message: 'Record not found.' });
  await logUserAction(req.user._id, record._id, 'view');
  res.json({ success: true, record });
};

export const downloadExcel = async (req, res) => {
  const record = await ExcelRecord.findOne({ _id: req.params.id, user: req.user._id });
  if (!record) return res.status(404).json({ message: 'Record not found.' });

  const ws = XLSX.utils.json_to_sheet(record.data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
  await logUserAction(req.user._id, record._id, 'download');

  res.setHeader('Content-Disposition', `attachment; filename="${record.fileName}"`);
  res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').send(buffer);
};

export const downloadJson = async (req, res) => {
  const record = await ExcelRecord.findOne({ _id: req.params.id, user: req.user._id });
  if (!record) return res.status(404).json({ message: 'Record not found.' });

  await logUserAction(req.user._id, record._id, 'download');
  res.setHeader('Content-Disposition', `attachment; filename="${record.fileName}.json"`);
  res.json(record.data);
};

export const saveAnalysis = async (req, res) => {
  const record = await ExcelRecord.findOne({ _id: req.params.id, user: req.user._id });
  if (!record) return res.status(404).json({ message: 'Record not found.' });

  const analysis = { ...req.body, createdAt: new Date() };
  record.analysis.push(analysis);
  await record.save();
  res.status(201).json({ success: true, analysis });
};

export const getAnalysisSessions = async (req, res) => {
  const record = await ExcelRecord.findOne({ _id: req.params.id, user: req.user._id });
  if (!record) return res.status(404).json({ message: 'Record not found.' });

  res.json({ success: true, analysis: record.analysis });
};
