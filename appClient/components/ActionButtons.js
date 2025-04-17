import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const ActionButtons = ({ isDarkMode = false, onNFCPress = () => {} }) => {
  return (
    <View style={styles.actionButtons}>
      <TouchableOpacity style={isDarkMode ? styles.actionButtonDark : styles.actionButton}>
        <Text style={styles.actionButtonIcon}>□</Text>
        <Text style={isDarkMode ? styles.actionButtonTextDark : styles.actionButtonText}>
          QR Code
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={isDarkMode ? styles.actionButtonDark : styles.actionButton}
        onPress={onNFCPress}
      >
        <Text style={styles.actionButtonIcon}>⊕</Text>
        <Text style={isDarkMode ? styles.actionButtonTextDark : styles.actionButtonText}>
          NFC
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 15,
  },
  actionButton: {
    backgroundColor: '#f0f0ff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonDark: {
    backgroundColor: '#444',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonIcon: {
    marginRight: 8,
    fontSize: 18,
  },
  actionButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  actionButtonTextDark: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default ActionButtons;
