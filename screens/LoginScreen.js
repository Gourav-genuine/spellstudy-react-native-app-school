import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import { useAuth, useUserRole } from '../components/state/atoms';
import { THEME_CONFIG } from '../constants/config';
import ApiService from '../services/api';

const LoginScreen = ({ navigation, onAuthSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { setAuth, setAuthError } = useAuth();
  const { setUserRole } = useUserRole();

  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem('savedUsername');
      const savedRememberMe = await AsyncStorage.getItem('rememberMe');
      
      if (savedUsername && savedRememberMe === 'true') {
        setFormData(prev => ({ ...prev, username: savedUsername }));
        setRememberMe(true);
      }
    } catch (error) {
      console.error('Error loading saved credentials:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter your username',
      });
      return false;
    }

    if (!formData.password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter your password',
      });
      return false;
    }

    // if (formData.password.length < 6) {
    //   Toast.show({
    //     type: 'error',
    //     text1: 'Validation Error',
    //     text2: 'Password must be at least 6 characters',
    //   });
    //   return false;
    // }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setAuthError(null);

    try {
      const response = await ApiService.login({
        username: formData.username.trim(),
        password: formData.password,
      });

      console.log('Full login response:', response);

      // Handle different response structures
      let user, token;
      if (response.success && response.data) {
        // Structure: { success: true, data: { user, token } }
        user = response.data.user;
        token = response.data.token;
      } else if (response.user && response.token) {
        // Structure: { user, token, ... }
        user = response.user;
        token = response.token;
      } else if (response.message === 'Login successful' && response.user) {
        // Structure: { message: 'Login successful', user, token, ... }
        user = response.user;
        token = response.token;
      } else {
        throw new Error('Invalid response structure');
      }

      if (user && token) {

        // Save credentials if remember me is checked
        if (rememberMe) {
          await AsyncStorage.setItem('savedUsername', formData.username);
          await AsyncStorage.setItem('rememberMe', 'true');
        } else {
          await AsyncStorage.removeItem('savedUsername');
          await AsyncStorage.removeItem('rememberMe');
        }

        // Set authentication state
        const authData = {
          user: {
            ...user,
            role: user.role || 'Staff',
            roles: user.roles || [user.role || 'Staff'],
            permissions: user.permissions || [],
          },
          token,
        };

        if (onAuthSuccess) {
          onAuthSuccess(authData);
        }

        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: `Welcome back, ${user.personname || user.username}!`,
        });
      } else {
        throw new Error('Missing user or token in response');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different types of errors
      let errorMessage = 'Login failed';
      let errorTitle = 'Login Failed';
      
      if (error.message === 'Login successful') {
        // This is actually a success but structured differently
        console.log('Login was successful but response structure unexpected');
        return; // Don't show error for successful login
      } else if (error.message === 'Invalid response structure') {
        errorMessage = 'Unexpected server response format';
      } else if (error.message === 'Missing user or token in response') {
        errorMessage = 'Server response missing required data';
      } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        errorMessage = 'Invalid username or password';
      } else if (error.message.includes('Network') || error.message.includes('fetch')) {
        errorMessage = 'Network connection error';
        errorTitle = 'Connection Error';
      } else {
        errorMessage = error.response?.data?.message || error.message || 'Login failed';
      }
      
      setAuthError(errorMessage);
      Toast.show({
        type: 'error',
        text1: errorTitle,
        text2: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    
    try {
      // Simulate demo login
      const demoUser = {
        _id: 'demo123',
        username: 'demo.admin',
        personname: 'Demo Administrator',
        email: 'demo@spellstudy.com',
        role: 'Admin',
        roles: ['Admin'],
        permissions: ['all'],
        school: 'demo-school-id',
        schoolName: 'Demo School',
      };
      
      const demoToken = 'demo-token-123';
      
      const authData = {
        user: demoUser,
        token: demoToken,
      };

      if (onAuthSuccess) {
        onAuthSuccess(authData);
      }

      Toast.show({
        type: 'success',
        text1: 'Demo Login Successful',
        text2: 'Welcome to SpellStudy Demo!',
      });
    } catch (error) {
      console.error('Demo login error:', error);
      Toast.show({
        type: 'error',
        text1: 'Demo Login Failed',
        text2: 'Please try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (navigation) {
      navigation.navigate('ForgotPassword');
    } else {
      Toast.show({
        type: 'info',
        text1: 'Forgot Password',
        text2: 'Please contact your administrator',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Icon name="school" size={80} color="#FFFFFF" />
            </View>
            <Text style={styles.appName}>SpellStudy School</Text>
            <Text style={styles.tagline}>School Management System</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Sign In</Text>
            
            {/* Username Input */}
            <View style={styles.inputContainer}>
              <Icon name="person" size={20} color={THEME_CONFIG.COLORS.TEXT_SECONDARY} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Username or Email"
                placeholderTextColor={THEME_CONFIG.COLORS.TEXT_SECONDARY}
                value={formData.username}
                onChangeText={(text) => handleInputChange('username', text)}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
                editable={!isLoading}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color={THEME_CONFIG.COLORS.TEXT_SECONDARY} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Password"
                placeholderTextColor={THEME_CONFIG.COLORS.TEXT_SECONDARY}
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <Icon
                  name={showPassword ? 'visibility' : 'visibility-off'}
                  size={20}
                  color={THEME_CONFIG.COLORS.TEXT_SECONDARY}
                />
              </TouchableOpacity>
            </View>

            {/* Remember Me */}
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.rememberMeContainer}
                onPress={() => setRememberMe(!rememberMe)}
                disabled={isLoading}
              >
                <Icon
                  name={rememberMe ? 'check-box' : 'check-box-outline-blank'}
                  size={20}
                  color={THEME_CONFIG.COLORS.PRIMARY}
                />
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleForgotPassword}
                disabled={isLoading}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {/* Demo Login Button */}
            <TouchableOpacity
              style={[styles.demoButton, isLoading && styles.demoButtonDisabled]}
              onPress={handleDemoLogin}
              disabled={isLoading}
            >
              <Text style={styles.demoButtonText}>
                {isLoading ? 'Loading Demo...' : 'Try Demo Login'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Need help? Contact your school administrator
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_CONFIG.COLORS.BACKGROUND,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: THEME_CONFIG.COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: THEME_CONFIG.COLORS.TEXT_PRIMARY,
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    color: THEME_CONFIG.COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: THEME_CONFIG.COLORS.SURFACE,
    borderRadius: 20,
    padding: 30,
    marginBottom: 30,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME_CONFIG.COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: THEME_CONFIG.COLORS.BACKGROUND,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: THEME_CONFIG.COLORS.TEXT_PRIMARY,
  },
  eyeIcon: {
    padding: 5,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    fontSize: 14,
    color: THEME_CONFIG.COLORS.TEXT_PRIMARY,
    marginLeft: 8,
  },
  forgotPasswordText: {
    color: THEME_CONFIG.COLORS.PRIMARY,
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: THEME_CONFIG.COLORS.PRIMARY,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: THEME_CONFIG.COLORS.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  loginButtonDisabled: {
    backgroundColor: THEME_CONFIG.COLORS.TEXT_SECONDARY,
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  demoButton: {
    backgroundColor: THEME_CONFIG.COLORS.SUCCESS,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 15,
    borderWidth: 2,
    borderColor: THEME_CONFIG.COLORS.SUCCESS,
  },
  demoButtonDisabled: {
    backgroundColor: THEME_CONFIG.COLORS.TEXT_SECONDARY,
  },
  demoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  footerText: {
    color: THEME_CONFIG.COLORS.TEXT_SECONDARY,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default LoginScreen; 