import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import DashboardScreen from '../../screens/DashboardScreen';
import StudentsScreen from '../../screens/StudentsScreen';
import ClassesScreen from '../../screens/ClassesScreen';
import StaffScreen from '../../screens/StaffScreen';
import FeesScreen from '../../screens/FeesScreen';
import ReportsScreen from '../../screens/ReportsScreen';
import SettingsScreen from '../../screens/SettingsScreen';

// Detail screens
import StudentDetailScreen from '../../screens/StudentDetailScreen';
import ClassDetailScreen from '../../screens/ClassDetailScreen';
import StaffDetailScreen from '../../screens/StaffDetailScreen';
import AttendanceScreen from '../../screens/AttendanceScreen';
import TimetableScreen from '../../screens/TimetableScreen';
import ExamsScreen from '../../screens/ExamsScreen';
import NotificationsScreen from '../../screens/NotificationsScreen';

// Form screens
import AddStudentScreen from '../../screens/AddStudentScreen';
import AddClassScreen from '../../screens/AddClassScreen';
import AddStaffScreen from '../../screens/AddStaffScreen';
import ProfileScreen from '../../screens/ProfileScreen';

// Custom components
import CustomDrawerContent from '../ui/CustomDrawerContent';

// Constants
import { THEME_CONFIG, USER_ROLES } from '../../constants/config';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Dashboard Stack
const DashboardStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: THEME_CONFIG.COLORS.PRIMARY },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen 
      name="DashboardMain" 
      component={DashboardScreen}
      options={{ title: 'Dashboard' }}
    />
    <Stack.Screen 
      name="Notifications" 
      component={NotificationsScreen}
      options={{ title: 'Notifications' }}
    />
    <Stack.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{ title: 'Profile' }}
    />
  </Stack.Navigator>
);

// Students Stack
const StudentsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: THEME_CONFIG.COLORS.PRIMARY },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen 
      name="StudentsMain" 
      component={StudentsScreen}
      options={{ title: 'Students' }}
    />
    <Stack.Screen 
      name="StudentDetail" 
      component={StudentDetailScreen}
      options={{ title: 'Student Details' }}
    />
    <Stack.Screen 
      name="AddStudent" 
      component={AddStudentScreen}
      options={{ title: 'Add Student' }}
    />
    <Stack.Screen 
      name="Attendance" 
      component={AttendanceScreen}
      options={{ title: 'Attendance' }}
    />
  </Stack.Navigator>
);

// Classes Stack
const ClassesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: THEME_CONFIG.COLORS.PRIMARY },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen 
      name="ClassesMain" 
      component={ClassesScreen}
      options={{ title: 'Classes' }}
    />
    <Stack.Screen 
      name="ClassDetail" 
      component={ClassDetailScreen}
      options={{ title: 'Class Details' }}
    />
    <Stack.Screen 
      name="AddClass" 
      component={AddClassScreen}
      options={{ title: 'Add Class' }}
    />
    <Stack.Screen 
      name="Timetable" 
      component={TimetableScreen}
      options={{ title: 'Timetable' }}
    />
  </Stack.Navigator>
);

// Staff Stack
const StaffStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: THEME_CONFIG.COLORS.PRIMARY },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen 
      name="StaffMain" 
      component={StaffScreen}
      options={{ title: 'Staff' }}
    />
    <Stack.Screen 
      name="StaffDetail" 
      component={StaffDetailScreen}
      options={{ title: 'Staff Details' }}
    />
    <Stack.Screen 
      name="AddStaff" 
      component={AddStaffScreen}
      options={{ title: 'Add Staff' }}
    />
  </Stack.Navigator>
);

// Fees Stack
const FeesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: THEME_CONFIG.COLORS.PRIMARY },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen 
      name="FeesMain" 
      component={FeesScreen}
      options={{ title: 'Fees Management' }}
    />
  </Stack.Navigator>
);

// More Stack (Drawer Navigation for additional features)
const MoreStack = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      headerStyle: { backgroundColor: THEME_CONFIG.COLORS.PRIMARY },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: { fontWeight: 'bold' },
      drawerStyle: { backgroundColor: THEME_CONFIG.COLORS.BACKGROUND },
      drawerActiveTintColor: THEME_CONFIG.COLORS.PRIMARY,
      drawerInactiveTintColor: THEME_CONFIG.COLORS.TEXT_SECONDARY,
    }}
  >
    <Drawer.Screen 
      name="Reports" 
      component={ReportsScreen}
      options={{
        title: 'Reports',
        drawerIcon: ({ color }) => (
          <Icon name="assessment" size={24} color={color} />
        ),
      }}
    />
    <Drawer.Screen 
      name="Exams" 
      component={ExamsScreen}
      options={{
        title: 'Exams',
        drawerIcon: ({ color }) => (
          <Icon name="quiz" size={24} color={color} />
        ),
      }}
    />
    <Drawer.Screen 
      name="Settings" 
      component={SettingsScreen}
      options={{
        title: 'Settings',
        drawerIcon: ({ color }) => (
          <Icon name="settings" size={24} color={color} />
        ),
      }}
    />
  </Drawer.Navigator>
);

// Main Bottom Tab Navigator
const AppTabs = ({ onLogout, userData }) => {
  const userRole = userData?.role || USER_ROLES.STAFF;

  const getTabsForRole = (role) => {
    const commonTabs = [
      {
        name: 'Dashboard',
        component: DashboardStack,
        icon: 'dashboard',
        label: 'Dashboard',
      },
    ];

    switch (role) {
      case USER_ROLES.ADMIN:
      case USER_ROLES.PRINCIPAL:
        return [
          ...commonTabs,
          {
            name: 'Students',
            component: StudentsStack,
            icon: 'school',
            label: 'Students',
          },
          {
            name: 'Classes',
            component: ClassesStack,
            icon: 'class',
            label: 'Classes',
          },
          {
            name: 'Staff',
            component: StaffStack,
            icon: 'people',
            label: 'Staff',
          },
          {
            name: 'More',
            component: MoreStack,
            icon: 'more-horiz',
            label: 'More',
          },
        ];

      case USER_ROLES.TEACHER:
        return [
          ...commonTabs,
          {
            name: 'Students',
            component: StudentsStack,
            icon: 'school',
            label: 'My Students',
          },
          {
            name: 'Classes',
            component: ClassesStack,
            icon: 'class',
            label: 'My Classes',
          },
          {
            name: 'More',
            component: MoreStack,
            icon: 'more-horiz',
            label: 'More',
          },
        ];

      case USER_ROLES.ACCOUNTANT:
        return [
          ...commonTabs,
          {
            name: 'Students',
            component: StudentsStack,
            icon: 'school',
            label: 'Students',
          },
          {
            name: 'Fees',
            component: FeesStack,
            icon: 'payment',
            label: 'Fees',
          },
          {
            name: 'More',
            component: MoreStack,
            icon: 'more-horiz',
            label: 'More',
          },
        ];

      default:
        return [
          ...commonTabs,
          {
            name: 'Students',
            component: StudentsStack,
            icon: 'school',
            label: 'Students',
          },
          {
            name: 'More',
            component: MoreStack,
            icon: 'more-horiz',
            label: 'More',
          },
        ];
    }
  };

  const tabs = getTabsForRole(userRole);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const tab = tabs.find(t => t.name === route.name);
          const iconName = tab ? tab.icon : 'circle';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: THEME_CONFIG.COLORS.PRIMARY,
        tabBarInactiveTintColor: THEME_CONFIG.COLORS.TEXT_SECONDARY,
        tabBarStyle: {
          backgroundColor: THEME_CONFIG.COLORS.SURFACE,
          borderTopColor: '#E0E0E0',
          borderTopWidth: 1,
        },
        headerShown: false,
      })}
    >
      {tabs.map((tab, index) => (
        <Tab.Screen
          key={index}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarLabel: tab.label,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default AppTabs; 