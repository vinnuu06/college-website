const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { 
  addBook, 
  getBooks, 
  issueBook, 
  getMyBooks,
  getInventory,
  returnBook,
  updateBook,
  getOverdueBooks,
  getLibraryStats
} = require('../controllers/libraryController');

router.get('/books', getBooks);
router.post('/books', protect, authorize('admin'), addBook);
router.get('/inventory', protect, authorize('admin', 'faculty'), getInventory);
router.put('/books/:bookId', protect, authorize('admin'), updateBook);
router.post('/issue', protect, authorize('admin'), issueBook);
router.put('/return/:recordId', protect, authorize('admin'), returnBook);
router.get('/overdue', protect, authorize('admin'), getOverdueBooks);
router.get('/stats', protect, authorize('admin'), getLibraryStats);
router.get('/my-books/:studentId', protect, getMyBooks);

module.exports = router;
