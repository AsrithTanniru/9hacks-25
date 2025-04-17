import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';

const ShakeGame = () => {
  const [score, setScore] = useState(0);
  let lastTime = 0;

  useEffect(() => {
    Accelerometer.setUpdateInterval(100);
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const now = Date.now();
      if (now - lastTime > 300) {
        const magnitude = Math.sqrt(x * x + y * y + z * z);
        if (magnitude > 1.8) {
          setScore((prev) => prev + 1);
          lastTime = now;
        }
      }
    });
    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shake Challenge</Text>
      <Text style={styles.score}>Shakes: {score}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  score: { color: '#ccc', fontSize: 22, marginTop: 20 },
});

export default ShakeGame;
