import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CustomButton({ title, onPress, type = 'primary', style }) {
  return (
    <TouchableOpacity 
      style={[styles.button, type === 'secondary' && styles.buttonSecondary, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, type === 'secondary' && styles.textSecondary]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4F46E5', // Indigo-600
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonSecondary: {
    backgroundColor: '#e0e7ff', // Indigo-100
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textSecondary: {
    color: '#4F46E5',
  },
});
