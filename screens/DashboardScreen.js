import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppState, useAuth, useUserRole } from '../components/state/atoms';
import { THEME_CONFIG, UI_CONFIG } from '../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { userRole } = useUserRole();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [visibleCategories, setVisibleCategories] = useState({});

  // Get the primary role from userRole object
  const primaryRole = userRole?.primaryRole || userRole?.highestPriorityRole || 'guest';

  // Get user's role-based permissions
  const hasPermission = (allowedRoles) => {
    if (allowedRoles.includes('all') && primaryRole === 'superuser') return true;
    return allowedRoles.includes(primaryRole);
  };

  // Task categories with navigation routes (matching web frontend structure)
  const taskCategories = {
    administration: {
      title: "🏛️ Administration & Management",
      color: "red",
      description: "Core administrative functions and school management",
      gradient: THEME_CONFIG.GRADIENTS.RED,
      roles: ["superuser", "admin"],
      tasks: [
        { 
          id: "addStudent", 
          title: "Add New Student", 
          icon: "👨‍🎓", 
          route: "AddStudentScreen",
          description: "Register new students to the school"
        },
        { 
          id: "manageStudents", 
          title: "Manage Students", 
          icon: "👥", 
          route: "StudentsScreen",
          description: "View and edit student information"
        },
        { 
          id: "addClass", 
          title: "Add New Class", 
          icon: "🏫", 
          route: "AddClassScreen",
          description: "Create new classes and sections"
        },
        { 
          id: "manageClasses", 
          title: "Manage Classes", 
          icon: "📚", 
          route: "ClassesScreen",
          description: "View and edit class information"
        },
        { 
          id: "addStaff", 
          title: "Add New Staff", 
          icon: "👨‍🏫", 
          route: "AddStaffScreen",
          description: "Add teachers and staff members"
        },
        { 
          id: "manageStaff", 
          title: "Manage Staff", 
          icon: "👨‍💼", 
          route: "StaffScreen",
          description: "View and edit staff information"
        }
      ]
    },
    academic: {
      title: "📚 Academic Operations",
      color: "green",
      description: "Teaching, learning, and classroom management",
      gradient: THEME_CONFIG.GRADIENTS.GREEN,
      roles: ["superuser", "admin", "teacher"],
      tasks: [
        { 
          id: "attendance", 
          title: "Take Attendance", 
          icon: "✅", 
          route: "AttendanceScreen",
          description: "Mark student attendance"
        },
        { 
          id: "exams", 
          title: "Manage Exams", 
          icon: "📝", 
          route: "ExamsScreen",
          description: "Create and manage examinations"
        },
        { 
          id: "syllabus", 
          title: "Syllabus Management", 
          icon: "📖", 
          route: "SyllabusScreen",
          description: "Manage course syllabus"
        },
        { 
          id: "timetable", 
          title: "Time Table", 
          icon: "🕐", 
          route: "TimetableScreen",
          description: "Create and view timetables"
        }
      ]
    },
    financial: {
      title: "💰 Financial Operations",
      color: "orange",
      description: "Fee management, salaries, and financial reporting",
      gradient: THEME_CONFIG.GRADIENTS.ORANGE,
      roles: ["superuser", "admin", "accountant"],
      tasks: [
        { 
          id: "feeManagement", 
          title: "Fee Management", 
          icon: "💳", 
          route: "FeesScreen",
          description: "Manage student fees and payments"
        },
        { 
          id: "salaryManagement", 
          title: "Salary Management", 
          icon: "💰", 
          route: "SalaryScreen",
          description: "Process staff salaries"
        },
        { 
          id: "financialReports", 
          title: "Financial Reports", 
          icon: "📊", 
          route: "FinancialReportsScreen",
          description: "View financial analytics"
        }
      ]
    },
    reports: {
      title: "📊 Reports & Analytics",
      color: "pink",
      description: "Data export, analytics, and reporting tools",
      gradient: THEME_CONFIG.GRADIENTS.PINK,
      roles: ["superuser", "admin", "teacher", "accountant"],
      tasks: [
        { 
          id: "studentReports", 
          title: "Student Reports", 
          icon: "📈", 
          route: "ReportsScreen",
          description: "Student performance analytics"
        },
        { 
          id: "attendanceReports", 
          title: "Attendance Reports", 
          icon: "📋", 
          route: "AttendanceReportsScreen",
          description: "Attendance analytics and reports"
        },
        { 
          id: "downloadRecords", 
          title: "Download Records", 
          icon: "📥", 
          route: "DownloadScreen",
          description: "Export and download data"
        }
      ]
    },
    communication: {
      title: "📱 Communication & Media",
      color: "teal",
      description: "Social media management and communication tools",
      gradient: THEME_CONFIG.GRADIENTS.TEAL,
      roles: ["superuser", "admin", "teacher", "accountant"],
      tasks: [
        { 
          id: "socialMedia", 
          title: "Social Media", 
          icon: "📱", 
          route: "SocialMediaScreen",
          description: "Manage school social media"
        },
        { 
          id: "notifications", 
          title: "Notifications", 
          icon: "🔔", 
          route: "NotificationsScreen",
          description: "Send notifications to users"
        }
      ]
    },
    personal: {
      title: "👤 Personal & Settings",
      color: "blue",
      description: "User profile and personal settings",
      gradient: THEME_CONFIG.GRADIENTS.BLUE,
      roles: ["superuser", "admin", "teacher", "accountant", "student", "parent"],
      tasks: [
        { 
          id: "profile", 
          title: "My Profile", 
          icon: "👤", 
          route: "ProfileScreen",
          description: "View and update personal information"
        },
        { 
          id: "settings", 
          title: "Settings", 
          icon: "⚙️", 
          route: "SettingsScreen",
          description: "App settings and preferences"
        }
      ]
    }
  };

  // Filter categories based on user permissions
  useEffect(() => {
    const getVisibleCategories = () => {
      const visible = {};
      
      Object.entries(taskCategories).forEach(([key, category]) => {
        if (hasPermission(category.roles)) {
          // Filter tasks by permissions
          const visibleTasks = category.tasks.filter(task => 
            hasPermission(category.roles)
          );
          
          if (visibleTasks.length > 0) {
            visible[key] = {
              ...category,
              tasks: visibleTasks
            };
          }
        }
      });
      
      return visible;
    };

    setVisibleCategories(getVisibleCategories());
  }, [primaryRole]);

  const handleCategoryClick = (categoryKey) => {
    setSelectedCategory(categoryKey);
  };

  const handleTaskClick = (task) => {
    if (task.route) {
      navigation.navigate(task.route);
    }
  };

  const handleBackClick = () => {
    setSelectedCategory(null);
  };

  // Get user role display name
  const getRoleDisplayName = () => {
    const roleNames = {
      superuser: "Super Administrator",
      admin: "Administrator", 
      teacher: "Teacher",
      accountant: "Accountant",
      student: "Student",
      parent: "Parent"
    };
    return roleNames[primaryRole] || primaryRole;
  };

  // Logout function
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                'token', 'userRole', 'userId', 'userName', 'userEmail', 'schoolId'
              ]);
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        }
      ]
    );
  };

  if (selectedCategory) {
    // Render tasks within selected category
    const category = visibleCategories[selectedCategory];
    
    return (
      <LinearGradient
        colors={THEME_CONFIG.GRADIENTS.PRIMARY}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.categoryHeader}>
              <TouchableOpacity style={styles.backButton} onPress={handleBackClick}>
                <Ionicons name="arrow-back" size={24} color={THEME_CONFIG.COLORS.TEXT_LIGHT} />
                <Text style={styles.backButtonText}>Back to Dashboard</Text>
              </TouchableOpacity>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
            </View>
            
            <View style={styles.tasksGrid}>
              {category.tasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  style={[styles.taskCard, { borderLeftColor: THEME_CONFIG.COLORS[`CATEGORY_${category.color.toUpperCase()}`] }]}
                  onPress={() => handleTaskClick(task)}
                  activeOpacity={0.7}
                >
                  <View style={styles.taskIconContainer}>
                    <Text style={styles.taskIcon}>{task.icon}</Text>
                  </View>
                  <View style={styles.taskContent}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <Text style={styles.taskDescription}>{task.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Render main dashboard
  return (
    <LinearGradient
      colors={THEME_CONFIG.GRADIENTS.PRIMARY}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Welcome Header */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>🏠 Welcome to SpellStudy</Text>
            <View style={styles.userInfo}>
              <View style={styles.userRoleBadge}>
                <Text style={styles.userRoleText}>{getRoleDisplayName()}</Text>
              </View>
              <Text style={styles.userName}>Dashboard</Text>
            </View>
            <Text style={styles.welcomeSubtitle}>Choose a category to access your tools and features</Text>
            
            {/* Quick Action - New Admission */}
            {hasPermission(["superuser", "admin"]) && (
              <TouchableOpacity 
                style={styles.quickActionCard}
                onPress={() => navigation.navigate('AddStudentScreen')}
                activeOpacity={0.8}
              >
                <View style={styles.quickActionIcon}>
                  <Text style={styles.quickActionIconText}>🎓</Text>
                </View>
                <View style={styles.quickActionContent}>
                  <Text style={styles.quickActionTitle}>New Admission</Text>
                  <Text style={styles.quickActionSubtitle}>Add new student</Text>
                </View>
                <Text style={styles.quickActionArrow}>→</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Categories Grid */}
          <View style={styles.categoriesGrid}>
            {Object.entries(visibleCategories).map(([key, category]) => (
              <TouchableOpacity
                key={key}
                style={styles.categoryCard}
                onPress={() => handleCategoryClick(key)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                  style={[styles.categoryGradient, { borderTopColor: THEME_CONFIG.COLORS[`CATEGORY_${category.color.toUpperCase()}`] }]}
                >
                  <View style={styles.categoryHeaderCard}>
                    <Text style={styles.categoryCardTitle}>{category.title}</Text>
                    <View style={[styles.taskCount, { backgroundColor: THEME_CONFIG.COLORS[`CATEGORY_${category.color.toUpperCase()}`] }]}>
                      <Text style={styles.taskCountText}>
                        {category.tasks.length} {category.tasks.length === 1 ? 'tool' : 'tools'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.categoryCardDescription}>{category.description}</Text>
                  
                  <View style={styles.categoryPreview}>
                    {category.tasks.slice(0, 3).map((task, index) => (
                      <View key={index} style={styles.previewTask}>
                        <Text style={styles.previewIcon}>{task.icon}</Text>
                        <Text style={styles.previewTitle}>{task.title}</Text>
                      </View>
                    ))}
                    {category.tasks.length > 3 && (
                      <Text style={[styles.previewMore, { color: THEME_CONFIG.COLORS[`CATEGORY_${category.color.toUpperCase()}`] }]}>
                        +{category.tasks.length - 3} more...
                      </Text>
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Quick Stats Section */}
          <View style={styles.quickStats}>
            <Text style={styles.statsTitle}>📈 Quick Overview</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>🎯</Text>
                <Text style={styles.statNumber}>{Object.keys(visibleCategories).length}</Text>
                <Text style={styles.statLabel}>Available Categories</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>🔧</Text>
                <Text style={styles.statNumber}>
                  {Object.values(visibleCategories).reduce((total, cat) => total + cat.tasks.length, 0)}
                </Text>
                <Text style={styles.statLabel}>Total Tools</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>👤</Text>
                <Text style={styles.statNumber}>{getRoleDisplayName()}</Text>
                <Text style={styles.statLabel}>Access Level</Text>
              </View>
              <TouchableOpacity style={[styles.statCard, styles.logoutCard]} onPress={handleLogout}>
                <Text style={styles.statIcon}>🚪</Text>
                <Text style={styles.logoutNumber}>Logout</Text>
                <Text style={styles.logoutLabel}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  
  // Welcome Section
  welcomeSection: {
    margin: THEME_CONFIG.SPACING.LG,
    padding: THEME_CONFIG.SPACING.XXL,
    backgroundColor: THEME_CONFIG.COLORS.BACKGROUND_CARD,
    borderRadius: THEME_CONFIG.BORDER_RADIUS.LG,
    ...THEME_CONFIG.SHADOWS.LARGE,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: THEME_CONFIG.FONT_SIZES.XXXL,
    fontWeight: '700',
    color: THEME_CONFIG.COLORS.TEXT_PRIMARY,
    marginBottom: THEME_CONFIG.SPACING.MD,
    textAlign: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME_CONFIG.SPACING.MD,
    gap: THEME_CONFIG.SPACING.SM,
  },
  userRoleBadge: {
    backgroundColor: THEME_CONFIG.COLORS.PRIMARY,
    paddingHorizontal: THEME_CONFIG.SPACING.MD,
    paddingVertical: THEME_CONFIG.SPACING.SM,
    borderRadius: THEME_CONFIG.BORDER_RADIUS.XL,
  },
  userRoleText: {
    color: THEME_CONFIG.COLORS.TEXT_LIGHT,
    fontSize: THEME_CONFIG.FONT_SIZES.SM,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: THEME_CONFIG.FONT_SIZES.LG,
    color: THEME_CONFIG.COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  welcomeSubtitle: {
    fontSize: THEME_CONFIG.FONT_SIZES.LG,
    color: THEME_CONFIG.COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: THEME_CONFIG.SPACING.LG,
  },
  
  // Quick Action
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_CONFIG.COLORS.SUCCESS,
    borderRadius: THEME_CONFIG.BORDER_RADIUS.MD,
    padding: THEME_CONFIG.SPACING.LG,
    marginTop: THEME_CONFIG.SPACING.LG,
    ...THEME_CONFIG.SHADOWS.MEDIUM,
    minWidth: 280,
    gap: THEME_CONFIG.SPACING.MD,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: THEME_CONFIG.BORDER_RADIUS.MD,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionIconText: {
    fontSize: 30,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: THEME_CONFIG.FONT_SIZES.LG,
    fontWeight: '700',
    color: THEME_CONFIG.COLORS.TEXT_LIGHT,
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: THEME_CONFIG.FONT_SIZES.MD,
    color: THEME_CONFIG.COLORS.TEXT_LIGHT,
    opacity: 0.9,
    fontWeight: '500',
  },
  quickActionArrow: {
    fontSize: THEME_CONFIG.FONT_SIZES.XL,
    color: THEME_CONFIG.COLORS.TEXT_LIGHT,
    fontWeight: 'bold',
    opacity: 0.8,
  },
  
  // Categories Grid
  categoriesGrid: {
    padding: THEME_CONFIG.SPACING.LG,
    gap: THEME_CONFIG.SPACING.LG,
  },
  categoryCard: {
    borderRadius: THEME_CONFIG.BORDER_RADIUS.LG,
    ...THEME_CONFIG.SHADOWS.LARGE,
    overflow: 'hidden',
  },
  categoryGradient: {
    padding: THEME_CONFIG.SPACING.XXL,
    borderTopWidth: 5,
    backgroundColor: THEME_CONFIG.COLORS.BACKGROUND_CARD,
  },
  categoryHeaderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME_CONFIG.SPACING.LG,
  },
  categoryCardTitle: {
    fontSize: THEME_CONFIG.FONT_SIZES.LG,
    fontWeight: '700',
    color: THEME_CONFIG.COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  taskCount: {
    paddingHorizontal: THEME_CONFIG.SPACING.MD,
    paddingVertical: THEME_CONFIG.SPACING.XS,
    borderRadius: THEME_CONFIG.BORDER_RADIUS.XL,
  },
  taskCountText: {
    color: THEME_CONFIG.COLORS.TEXT_LIGHT,
    fontSize: THEME_CONFIG.FONT_SIZES.XS,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryCardDescription: {
    fontSize: THEME_CONFIG.FONT_SIZES.MD,
    color: THEME_CONFIG.COLORS.TEXT_SECONDARY,
    marginBottom: THEME_CONFIG.SPACING.LG,
    lineHeight: 22,
  },
  categoryPreview: {
    gap: THEME_CONFIG.SPACING.SM,
  },
  previewTask: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME_CONFIG.SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    gap: THEME_CONFIG.SPACING.MD,
  },
  previewIcon: {
    fontSize: THEME_CONFIG.FONT_SIZES.LG,
    width: 30,
    textAlign: 'center',
  },
  previewTitle: {
    fontSize: THEME_CONFIG.FONT_SIZES.MD,
    color: THEME_CONFIG.COLORS.TEXT_SECONDARY,
    fontWeight: '500',
    flex: 1,
  },
  previewMore: {
    fontSize: THEME_CONFIG.FONT_SIZES.SM,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: THEME_CONFIG.SPACING.MD,
    borderTopWidth: 2,
    borderTopColor: '#ecf0f1',
    marginTop: THEME_CONFIG.SPACING.SM,
  },
  
  // Category Tasks View
  categoryHeader: {
    padding: THEME_CONFIG.SPACING.XXL,
    backgroundColor: THEME_CONFIG.COLORS.BACKGROUND_CARD,
    margin: THEME_CONFIG.SPACING.LG,
    borderRadius: THEME_CONFIG.BORDER_RADIUS.LG,
    ...THEME_CONFIG.SHADOWS.LARGE,
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_CONFIG.COLORS.PRIMARY,
    paddingHorizontal: THEME_CONFIG.SPACING.LG,
    paddingVertical: THEME_CONFIG.SPACING.MD,
    borderRadius: THEME_CONFIG.BORDER_RADIUS.XL,
    marginBottom: THEME_CONFIG.SPACING.LG,
    gap: THEME_CONFIG.SPACING.SM,
  },
  backButtonText: {
    color: THEME_CONFIG.COLORS.TEXT_LIGHT,
    fontSize: THEME_CONFIG.FONT_SIZES.MD,
    fontWeight: '600',
  },
  categoryTitle: {
    fontSize: THEME_CONFIG.FONT_SIZES.XXL,
    fontWeight: '700',
    color: THEME_CONFIG.COLORS.TEXT_PRIMARY,
    marginBottom: THEME_CONFIG.SPACING.SM,
    textAlign: 'center',
  },
  categoryDescription: {
    fontSize: THEME_CONFIG.FONT_SIZES.LG,
    color: THEME_CONFIG.COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  
  // Tasks Grid
  tasksGrid: {
    padding: THEME_CONFIG.SPACING.LG,
    gap: THEME_CONFIG.SPACING.LG,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_CONFIG.COLORS.BACKGROUND_CARD,
    borderRadius: THEME_CONFIG.BORDER_RADIUS.MD,
    padding: THEME_CONFIG.SPACING.LG,
    ...THEME_CONFIG.SHADOWS.MEDIUM,
    borderLeftWidth: 5,
    gap: THEME_CONFIG.SPACING.LG,
  },
  taskIconContainer: {
    width: 60,
    height: 60,
    borderRadius: THEME_CONFIG.BORDER_RADIUS.MD,
    backgroundColor: THEME_CONFIG.COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskIcon: {
    fontSize: 30,
    color: THEME_CONFIG.COLORS.TEXT_LIGHT,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: THEME_CONFIG.FONT_SIZES.LG,
    fontWeight: '600',
    color: THEME_CONFIG.COLORS.TEXT_PRIMARY,
    marginBottom: THEME_CONFIG.SPACING.XS,
  },
  taskDescription: {
    fontSize: THEME_CONFIG.FONT_SIZES.SM,
    color: THEME_CONFIG.COLORS.TEXT_SECONDARY,
    lineHeight: 18,
  },
  
  // Quick Stats
  quickStats: {
    margin: THEME_CONFIG.SPACING.LG,
    padding: THEME_CONFIG.SPACING.XXL,
    backgroundColor: THEME_CONFIG.COLORS.BACKGROUND_CARD,
    borderRadius: THEME_CONFIG.BORDER_RADIUS.LG,
    ...THEME_CONFIG.SHADOWS.LARGE,
  },
  statsTitle: {
    fontSize: THEME_CONFIG.FONT_SIZES.XL,
    fontWeight: '700',
    color: THEME_CONFIG.COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: THEME_CONFIG.SPACING.XXL,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME_CONFIG.SPACING.LG,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: THEME_CONFIG.BORDER_RADIUS.MD,
    padding: THEME_CONFIG.SPACING.LG,
    alignItems: 'center',
    minWidth: (width - 80) / 2 - 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  statIcon: {
    fontSize: 30,
    marginBottom: THEME_CONFIG.SPACING.MD,
  },
  statNumber: {
    fontSize: THEME_CONFIG.FONT_SIZES.XL,
    fontWeight: '700',
    color: THEME_CONFIG.COLORS.TEXT_PRIMARY,
    marginBottom: THEME_CONFIG.SPACING.XS,
  },
  statLabel: {
    fontSize: THEME_CONFIG.FONT_SIZES.SM,
    color: THEME_CONFIG.COLORS.TEXT_SECONDARY,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  logoutCard: {
    backgroundColor: THEME_CONFIG.COLORS.ERROR,
  },
  logoutNumber: {
    fontSize: THEME_CONFIG.FONT_SIZES.XL,
    fontWeight: '700',
    color: THEME_CONFIG.COLORS.TEXT_LIGHT,
    marginBottom: THEME_CONFIG.SPACING.XS,
  },
  logoutLabel: {
    fontSize: THEME_CONFIG.FONT_SIZES.SM,
    color: THEME_CONFIG.COLORS.TEXT_LIGHT,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default DashboardScreen; 