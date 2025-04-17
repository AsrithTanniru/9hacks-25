import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const TabBar = ({ currentScreen, setCurrentScreen }) => {
  return (
    <View style={styles.tabBar}>
       <TouchableOpacity 
        style={[styles.tab, currentScreen === 'Scan' && styles.activeTab]} 
        onPress={() => setCurrentScreen('Scan')}
      >
        <Text style={styles.tabText}>Scan</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, currentScreen === 'Profile' && styles.activeTab]} 
        onPress={() => setCurrentScreen('Profile')}
      >
        <Text style={styles.tabText}>Profile</Text>
      </TouchableOpacity>
     
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderTopWidth: 3,
    borderTopColor: '#4040ff',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default TabBar;
