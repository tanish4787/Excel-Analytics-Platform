import React from 'react';
import Authbox from '../components/Authbox';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const navigate = useNavigate();

  const schema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const { register, handleSubmit, setError,
    formState: { errors, isSubmitting }, } =
    useForm({ resolver: yupResolver(schema), });


  const onSubmit = async (data) => {
    try {
      const res = await axios.post('/api/auth/login', data, {
        withCredentials: true,
      });

      if (res.data.success) {
        navigate('/dashboard');
      } else {
        setError('root', { message: res.data.message || 'Login failed' });
      }
    } catch (err) {
      setError('root', {
        message: err.response?.data?.message || 'Server error',
      });
    }
  };

  return (
    <Authbox activeTab="login">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

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



        {errors.root && <p className="text-red-500 text-sm text-center">{errors.root.message}</p>}



        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {isSubmitting ? 'Logging in...' : 'LOGIN'}
        </button>


        <button
          type="button"
          className="w-full text-sm text-blue-600 hover:underline"
          onClick={() => navigate('/forgot-password')}
        >
          Forgot Password?
        </button>
      </form>
    </Authbox>
  )
}

export default Login;
