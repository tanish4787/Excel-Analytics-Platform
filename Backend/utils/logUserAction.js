import User from '../Models/UserModel.js';

export const logUserAction = async (userId, fileId, action) => {
    try {
        await User.findByIdAndUpdate(userId, {
            $push: {
                history: {
                    fileId,
                    action,
                    timestamp: new Date()
                },
            },
        });
    } catch (err) {
        console.error('Error logging user action:', err.message);
    }
};
