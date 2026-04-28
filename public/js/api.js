/**
 * Bellari Business College — Frontend API Client v2.0
 * Complete API integration module for all backend endpoints
 */

const API_BASE_URL = 'http://localhost:5000/api';

// ============= TOKEN MANAGEMENT =============
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');
const getUser = () => JSON.parse(localStorage.getItem('user'));
const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));
const removeUser = () => localStorage.removeItem('user');

// ============= PASSWORD TOGGLE HELPER =============
const initPasswordToggles = () => {
  document.querySelectorAll('.password-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const input = toggle.parentElement.querySelector('input');
      const icon = toggle.querySelector('i');
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
      }
    });
  });
};

// ============= API HELPER =============
const apiCall = async (method, endpoint, data = null) => {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };

    const token = getToken();
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    console.log(`🌐 API REQ: ${method} ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result = await response.json();
    console.log(`📡 API RES: ${response.status}`, result);

    if (!response.ok) {
      throw new Error(result.message || 'An error occurred');
    }

    return result;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============= FORM DATA HELPER =============
const apiCallFormData = async (method, endpoint, formData) => {
  try {
    const options = {
      method,
      headers: {} // Browser will set correct boundary for FormData
    };

    const token = getToken();
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    options.body = formData;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'An error occurred during file upload');
    }

    return result;
  } catch (error) {
    console.error('Upload API Error:', error);
    throw error;
  }
};

// ============= AUTH APIs =============
const authAPI = {
  register: async (userData) => {
    const result = await apiCall('POST', '/auth/register', userData);
    if (result.success && result.token) {
      setToken(result.token);
      setUser(result.user);
    }
    return result;
  },

  login: async (email, password) => {
    console.log('🔑 Attempting login for:', email);
    const result = await apiCall('POST', '/auth/login', { email, password });
    if (result.success && result.token) {
      console.log('✅ Login successful, storing session');
      setToken(result.token);
      setUser(result.user);
    }
    return result;
  },

  logout: () => {
    removeToken();
    removeUser();
  },

  getMe: async () => {
    return await apiCall('GET', '/auth/me');
  },

  isLoggedIn: () => {
    return !!getToken() && !!getUser();
  }
};

// ============= STUDENT APIs =============
const studentAPI = {
  getProfile: async (userId) => {
    return await apiCall('GET', `/students/${userId}`);
  },

  getAllStudents: async () => {
    return await apiCall('GET', '/students');
  },

  getAcademics: async (userId) => {
    return await apiCall('GET', `/students/${userId}/academics`);
  },

  updateProfile: async (userId, data) => {
    return await apiCall('PUT', `/students/${userId}`, data);
  },

  enrollCourse: async (userId, courseId) => {
    return await apiCall('POST', `/students/${userId}/enroll/${courseId}`);
  }
};

// ============= FACULTY APIs =============
const facultyAPI = {
  getProfile: async (userId) => {
    return await apiCall('GET', `/faculty/${userId}`);
  },

  getAllFaculty: async () => {
    return await apiCall('GET', '/faculty');
  },

  updateProfile: async (userId, data) => {
    return await apiCall('PUT', `/faculty/${userId}`, data);
  },

  addSkills: async (userId, skills) => {
    return await apiCall('POST', `/faculty/${userId}/skills`, { skills });
  },

  addAchievement: async (userId, achievementData) => {
    return await apiCall('POST', `/faculty/${userId}/achievements`, achievementData);
  },

  getSkills: async (userId) => {
    return await apiCall('GET', `/faculty/${userId}/skills`);
  },

  getAchievements: async (userId) => {
    return await apiCall('GET', `/faculty/${userId}/achievements`);
  }
};

// ============= ACADEMIC APIs =============
const academicAPI = {
  createRecord: async (data) => {
    return await apiCall('POST', '/academics', data);
  },

  getAllAcademics: async () => {
    return await apiCall('GET', '/academics');
  },

  getTranscript: async (studentId) => {
    return await apiCall('GET', `/academics/transcript/${studentId}`);
  },

  updateRecord: async (recordId, data) => {
    return await apiCall('PUT', `/academics/${recordId}`, data);
  },

  getStudentsBySemester: async (semester) => {
    return await apiCall('GET', `/academics/semester/${semester}`);
  }
};

// ============= PLACEMENT APIs =============
const placementAPI = {
  createPlacement: async (data) => {
    return await apiCall('POST', '/placements', data);
  },

  getAllPlacements: async () => {
    return await apiCall('GET', '/placements');
  },

  getStats: async () => {
    return await apiCall('GET', '/placements/stats');
  },

  getStudentPlacement: async (studentId) => {
    return await apiCall('GET', `/placements/student/${studentId}`);
  },

  updatePlacement: async (placementId, data) => {
    return await apiCall('PUT', `/placements/${placementId}`, data);
  },

  getPlacementsByYear: async (academicYear) => {
    return await apiCall('GET', `/placements/year/${academicYear}`);
  },

  getTopCompanies: async () => {
    return await apiCall('GET', '/placements/companies');
  }
};

// ============= COURSE APIs =============
const courseAPI = {
  createCourse: async (data) => {
    return await apiCall('POST', '/courses', data);
  },

  getAllCourses: async () => {
    return await apiCall('GET', '/courses');
  },

  getCourseById: async (courseId) => {
    return await apiCall('GET', `/courses/get/${courseId}`);
  },

  getCourseByCode: async (code) => {
    return await apiCall('GET', `/courses/code/${code}`);
  },

  updateCourse: async (courseId, data) => {
    return await apiCall('PUT', `/courses/${courseId}`, data);
  },

  getCourseStats: async () => {
    return await apiCall('GET', '/courses/stats');
  }
};

// ============= ADMISSION APIs =============
const admissionAPI = {
  apply: async (data) => {
    return await apiCall('POST', '/admissions/apply', data);
  },

  getAllAdmissions: async () => {
    return await apiCall('GET', '/admissions/all');
  },

  getByStatus: async (status) => {
    return await apiCall('GET', `/admissions/status/${status}`);
  },

  getByCourse: async (courseId) => {
    return await apiCall('GET', `/admissions/course/${courseId}`);
  },

  getById: async (id) => {
    return await apiCall('GET', `/admissions/${id}`);
  },

  updateStatus: async (id, status, notes) => {
    return await apiCall('PUT', `/admissions/${id}/status`, { status, notes });
  },

  verifyDocuments: async (id) => {
    return await apiCall('PUT', `/admissions/${id}/verify`);
  },

  getStats: async () => {
    return await apiCall('GET', '/admissions/stats');
  }
};

// ============= DASHBOARD APIs =============
const dashboardAPI = {
  getAdminStats: async () => {
    return await apiCall('GET', '/dashboard/stats');
  },

  getStudentDashboard: async (userId) => {
    return await apiCall('GET', `/dashboard/student/${userId}`);
  },

  getFacultyDashboard: async (userId) => {
    return await apiCall('GET', `/dashboard/faculty/${userId}`);
  }
};

// ============= NOTIFICATION APIs =============
const notificationAPI = {
  getAll: async (page = 1, unreadOnly = false) => {
    return await apiCall('GET', `/notifications?page=${page}&unreadOnly=${unreadOnly}`);
  },

  getUnreadCount: async () => {
    return await apiCall('GET', '/notifications/unread-count');
  },

  markAsRead: async (id) => {
    return await apiCall('PUT', `/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    return await apiCall('PUT', '/notifications/read-all');
  },

  create: async (data) => {
    return await apiCall('POST', '/notifications', data);
  },

  broadcast: async (data) => {
    return await apiCall('POST', '/notifications/broadcast', data);
  },

  delete: async (id) => {
    return await apiCall('DELETE', `/notifications/${id}`);
  }
};

// ============= EVENT APIs =============
const eventAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await apiCall('GET', `/events?${query}`);
  },

  getById: async (id) => {
    return await apiCall('GET', `/events/${id}`);
  },

  create: async (data) => {
    return await apiCall('POST', '/events', data);
  },

  update: async (id, data) => {
    return await apiCall('PUT', `/events/${id}`, data);
  },

  delete: async (id) => {
    return await apiCall('DELETE', `/events/${id}`);
  },

  register: async (id) => {
    return await apiCall('POST', `/events/${id}/register`);
  },

  getStats: async () => {
    return await apiCall('GET', '/events/stats/overview');
  }
};

// ============= CONTACT APIs =============
const contactAPI = {
  submit: async (data) => {
    return await apiCall('POST', '/contact', data);
  },

  getAll: async (page = 1) => {
    return await apiCall('GET', `/contact?page=${page}`);
  },

  getById: async (id) => {
    return await apiCall('GET', `/contact/${id}`);
  },

  update: async (id, data) => {
    return await apiCall('PUT', `/contact/${id}`, data);
  },

  delete: async (id) => {
    return await apiCall('DELETE', `/contact/${id}`);
  },

  getStats: async () => {
    return await apiCall('GET', '/contact/stats');
  }
};

// ============= UPLOAD APIs =============
const uploadAPI = {
  resume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return await apiCallFormData('POST', '/upload/resume', formData);
  },

  material: async (courseId, file, title) => {
    const formData = new FormData();
    formData.append('material', file);
    if (title) formData.append('title', title);
    return await apiCallFormData('POST', `/upload/material/${courseId}`, formData);
  }
};

// ============= HEALTH CHECK =============
const healthAPI = {
  check: async () => {
    return await apiCall('GET', '/health');
  }
};

// ============= EXPORT ALL APIs =============
window.API = {
  auth: authAPI,
  student: studentAPI,
  faculty: facultyAPI,
  academic: academicAPI,
  placement: placementAPI,
  course: {
    ...courseAPI,
    getEnrolledStudents: async (courseId) => {
      return await apiCall('GET', `/courses/${courseId}/students`);
    }
  },
  attendance: {
    markBulk: async (data) => {
      return await apiCall('POST', '/attendance/bulk', data);
    },
    getStudentSummary: async (studentId) => {
      return await apiCall('GET', `/attendance/student/${studentId}`);
    },
    getCourseReport: async (courseId, date) => {
      const query = date ? `?date=${date}` : '';
      return await apiCall('GET', `/attendance/course/${courseId}${query}`);
    }
  },
  search: {
    query: async (q) => {
      return await apiCall('GET', `/search?q=${q}`);
    }
  },
  exam: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await apiCall('GET', `/exams?${query}`);
    },
    create: async (data) => {
      return await apiCall('POST', '/exams', data);
    },
    update: async (id, data) => {
      return await apiCall('PUT', `/exams/${id}`, data);
    }
  },
  payment: {
    initiate: async (data) => {
      return await apiCall('POST', '/payment/initiate', data);
    },
    verify: async (transactionId) => {
      return await apiCall('POST', '/payment/verify', { transactionId });
    },
    getHistory: async () => {
      return await apiCall('GET', '/payment/history');
    }
  },
  library: {
    getBooks: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await apiCall('GET', `/library/books?${query}`);
    },
    addBook: async (data) => {
      return await apiCall('POST', '/library/books', data);
    },
    issueBook: async (data) => {
      return await apiCall('POST', '/library/issue', data);
    },
    returnBook: async (recordId) => {
      return await apiCall('PUT', `/library/return/${recordId}`);
    },
    getMyBooks: async (studentId) => {
      return await apiCall('GET', `/library/my-books/${studentId}`);
    },
    getInventory: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await apiCall('GET', `/library/inventory?${query}`);
    },
    updateBook: async (bookId, data) => {
      return await apiCall('PUT', `/library/books/${bookId}`, data);
    },
    getOverdueBooks: async () => {
      return await apiCall('GET', '/library/overdue');
    },
    getStats: async () => {
      return await apiCall('GET', '/library/stats');
    }
  },
  admission: admissionAPI,
  dashboard: dashboardAPI,
  notification: notificationAPI,
  event: eventAPI,
  contact: contactAPI,
  upload: uploadAPI,
  health: healthAPI,
  initPasswordToggles: initPasswordToggles
};

// Export helper functions globally
window.getToken = getToken;
window.setToken = setToken;
window.removeToken = removeToken;
window.getUser = getUser;
window.setUser = setUser;
window.removeUser = removeUser;
