// App.js - Main entry point
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TapGame from './screens/TapGame';
import ShakeGame from './screens/ShakeGame';
import MazeGame from './screens/MazeGame';
import ScanScreen from './screens/ScanScreen';
import ProfileScreen from './screens/ProfileScreen';
import NFCScreen from './screens/NFCScreen';
import TabBar from './components/TabBar';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('Profile'); 
  
  const renderScreen = () => {
    switch(currentScreen) {
      case 'Scan':
        return <ScanScreen navigation={{ navigate: setCurrentScreen }} />;
      case 'Profile':
        return <ProfileScreen navigation={{ navigate: setCurrentScreen }} />;
      case 'NFC':
        return <NFCScreen navigation={{ goBack: () => setCurrentScreen('Profile') }} />;
      default:
        return <ProfileScreen navigation={{ navigate: setCurrentScreen }} />;
    }
  };
  
  return (
    <View style={styles.appContainer}>
      {renderScreen()}
      <TabBar 
        currentScreen={currentScreen} 
        setCurrentScreen={setCurrentScreen} 
      />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
