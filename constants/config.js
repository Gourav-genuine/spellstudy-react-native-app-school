import { Platform } from 'react-native';

// Configuration constants
export const API_BASE_URL = 'https://data.spellstudy.com';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/v1/auth/login',
    REGISTER: '/v1/auth/register',
    VERIFY: '/v1/auth/verify',
    FORGOT_PASSWORD: '/v1/auth/forgot-password',
    RESET_PASSWORD: '/v1/auth/reset-password',
  },

  // User Management
  USER: {
    PROFILE: '/v1/userroute/getprofile',
    ROLE_INFO: '/v1/userroute/getuserroleinfo',
    UPDATE_ADMIN_CREDENTIALS: '/v1/schoolroute/updateadmincredentials',
    UPDATE_SUPERUSER_CREDENTIALS: '/v1/schoolroute/updatesuperusercredentials',
    PUSH_TOKENS: '/v1/userroute/storepushtokens',
  },

  // Class Management
  CLASS: {
    GET_AVAILABLE_CLASSES: '/v1/classroute/getavailableclasses',
    GET_CLASS: '/v1/classroute/getclass',
    GET_STUDENT_LIST: '/v1/classroute/getstudentlist',
    GET_PARTIAL_STUDENT_LIST: '/v1/classroute/getpartialstudentlist',
    ADD_NEW_CLASS: '/v1/classroute/addnewclass',
    UPDATE_CLASS: '/v1/classroute/updateclass',
    DELETE_CLASS: '/v1/classroute/deleteclass',
    GET_ALL_CLASSES_ATTENDANCE: '/v1/classroute/getallclassesattendacefordate',
  },

  // Student Management
  STUDENT: {
    ADD_NEW_STUDENT: '/v1/studentroute/addnewstudent',
    UPDATE_STUDENT: '/v1/studentroute/updatestudent',
    DELETE_STUDENT: '/v1/studentroute/deletestudent',
    GET_STUDENT_DETAILS: '/v1/studentroute/getstudentdetails',
    UPDATE_DAILY_REPORT: '/v1/studentroute/updatedailyreport',
    UPDATE_TEST_REPORT: '/v1/studentroute/updatetestreport',
    GET_ATTENDANCE: '/v1/studentroute/getattendance',
    UPDATE_ATTENDANCE: '/v1/studentroute/updateattendance',
  },

  // Staff Management
  STAFF: {
    ADD_NEW_STAFF: '/v1/staffroute/addnewstaff',
    ADD_NEW_TEACHER: '/v1/staffroute/addnewteacher',
    GET_ALL_TEACHERS: '/v1/staffroute/getallteachers',
    GET_ALL_STAFF: '/v1/staffroute/getallstaff',
    UPDATE_STAFF: '/v1/staffroute/updatestaff',
    DELETE_STAFF: '/v1/staffroute/deletestaff',
    GET_STAFF_DETAILS: '/v1/staffroute/getstaffdetails',
  },

  // Fee Management
  FEE: {
    GET_FEE_STATUS: '/v1/feeroute/getstudentfeestatus',
    PAY_FEE: '/v1/feeroute/newFeeStatus',
    GET_FEE_SUMMARY: '/v1/feeroute/getfeesummary',
    SET_FEE_FOR_CLASS: '/v1/feeroute/setfeeforclass',
    GET_FEE_DETAILS_OF_CLASS: '/v1/feeroute/getfeedetailsofclass',
    UPDATE_REQUIRED_FEE: '/v1/feeroute/updaterequiredfeeforstudent',
    PROCESS_FLEXIBLE_PAYMENT: '/v1/feeroute/processflexiblepayment',
    GET_PARENT_FEE_SUMMARY: '/v1/feeroute/getparentfeesummary',
    GET_UNIFIED_FEE_DATA: '/v1/feeroute/getunifiedfeedata',
  },

  // Salary Management
  SALARY: {
    GET_SALARY_STATUS: '/v1/salaryroute/getsalarystatus',
    UPDATE_SALARY: '/v1/salaryroute/updatesalary',
    PROCESS_SALARY: '/v1/salaryroute/processsalary',
  },

  // Academic Sessions
  ACADEMIC_SESSION: {
    GET_ALL: '/v1/academicsessionroute/getallacademicsessions',
    GET_CURRENT: '/v1/academicsessionroute/current',
    CREATE: '/v1/academicsessionroute/createacademicsession',
    UPDATE: '/v1/academicsessionroute/updateacademicsession',
    DELETE: '/v1/academicsessionroute/deleteacademicsession',
    ACTIVATE: '/v1/academicsessionroute/activate',
  },

  // Syllabus Management
  SYLLABUS: {
    GET_SYLLABUS: '/v1/syllabusroute/getsyllabus',
    ADD_NEW_SYLLABUS: '/v1/syllabusroute/addnewsyllabus',
    UPDATE_SYLLABUS: '/v1/syllabusroute/updatesyllabus',
    CREATE_FROM_MASTER: '/v1/syllabusroute/createnewsyllabusfrommaster',
    RESET_FROM_MASTER: '/v1/syllabusroute/resetsyllabusfrommaster',
    GET_COMBINED_COMPLETION: '/v1/syllabusroute/getcombinedsyllabuscompletionforallclasses',
  },

  // Parent Management
  PARENT: {
    GET_ALL_PARENTS: '/v1/parentroute/getallparents',
    GET_PARENT_DETAILS: '/v1/parentroute/getparentdetails',
    UPDATE_PARENT: '/v1/parentroute/updateparent',
    SEARCH_PARENTS: '/v1/parentroute/searchparents',
  },

  // Exam Management
  EXAM: {
    CREATE_EXAM: '/v1/examroute/createexam',
    GET_EXAMS: '/v1/examroute/getexams',
    UPDATE_EXAM: '/v1/examroute/updateexam',
    DELETE_EXAM: '/v1/examroute/deleteexam',
  },

  // Social Media
  SOCIAL_MEDIA: {
    GET_POSTS: '/v1/socialmedia/posts',
    CREATE_POST: '/v1/socialmedia/posts',
    UPDATE_POST: '/v1/socialmedia/posts',
    DELETE_POST: '/v1/socialmedia/posts',
    LIKE_POST: '/v1/socialmedia/posts/like',
    COMMENT_POST: '/v1/socialmedia/posts/comment',
    GET_CHAT_MESSAGES: '/v1/socialmedia/chat/messages',
    SEND_MESSAGE: '/v1/socialmedia/chat/send',
  },

  // Audit Logs
  AUDIT: {
    GET_LOGS: '/v1/audit/logs',
    GET_STATISTICS: '/v1/audit/statistics',
    GET_FILTERS: '/v1/audit/filters',
    EXPORT_LOGS: '/v1/audit/export',
  },

  // Certificates
  CERTIFICATE: {
    GENERATE: '/v1/certificateroute/generate',
    GET_TEMPLATES: '/v1/certificateroute/templates',
  },

  // Document Templates
  DOCUMENT_TEMPLATE: {
    GET_ALL: '/v1/documenttemplatesroute/getalltemplates',
    CREATE: '/v1/documenttemplatesroute/createtemplate',
    UPDATE: '/v1/documenttemplatesroute/updatetemplate',
    DELETE: '/v1/documenttemplatesroute/deletetemplate',
  },

  // Excel Templates
  EXCEL_TEMPLATE: {
    GET_ALL: '/v1/exceltemplatesroute/getalltemplates',
    UPLOAD: '/v1/exceltemplatesroute/upload',
    DOWNLOAD: '/v1/exceltemplatesroute/download',
  },

  // School Management
  SCHOOL: {
    GET_SCHOOL_INFO: '/v1/schoolroute/getschoolinfo',
    UPDATE_SCHOOL_INFO: '/v1/schoolroute/updateschoolinfo',
    REGISTER_SCHOOL: '/v1/schoolroute/registerschool',
    APPROVE_SCHOOL: '/v1/schoolroute/approveschool',
  },
};

// User Roles
export const USER_ROLES = {
  SUPERUSER: 'superuser',
  ADMIN: 'admin',
  PRINCIPAL: 'principal',
  TEACHER: 'teacher',
  STAFF: 'staff',
  ACCOUNTANT: 'accountant',
  STUDENT: 'student',
  PARENT: 'parent',
};

// Role Priorities (higher number = higher priority)
export const ROLE_PRIORITIES = {
  superuser: 7,
  admin: 6,
  principal: 5,
  teacher: 4,
  accountant: 3,
  staff: 2,
  student: 1,
  parent: 1,
};

// App Configuration
export const APP_CONFIG = {
  VERSION: '1.0.0',
  MIN_PASSWORD_LENGTH: 6,
  SESSION_TIMEOUT: 3600000, // 1 hour in milliseconds
  PAGINATION_LIMIT: 20,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  SUPPORTED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

// Theme Configuration
export const THEME_CONFIG = {
  COLORS: {
    PRIMARY: '#667eea',
    PRIMARY_DARK: '#764ba2',
    SECONDARY: '#2196F3',
    SECONDARY_DARK: '#1976D2',
    SUCCESS: '#4CAF50',
    SUCCESS_DARK: '#45a049',
    WARNING: '#FF9800',
    WARNING_DARK: '#f57c00',
    ERROR: '#F44336',
    ERROR_DARK: '#d32f2f',
    INFO: '#2196F3',
    INFO_DARK: '#21CBF3',
    BACKGROUND: '#f5f5f5',
    BACKGROUND_LIGHT: '#ffffff',
    BACKGROUND_CARD: 'rgba(255, 255, 255, 0.95)',
    TEXT_PRIMARY: '#2c3e50',
    TEXT_SECONDARY: '#7f8c8d',
    TEXT_LIGHT: '#ffffff',
    BORDER: '#e0e0e0',
    BORDER_LIGHT: 'rgba(255, 255, 255, 0.2)',
    CATEGORY_RED: '#e74c3c',
    CATEGORY_GREEN: '#27ae60',
    CATEGORY_ORANGE: '#f39c12',
    CATEGORY_PINK: '#e91e63',
    CATEGORY_TEAL: '#1abc9c',
    CATEGORY_BLUE: '#3498db',
    CATEGORY_PURPLE: '#9b59b6',
  },
  GRADIENTS: {
    PRIMARY: ['#667eea', '#764ba2'],
    SUCCESS: ['#4CAF50', '#45a049'],
    WARNING: ['#FF9800', '#f57c00'],
    ERROR: ['#F44336', '#d32f2f'],
    INFO: ['#2196F3', '#21CBF3'],
    RED: ['#e74c3c', '#f39c12'],
    GREEN: ['#27ae60', '#2ecc71'],
    ORANGE: ['#f39c12', '#e67e22'],
    PINK: ['#e91e63', '#ad1457'],
    TEAL: ['#1abc9c', '#16a085'],
    BLUE: ['#3498db', '#2980b9'],
    PURPLE: ['#9b59b6', '#8e44ad'],
  },
  SHADOWS: {
    SMALL: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    MEDIUM: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    LARGE: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
    XXL: 40,
  },
  BORDER_RADIUS: {
    SM: 6,
    MD: 12,
    LG: 20,
    XL: 25,
    ROUND: 50,
  },
  FONTS: {
    REGULAR: 'System',
    MEDIUM: 'System',
    BOLD: 'System',
  },
  FONT_SIZES: {
    XS: 12,
    SM: 14,
    MD: 16,
    LG: 18,
    XL: 20,
    XXL: 24,
    XXXL: 32,
  },
};

// Navigation Routes
export const ROUTES = {
  // Auth
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',

  // Main
  DASHBOARD: 'Dashboard',
  HOME: 'Home',

  // Students
  STUDENTS: 'Students',
  ADD_STUDENT: 'AddStudent',
  EDIT_STUDENT: 'EditStudent',
  STUDENT_DETAILS: 'StudentDetails',
  STUDENT_PROFILE: 'StudentProfile',

  // Classes
  CLASSES: 'Classes',
  ADD_CLASS: 'AddClass',
  EDIT_CLASS: 'EditClass',
  CLASS_DETAILS: 'ClassDetails',

  // Staff
  STAFF: 'Staff',
  ADD_STAFF: 'AddStaff',
  EDIT_STAFF: 'EditStaff',
  STAFF_DETAILS: 'StaffDetails',
  STAFF_PROFILE: 'StaffProfile',

  // Teachers
  TEACHERS: 'Teachers',
  ADD_TEACHER: 'AddTeacher',
  TEACHER_HOME: 'TeacherHome',

  // Fees
  FEES: 'Fees',
  FEE_MANAGEMENT: 'FeeManagement',
  UNIFIED_FEE_MANAGEMENT: 'UnifiedFeeManagement',
  PARENT_FEE_MANAGEMENT: 'ParentFeeManagement',
  MASTER_FEE_MANAGEMENT: 'MasterFeeManagement',
  STUDENT_FEE_STATUS: 'StudentFeeStatus',

  // Reports
  REPORTS: 'Reports',
  ATTENDANCE_REPORT: 'AttendanceReport',
  ACADEMIC_REPORT: 'AcademicReport',
  FEE_REPORT: 'FeeReport',
  ANALYTICS: 'Analytics',

  // Settings
  SETTINGS: 'Settings',
  PROFILE: 'Profile',
  SCHOOL_SETTINGS: 'SchoolSettings',
  USER_MANAGEMENT: 'UserManagement',

  // Social Media
  SOCIAL_MEDIA: 'SocialMedia',
  CHAT: 'Chat',
  POSTS: 'Posts',

  // Audit
  AUDIT_LOGS: 'AuditLogs',

  // Utilities
  NOTIFICATIONS: 'Notifications',
  CERTIFICATES: 'Certificates',
  DOCUMENTS: 'Documents',
  TEMPLATES: 'Templates',
};

// App constants
export const APP_NAME = 'SpellStudy School';
export const APP_VERSION = '1.0.0';

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: 'schoolToken',
  USER_DATA: 'schoolUserData',
  SCHOOL_ID: 'schoolId',
  PUSH_TOKEN: 'expoPushToken',
  BIOMETRIC_ENABLED: 'biometricEnabled',
  THEME: 'theme',
  LANGUAGE: 'language',
  NOTIFICATION_SETTINGS: 'notificationSettings',
};

// Screen dimensions
export const SCREEN_DIMENSIONS = {
  SMALL: 480,
  MEDIUM: 768,
  LARGE: 1024,
};

// Colors
export const COLORS = {
  PRIMARY: '#3498db',
  SECONDARY: '#2ecc71',
  SUCCESS: '#27ae60',
  ERROR: '#e74c3c',
  WARNING: '#f39c12',
  INFO: '#3498db',
  LIGHT: '#ecf0f1',
  DARK: '#2c3e50',
  WHITE: '#ffffff',
  BLACK: '#000000',
  GRAY: '#95a5a6',
  LIGHT_GRAY: '#bdc3c7',
};

// Navigation
export const NAVIGATION = {
  BOTTOM_TAB_HEIGHT: 80,
  HEADER_HEIGHT: 60,
};

// Permissions
export const PERMISSIONS = {
  CAMERA: 'camera',
  PHOTO_LIBRARY: 'photo-library',
  MEDIA_LIBRARY: 'media-library',
  NOTIFICATIONS: 'notifications',
  LOCATION: 'location',
};

// UI Configuration
export const UI_CONFIG = {
  DASHBOARD_CATEGORIES: {
    ADMINISTRATION: {
      id: 'administration',
      title: '🏛️ Administration & Management',
      color: 'red',
      description: 'Core administrative functions and school management',
      gradient: THEME_CONFIG.GRADIENTS.RED,
    },
    ACADEMIC: {
      id: 'academic',
      title: '📚 Academic Operations',
      color: 'green',
      description: 'Teaching, learning, and classroom management',
      gradient: THEME_CONFIG.GRADIENTS.GREEN,
    },
    FINANCIAL: {
      id: 'financial',
      title: '💰 Financial Operations',
      color: 'orange',
      description: 'Fee management, salaries, and financial reporting',
      gradient: THEME_CONFIG.GRADIENTS.ORANGE,
    },
    REPORTS: {
      id: 'reports',
      title: '📊 Reports & Analytics',
      color: 'pink',
      description: 'Data export, analytics, and reporting tools',
      gradient: THEME_CONFIG.GRADIENTS.PINK,
    },
    COMMUNICATION: {
      id: 'communication',
      title: '📱 Communication & Media',
      color: 'teal',
      description: 'Social media management and communication tools',
      gradient: THEME_CONFIG.GRADIENTS.TEAL,
    },
    PERSONAL: {
      id: 'personal',
      title: '👤 Personal & Settings',
      color: 'blue',
      description: 'User profile and personal settings',
      gradient: THEME_CONFIG.GRADIENTS.BLUE,
    },
  },
  ROLE_PERMISSIONS: {
    superuser: ['all'],
    admin: ['administration', 'academic', 'financial', 'reports', 'communication', 'personal'],
    teacher: ['academic', 'reports', 'communication', 'personal'],
    accountant: ['financial', 'reports', 'personal'],
    student: ['personal'],
    parent: ['personal'],
  },
  ANIMATION_DURATION: {
    FAST: 200,
    MEDIUM: 300,
    SLOW: 500,
  },
};

// Default configuration
export const DEFAULT_CONFIG = {
  PAGINATION_LIMIT: 20,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'gif'],
  SUPPORTED_DOCUMENT_FORMATS: ['pdf', 'doc', 'docx', 'xls', 'xlsx'],
  DEFAULT_CLASS_SECTION: 'A',
  DEFAULT_ACADEMIC_YEAR: new Date().getFullYear(),
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 6,
    MAX_NAME_LENGTH: 50,
    MAX_EMAIL_LENGTH: 100,
    PHONE_NUMBER_LENGTH: 10,
  },
};

export default {
  API_URL: API_BASE_URL,
  API_BASE_URL,
  APP_NAME,
  APP_VERSION,
  STORAGE_KEYS,
  USER_ROLES,
  SCREEN_DIMENSIONS,
  COLORS,
  NAVIGATION,
  PERMISSIONS,
  API_ENDPOINTS,
  APP_CONFIG,
  THEME_CONFIG,
  ROUTES,
  UI_CONFIG,
  DEFAULT_CONFIG,
}; 