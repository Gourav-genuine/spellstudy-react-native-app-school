import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';

class StorageService {
  // Generic storage methods
  async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error('Error setting item in storage:', error);
      return false;
    }
  }

  async getItem(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  }

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing item from storage:', error);
      return false;
    }
  }

  async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  // App-specific storage methods
  async setToken(token) {
    return await this.setItem(STORAGE_KEYS.TOKEN, token);
  }

  async getToken() {
    return await this.getItem(STORAGE_KEYS.TOKEN);
  }

  async removeToken() {
    return await this.removeItem(STORAGE_KEYS.TOKEN);
  }

  async setUserData(userData) {
    return await this.setItem(STORAGE_KEYS.USER_DATA, userData);
  }

  async getUserData() {
    return await this.getItem(STORAGE_KEYS.USER_DATA);
  }

  async removeUserData() {
    return await this.removeItem(STORAGE_KEYS.USER_DATA);
  }

  async setSchoolId(schoolId) {
    return await this.setItem(STORAGE_KEYS.SCHOOL_ID, schoolId);
  }

  async getSchoolId() {
    return await this.getItem(STORAGE_KEYS.SCHOOL_ID);
  }

  async setPushToken(token) {
    return await this.setItem(STORAGE_KEYS.PUSH_TOKEN, token);
  }

  async getPushToken() {
    return await this.getItem(STORAGE_KEYS.PUSH_TOKEN);
  }

  async setTheme(theme) {
    return await this.setItem(STORAGE_KEYS.THEME, theme);
  }

  async getTheme() {
    return await this.getItem(STORAGE_KEYS.THEME);
  }

  async setNotificationSettings(settings) {
    return await this.setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, settings);
  }

  async getNotificationSettings() {
    return await this.getItem(STORAGE_KEYS.NOTIFICATION_SETTINGS);
  }

  // Clear all app data
  async clearAppData() {
    try {
      await Promise.all([
        this.removeToken(),
        this.removeUserData(),
        this.removeItem(STORAGE_KEYS.SCHOOL_ID),
        this.removeItem(STORAGE_KEYS.PUSH_TOKEN),
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing app data:', error);
      return false;
    }
  }
}

export default new StorageService(); 