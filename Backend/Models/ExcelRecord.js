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
        insights: {
            type: Object,
        },
        analysis: {
            type: [
                {
                    chartType: String,
                    xAxis: String,
                    yAxis: String,
                    filters: Object,
                    createdAt: {
                        type: Date,
                        default: Date.now,
                    },
                },
            ],
            default: [],
        },

    },
    { timestamps: true }
);


const ExcelRecord = mongoose.model('ExcelRecord', ExcelRecordSchema)
export default ExcelRecord