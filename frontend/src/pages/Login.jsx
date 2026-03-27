import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await login(formData.email, formData.password);
    setIsLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="container">
      <motion.div 
        className="glass form-card"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, scale: 0.95, y: 20 },
          visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: {
              duration: 0.6,
              staggerChildren: 0.1,
              when: "beforeChildren"
            }
          }
        }}
      >

        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))', 
            width: '72px', 
            height: '72px', 
            borderRadius: '22px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)',
            transform: 'rotate(-5deg)'
          }}>
            <LogIn size={32} style={{ color: '#fff' }} />
          </div>
          <h1>Welcome back to <span style={{ color: '#8b5cf6' }}>Kontact</span></h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Good to see you again!</p>
        </motion.div>


        {error && (
          <div style={{ 
            background: 'rgba(244, 63, 94, 0.1)', 
            color: '#f43f5e', 
            padding: '1rem', 
            borderRadius: '0.8rem', 
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            textAlign: 'center',
            border: '1px solid rgba(244, 63, 94, 0.2)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="form-group">
            <label>Email Address</label>
            <div className="input-container">
              <Mail />
              <input 
                type="email" 
                placeholder="you@example.com" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ marginBottom: 0 }}>Password</label>
              <Link to="#" style={{ fontSize: '0.8rem', color: '#8b5cf6', textDecoration: 'none' }}>Forgot Password?</Link>
            </div>
            <div className="input-container">
              <Lock />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                required 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={{ paddingRight: '3rem' }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', 
                  right: '1rem', 
                  background: 'none', 
                  border: 'none', 
                  color: '#94a3b8', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="form-group" style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', color: '#94a3b8', fontSize: '0.9rem' }}>
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#8b5cf6' }} 
              />
              Remember me on this device
            </label>
          </motion.div>
          
          <motion.button 
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="btn btn-primary" 
            type="submit" 
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Log In to Kontact'}
          </motion.button>
        </form>


        <div className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
