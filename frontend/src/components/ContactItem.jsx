import { User, Mail, Phone, Edit2, Trash2, Tag, ArrowRight, Star, MessageSquare, PhoneForwarded } from 'lucide-react';

import { motion } from 'framer-motion';

const ContactItem = ({ contact, deleteContact, setEditingContact, toggleFavorite, index }) => {
    const { _id, name, email, phone, type, isFavorite } = contact;


    const badgeColor = type === 'professional' ? '#8b5cf6' : '#ec4899';
    const badgeBg = type === 'professional' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(236, 72, 153, 0.1)';

    const getInitials = (n) => {
      const parts = n.trim().split(' ');
      if (parts.length > 1) return (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
      return parts[0][0].toUpperCase();
    };

    // Deterministic color based on name
    const getAvatarColor = (n) => {
      const colors = [
        'linear-gradient(135deg, #f43f5e, #fb7185)', 
        'linear-gradient(135deg, #8b5cf6, #a78bfa)', 
        'linear-gradient(135deg, #ec4899, #f472b6)',
        'linear-gradient(135deg, #06b6d4, #22d3ee)',
        'linear-gradient(135deg, #10b981, #34d399)',
        'linear-gradient(135deg, #f59e0b, #fbbf24)'
      ];
      let hash = 0;
      for (let i = 0; i < n.length; i++) hash = n.charCodeAt(i) + ((hash << 5) - hash);
      return colors[Math.abs(hash) % colors.length];
    };


    return (
        <motion.div 
          layout
          className="glass contact-item"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            opacity: { duration: 0.2 }
          }}
          whileHover={{ translateY: -5, scale: 1.01 }}
        >

            <div className="contact-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
                    <div style={{ 
                      width: '44px', 
                      height: '44px', 
                      borderRadius: '14px', 
                      background: getAvatarColor(name), 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}>
                      {getInitials(name)}
                    </div>

                    <div>
                      <h3 style={{ textTransform: 'capitalize' }}>{name}</h3>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '100px', 
                        background: badgeBg, 
                        color: badgeColor,
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        border: `1px solid ${badgeColor}22`
                      }}>
                          {type}
                      </span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.2rem' }}>
                  {phone && (
                    <>
                      <p style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#f8fafc', fontSize: '1rem', fontWeight: '500' }}>
                        <Phone size={14} style={{ color: '#94a3b8' }} /> {phone}
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <a 
                          href={`https://wa.me/${phone.replace(/\D/g, '')}`} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{ color: '#22c55e', background: 'rgba(34, 197, 94, 0.1)', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}
                          title="WhatsApp"
                        >
                          <MessageSquare size={14} />
                        </a>
                        <a 
                          href={`tel:${phone}`}
                          style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}
                          title="Call"
                        >
                          <PhoneForwarded size={14} />
                        </a>
                      </div>
                    </>
                  )}
                </div>


            </div>

            <div className="contact-actions">
                <button 
                  onClick={() => toggleFavorite(_id)}
                  style={{ color: isFavorite ? '#fbbf24' : '#94a3b8', background: isFavorite ? 'rgba(251, 191, 36, 0.1)' : 'transparent', border: 'none', cursor: 'pointer', padding: '0.4rem', borderRadius: '8px' }}
                  title={isFavorite ? 'Unfavorite' : 'Favorite'}
                >
                  <Star size={18} fill={isFavorite ? '#fbbf24' : 'none'} />
                </button>
                <button 
                    className="action-btn edit" 
                    onClick={() => setEditingContact(contact)}
                    title="Edit Contact"
                >

                    <Edit2 size={18} />
                </button>
                <button 
                    className="action-btn delete" 
                    onClick={() => deleteContact(_id)}
                    title="Delete Contact"
                >
                    <Trash2 size={18} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '0.5rem', opacity: 0.3 }}>
                  <ArrowRight size={18} />
                </div>
            </div>
        </motion.div>
    );
};

export default ContactItem;
