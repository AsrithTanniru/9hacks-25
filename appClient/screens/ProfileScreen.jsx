// screens/ProfileScreen.js
import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import Header from '../components/Header';
import ProfileInfo from '../components/ProfileInfo';

const ProfileScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Header title="My Profile" showBackButton={false} />

      <View style={styles.profileBanner}>
        <Image 
          source={{ uri: 'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg' }}
          style={styles.bannerImage}
        />
      </View>

      <ProfileInfo />

      <View style={styles.divider} />

      <View style={styles.rewardSection}>
        <Text style={styles.rewardTitle}>Reward Points</Text>
        <Text style={styles.rewardPoints}>1,250</Text>
      </View>

      <View style={styles.divider} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileBanner: {
    width: '100%',
    height: 150,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  rewardSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rewardPoints: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff9900',
  },
});

export default ProfileScreen;
