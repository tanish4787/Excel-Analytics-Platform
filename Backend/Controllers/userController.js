import User from '../Models/UserModel.js';

export const getUserHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('history.fileId', 'fileName sizeKB createdAt')
            .select('history');

        if (!user || !user.history) {
            return res.status(404).json({ message: 'No history found for this user' });
        }

        res.status(200).json({ success: true, history: user.history });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch history' });
    }
};
