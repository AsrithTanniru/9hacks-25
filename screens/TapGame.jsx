// screens/TapGame.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TapGame = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tap Game</Text>
    </View>
  );
};

export default TapGame;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 20,
  },
});
