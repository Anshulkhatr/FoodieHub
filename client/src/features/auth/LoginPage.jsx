import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from './authSlice';
import Button from '../../components/Button';
import Spinner from '../../components/Spinner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/');
    }
  }, [user, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="bg-surface p-8 rounded-2xl shadow-sm border border-border w-full max-w-md">
        <h1 className="text-3xl font-heading font-bold mb-6 text-center text-primary">Welcome Back</h1>
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Email</label>
            <input placeholder='Enter your Email' type="email" required className="w-full p-3 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Password</label>
            <input placeholder='Enter your Password' type="password" required className="w-full p-3 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full mt-4 h-12" disabled={isLoading}>
            {isLoading ? <Spinner size={20} className="text-white" /> : 'Sign In'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-text-muted">
          New to FoodieHub? <Link to="/register" className="text-primary hover:underline font-medium">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
