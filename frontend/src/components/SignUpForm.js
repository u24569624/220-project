import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email';

    if (!password) newErrors.password = 'Password required';
    else if (password.length < 6) newErrors.password = '≥ 6 characters';

    if (!repeatPassword) newErrors.repeatPassword = 'Repeat password required';
    else if (repeatPassword !== password) newErrors.repeatPassword = 'Passwords don’t match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (data.success) {
      localStorage.setItem('userId', data.user.id);
      navigate('/home');
    }
  };

  return (
    <div className="auth-wrapper">
      <button className="auth-trigger btn primary" onClick={() => setOpen(true)}>
        Get Started
      </button>

      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} className="auth-form">
              <label htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              {errors.email && <p className="error-msg">{errors.email}</p>}

              <label htmlFor="signup-pass">Password</label>
              <input
                id="signup-pass"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              {errors.password && <p className="error-msg">{errors.password}</p>}

              <label htmlFor="signup-repeat">Repeat Password</label>
              <input
                id="signup-repeat"
                type="password"
                placeholder="••••••"
                value={repeatPassword}
                onChange={e => setRepeatPassword(e.target.value)}
                required
              />
              {errors.repeatPassword && <p className="error-msg">{errors.repeatPassword}</p>}

              <div className="auth-actions">
                <button type="submit" className="btn primary">
                  Create Account
                </button>
                <button type="button" onClick={() => setOpen(false)} className="btn secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpForm;