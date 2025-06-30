import mongoose from "mongoose";

const ExcelRecordSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserModel',
            required: true,
        },
        fileName: {
            type: String,
            required: true,
        },
        data: {
            type: Array,
            required: true,
        },
        sizeKB: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true })

export const ExcelRecordModel = mongoose.model('ExcelRecordModel', ExcelRecordSchema)