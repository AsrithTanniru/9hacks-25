import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const Header = ({ title, showBackButton = false, isDarkMode = false, rightIcon = null, onBackPress = () => {} }) => {
  return (
    <View style={styles.header}>
      {showBackButton ? (
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Text style={[styles.backButtonText, isDarkMode && styles.textLight]}>{'<'}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
      
      <Text style={[styles.headerTitle, isDarkMode && styles.textLight]}>{title}</Text>
      
      {rightIcon ? (
        <TouchableOpacity style={styles.rightButton}>
          <Text style={[styles.rightButtonText, isDarkMode && styles.textLight]}>{rightIcon}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 24,
  },
  rightButton: {
    padding: 5,
  },
  rightButtonText: {
    fontSize: 24,
  },
  textLight: {
    color: '#fff',
  },
});

export default Header;
