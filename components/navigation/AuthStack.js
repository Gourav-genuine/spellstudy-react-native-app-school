import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Auth screens
import LoginScreen from '../../screens/LoginScreen';
import ForgotPasswordScreen from '../../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../../screens/ResetPasswordScreen';

// Constants
import { THEME_CONFIG } from '../../constants/config';

const Stack = createStackNavigator();

const AuthStack = ({ onAuthSuccess }) => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: THEME_CONFIG.COLORS.BACKGROUND },
        animationEnabled: true,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="Login">
        {(props) => (
          <LoginScreen 
            {...props} 
            onAuthSuccess={onAuthSuccess}
          />
        )}
      </Stack.Screen>
      
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{
          headerShown: true,
          title: 'Forgot Password',
          headerStyle: {
            backgroundColor: THEME_CONFIG.COLORS.PRIMARY,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      
      <Stack.Screen 
        name="ResetPassword" 
        component={ResetPasswordScreen}
        options={{
          headerShown: true,
          title: 'Reset Password',
          headerStyle: {
            backgroundColor: THEME_CONFIG.COLORS.PRIMARY,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack; 