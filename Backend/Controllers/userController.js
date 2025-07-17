import User from '../Models/UserModel.js';

export const getUserHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('history.fileId', 'fileName sizeKB createdAt')
            .select('history');

        if (!user) {
            return res.status(401).json({ message: 'User associated with token not found.' });
        }

        if (!user.history || user.history.length === 0) {
            return res.status(200).json({ success: true, message: 'No history found for this user', history: [] });
        }

        res.status(200).json({ success: true, history: user.history });
    } catch (error) {
        console.error("[UserController] Error fetching user history:", error);
        res.status(500).json({ message: 'Failed to fetch history' });
    }
};