import React from 'react';
import Authbox from '../components/Authbox';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const schema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    role: Yup.string().required('Please select a role'),
    username: Yup.string().required('Username is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const {
    register,handleSubmit,setError,formState: { errors, isSubmitting },} = useForm({resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {

    try {
      const res = await axios.post('/api/auth/register', data, {
        withCredentials: true,
      })

      if (res.data.success) {
        navigate('/dashboard');
      } else {
        setError('root', { message: res.data.message || 'Registration failed' })
      }
    } catch (err) {
      setError('root', {
        message: err.response?.data?.message || 'Server error',
      })
    }
  }

  return (
    <Authbox activeTab="register">

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <input
          type="text"
          placeholder="FIRST NAME"
          {...register('firstName')}
          className="input"
        />
        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}

        <input
          type="text"
          placeholder="LAST NAME"
          {...register('lastName')}
          className="input"
        />
        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}

        <input
          type="text"
          placeholder="ORGANIZATION NAME"
          {...register('organization')}
          className="input"
        />
        {errors.organization && <p className="text-red-500 text-sm">{errors.organization.message}</p>}

        <input
          type="email"
          placeholder="ORGANIZATION EMAIL"
          {...register('email')}
          className="input"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <select {...register('role')} className="input">
          <option value="">Select ROLE</option>
          <option value="admin">ADMIN</option>
          <option value="user">USER</option>
        </select>
        {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}

        <input
          type="text"
          placeholder="USERNAME"
          {...register('username')}
          className="input"
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

        <input
          type="password"
          placeholder="PASSWORD"
          {...register('password')}
          className="input"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        {errors.root && <p className="text-red-600 text-sm text-center">{errors.root.message}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {isSubmitting ? 'Registering...' : 'REGISTER'}
        </button>
      </form>
    </Authbox>
  )
}

export default Register;
