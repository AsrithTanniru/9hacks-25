import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const ProfileInfo = () => {
  return (
    <View style={styles.profileInfo}>
      <View style={styles.avatarContainer}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/80' }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>✎</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.profileName}>Alexa Stephanie</Text>
      <Text style={styles.profileLinks}>3 public links</Text>
      
      <Text style={styles.profileBio}>
        I'm focused mainly on the aspect of user experience, but I also place much emphasis on the visual attractiveness and taste.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  profileInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  avatarContainer: {
    marginTop: -40,
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  editButton: {
    position: 'absolute',
    right: -5,
    bottom: 0,
    backgroundColor: '#4040ff',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  profileLinks: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  profileBio: {
    textAlign: 'center',
    marginTop: 15,
    color: '#555',
    lineHeight: 20,
  },
});

export default ProfileInfo;
