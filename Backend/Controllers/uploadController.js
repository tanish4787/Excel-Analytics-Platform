import XLSX from 'xlsx'
import ExcelRecordModel from '../Models/ExcelRecord.js'
import upload from '../Middlewares/upload.js'

export const uploadExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No File Found.' })
        }


        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(sheet)

        const newRecord = await ExcelRecordModel.create({
            user: req.user.id,
            fileName: req.file.originalname,
            data: jsonData,
            sizeKB: Math.round(req.file.size / 1024),
        })

        return res.status(201).json({ success: true, record: newRecord });

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Upload Failed' })

    }
}

export const viewUploads = async (req, res) => {
    try {
        const uploads = await ExcelRecordModel.find({ user: req.user.id });

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

        const record = await ExcelRecordModel.findOne({
            _id: id,
            user: req.user.id,
        });

        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        res.status(200).json({ success: true, record });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch record' });
    }
};


