import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MazeGame = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Maze Challenge</Text>
      <Text style={styles.subtitle}>Maze game coming soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  subtitle: { color: '#ccc', fontSize: 18, marginTop: 20 },
});

export default MazeGame;
