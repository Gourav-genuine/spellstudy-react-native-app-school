import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME_CONFIG } from '../constants/config';

const SyllabusScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Syllabus</Text>
      <Text style={styles.subtitle}>Coming Soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME_CONFIG.COLORS.BACKGROUND,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME_CONFIG.COLORS.TEXT_PRIMARY,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: THEME_CONFIG.COLORS.TEXT_SECONDARY,
  },
});

export default SyllabusScreen; 