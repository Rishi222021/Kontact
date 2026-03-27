const Contact = require('../models/Contact');

const countryCodes = {
    'india': '+91',
    'united states': '+1',
    'usa': '+1',
    'united kingdom': '+44',
    'uk': '+44',
    'canada': '+1',
    'australia': '+61',
    'germany': '+49',
    'france': '+33',
    'pakistan': '+92',
    'bangladesh': '+880',
    'china': '+86',
    'japan': '+81'
};

const getCountryCode = (countryName) => {
    if (!countryName) return '';
    return countryCodes[countryName.toLowerCase().trim()] || '';
};

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Public
const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


// @desc    Create new contact
// @route   POST /api/contacts
// @access  Public
const createContact = async (req, res) => {
    let { name, email, phone, country, type, isFavorite } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ message: 'Please add Name and Phone' });
    }




    // Auto detect country code
    if (country && !phone.startsWith('+')) {
        const code = getCountryCode(country);
        if (code) {
            phone = `${code}${phone.replace(/^0+/, '')}`;
        }
    }

    try {
        const contact = await Contact.create({
            user: req.user.id,
            name,
            email,
            phone,
            country: country || '',
            type: type || 'personal',
            isFavorite: isFavorite || false,
        });

        res.status(201).json(contact);
    } catch (error) {
        res.status(400).json({ message: 'Invalid contact data', error: error.message });
    }
};



// @desc    Update contact
// @route   PUT /api/contacts/:id
// @access  Public
const updateContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        // Check for user ownership
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // Auto detect country code if country changed
        if (req.body.country && req.body.phone && !req.body.phone.startsWith('+')) {
            const code = getCountryCode(req.body.country);
            if (code) {
                req.body.phone = `${code}${req.body.phone.replace(/^0+/, '')}`;
            }
        }

        const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });


        res.status(200).json(updatedContact);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error: error.message });
    }
};


// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Public
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        // Check for user ownership
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await contact.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(400).json({ message: 'Server Error', error: error.message });
    }
};


// @desc    Toggle favorite
// @route   PUT /api/contacts/:id/favorite
// @access  Private
const toggleFavorite = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        if (contact.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        contact.isFavorite = !contact.isFavorite;
        await contact.save();

        res.status(200).json(contact);
    } catch (error) {
        res.status(400).json({ message: 'Server Error', error: error.message });
    }
};

const deleteAllContacts = async (req, res) => {
    try {
        await Contact.deleteMany({ user: req.user.id });
        res.status(200).json({ message: 'All contacts deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contacts' });
    }
};

module.exports = {
    getContacts,
    createContact,
    updateContact,
    deleteContact,
    toggleFavorite,
    deleteAllContacts
};


