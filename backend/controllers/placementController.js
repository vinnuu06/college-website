const Placement = require('../models/Placement');
const Course = require('../models/Course');

// Create/Record placement for a course
exports.createPlacement = async (req, res) => {
  try {
    const { course, academicYear, totalStudents, placedStudents, highestPackage, averagePackage, lowestPackage, companies, remarks } = req.body;

    // Validate course exists
    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if placement already exists for this course and year
    const existingPlacement = await Placement.findOne({ course, academicYear });
    if (existingPlacement) {
      return res.status(400).json({
        success: false,
        message: `Placement record already exists for ${courseExists.courseName} in ${academicYear}`
      });
    }

    const placement = await Placement.create({
      course,
      academicYear,
      totalStudents,
      placedStudents,
      highestPackage,
      averagePackage,
      lowestPackage,
      companies: companies || [],
      remarks
    });

    res.status(201).json({
      success: true,
      message: 'Placement record created successfully',
      placement
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all placements
exports.getAllPlacements = async (req, res) => {
  try {
    const placements = await Placement.find()
      .populate('course', 'courseCode courseName')
      .sort({ academicYear: -1 });

    res.status(200).json({
      success: true,
      count: placements.length,
      placements
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get placements by course
exports.getPlacementsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const placements = await Placement.find({ course: courseId })
      .populate('course')
      .sort({ academicYear: -1 });

    if (placements.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No placement records found for this course'
      });
    }

    res.status(200).json({
      success: true,
      count: placements.length,
      placements
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get placements by academic year
exports.getPlacementsByYear = async (req, res) => {
  try {
    const { year } = req.params;

    const placements = await Placement.find({ academicYear: year })
      .populate('course', 'courseCode courseName')
      .sort({ createdAt: -1 });

    if (placements.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No placement records found for year ${year}`
      });
    }

    res.status(200).json({
      success: true,
      count: placements.length,
      placements
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get placement by ID
exports.getPlacementById = async (req, res) => {
  try {
    const { id } = req.params;

    const placement = await Placement.findById(id)
      .populate('course')
      .populate('students.studentId');

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: 'Placement record not found'
      });
    }

    res.status(200).json({
      success: true,
      placement
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update placement
exports.updatePlacement = async (req, res) => {
  try {
    const { id } = req.params;
    const { totalStudents, placedStudents, highestPackage, averagePackage, lowestPackage, companies, remarks } = req.body;

    const placement = await Placement.findByIdAndUpdate(
      id,
      {
        totalStudents,
        placedStudents,
        highestPackage,
        averagePackage,
        lowestPackage,
        companies,
        remarks,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: 'Placement record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Placement record updated successfully',
      placement
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Add companies to placement
exports.addCompanies = async (req, res) => {
  try {
    const { id } = req.params;
    const { companies } = req.body;

    const placement = await Placement.findByIdAndUpdate(
      id,
      { $push: { companies: { $each: companies } }, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: 'Placement record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Companies added successfully',
      placement
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Add student to placement
exports.addStudentToPlacement = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, companyName, position, salary, joiningDate, status } = req.body;

    const placement = await Placement.findByIdAndUpdate(
      id,
      {
        $push: {
          students: {
            studentId,
            companyName,
            position,
            salary,
            joiningDate,
            status: status || 'Placed'
          }
        },
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: 'Placement record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student added to placement record',
      placement
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get placement statistics across all courses
exports.getPlacementStats = async (req, res) => {
  try {
    const allPlacements = await Placement.find().populate('course');

    const stats = {
      totalCourses: await Placement.distinct('course').then(r => r.length),
      latestYear: 0,
      totalStudentsAcrossCourses: 0,
      totalPlacedStudents: 0,
      overallPlacementPercentage: 0,
      highestPackageOverall: 0,
      averagePackageOverall: 0,
      coursesWithPerfectPlacement: [],
      companies: new Set()
    };

    allPlacements.forEach(placement => {
      stats.totalStudentsAcrossCourses += placement.totalStudents;
      stats.totalPlacedStudents += placement.placedStudents;
      if (placement.highestPackage > stats.highestPackageOverall) {
        stats.highestPackageOverall = placement.highestPackage;
      }
      placement.companies.forEach(c => stats.companies.add(c.companyName));
    });

    if (stats.totalStudentsAcrossCourses > 0) {
      stats.overallPlacementPercentage = (stats.totalPlacedStudents / stats.totalStudentsAcrossCourses) * 100;
    }

    stats.companies = Array.from(stats.companies);
    stats.uniqueCompanies = stats.companies.length;

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get top companies
exports.getTopCompanies = async (req, res) => {
  try {
    const placements = await Placement.find();

    const companyStats = {};
    placements.forEach(placement => {
      placement.companies.forEach(company => {
        if (!companyStats[company.companyName]) {
          companyStats[company.companyName] = {
            name: company.companyName,
            count: 0,
            averagePackage: 0,
            totalPackage: 0
          };
        }
        companyStats[company.companyName].count += company.studentCount || 0;
        if (company.ctcOffered) {
          companyStats[company.companyName].totalPackage += company.ctcOffered;
        }
      });
    });

    const companies = Object.values(companyStats)
      .map(c => ({
        ...c,
        averagePackage: c.count > 0 ? c.totalPackage / c.count : 0
      }))
      .sort((a, b) => b.count - a.count);

    res.status(200).json({
      success: true,
      count: companies.length,
      companies: companies.slice(0, 10)
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
