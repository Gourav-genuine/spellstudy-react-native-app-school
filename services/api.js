import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/config';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  // Helper method to get auth headers
  async getAuthHeaders() {
    const token = await AsyncStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers = await this.getAuthHeaders();
      
      const config = {
        headers,
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Authentication Methods
  async login(credentials) {
    return this.request(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyToken() {
    return this.request(API_ENDPOINTS.AUTH.VERIFY, {
      method: 'GET',
    });
  }

  async forgotPassword(email) {
    return this.request(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token, password) {
    return this.request(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  // User Management Methods
  async getUserProfile() {
    return this.request(API_ENDPOINTS.USER.PROFILE, {
      method: 'GET',
    });
  }

  async getUserRoleInfo() {
    return this.request(API_ENDPOINTS.USER.ROLE_INFO, {
      method: 'GET',
    });
  }

  async updateAdminCredentials(data) {
    return this.request(API_ENDPOINTS.USER.UPDATE_ADMIN_CREDENTIALS, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async storePushTokens(tokens) {
    return this.request(API_ENDPOINTS.USER.PUSH_TOKENS, {
      method: 'POST',
      body: JSON.stringify(tokens),
    });
  }

  // Class Management Methods
  async getAvailableClasses() {
    return this.request(API_ENDPOINTS.CLASS.GET_AVAILABLE_CLASSES, {
      method: 'GET',
    });
  }

  async getClass(className, section) {
    return this.request(`${API_ENDPOINTS.CLASS.GET_CLASS}?className=${className}&section=${section}`, {
      method: 'GET',
    });
  }

  async getStudentList(className, section) {
    return this.request(`${API_ENDPOINTS.CLASS.GET_STUDENT_LIST}?className=${className}&section=${section}`, {
      method: 'GET',
    });
  }

  async getPartialStudentList(classId) {
    return this.request(`${API_ENDPOINTS.CLASS.GET_PARTIAL_STUDENT_LIST}?classId=${classId}`, {
      method: 'GET',
    });
  }

  async addNewClass(classData) {
    return this.request(API_ENDPOINTS.CLASS.ADD_NEW_CLASS, {
      method: 'POST',
      body: JSON.stringify(classData),
    });
  }

  async updateClass(classId, classData) {
    return this.request(`${API_ENDPOINTS.CLASS.UPDATE_CLASS}/${classId}`, {
      method: 'PUT',
      body: JSON.stringify(classData),
    });
  }

  async deleteClass(classId) {
    return this.request(`${API_ENDPOINTS.CLASS.DELETE_CLASS}/${classId}`, {
      method: 'DELETE',
    });
  }

  async getAllClassesAttendance(date) {
    return this.request(`${API_ENDPOINTS.CLASS.GET_ALL_CLASSES_ATTENDANCE}?date=${date}`, {
      method: 'GET',
    });
  }

  // Student Management Methods
  async addNewStudent(studentData) {
    return this.request(API_ENDPOINTS.STUDENT.ADD_NEW_STUDENT, {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  }

  async updateStudent(studentId, studentData) {
    return this.request(`${API_ENDPOINTS.STUDENT.UPDATE_STUDENT}/${studentId}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  }

  async deleteStudent(studentId) {
    return this.request(`${API_ENDPOINTS.STUDENT.DELETE_STUDENT}/${studentId}`, {
      method: 'DELETE',
    });
  }

  async getStudentDetails(studentId) {
    return this.request(`${API_ENDPOINTS.STUDENT.GET_STUDENT_DETAILS}/${studentId}`, {
      method: 'GET',
    });
  }

  async updateDailyReport(reportData) {
    return this.request(API_ENDPOINTS.STUDENT.UPDATE_DAILY_REPORT, {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  }

  async updateTestReport(reportData) {
    return this.request(API_ENDPOINTS.STUDENT.UPDATE_TEST_REPORT, {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  }

  async getAttendance(params) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`${API_ENDPOINTS.STUDENT.GET_ATTENDANCE}?${queryString}`, {
      method: 'GET',
    });
  }

  async updateAttendance(attendanceData) {
    return this.request(API_ENDPOINTS.STUDENT.UPDATE_ATTENDANCE, {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  }

  // Staff Management Methods
  async addNewStaff(staffData) {
    return this.request(API_ENDPOINTS.STAFF.ADD_NEW_STAFF, {
      method: 'POST',
      body: JSON.stringify(staffData),
    });
  }

  async addNewTeacher(teacherData) {
    return this.request(API_ENDPOINTS.STAFF.ADD_NEW_TEACHER, {
      method: 'POST',
      body: JSON.stringify(teacherData),
    });
  }

  async getAllTeachers() {
    return this.request(API_ENDPOINTS.STAFF.GET_ALL_TEACHERS, {
      method: 'GET',
    });
  }

  async getAllStaff() {
    return this.request(API_ENDPOINTS.STAFF.GET_ALL_STAFF, {
      method: 'GET',
    });
  }

  async updateStaff(staffId, staffData) {
    return this.request(`${API_ENDPOINTS.STAFF.UPDATE_STAFF}/${staffId}`, {
      method: 'PUT',
      body: JSON.stringify(staffData),
    });
  }

  async deleteStaff(staffId) {
    return this.request(`${API_ENDPOINTS.STAFF.DELETE_STAFF}/${staffId}`, {
      method: 'DELETE',
    });
  }

  async getStaffDetails(staffId) {
    return this.request(`${API_ENDPOINTS.STAFF.GET_STAFF_DETAILS}/${staffId}`, {
      method: 'GET',
    });
  }

  // Fee Management Methods
  async getStudentFeeStatus(studentId) {
    return this.request(`${API_ENDPOINTS.FEE.GET_FEE_STATUS}?sti=${studentId}`, {
      method: 'GET',
    });
  }

  async payFee(feeData) {
    return this.request(API_ENDPOINTS.FEE.PAY_FEE, {
      method: 'POST',
      body: JSON.stringify(feeData),
    });
  }

  async getFeeSummary(mode, params) {
    const queryString = new URLSearchParams({ mode, ...params }).toString();
    return this.request(`${API_ENDPOINTS.FEE.GET_FEE_SUMMARY}?${queryString}`, {
      method: 'GET',
    });
  }

  async setFeeForClass(feeData) {
    return this.request(API_ENDPOINTS.FEE.SET_FEE_FOR_CLASS, {
      method: 'PUT',
      body: JSON.stringify(feeData),
    });
  }

  async getFeeDetailsOfClass(classId) {
    return this.request(`${API_ENDPOINTS.FEE.GET_FEE_DETAILS_OF_CLASS}?classId=${classId}`, {
      method: 'GET',
    });
  }

  async updateRequiredFeeForStudent(feeData) {
    return this.request(API_ENDPOINTS.FEE.UPDATE_REQUIRED_FEE, {
      method: 'PUT',
      body: JSON.stringify(feeData),
    });
  }

  async processFlexiblePayment(paymentData) {
    return this.request(API_ENDPOINTS.FEE.PROCESS_FLEXIBLE_PAYMENT, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getParentFeeSummary(parentId) {
    return this.request(`${API_ENDPOINTS.FEE.GET_PARENT_FEE_SUMMARY}?parentId=${parentId}`, {
      method: 'GET',
    });
  }

  // Salary Management Methods
  async getSalaryStatus(params) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`${API_ENDPOINTS.SALARY.GET_SALARY_STATUS}?${queryString}`, {
      method: 'GET',
    });
  }

  async updateSalary(salaryData) {
    return this.request(API_ENDPOINTS.SALARY.UPDATE_SALARY, {
      method: 'PUT',
      body: JSON.stringify(salaryData),
    });
  }

  async processSalary(salaryData) {
    return this.request(API_ENDPOINTS.SALARY.PROCESS_SALARY, {
      method: 'POST',
      body: JSON.stringify(salaryData),
    });
  }

  // Academic Session Methods
  async getAllAcademicSessions() {
    return this.request(API_ENDPOINTS.ACADEMIC_SESSION.GET_ALL, {
      method: 'GET',
    });
  }

  async getCurrentAcademicSession() {
    return this.request(API_ENDPOINTS.ACADEMIC_SESSION.GET_CURRENT, {
      method: 'GET',
    });
  }

  async createAcademicSession(sessionData) {
    return this.request(API_ENDPOINTS.ACADEMIC_SESSION.CREATE, {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async updateAcademicSession(sessionId, sessionData) {
    return this.request(`${API_ENDPOINTS.ACADEMIC_SESSION.UPDATE}/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    });
  }

  async deleteAcademicSession(sessionId) {
    return this.request(`${API_ENDPOINTS.ACADEMIC_SESSION.DELETE}/${sessionId}`, {
      method: 'DELETE',
    });
  }

  async activateAcademicSession(sessionId) {
    return this.request(`${API_ENDPOINTS.ACADEMIC_SESSION.ACTIVATE}/${sessionId}`, {
      method: 'PUT',
    });
  }

  // Syllabus Management Methods
  async getSyllabus(className, subject, section) {
    return this.request(`${API_ENDPOINTS.SYLLABUS.GET_SYLLABUS}?className=${className}&subject=${subject}&section=${section}`, {
      method: 'GET',
    });
  }

  async addNewSyllabus(syllabusData) {
    return this.request(API_ENDPOINTS.SYLLABUS.ADD_NEW_SYLLABUS, {
      method: 'POST',
      body: JSON.stringify(syllabusData),
    });
  }

  async updateSyllabus(syllabusData) {
    return this.request(API_ENDPOINTS.SYLLABUS.UPDATE_SYLLABUS, {
      method: 'PUT',
      body: JSON.stringify(syllabusData),
    });
  }

  async createSyllabusFromMaster(syllabusData) {
    return this.request(API_ENDPOINTS.SYLLABUS.CREATE_FROM_MASTER, {
      method: 'POST',
      body: JSON.stringify(syllabusData),
    });
  }

  async resetSyllabusFromMaster(syllabusData) {
    return this.request(API_ENDPOINTS.SYLLABUS.RESET_FROM_MASTER, {
      method: 'PUT',
      body: JSON.stringify(syllabusData),
    });
  }

  async getCombinedSyllabusCompletion() {
    return this.request(API_ENDPOINTS.SYLLABUS.GET_COMBINED_COMPLETION, {
      method: 'GET',
    });
  }

  // Parent Management Methods
  async getAllParents() {
    return this.request(API_ENDPOINTS.PARENT.GET_ALL_PARENTS, {
      method: 'GET',
    });
  }

  async getParentDetails(parentId) {
    return this.request(`${API_ENDPOINTS.PARENT.GET_PARENT_DETAILS}/${parentId}`, {
      method: 'GET',
    });
  }

  async updateParent(parentId, parentData) {
    return this.request(`${API_ENDPOINTS.PARENT.UPDATE_PARENT}/${parentId}`, {
      method: 'PUT',
      body: JSON.stringify(parentData),
    });
  }

  async searchParents(query) {
    return this.request(`${API_ENDPOINTS.PARENT.SEARCH_PARENTS}?q=${query}`, {
      method: 'GET',
    });
  }

  // Exam Management Methods
  async createExam(examData) {
    return this.request(API_ENDPOINTS.EXAM.CREATE_EXAM, {
      method: 'POST',
      body: JSON.stringify(examData),
    });
  }

  async getExams(params) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`${API_ENDPOINTS.EXAM.GET_EXAMS}?${queryString}`, {
      method: 'GET',
    });
  }

  async updateExam(examId, examData) {
    return this.request(`${API_ENDPOINTS.EXAM.UPDATE_EXAM}/${examId}`, {
      method: 'PUT',
      body: JSON.stringify(examData),
    });
  }

  async deleteExam(examId) {
    return this.request(`${API_ENDPOINTS.EXAM.DELETE_EXAM}/${examId}`, {
      method: 'DELETE',
    });
  }

  // Social Media Methods
  async getPosts(params) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`${API_ENDPOINTS.SOCIAL_MEDIA.GET_POSTS}?${queryString}`, {
      method: 'GET',
    });
  }

  async createPost(postData) {
    return this.request(API_ENDPOINTS.SOCIAL_MEDIA.CREATE_POST, {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async updatePost(postId, postData) {
    return this.request(`${API_ENDPOINTS.SOCIAL_MEDIA.UPDATE_POST}/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  }

  async deletePost(postId) {
    return this.request(`${API_ENDPOINTS.SOCIAL_MEDIA.DELETE_POST}/${postId}`, {
      method: 'DELETE',
    });
  }

  async likePost(postId) {
    return this.request(`${API_ENDPOINTS.SOCIAL_MEDIA.LIKE_POST}/${postId}`, {
      method: 'POST',
    });
  }

  async commentOnPost(postId, comment) {
    return this.request(`${API_ENDPOINTS.SOCIAL_MEDIA.COMMENT_POST}/${postId}`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    });
  }

  async getChatMessages(params) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`${API_ENDPOINTS.SOCIAL_MEDIA.GET_CHAT_MESSAGES}?${queryString}`, {
      method: 'GET',
    });
  }

  async sendMessage(messageData) {
    return this.request(API_ENDPOINTS.SOCIAL_MEDIA.SEND_MESSAGE, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  // Audit Log Methods
  async getAuditLogs(params) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`${API_ENDPOINTS.AUDIT.GET_LOGS}?${queryString}`, {
      method: 'GET',
    });
  }

  async getAuditStatistics(params) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`${API_ENDPOINTS.AUDIT.GET_STATISTICS}?${queryString}`, {
      method: 'GET',
    });
  }

  async getAuditFilters() {
    return this.request(API_ENDPOINTS.AUDIT.GET_FILTERS, {
      method: 'GET',
    });
  }

  async exportAuditLogs(params) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`${API_ENDPOINTS.AUDIT.EXPORT_LOGS}?${queryString}`, {
      method: 'GET',
    });
  }

  // Certificate Methods
  async generateCertificate(certificateData) {
    return this.request(API_ENDPOINTS.CERTIFICATE.GENERATE, {
      method: 'POST',
      body: JSON.stringify(certificateData),
    });
  }

  async getCertificateTemplates() {
    return this.request(API_ENDPOINTS.CERTIFICATE.GET_TEMPLATES, {
      method: 'GET',
    });
  }

  // Document Template Methods
  async getAllDocumentTemplates() {
    return this.request(API_ENDPOINTS.DOCUMENT_TEMPLATE.GET_ALL, {
      method: 'GET',
    });
  }

  async createDocumentTemplate(templateData) {
    return this.request(API_ENDPOINTS.DOCUMENT_TEMPLATE.CREATE, {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  }

  async updateDocumentTemplate(templateId, templateData) {
    return this.request(`${API_ENDPOINTS.DOCUMENT_TEMPLATE.UPDATE}/${templateId}`, {
      method: 'PUT',
      body: JSON.stringify(templateData),
    });
  }

  async deleteDocumentTemplate(templateId) {
    return this.request(`${API_ENDPOINTS.DOCUMENT_TEMPLATE.DELETE}/${templateId}`, {
      method: 'DELETE',
    });
  }

  // Excel Template Methods
  async getAllExcelTemplates() {
    return this.request(API_ENDPOINTS.EXCEL_TEMPLATE.GET_ALL, {
      method: 'GET',
    });
  }

  async uploadExcelTemplate(templateData) {
    return this.request(API_ENDPOINTS.EXCEL_TEMPLATE.UPLOAD, {
      method: 'POST',
      body: templateData, // FormData for file upload
    });
  }

  async downloadExcelTemplate(templateId) {
    return this.request(`${API_ENDPOINTS.EXCEL_TEMPLATE.DOWNLOAD}/${templateId}`, {
      method: 'GET',
    });
  }

  // School Management Methods
  async getSchoolInfo() {
    return this.request(API_ENDPOINTS.SCHOOL.GET_SCHOOL_INFO, {
      method: 'GET',
    });
  }

  async updateSchoolInfo(schoolData) {
    return this.request(API_ENDPOINTS.SCHOOL.UPDATE_SCHOOL_INFO, {
      method: 'PUT',
      body: JSON.stringify(schoolData),
    });
  }

  async registerSchool(schoolData) {
    return this.request(API_ENDPOINTS.SCHOOL.REGISTER_SCHOOL, {
      method: 'POST',
      body: JSON.stringify(schoolData),
    });
  }

  async approveSchool(schoolId) {
    return this.request(`${API_ENDPOINTS.SCHOOL.APPROVE_SCHOOL}/${schoolId}`, {
      method: 'PUT',
    });
  }

  // Utility Methods
  async uploadFile(file, endpoint) {
    const formData = new FormData();
    formData.append('file', file);

    const headers = await this.getAuthHeaders();
    delete headers['Content-Type']; // Let browser set content-type for FormData

    return fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    }).then(response => response.json());
  }

  // Batch operations
  async batchRequest(requests) {
    const promises = requests.map(({ endpoint, method = 'GET', body }) =>
      this.request(endpoint, { method, body: body ? JSON.stringify(body) : undefined })
    );
    
    return Promise.allSettled(promises);
  }

  // Statistics and Analytics
  async getDashboardStats() {
    const requests = [
      { endpoint: API_ENDPOINTS.CLASS.GET_AVAILABLE_CLASSES },
      { endpoint: API_ENDPOINTS.STAFF.GET_ALL_STAFF },
      { endpoint: API_ENDPOINTS.ACADEMIC_SESSION.GET_CURRENT },
    ];

    return this.batchRequest(requests);
  }
}

// Create and export a singleton instance
const ApiService_Instance = new ApiService();
export default ApiService_Instance; 