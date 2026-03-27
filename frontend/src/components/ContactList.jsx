import ContactItem from './ContactItem';
import { Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ContactList = ({ contacts, deleteContact, setEditingContact, toggleFavorite, loading }) => {
    if (loading) {
        return (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}
            >
                <Users size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p>Loading your connections...</p>
            </motion.div>
        );
    }

    if (contacts.length === 0) {
        return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}
            >
                <Users size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p>No contacts found.</p>
            </motion.div>
        );
    }

    return (
        <div className="contact-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <AnimatePresence mode='popLayout'>
                {contacts.map((contact, index) => (
                    <ContactItem 
                        key={contact._id || index} 
                        contact={contact} 
                        deleteContact={deleteContact} 
                        setEditingContact={setEditingContact}
                        toggleFavorite={toggleFavorite}
                        index={index}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};



export default ContactList;
