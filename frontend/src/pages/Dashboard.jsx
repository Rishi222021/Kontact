import { useState, useEffect } from 'react';
import axios from 'axios';
import ContactForm from '../components/ContactForm';
import ContactList from '../components/ContactList';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Users, PlusCircle, Search, Briefcase, Heart, Star, Trash2, Download, Squirrel } from 'lucide-react';

import { useAuth } from '../context/AuthContext';



const Dashboard = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingContact, setEditingContact] = useState(null);
    const [currentTab, setCurrentTab] = useState('overview'); // 'overview', 'personal', 'professional', 'favorites'


    const { user, logout } = useAuth();

    const exportToCSV = () => {
        if (contacts.length === 0) return alert('No contacts to export');
        
        const headers = ['Name', 'Phone', 'Type', 'Country', 'Is Favorite'];
        const csvRows = [
            headers.join(','),
            ...contacts.map(c => [
                `"${c.name}"`,
                `"${c.phone}"`,
                `"${c.type}"`,
                `"${c.country || ''}"`,
                c.isFavorite ? 'Yes' : 'No'
            ].join(','))
        ];
        
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Kontact_Backup_${new Date().toLocaleDateString()}.csv`;
        a.click();
    };

    const deleteAll = async () => {

        if (!window.confirm('CRITICAL WARNING: This will permanently delete EVERY contact you have saved. This cannot be undone. Are you sure?')) {
            return;
        }

        try {
            await axios.delete('/api/contacts/all', config);
            setContacts([]);
        } catch (error) {
            console.error('Delete all error:', error);
            alert('Failed to delete all contacts. Please try again.');
        }
    };





    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await axios.get('/api/contacts', config);
            setContacts(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching contacts');
            setLoading(false);
        }
    };

    const addContact = async (contact) => {
        try {
            const res = await axios.post('/api/contacts', contact, config);
            setContacts([res.data, ...contacts]);
        } catch (error) {
            console.error('Failed to add contact');
        }
    };

    const updateContact = async (id, updatedContact) => {
        try {
            const res = await axios.put(`/api/contacts/${id}`, updatedContact, config);
            setContacts(contacts.map(c => c._id === id ? res.data : c));
            setEditingContact(null);
        } catch (error) {
            console.error('Failed to update contact');
        }
    };

    const deleteContact = async (id) => {
        if (!window.confirm('Are you sure you want to delete this contact?')) return;
        try {
            await axios.delete(`/api/contacts/${id}`, config);
            setContacts(contacts.filter(c => c._id !== id));
        } catch (error) {
            console.error('Failed to delete contact');
        }
    };

    const toggleFavorite = async (id) => {
        try {
            const res = await axios.put(`/api/contacts/${id}/favorite`, {}, config);
            setContacts(contacts.map(c => c._id === id ? res.data : c));
        } catch (error) {
            console.error('Failed to toggle favorite');
        }
    };


    const filteredContacts = contacts.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (currentTab === 'favorites') return matchesSearch && c.isFavorite;
      if (currentTab === 'personal') return matchesSearch && c.type === 'personal';
      if (currentTab === 'professional') return matchesSearch && c.type === 'professional';
      
      return matchesSearch;
    });



    return (
        <div className="container" style={{ paddingBottom: '5rem' }}>
            <nav className="glass" style={{ marginBottom: '3rem', marginTop: '1rem' }}>
              <div className="logo">
                <Users /> <span>Kontact</span>
              </div>

              <div className="nav-links">
                <div className="user-info">
                  <User size={16} /> {user.name}
                </div>
                <button onClick={exportToCSV} className="btn" style={{ background: 'rgba(59, 130, 246, 0.05)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Download size={16} /> Export CSV
                </button>
                <button onClick={deleteAll} className="btn btn-logout" style={{ background: 'rgba(244, 63, 94, 0.05)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.1)' }}>
                  <Trash2 size={16} /> Delete All
                </button>
                <button onClick={logout} className="btn btn-logout">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </nav>



            <div className="search-section" style={{ marginBottom: '2rem' }}>
                <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
                  <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="text" 
                    placeholder="Search all contacts..." 
                    className="glass"
                    style={{ 
                      width: '100%', 
                      padding: '1rem 1rem 1rem 3rem', 
                      borderRadius: '1rem', 
                      background: 'rgba(30, 41, 59, 0.4)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
            </div>

            <div className="dashboard-grid">

              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="glass" style={{ padding: '1.5rem', position: 'sticky', top: '2rem' }}>
                  <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.4rem' }}>
                    <PlusCircle style={{ color: '#8b5cf6' }} /> 
                    {editingContact ? 'Edit Contact' : 'New Contact'}
                  </h2>
                  <ContactForm 
                      addContact={addContact} 
                      updateContact={updateContact}
                      currentContact={editingContact}
                      setEditing={(val) => !val && setEditingContact(null)}
                  />
                </div>
              </motion.div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', padding: '0.3rem', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {[
                        { id: 'overview', label: 'All Contacts', icon: <Users size={16} />, count: contacts.length },
                        { id: 'personal', label: 'Personal', icon: <Heart size={16} />, count: contacts.filter(c => c.type === 'personal').length },
                        { id: 'professional', label: 'Professional', icon: <Briefcase size={16} />, count: contacts.filter(c => c.type === 'professional').length },
                        { id: 'favorites', label: 'Favorites', icon: <Star size={16} />, count: contacts.filter(c => c.isFavorite).length }
                      ].map((tab) => (



                        <button 
                          key={tab.id}
                          onClick={() => setCurrentTab(tab.id)}
                          style={{ 
                            padding: '0.6rem 1.2rem', 
                            borderRadius: '0.8rem', 
                            border: 'none', 
                            background: currentTab === tab.id ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'transparent',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                          }}
                        >
                          {tab.icon} {tab.label}
                          <span style={{ 
                            fontSize: '0.7rem', 
                            background: currentTab === tab.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)', 
                            padding: '0.1rem 0.4rem', 
                            borderRadius: '4px',
                            marginLeft: '0.2rem'
                          }}>
                            {tab.count}
                          </span>
                        </button>

                      ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                  {currentTab === 'overview' && (
                    <motion.div 
                      key="overview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}
                    >
                      {/* Dual Column View */}
                      <div className="glass" style={{ padding: '1.5rem', background: 'rgba(236, 72, 153, 0.03)' }}>
                        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ec4899' }}>
                          <Heart size={20} /> Personal
                          <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 'normal', marginLeft: 'auto' }}>
                            {filteredContacts.filter(c => c.type === 'personal').length}
                          </span>
                        </h2>
                        <ContactList contacts={filteredContacts.filter(c => c.type === 'personal')} deleteContact={deleteContact} setEditingContact={setEditingContact} toggleFavorite={toggleFavorite} loading={loading} />
                      </div>

                      <div className="glass" style={{ padding: '1.5rem', background: 'rgba(139, 92, 246, 0.03)' }}>
                        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#8b5cf6' }}>
                          <Briefcase size={20} /> Professional
                          <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 'normal', marginLeft: 'auto' }}>
                            {filteredContacts.filter(c => c.type === 'professional').length}
                          </span>
                        </h2>
                        <ContactList contacts={filteredContacts.filter(c => c.type === 'professional')} deleteContact={deleteContact} setEditingContact={setEditingContact} toggleFavorite={toggleFavorite} loading={loading} />
                      </div>
                    </motion.div>
                  )}



                  {(currentTab === 'personal' || currentTab === 'professional') && (
                    <motion.div 
                      key={currentTab}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="glass"
                      style={{ padding: '2rem' }}
                    >
                      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', color: currentTab === 'personal' ? '#ec4899' : '#8b5cf6' }}>
                        {currentTab === 'personal' ? <Heart size={24} /> : <Briefcase size={24} />} 
                        {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)} Dashboard
                        <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 'normal', marginLeft: 'auto' }}>
                          {filteredContacts.length} Contacts
                        </span>
                      </h2>
                      <ContactList contacts={filteredContacts} deleteContact={deleteContact} setEditingContact={setEditingContact} toggleFavorite={toggleFavorite} loading={loading} />
                    </motion.div>
                  )}

                  {currentTab === 'favorites' && (
                    <motion.div 
                      key="favorites"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}
                    >
                      <div className="glass" style={{ padding: '1.5rem', border: '1px solid rgba(236, 72, 153, 0.2)', background: 'rgba(236, 72, 153, 0.05)' }}>
                        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ec4899' }}>
                          <Star fill="#ec4899" size={20} /> Personal Fav
                        </h2>
                        <ContactList contacts={filteredContacts.filter(c => c.type === 'personal')} deleteContact={deleteContact} setEditingContact={setEditingContact} toggleFavorite={toggleFavorite} loading={loading} />
                      </div>
                      <div className="glass" style={{ padding: '1.5rem', border: '1px solid rgba(139, 92, 246, 0.2)', background: 'rgba(139, 92, 246, 0.05)' }}>
                        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#8b5cf6' }}>
                          <Star fill="#8b5cf6" size={20} /> Professional Fav
                        </h2>
                        <ContactList contacts={filteredContacts.filter(c => c.type === 'professional')} deleteContact={deleteContact} setEditingContact={setEditingContact} toggleFavorite={toggleFavorite} loading={loading} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>


        </div>
    );
}

export default Dashboard;
