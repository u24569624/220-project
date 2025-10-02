import React, { useState } from 'react';
//import '../styles/tailwind.css'; // Replace global.css with tailwind.css

const LoginForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required';
    else if (username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            localStorage.setItem('userId', data.user.id);
            window.location.href = '/home';
          }
        });
    }
  };

  return (
    <div className="login">
      <button onClick={() => setIsOpen(true)} className="bg-blue-500 text-white p-2">Login</button>
      <div className={`${isOpen ? 'block' : 'hidden'} bg-white p-4 rounded shadow`}>
        <div className="imgcontainer">
          <span className="material-symbols-outlined">account_circle</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label><b>Username</b></label>
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="border p-2 w-full"
            />
            {errors.username && <p className="text-red-500">{errors.username}</p>}
            <label><b>Password</b></label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border p-2 w-full"
            />
            {errors.password && <p className="text-red-500">{errors.password}</p>}
            <label>
              <input type="checkbox" name="remember" /> Remember me
            </label>
            <button type="submit" className="bg-blue-500 text-white p-2 w-full">Login</button>
          </div>
        </form>
        <div className="mt-2">
          <button type="button" className="cancelbtn bg-gray-300 p-2" onClick={() => setIsOpen(false)}>Cancel</button>
          <span className="psw">Forgot <a href="#" className="text-blue-500">password?</a></span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;