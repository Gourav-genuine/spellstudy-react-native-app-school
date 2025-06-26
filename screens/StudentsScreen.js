import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  Modal,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useAuth, useUserRole } from '../components/state/atoms';
import { THEME_CONFIG } from '../constants/config';
import ApiService from '../services/api';

const { width } = Dimensions.get('window');

const StudentsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { userRole } = useUserRole();
  
  // State management
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetailsVisible, setStudentDetailsVisible] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [students, searchQuery, selectedClass, selectedSection, sortBy, sortOrder]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load classes and students simultaneously
      const [classesResponse, studentsResponse] = await Promise.allSettled([
        ApiService.getAvailableClasses(),
        ApiService.getStudentsList()
      ]);

      if (classesResponse.status === 'fulfilled') {
        setClasses(classesResponse.value.classes || []);
      }

      if (studentsResponse.status === 'fulfilled') {
        setStudents(studentsResponse.value.students || []);
      }

    } catch (error) {
      console.error('Failed to load data:', error);
      Alert.alert('Error', 'Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const applyFilters = () => {
    let filtered = [...students];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(student => 
        student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNumber?.toString().includes(searchQuery) ||
        student.admissionNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Class filter
    if (selectedClass) {
      filtered = filtered.filter(student => student.className === selectedClass);
    }

    // Section filter
    if (selectedSection) {
      filtered = filtered.filter(student => student.section === selectedSection);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'rollNumber':
          aValue = a.rollNumber || 0;
          bValue = b.rollNumber || 0;
          break;
        case 'className':
          aValue = a.className || '';
          bValue = b.className || '';
          break;
        case 'section':
          aValue = a.section || '';
          bValue = b.section || '';
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredStudents(filtered);
  };

  const handleStudentPress = (student) => {
    setSelectedStudent(student);
    setStudentDetailsVisible(true);
  };

  const handleEditStudent = (student) => {
    navigation.navigate('EditStudentScreen', { studentId: student._id });
  };

  const handleDeleteStudent = (student) => {
    Alert.alert(
      'Delete Student',
      `Are you sure you want to delete ${student.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteStudent(student._id)
        }
      ]
    );
  };

  const deleteStudent = async (studentId) => {
    try {
      await ApiService.deleteStudent(studentId);
      setStudents(students.filter(s => s._id !== studentId));
      Alert.alert('Success', 'Student deleted successfully');
    } catch (error) {
      console.error('Failed to delete student:', error);
      Alert.alert('Error', 'Failed to delete student');
    }
  };

  const getAvailableSections = () => {
    if (!selectedClass || !classes.length) return [];
    
    const classData = classes.find(cls => cls.className === selectedClass);
    return classData?.sectionsAndSubjects?.map(s => s.section) || [];
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedClass('');
    setSelectedSection('');
    setSortBy('name');
    setSortOrder('asc');
    setFilterModalVisible(false);
  };

  const renderStudentCard = ({ item: student }) => (
    <TouchableOpacity
      style={styles.studentCard}
      onPress={() => handleStudentPress(student)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', 'rgba(248, 249, 250, 0.9)']}
        style={styles.studentCardGradient}
      >
        <View style={styles.studentHeader}>
          <View style={styles.studentAvatar}>
            <Text style={styles.studentInitial}>
              {student.name?.charAt(0)?.toUpperCase() || 'S'}
            </Text>
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{student.name || 'Unknown'}</Text>
            <Text style={styles.studentClass}>
              Class {student.className} - {student.section}
            </Text>
            <Text style={styles.studentRoll}>Roll No: {student.rollNumber || 'N/A'}</Text>
          </View>
          <View style={styles.studentActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => handleEditStudent(student)}
            >
              <Ionicons name="pencil" size={16} color={THEME_CONFIG.COLORS.TEXT_LIGHT} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDeleteStudent(student)}
            >
              <Ionicons name="trash" size={16} color={THEME_CONFIG.COLORS.TEXT_LIGHT} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.studentDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="id-card" size={16} color={THEME_CONFIG.COLORS.PRIMARY} />
            <Text style={styles.detailText}>
              Admission: {student.admissionNumber || 'N/A'}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="mail" size={16} color={THEME_CONFIG.COLORS.PRIMARY} />
            <Text style={styles.detailText}>
              {student.email || 'No email'}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="call" size={16} color={THEME_CONFIG.COLORS.PRIMARY} />
            <Text style={styles.detailText}>
              {student.phoneNumber || 'No phone'}
            </Text>
          </View>
        </View>
        
        {student.parentsInfo && student.parentsInfo.length > 0 && (
          <View style={styles.parentInfo}>
            <Text style={styles.parentLabel}>Parent:</Text>
            <Text style={styles.parentName}>
              {student.parentsInfo[0].name || 'Not provided'}
            </Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderFilterModal = () => (
    <Modal
      visible={filterModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter & Sort Students</Text>
            <TouchableOpacity
              onPress={() => setFilterModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={THEME_CONFIG.COLORS.TEXT_PRIMARY} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            {/* Class Filter */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Class</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedClass}
                  onValueChange={setSelectedClass}
                  style={styles.picker}
                >
                  <Picker.Item label="All Classes" value="" />
                  {classes.map((cls, index) => (
                    <Picker.Item
                      key={index}
                      label={`Class ${cls.className}`}
                      value={cls.className}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Section Filter */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Section</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedSection}
                  onValueChange={setSelectedSection}
                  style={styles.picker}
                  enabled={!!selectedClass}
                >
                  <Picker.Item label="All Sections" value="" />
                  {getAvailableSections().map((section, index) => (
                    <Picker.Item
                      key={index}
                      label={`Section ${section}`}
                      value={section}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Sort By */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Sort By</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={sortBy}
                  onValueChange={setSortBy}
                  style={styles.picker}
                >
                  <Picker.Item label="Name" value="name" />
                  <Picker.Item label="Roll Number" value="rollNumber" />
                  <Picker.Item label="Class" value="className" />
                  <Picker.Item label="Section" value="section" />
                </Picker>
              </View>
            </View>

            {/* Sort Order */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Sort Order</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={sortOrder}
                  onValueChange={setSortOrder}
                  style={styles.picker}
                >
                  <Picker.Item label="Ascending" value="asc" />
                  <Picker.Item label="Descending" value="desc" />
                </Picker>
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.clearButton]}
              onPress={clearFilters}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.applyButton]}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderStudentDetailsModal = () => (
    <Modal
      visible={studentDetailsVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setStudentDetailsVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.detailsModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Student Details</Text>
            <TouchableOpacity
              onPress={() => setStudentDetailsVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={THEME_CONFIG.COLORS.TEXT_PRIMARY} />
            </TouchableOpacity>
          </View>
          
          {selectedStudent && (
            <ScrollView style={styles.detailsBody}>
              <View style={styles.detailsHeader}>
                <View style={styles.detailsAvatar}>
                  <Text style={styles.detailsInitial}>
                    {selectedStudent.name?.charAt(0)?.toUpperCase() || 'S'}
                  </Text>
                </View>
                <Text style={styles.detailsName}>{selectedStudent.name}</Text>
                <Text style={styles.detailsClass}>
                  Class {selectedStudent.className} - {selectedStudent.section}
                </Text>
              </View>
              
              <View style={styles.detailsSection}>
                <Text style={styles.detailsSectionTitle}>Basic Information</Text>
                <View style={styles.detailsGrid}>
                  <View style={styles.detailsItem}>
                    <Text style={styles.detailsLabel}>Roll Number</Text>
                    <Text style={styles.detailsValue}>{selectedStudent.rollNumber || 'N/A'}</Text>
                  </View>
                  <View style={styles.detailsItem}>
                    <Text style={styles.detailsLabel}>Admission Number</Text>
                    <Text style={styles.detailsValue}>{selectedStudent.admissionNumber || 'N/A'}</Text>
                  </View>
                  <View style={styles.detailsItem}>
                    <Text style={styles.detailsLabel}>Gender</Text>
                    <Text style={styles.detailsValue}>{selectedStudent.gender || 'N/A'}</Text>
                  </View>
                  <View style={styles.detailsItem}>
                    <Text style={styles.detailsLabel}>Date of Birth</Text>
                    <Text style={styles.detailsValue}>
                      {selectedStudent.dateOfBirth ? 
                        new Date(selectedStudent.dateOfBirth).toLocaleDateString() : 'N/A'}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.detailsSection}>
                <Text style={styles.detailsSectionTitle}>Contact Information</Text>
                <View style={styles.detailsGrid}>
                  <View style={styles.detailsItem}>
                    <Text style={styles.detailsLabel}>Email</Text>
                    <Text style={styles.detailsValue}>{selectedStudent.email || 'N/A'}</Text>
                  </View>
                  <View style={styles.detailsItem}>
                    <Text style={styles.detailsLabel}>Phone</Text>
                    <Text style={styles.detailsValue}>{selectedStudent.phoneNumber || 'N/A'}</Text>
                  </View>
                  <View style={styles.detailsItem}>
                    <Text style={styles.detailsLabel}>Address</Text>
                    <Text style={styles.detailsValue}>{selectedStudent.address || 'N/A'}</Text>
                  </View>
                </View>
              </View>
              
              {selectedStudent.parentsInfo && selectedStudent.parentsInfo.length > 0 && (
                <View style={styles.detailsSection}>
                  <Text style={styles.detailsSectionTitle}>Parent Information</Text>
                  {selectedStudent.parentsInfo.map((parent, index) => (
                    <View key={index} style={styles.parentCard}>
                      <Text style={styles.parentRelation}>{parent.relation || 'Guardian'}</Text>
                      <View style={styles.detailsGrid}>
                        <View style={styles.detailsItem}>
                          <Text style={styles.detailsLabel}>Name</Text>
                          <Text style={styles.detailsValue}>{parent.name || 'N/A'}</Text>
                        </View>
                        <View style={styles.detailsItem}>
                          <Text style={styles.detailsLabel}>Email</Text>
                          <Text style={styles.detailsValue}>{parent.email || 'N/A'}</Text>
                        </View>
                        <View style={styles.detailsItem}>
                          <Text style={styles.detailsLabel}>Phone</Text>
                          <Text style={styles.detailsValue}>{parent.phoneNumber || 'N/A'}</Text>
                        </View>
                        <View style={styles.detailsItem}>
                          <Text style={styles.detailsLabel}>Occupation</Text>
                          <Text style={styles.detailsValue}>{parent.occupation || 'N/A'}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
              
              {selectedStudent.busService && (
                <View style={styles.detailsSection}>
                  <Text style={styles.detailsSectionTitle}>Transport Information</Text>
                  <View style={styles.detailsGrid}>
                    <View style={styles.detailsItem}>
                      <Text style={styles.detailsLabel}>Bus Service</Text>
                      <Text style={styles.detailsValue}>{selectedStudent.busService}</Text>
                    </View>
                    <View style={styles.detailsItem}>
                      <Text style={styles.detailsLabel}>Bus Number</Text>
                      <Text style={styles.detailsValue}>{selectedStudent.busNumber || 'N/A'}</Text>
                    </View>
                    <View style={styles.detailsItem}>
                      <Text style={styles.detailsLabel}>Bus Stop</Text>
                      <Text style={styles.detailsValue}>{selectedStudent.busStop || 'N/A'}</Text>
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>
          )}
          
          <View style={styles.detailsActions}>
            <TouchableOpacity
              style={[styles.detailsButton, styles.editDetailsButton]}
              onPress={() => {
                setStudentDetailsVisible(false);
                handleEditStudent(selectedStudent);
              }}
            >
              <Ionicons name="pencil" size={20} color={THEME_CONFIG.COLORS.TEXT_LIGHT} />
              <Text style={styles.editDetailsText}>Edit Student</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="school" size={64} color={THEME_CONFIG.COLORS.TEXT_SECONDARY} />
      <Text style={styles.emptyTitle}>No Students Found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery || selectedClass || selectedSection
          ? 'Try adjusting your filters'
          : 'Add your first student to get started'}
      </Text>
      {!searchQuery && !selectedClass && !selectedSection && (
        <TouchableOpacity
          style={styles.addFirstButton}
          onPress={() => navigation.navigate('AddStudentScreen')}
        >
          <Text style={styles.addFirstButtonText}>Add First Student</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <LinearGradient
      colors={THEME_CONFIG.GRADIENTS.PRIMARY}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={THEME_CONFIG.COLORS.TEXT_LIGHT} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Students</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddStudentScreen')}
            style={styles.addButton}
          >
            <Ionicons name="add" size={24} color={THEME_CONFIG.COLORS.TEXT_LIGHT} />
          </TouchableOpacity>
        </View>

        {/* Search and Filter Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={THEME_CONFIG.COLORS.TEXT_SECONDARY} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search students..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={THEME_CONFIG.COLORS.TEXT_SECONDARY}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close" size={20} color={THEME_CONFIG.COLORS.TEXT_SECONDARY} />
              </TouchableOpacity>
            ) : null}
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons name="options" size={20} color={THEME_CONFIG.COLORS.TEXT_LIGHT} />
          </TouchableOpacity>
        </View>

        {/* Stats Bar */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filteredStudents.length}</Text>
            <Text style={styles.statLabel}>
              {filteredStudents.length === 1 ? 'Student' : 'Students'}
            </Text>
          </View>
          {selectedClass && (
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{selectedClass}</Text>
              <Text style={styles.statLabel}>Class</Text>
            </View>
          )}
          {selectedSection && (
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{selectedSection}</Text>
              <Text style={styles.statLabel}>Section</Text>
            </View>
          )}
        </View>

        {/* Students List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading students...</Text>
          </View>
        ) : filteredStudents.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={filteredStudents}
            renderItem={renderStudentCard}
            keyExtractor={(item) => item._id || item.rollNumber?.toString() || Math.random().toString()}
            style={styles.studentsList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={THEME_CONFIG.COLORS.TEXT_LIGHT}
              />
            }
            contentContainerStyle={styles.studentsListContent}
          />
        )}

        {/* Modals */}
        {renderFilterModal()}
        {renderStudentDetailsModal()}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME_CONFIG.SPACING.LG,
    paddingVertical: THEME_CONFIG.SPACING.MD,
  },
  backButton: {
    padding: THEME_CONFIG.SPACING.SM,
  },
  headerTitle: {
    fontSize: THEME_CONFIG.FONT_SIZES.XL,
    fontWeight: '700',
    color: THEME_CONFIG.COLORS.TEXT_LIGHT,
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: THEME_CONFIG.BORDER_RADIUS.ROUND,
    padding: THEME_CONFIG.SPACING.SM,
  },
  
  // Search and Filter
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: THEME_CONFIG.SPACING.LG,
    paddingBottom: THEME_CONFIG.SPACING.MD,
    gap: THEME_CONFIG.SPACING.SM,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_CONFIG.COLORS.BACKGROUND_CARD,
    borderRadius: THEME_CONFIG.BORDER_RADIUS.MD,
    paddingHorizontal: THEME_CONFIG.SPACING.MD,
    ...THEME_CONFIG.SHADOWS.SMALL,
  },
  searchInput: {
    flex: 1,
    paddingVertical: THEME_CONFIG.SPACING.MD,
    paddingHorizontal: THEME_CONFIG.SPACING.SM,
    fontSize: THEME_CONFIG.FONT_SIZES.MD,
    color: THEME_CONFIG.COLORS.TEXT_PRIMARY,
  },
  filterButton: {
    backgroundColor: THEME_CONFIG.COLORS.PRIMARY,
    borderRadius: THEME_CONFIG.BORDER_RADIUS.MD,
    padding: THEME_CONFIG.SPACING.MD,
    ...THEME_CONFIG.SHADOWS.SMALL,
  },
  
  // Stats Bar
  statsBar: {
    flexDirection: 'row',
    backgroundColor: THEME_CONFIG.COLORS.BACKGROUND_CARD,
    marginHorizontal: THEME_CONFIG.SPACING.LG,
    marginBottom: THEME_CONFIG.SPACING.MD,
    borderRadius: THEME_CONFIG.BORDER_RADIUS.MD,
    padding: THEME_CONFIG.SPACING.MD,
    ...THEME_CONFIG.SHADOWS.SMALL,
  },
  statItem: {
    alignItems: 'center',
    marginRight: THEME_CONFIG.SPACING.XL,
  },
  statNumber: {
    fontSize: THEME_CONFIG.FONT_SIZES.LG,
    fontWeight: '700',
    color: THEME_CONFIG.COLORS.PRIMARY,
  },
  statLabel: {
    fontSize: THEME_CONFIG.FONT_SIZES.SM,
    color: THEME_CONFIG.COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  
  // Students List
  studentsList: {
    flex: 1,
  },
  studentsListContent: {
    padding: THEME_CONFIG.SPACING.LG,
    gap: THEME_CONFIG.SPACING.MD,
  },
  
  // Student Card
  studentCard: {
    borderRadius: THEME_CONFIG.BORDER_RADIUS.MD,
    ...THEME_CONFIG.SHADOWS.MEDIUM,
    overflow: 'hidden',
  },
  studentCardGradient: {
    padding: THEME_CONFIG.SPACING.LG,
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME_CONFIG.SPACING.MD,
  },
  studentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: THEME_CONFIG.COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME_CONFIG.SPACING.MD,
  },
  studentInitial: {
    fontSize: THEME_CONFIG.FONT_SIZES.LG,
    fontWeight: '700',
    color: THEME_CONFIG.COLORS.TEXT_LIGHT,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: THEME_CONFIG.FONT_SIZES.LG,
    fontWeight: '600',
    color: THEME_CONFIG.COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  studentClass: {
    fontSize: THEME_CONFIG.FONT_SIZES.SM,
    color: THEME_CONFIG.COLORS.PRIMARY,
    fontWeight: '500',
    marginBottom: 2,
  },
  studentRoll: {
    fontSize: THEME_CONFIG.FONT_SIZES.SM,
    color: THEME_CONFIG.COLORS.TEXT_SECONDARY,
  },
  studentActions: {
    flexDirection: 'row',
    gap: THEME_CONFIG.SPACING.SM,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: THEME_CONFIG.COLORS.SUCCESS,
  },
  deleteButton: {
    backgroundColor: THEME_CONFIG.COLORS.ERROR,
  },
  
  // Student Details
  studentDetails: {
    gap: THEME_CONFIG.SPACING.XS,
    marginBottom: THEME_CONFIG.SPACING.MD,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME_CONFIG.SPACING.SM,
  },
  detailText: {
    fontSize: THEME_CONFIG.FONT_SIZES.SM,
    color: THEME_CONFIG.COLORS.TEXT_SECONDARY,
    flex: 1,
  },
  
  // Parent Info
  parentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    padding: THEME_CONFIG.SPACING.SM,
    borderRadius: THEME_CONFIG.BORDER_RADIUS.SM,
    gap: THEME_CONFIG.SPACING.SM,
  },
  parentLabel: {
    fontSize: THEME_CONFIG.FONT_SIZES.SM,
    color: THEME_CONFIG.COLORS.PRIMARY,
    fontWeight: '500',
  },
  parentName: {
    fontSize: THEME_CONFIG.FONT_SIZES.SM,
    color: THEME_CONFIG.COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  
  // Loading and Empty States
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: THEME_CONFIG.FONT_SIZES.MD,
    color: THEME_CONFIG.COLORS.TEXT_LIGHT,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME_CONFIG.SPACING.XXL,
  },
  emptyTitle: {
    fontSize: THEME_CONFIG.FONT_SIZES.XL,
    fontWeight: '600',
    color: THEME_CONFIG.COLORS.TEXT_LIGHT,
    marginTop: THEME_CONFIG.SPACING.MD,
    marginBottom: THEME_CONFIG.SPACING.SM,
  },
  emptySubtitle: {
    fontSize: THEME_CONFIG.FONT_SIZES.MD,
    color: THEME_CONFIG.COLORS.TEXT_LIGHT,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: THEME_CONFIG.SPACING.XL,
  },
  addFirstButton: {
    backgroundColor: THEME_CONFIG.COLORS.SUCCESS,
    paddingHorizontal: THEME_CONFIG.SPACING.XL,
    paddingVertical: THEME_CONFIG.SPACING.MD,
    borderRadius: THEME_CONFIG.BORDER_RADIUS.MD,
  },
  addFirstButtonText: {
    color: THEME_CONFIG.COLORS.TEXT_LIGHT,
    fontSize: THEME_CONFIG.FONT_SIZES.MD,
    fontWeight: '600',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: THEME_CONFIG.COLORS.BACKGROUND_LIGHT,
    borderRadius: THEME_CONFIG.BORDER_RADIUS.LG,
    width: width - 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: THEME_CONFIG.SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: THEME_CONFIG.COLORS.BORDER,
  },
  modalTitle: {
    fontSize: THEME_CONFIG.FONT_SIZES.XL,
    fontWeight: '600',
    color: THEME_CONFIG.COLORS.TEXT_PRIMARY,
  },
  closeButton: {
    padding: THEME_CONFIG.SPACING.SM,
  },
  modalBody: {
    maxHeight: 400,
  },
  
  // Filter Modal
  filterGroup: {
    padding: THEME_CONFIG.SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: THEME_CONFIG.COLORS.BORDER,
  },
  filterLabel: {
    fontSize: THEME_CONFIG.FONT_SIZES.MD,
    fontWeight: '600',
    color: THEME_CONFIG.COLORS.TEXT_PRIMARY,
    marginBottom: THEME_CONFIG.SPACING.SM,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: THEME_CONFIG.COLORS.BORDER,
    borderRadius: THEME_CONFIG.BORDER_RADIUS.SM,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  modalActions: {
    flexDirection: 'row',
    padding: THEME_CONFIG.SPACING.LG,
    gap: THEME_CONFIG.SPACING.MD,
  },
  modalButton: {
    flex: 1,
    paddingVertical: THEME_CONFIG.SPACING.MD,
    borderRadius: THEME_CONFIG.BORDER_RADIUS.MD,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: THEME_CONFIG.COLORS.TEXT_SECONDARY,
  },
  clearButtonText: {
    color: THEME_CONFIG.COLORS.TEXT_LIGHT,
    fontSize: THEME_CONFIG.FONT_SIZES.MD,
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: THEME_CONFIG.COLORS.PRIMARY,
  },
  applyButtonText: {
    color: THEME_CONFIG.COLORS.TEXT_LIGHT,
    fontSize: THEME_CONFIG.FONT_SIZES.MD,
    fontWeight: '600',
  },
  
  // Student Details Modal
  detailsModalContent: {
    backgroundColor: THEME_CONFIG.COLORS.BACKGROUND_LIGHT,
    borderRadius: THEME_CONFIG.BORDER_RADIUS.LG,
    width: width - 20,
    maxHeight: '90%',
  },
  detailsBody: {
    maxHeight: 500,
  },
  detailsHeader: {
    alignItems: 'center',
    padding: THEME_CONFIG.SPACING.XL,
    borderBottomWidth: 1,
    borderBottomColor: THEME_CONFIG.COLORS.BORDER,
  },
  detailsAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: THEME_CONFIG.COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME_CONFIG.SPACING.MD,
  },
  detailsInitial: {
    fontSize: THEME_CONFIG.FONT_SIZES.XXL,
    fontWeight: '700',
    color: THEME_CONFIG.COLORS.TEXT_LIGHT,
  },
  detailsName: {
    fontSize: THEME_CONFIG.FONT_SIZES.XL,
    fontWeight: '600',
    color: THEME_CONFIG.COLORS.TEXT_PRIMARY,
    marginBottom: THEME_CONFIG.SPACING.XS,
  },
  detailsClass: {
    fontSize: THEME_CONFIG.FONT_SIZES.MD,
    color: THEME_CONFIG.COLORS.PRIMARY,
    fontWeight: '500',
  },
  detailsSection: {
    padding: THEME_CONFIG.SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: THEME_CONFIG.COLORS.BORDER,
  },
  detailsSectionTitle: {
    fontSize: THEME_CONFIG.FONT_SIZES.LG,
    fontWeight: '600',
    color: THEME_CONFIG.COLORS.TEXT_PRIMARY,
    marginBottom: THEME_CONFIG.SPACING.MD,
  },
  detailsGrid: {
    gap: THEME_CONFIG.SPACING.MD,
  },
  detailsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: THEME_CONFIG.SPACING.SM,
  },
  detailsLabel: {
    fontSize: THEME_CONFIG.FONT_SIZES.SM,
    color: THEME_CONFIG.COLORS.TEXT_SECONDARY,
    fontWeight: '500',
    flex: 1,
  },
  detailsValue: {
    fontSize: THEME_CONFIG.FONT_SIZES.SM,
    color: THEME_CONFIG.COLORS.TEXT_PRIMARY,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  parentCard: {
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
    borderRadius: THEME_CONFIG.BORDER_RADIUS.MD,
    padding: THEME_CONFIG.SPACING.MD,
    marginBottom: THEME_CONFIG.SPACING.MD,
  },
  parentRelation: {
    fontSize: THEME_CONFIG.FONT_SIZES.MD,
    fontWeight: '600',
    color: THEME_CONFIG.COLORS.PRIMARY,
    marginBottom: THEME_CONFIG.SPACING.SM,
  },
  detailsActions: {
    padding: THEME_CONFIG.SPACING.LG,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME_CONFIG.SPACING.MD,
    borderRadius: THEME_CONFIG.BORDER_RADIUS.MD,
    gap: THEME_CONFIG.SPACING.SM,
  },
  editDetailsButton: {
    backgroundColor: THEME_CONFIG.COLORS.PRIMARY,
  },
  editDetailsText: {
    color: THEME_CONFIG.COLORS.TEXT_LIGHT,
    fontSize: THEME_CONFIG.FONT_SIZES.MD,
    fontWeight: '600',
  },
});

export default StudentsScreen; 