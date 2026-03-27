const express = require('express');
const router = express.Router();
const {
    getContacts,
    createContact,
    updateContact,
    deleteContact,
    toggleFavorite,
    deleteAllContacts,
} = require('../controllers/contactController');

const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getContacts).post(createContact);
router.route('/all').delete(deleteAllContacts);
router.route('/:id').put(updateContact).delete(deleteContact);
router.route('/:id/favorite').put(toggleFavorite);




module.exports = router;
