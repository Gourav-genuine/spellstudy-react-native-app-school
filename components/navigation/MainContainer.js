import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useAuth, useUserRole } from '../state/atoms';
import { THEME_CONFIG } from '../../constants/config';

// Import navigation components
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';

// Main Container Component
const MainContainer = () => {
  const { auth, setAuth } = useAuth();
  const { userRole, setUserRole } = useUserRole();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        setAuth({
          isAuthenticated: true,
          user: user,
          token: token,
          loading: false,
          error: null,
        });
        
        setUserRole({
          primaryRole: user.role,
          allRoles: user.roles || [user.role],
          highestPriorityRole: user.role,
          highestPriorityLevel: getRolePriority(user.role),
          permissions: user.permissions || [],
        });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      Toast.show({
        type: 'error',
        text1: 'Authentication Error',
        text2: 'Failed to restore session',
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const getRolePriority = (role) => {
    const priorities = {
      'Super Admin': 100,
      'Admin': 90,
      'Principal': 80,
      'Vice Principal': 70,
      'Teacher': 60,
      'Staff': 50,
      'Accountant': 40,
      'Parent': 30,
      'Student': 20,
    };
    return priorities[role] || 10;
  };

  const handleAuthSuccess = async (authData) => {
    try {
      await AsyncStorage.setItem('authToken', authData.token);
      await AsyncStorage.setItem('userData', JSON.stringify(authData.user));
      
      setAuth({
        isAuthenticated: true,
        user: authData.user,
        token: authData.token,
        loading: false,
        error: null,
      });
      
      setUserRole({
        primaryRole: authData.user.role,
        allRoles: authData.user.roles || [authData.user.role],
        highestPriorityRole: authData.user.role,
        highestPriorityLevel: getRolePriority(authData.user.role),
        permissions: authData.user.permissions || [],
      });

      Toast.show({
        type: 'success',
        text1: 'Welcome!',
        text2: `Logged in as ${authData.user.personname || authData.user.username}`,
      });
    } catch (error) {
      console.error('Error handling auth success:', error);
      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2: 'Failed to save session data',
      });
    }
  };

  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading SpellStudy...</Text>
        <Text style={styles.loadingSubtext}>Initializing school management system</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {auth.isAuthenticated ? (
        <AppTabs />
      ) : (
        <AuthStack onAuthSuccess={handleAuthSuccess} />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME_CONFIG.COLORS.BACKGROUND,
    padding: 20,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME_CONFIG.COLORS.PRIMARY,
    marginBottom: 10,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 16,
    color: THEME_CONFIG.COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});

export default MainContainer; 