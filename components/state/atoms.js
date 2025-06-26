import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  // Authentication
  auth: {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  
  // User Role Management
  userRole: {
    primaryRole: null,
    allRoles: [],
    highestPriorityRole: null,
    highestPriorityLevel: 0,
    permissions: [],
  },
  
  // UI Theme and Settings
  theme: {
    isDarkMode: false,
    primaryColor: '#2196F3',
    accentColor: '#FF5722',
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    fontSize: 'medium',
  },
  
  // Navigation and UI State
  navigation: {
    activeTab: 'Dashboard',
    drawerOpen: false,
    currentScreen: null,
    previousScreen: null,
  },
  
  // Selection States
  selection: {
    selectedClass: null,
    selectedSection: null,
    selectedSubject: null,
    selectedStudent: null,
    selectedStaff: null,
    selectedAcademicSession: null,
  },
  
  // Students
  students: {
    studentList: [],
    filteredStudents: [],
    selectedStudent: null,
    searchQuery: '',
    filterBy: 'all',
    sortBy: 'name',
    loading: false,
    error: null,
  },
  
  // Staff
  staff: {
    staffList: [],
    filteredStaff: [],
    selectedStaff: null,
    searchQuery: '',
    filterBy: 'all',
    sortBy: 'name',
    loading: false,
    error: null,
  },
  
  // Reports
  reports: {
    dashboardStats: {
      totalStudents: 0,
      totalStaff: 0,
      totalClasses: 0,
      pendingFees: 0,
      attendanceToday: 0,
    },
    loading: false,
    error: null,
  },
  
  // Global UI State
  ui: {
    loading: false,
    error: null,
    successMessage: null,
  },
};

// Action types
const actionTypes = {
  SET_AUTH: 'SET_AUTH',
  SET_AUTH_LOADING: 'SET_AUTH_LOADING',
  SET_AUTH_ERROR: 'SET_AUTH_ERROR',
  LOGOUT: 'LOGOUT',
  SET_USER_ROLE: 'SET_USER_ROLE',
  SET_THEME: 'SET_THEME',
  TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  SET_DRAWER_OPEN: 'SET_DRAWER_OPEN',
  SET_CURRENT_SCREEN: 'SET_CURRENT_SCREEN',
  SET_SELECTED_CLASS: 'SET_SELECTED_CLASS',
  SET_SELECTED_STUDENT: 'SET_SELECTED_STUDENT',
  SET_SELECTED_STAFF: 'SET_SELECTED_STAFF',
  SET_STUDENTS: 'SET_STUDENTS',
  SET_STAFF: 'SET_STAFF',
  SET_DASHBOARD_STATS: 'SET_DASHBOARD_STATS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SUCCESS_MESSAGE: 'SET_SUCCESS_MESSAGE',
  CLEAR_MESSAGES: 'CLEAR_MESSAGES',
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_AUTH:
      return {
        ...state,
        auth: { ...state.auth, ...action.payload },
      };
    case actionTypes.SET_AUTH_LOADING:
      return {
        ...state,
        auth: { ...state.auth, loading: action.payload },
      };
    case actionTypes.SET_AUTH_ERROR:
      return {
        ...state,
        auth: { ...state.auth, error: action.payload, loading: false },
      };
    case actionTypes.LOGOUT:
      return {
        ...initialState,
        theme: state.theme,
      };
    case actionTypes.SET_USER_ROLE:
      return {
        ...state,
        userRole: { ...state.userRole, ...action.payload },
      };
    case actionTypes.SET_THEME:
      return {
        ...state,
        theme: { ...state.theme, ...action.payload },
      };
    case actionTypes.TOGGLE_DARK_MODE:
      return {
        ...state,
        theme: { 
          ...state.theme, 
          isDarkMode: !state.theme.isDarkMode,
          backgroundColor: !state.theme.isDarkMode ? '#121212' : '#FFFFFF',
          textColor: !state.theme.isDarkMode ? '#FFFFFF' : '#000000',
        },
      };
    case actionTypes.SET_ACTIVE_TAB:
      return {
        ...state,
        navigation: { ...state.navigation, activeTab: action.payload },
      };
    case actionTypes.SET_DRAWER_OPEN:
      return {
        ...state,
        navigation: { ...state.navigation, drawerOpen: action.payload },
      };
    case actionTypes.SET_CURRENT_SCREEN:
      return {
        ...state,
        navigation: { 
          ...state.navigation, 
          previousScreen: state.navigation.currentScreen,
          currentScreen: action.payload 
        },
      };
    case actionTypes.SET_SELECTED_CLASS:
      return {
        ...state,
        selection: { ...state.selection, selectedClass: action.payload },
      };
    case actionTypes.SET_SELECTED_STUDENT:
      return {
        ...state,
        selection: { ...state.selection, selectedStudent: action.payload },
      };
    case actionTypes.SET_SELECTED_STAFF:
      return {
        ...state,
        selection: { ...state.selection, selectedStaff: action.payload },
      };
    case actionTypes.SET_STUDENTS:
      return {
        ...state,
        students: { 
          ...state.students, 
          studentList: action.payload,
          loading: false,
          error: null,
        },
      };
    case actionTypes.SET_STAFF:
      return {
        ...state,
        staff: { 
          ...state.staff, 
          staffList: action.payload,
          loading: false,
          error: null,
        },
      };
    case actionTypes.SET_DASHBOARD_STATS:
      return {
        ...state,
        reports: { ...state.reports, dashboardStats: action.payload },
      };
    case actionTypes.SET_LOADING:
      return {
        ...state,
        ui: { ...state.ui, loading: action.payload },
      };
    case actionTypes.SET_ERROR:
      return {
        ...state,
        ui: { ...state.ui, error: action.payload },
      };
    case actionTypes.SET_SUCCESS_MESSAGE:
      return {
        ...state,
        ui: { ...state.ui, successMessage: action.payload },
      };
    case actionTypes.CLEAR_MESSAGES:
      return {
        ...state,
        ui: { 
          ...state.ui, 
          error: null, 
          successMessage: null,
        },
      };
    default:
      return state;
  }
};

// Create contexts
const AppStateContext = createContext();
const AppDispatchContext = createContext();

// Provider component
export const AppStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

// Custom hooks
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};

export const useAppDispatch = () => {
  const context = useContext(AppDispatchContext);
  if (!context) {
    throw new Error('useAppDispatch must be used within AppStateProvider');
  }
  return context;
};

// Convenience hooks
export const useAuth = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();
  
  const setAuth = (authData) => {
    dispatch({ type: actionTypes.SET_AUTH, payload: authData });
  };
  
  const setAuthLoading = (loading) => {
    dispatch({ type: actionTypes.SET_AUTH_LOADING, payload: loading });
  };
  
  const setAuthError = (error) => {
    dispatch({ type: actionTypes.SET_AUTH_ERROR, payload: error });
  };
  
  const logout = () => {
    dispatch({ type: actionTypes.LOGOUT });
  };
  
  return {
    auth: state.auth,
    setAuth,
    setAuthLoading,
    setAuthError,
    logout,
  };
};

export const useUserRole = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();
  
  const setUserRole = (roleData) => {
    dispatch({ type: actionTypes.SET_USER_ROLE, payload: roleData });
  };
  
  return {
    userRole: state.userRole,
    setUserRole,
  };
};

export const useTheme = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();
  
  const setTheme = (themeData) => {
    dispatch({ type: actionTypes.SET_THEME, payload: themeData });
  };
  
  const toggleDarkMode = () => {
    dispatch({ type: actionTypes.TOGGLE_DARK_MODE });
  };
  
  return {
    theme: state.theme,
    setTheme,
    toggleDarkMode,
  };
};

export const useNavigation = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();
  
  const setActiveTab = (tab) => {
    dispatch({ type: actionTypes.SET_ACTIVE_TAB, payload: tab });
  };
  
  const setDrawerOpen = (open) => {
    dispatch({ type: actionTypes.SET_DRAWER_OPEN, payload: open });
  };
  
  const setCurrentScreen = (screen) => {
    dispatch({ type: actionTypes.SET_CURRENT_SCREEN, payload: screen });
  };
  
  return {
    navigation: state.navigation,
    setActiveTab,
    setDrawerOpen,
    setCurrentScreen,
  };
};

export const useSelection = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();
  
  const setSelectedClass = (classData) => {
    dispatch({ type: actionTypes.SET_SELECTED_CLASS, payload: classData });
  };
  
  const setSelectedStudent = (student) => {
    dispatch({ type: actionTypes.SET_SELECTED_STUDENT, payload: student });
  };
  
  const setSelectedStaff = (staff) => {
    dispatch({ type: actionTypes.SET_SELECTED_STAFF, payload: staff });
  };
  
  return {
    selection: state.selection,
    setSelectedClass,
    setSelectedStudent,
    setSelectedStaff,
  };
};

export const useStudents = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();
  
  const setStudents = (students) => {
    dispatch({ type: actionTypes.SET_STUDENTS, payload: students });
  };
  
  return {
    students: state.students,
    setStudents,
  };
};

export const useStaff = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();
  
  const setStaff = (staff) => {
    dispatch({ type: actionTypes.SET_STAFF, payload: staff });
  };
  
  return {
    staff: state.staff,
    setStaff,
  };
};

export const useReports = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();
  
  const setDashboardStats = (stats) => {
    dispatch({ type: actionTypes.SET_DASHBOARD_STATS, payload: stats });
  };
  
  return {
    reports: state.reports,
    setDashboardStats,
  };
};

export const useUI = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();
  
  const setLoading = (loading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: loading });
  };
  
  const setError = (error) => {
    dispatch({ type: actionTypes.SET_ERROR, payload: error });
  };
  
  const setSuccessMessage = (message) => {
    dispatch({ type: actionTypes.SET_SUCCESS_MESSAGE, payload: message });
  };
  
  const clearMessages = () => {
    dispatch({ type: actionTypes.CLEAR_MESSAGES });
  };
  
  return {
    ui: state.ui,
    setLoading,
    setError,
    setSuccessMessage,
    clearMessages,
  };
};

export { actionTypes }; 