// SignUpForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!repeatPassword) newErrors.repeatPassword = 'Repeat password is required';
    else if (repeatPassword !== password) newErrors.repeatPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const response = fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password}), // Simplified name
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            localStorage.setItem('userId', data.user.id);
            navigate(`/home`); 
          }
        });
    }
  };

  return (
    <div className="SignUp">
      <button onClick={() => setIsOpen(true)} className="bg-green-500 text-white p-2">Sign Up</button>
      <div className={`${isOpen ? 'block' : 'hidden'} bg-white p-4 rounded shadow`}>
        <h1 className="text-xl font-semibold">Sign Up</h1>
        <p>Please fill in this form to create an account.</p>
        <form onSubmit={handleSubmit} className="space-y-2">
          <label><b>Email</b></label>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border p-2 w-full"
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
          <label><b>Password</b></label>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border p-2 w-full"
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
          <label><b>Repeat Password</b></label>
          <input
            type="password"
            placeholder="Repeat Password"
            value={repeatPassword}
            onChange={e => setRepeatPassword(e.target.value)}
            className="border p-2 w-full"
          />
          {errors.repeatPassword && <p className="text-red-500">{errors.repeatPassword}</p>}
          <label>
            <input type="checkbox" name="remember" /> Remember me
          </label>
          <button type="submit">Sign Up</button>
        </form>
        <div className="mt-2">
          <button type="button" className="cancelbtn bg-gray-300 p-2" onClick={() => setIsOpen(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;