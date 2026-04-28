const Book = require('../models/Book');
const LibraryRecord = require('../models/LibraryRecord');

// @desc    Add a new book
// @route   POST /api/library/books
// @access  Private (Admin)
exports.addBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ success: true, book });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Search books
// @route   GET /api/library/books
// @access  Public
exports.getBooks = async (req, res) => {
  try {
    const { q, category } = req.query;
    const query = {};
    if (q) {
      query.$or = [
        { title: new RegExp(q, 'i') },
        { author: new RegExp(q, 'i') }
      ];
    }
    if (category) query.category = category;

    const books = await Book.find(query);
    res.status(200).json({ success: true, books });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Issue a book
// @route   POST /api/library/issue
// @access  Private (Admin)
exports.issueBook = async (req, res) => {
  try {
    const { studentId, bookId, dueDate } = req.body;

    const book = await Book.findById(bookId);
    if (!book || book.available < 1) {
      return res.status(400).json({ success: false, message: 'Book not available' });
    }

    const record = await LibraryRecord.create({
      student: studentId,
      book: bookId,
      dueDate: new Date(dueDate)
    });

    // Update book availability
    book.available -= 1;
    await book.save();

    res.status(201).json({ success: true, record });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get student borrowed books
// @route   GET /api/library/my-books/:studentId
// @access  Private
exports.getMyBooks = async (req, res) => {
  try {
    const records = await LibraryRecord.find({ student: req.params.studentId })
      .populate('book')
      .sort({ issueDate: -1 });
    res.status(200).json({ success: true, records });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all books with inventory details
// @route   GET /api/library/inventory
// @access  Private (Admin/Faculty)
exports.getInventory = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status === 'low') {
      query.available = { $lt: 2 };
    } else if (status === 'unavailable') {
      query.available = 0;
    }

    const books = await Book.find(query).sort({ title: 1 });
    res.status(200).json({ success: true, books });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Return a book
// @route   PUT /api/library/return/:recordId
// @access  Private (Admin)
exports.returnBook = async (req, res) => {
  try {
    const record = await LibraryRecord.findById(req.params.recordId).populate('book');
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    if (record.status === 'Returned') {
      return res.status(400).json({ success: false, message: 'Book already returned' });
    }

    // Update record
    record.returnDate = new Date();
    record.status = 'Returned';
    
    // Calculate fine if overdue (₹10 per day after due date)
    const now = new Date();
    if (now > record.dueDate) {
      const daysOverdue = Math.floor((now - record.dueDate) / (1000 * 60 * 60 * 24));
      record.fine = daysOverdue * 10;
    }

    await record.save();

    // Update book availability
    const book = record.book;
    book.available += 1;
    await book.save();

    res.status(200).json({ success: true, record });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update book quantity
// @route   PUT /api/library/books/:bookId
// @access  Private (Admin)
exports.updateBook = async (req, res) => {
  try {
    const { quantity } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.bookId,
      { quantity, available: quantity },
      { new: true }
    );
    
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({ success: true, book });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get overdue books
// @route   GET /api/library/overdue
// @access  Private (Admin)
exports.getOverdueBooks = async (req, res) => {
  try {
    const now = new Date();
    const records = await LibraryRecord.find({
      status: 'Issued',
      dueDate: { $lt: now }
    })
      .populate('student')
      .populate('book')
      .sort({ dueDate: 1 });
    
    res.status(200).json({ success: true, records });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get library statistics
// @route   GET /api/library/stats
// @access  Private (Admin)
exports.getLibraryStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalAvailable = await Book.aggregate([
      { $group: { _id: null, total: { $sum: '$available' } } }
    ]);
    const issuedCount = await LibraryRecord.countDocuments({ status: 'Issued' });
    const overdueCount = await LibraryRecord.countDocuments({ 
      status: 'Issued', 
      dueDate: { $lt: new Date() } 
    });

    res.status(200).json({
      success: true,
      stats: {
        totalBooks,
        totalAvailable: totalAvailable[0]?.total || 0,
        issuedCount,
        overdueCount
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
