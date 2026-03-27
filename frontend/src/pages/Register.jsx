import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (!specialCharRegex.test(formData.password)) {
      setError('Password must include at least one special character');
      return;
    }

    setIsLoading(true);

    const result = await register(formData);
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
              staggerChildren: 0.08,
              when: "beforeChildren"
            }
          }
        }}
      >

        <motion.div 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          style={{ textAlign: 'center', marginBottom: '2rem' }}
        >
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.2))', 
            width: '72px', 
            height: '72px', 
            borderRadius: '22px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(236, 72, 153, 0.2)',
            transform: 'rotate(5deg)'
          }}>
            <UserPlus size={32} style={{ color: '#fff' }} />
          </div>
          <h1>Join <span style={{ color: '#ec4899' }}>Kontact</span></h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Start your organized journey today.</p>
        </motion.div>


        {error && (
          <div style={{ 
            background: 'rgba(244, 63, 94, 0.1)', 
            color: '#f43f5e', 
            padding: '0.75rem', 
            borderRadius: '0.75rem', 
            marginBottom: '1rem',
            fontSize: '0.9rem',
            textAlign: 'center',
            border: '1px solid rgba(244, 63, 94, 0.2)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="form-group">
            <label>Full Name</label>
            <div className="input-container">
              <User />
              <input 
                type="text" 
                placeholder="John Doe" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </motion.div>

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
            <label>Create Password</label>
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
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
              Min 8 characters, include a special character (e.g. @, #, $).
            </p>
          </motion.div>

          
          <motion.button 
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="btn btn-primary" 
            type="submit" 
            disabled={isLoading} 
            style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
             {isLoading ? <Loader2 className="animate-spin" /> : 'Get Started with Kontact'}
          </motion.button>
        </form>


        <div className="auth-footer">
          Already have an account? <Link to="/login" style={{ color: '#ec4899' }}>Log in</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
