import { useState, useEffect } from 'react';
import { User, Mail, Phone, Tag, Save, X, Loader2, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const countries = [
  { name: "India", code: "+91", limit: 10 },
  { name: "United States", code: "+1", limit: 10 },
  { name: "USA", code: "+1", limit: 10 },
  { name: "United Kingdom", code: "+44", limit: 10 },
  { name: "UK", code: "+44", limit: 10 },
  { name: "Canada", code: "+1", limit: 10 },
  { name: "Australia", code: "+61", limit: 9 },
  { name: "Germany", code: "+49", limit: 11 },
  { name: "France", code: "+33", limit: 10 },
  { name: "Pakistan", code: "+92", limit: 10 },
  { name: "Bangladesh", code: "+880", limit: 10 },
  { name: "China", code: "+86", limit: 11 },
  { name: "Japan", code: "+81", limit: 10 },
  { name: "South Africa", code: "+27", limit: 10 },
  { name: "UAE", code: "+971", limit: 9 },
  { name: "Saudi Arabia", code: "+966", limit: 9 },
  { name: "Singapore", code: "+65", limit: 8 },
  { name: "Italy", code: "+39", limit: 10 },
  { name: "Spain", code: "+34", limit: 9 }
];




const ContactForm = ({ addContact, updateContact, currentContact, setEditing }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        country: '',
        type: 'personal',
    });

    const [isSaving, setIsSaving] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIdx, setSelectedIdx] = useState(-1);



    useEffect(() => {
        if (currentContact) {
            setFormData(currentContact);
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                country: '',
                type: 'personal',
            });

        }
    }, [currentContact]);

    const handleCountryChange = (e) => {
        const val = e.target.value;
        setFormData({ ...formData, country: val });
        
        if (val.trim().length > 0) {
            const filtered = countries.filter(c => 
                c.name.toLowerCase().includes(val.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 5));
            setShowSuggestions(true);
            setSelectedIdx(-1);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
            setSelectedIdx(-1);
        }
    };

    const selectSuggestion = (countryObj) => {
        if (!countryObj) return;
        let newPhone = formData.phone;
        // If phone doesn't already have a code, add it
        if (!newPhone.startsWith('+')) {
            newPhone = `${countryObj.code}${newPhone.replace(/^0+/, '')}`;
        }
        
        setFormData({ 
            ...formData, 
            country: countryObj.name,
            phone: newPhone
        });
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedIdx(-1);
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIdx(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIdx(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter' && selectedIdx >= 0) {
            e.preventDefault();
            selectSuggestion(suggestions[selectedIdx]);
        }
    };



    const handlePhoneChange = (e) => {
        let val = e.target.value;
        const currentCountry = countries.find(c => c.name.toLowerCase() === (formData.country || "").toLowerCase());
        
        if (currentCountry) {
            const prefix = currentCountry.code;
            if (val.startsWith(prefix)) {
                const digits = val.slice(prefix.length).replace(/\D/g, '');
                if (digits.length <= currentCountry.limit) {
                    setFormData({ ...formData, phone: prefix + digits });
                }
            } else {
                setFormData({ ...formData, phone: val });
            }
        } else {
            setFormData({ ...formData, phone: val });
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setIsSaving(true);
        if (currentContact) {
            await updateContact(currentContact._id, formData);
        } else {
            await addContact(formData);
        }
        setIsSaving(false);
        setFormData({ name: '', email: '', phone: '', country: '', type: 'personal' });
        setShowSuggestions(false);
    };


    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Name</label>
                <div className="input-container">
                    <User size={18} />
                    <input
                        type="text"
                        placeholder="Contact Name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
            </div>
            
            <div className="form-group" style={{ position: 'relative' }}>
                <label>Country</label>

                <div className="input-container">
                    <Globe size={18} />
                    <input
                        type="text"
                        placeholder="e.g. India, USA, UK"
                        value={formData.country || ''}
                        onChange={handleCountryChange}
                        onKeyDown={handleKeyDown}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    />

                </div>
                
                <AnimatePresence>
                    {showSuggestions && suggestions.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            style={{ 
                                position: 'absolute', 
                                top: '100%', 
                                left: 0, 
                                width: '100%', 
                                background: 'rgba(30, 41, 59, 1)', 
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '0.8rem',
                                marginTop: '0.5rem',
                                zIndex: 100,
                                overflow: 'hidden',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                            }}
                        >
                            {suggestions.map((c, i) => (
                                <div 
                                    key={i}
                                    style={{ 
                                        padding: '0.75rem 1rem', 
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                        fontSize: '0.9rem',
                                        borderBottom: i !== suggestions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                        background: selectedIdx === i ? 'rgba(139, 92, 246, 0.4)' : 'transparent'
                                    }}
                                    className="suggestion-item"
                                    onClick={() => selectSuggestion(c)}
                                    onMouseEnter={() => {
                                        setSelectedIdx(i);
                                    }}

                                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                >
                                    {c.name} ({c.code})
                                </div>

                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="form-group">

                <label>Phone</label>
                <div className="input-container">
                    <Phone size={18} />
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                    />

                </div>
            </div>




            <div className="form-group">
                <label>Type</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#f8fafc' }}>
                        <input
                            type="radio"
                            name="type"
                            value="personal"
                            checked={formData.type === 'personal'}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            style={{ width: 'auto' }}
                        /> 
                        Personal
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#f8fafc' }}>
                        <input
                            type="radio"
                            name="type"
                            value="professional"
                            checked={formData.type === 'professional'}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            style={{ width: 'auto' }}
                        /> 
                        Professional
                    </label>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ 
                    flex: 1,
                    background: formData.type === 'professional' ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' : 'linear-gradient(135deg, #ec4899, #8b5cf6)'
                  }} 
                  disabled={isSaving}
                >
                    {isSaving ? <Loader2 className="animate-spin" /> : (
                      <>
                        <Save size={18} /> {currentContact ? 'Update Contact' : 'Save Contact'}
                      </>
                    )}
                </button>

                {currentContact && (
                    <button type="button" className="btn" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white', flex: 0.5 }} onClick={() => setEditing(false)}>
                        <X size={18} /> Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default ContactForm;
