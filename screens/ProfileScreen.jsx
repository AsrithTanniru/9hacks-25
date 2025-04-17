// screens/ProfileScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Switch, ScrollView } from 'react-native';
import Header from '../components/Header';
import ProfileInfo from '../components/ProfileInfo';
import ActionButtons from '../components/ActionButtons';
import SettingsSection from '../components/SettingsSection';

const ProfileScreen = ({ navigation }) => {
  const [privatePersonalLinks, setPrivatePersonalLinks] = useState(true);
  const [privateBusinessLinks, setPrivateBusinessLinks] = useState(false);
  
  return (
    <ScrollView style={styles.container}>
      <Header 
        title="My Profile" 
        showBackButton={false}
      />
      
      <View style={styles.profileBanner}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/350x150/ffccdd' }}
          style={styles.bannerImage}
        />
      </View>
      
      <ProfileInfo />
      
      <ActionButtons 
        onNFCPress={() => navigation && navigation.navigate('NFC')}
      />
      
      <View style={styles.divider} />
      
      <SettingsSection 
        title="Private Account"
        settings={[
          {
            icon: '🔒',
            text: 'Private Personal Links',
            value: privatePersonalLinks,
            onValueChange: setPrivatePersonalLinks
          },
          {
            icon: '📁',
            text: 'Private Business Links',
            value: privateBusinessLinks,
            onValueChange: setPrivateBusinessLinks
          }
        ]}
      />
      
      <View style={styles.divider} />
      
      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionTitle}>Tentang</Text>
      </View>
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
  settingsSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  settingsSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
});

export default ProfileScreen;
