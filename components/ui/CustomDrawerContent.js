import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useAuth, useUserRole } from '../state/atoms';
import { THEME_CONFIG } from '../../constants/config';

const CustomDrawerContent = ({ onLogout, ...props }) => {
  const { auth } = useAuth();
  const { userRole } = useUserRole();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: onLogout },
      ]
    );
  };

  const getRoleDisplayName = () => {
    const roleNames = {
      'Super Admin': 'Super Administrator',
      'Admin': 'Administrator',
      'Principal': 'Principal',
      'Vice Principal': 'Vice Principal',
      'Teacher': 'Teacher',
      'Accountant': 'Accountant',
      'Staff': 'Staff Member',
      'Parent': 'Parent',
      'Student': 'Student',
    };
    return roleNames[userRole.primaryRole] || userRole.primaryRole || 'User';
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} style={styles.scrollView}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {auth.user?.personname?.[0] || auth.user?.username?.[0] || 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {auth.user?.personname || auth.user?.username || 'User'}
            </Text>
            <Text style={styles.userRole}>{getRoleDisplayName()}</Text>
          </View>
        </View>

        {/* Navigation Items */}
        <View style={styles.navSection}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      {/* Footer Section */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color={THEME_CONFIG.COLORS.ERROR} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_CONFIG.COLORS.SURFACE,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: THEME_CONFIG.COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    alignItems: 'flex-start',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME_CONFIG.COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: THEME_CONFIG.COLORS.PRIMARY,
    fontWeight: '600',
  },
  navSection: {
    flex: 1,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    padding: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: THEME_CONFIG.COLORS.ERROR,
    fontWeight: '600',
  },
});

export default CustomDrawerContent;
