import UserModel from '../Models/UserModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'All the fields are required' })
        }

        const user = await UserModel.findOne({ email })
        if (user) {
            return res.status(400).json({ message: 'User already exists. Please login.' })
        }

        const hashedPass = await bcrypt.hash(password, 10)

        const newUser = await UserModel.create({
            firstName,
            lastName,
            email,
            password: hashedPass
        })

        newUser.password = undefined

        return res.status(201).json({ success: true, user: newUser })

    } catch (error) {
        console.error(error)
        return res.status(400).json({ message: 'Something went wrong' })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: 'All the Fields are REQUIRED.'
            })
        }

        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials'
            })
        }


        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid Password'
            })
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )
        user.password = undefined

        return res.status(200).json({
            success: true,
            message: 'Login Successful.',
            user,
            token,
        })


    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'Something Went Wrong.'
        })
    }
}
