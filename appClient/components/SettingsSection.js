import React from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';

const SettingsSection = ({ title, settings }) => {
  return (
    <View style={styles.settingsSection}>
      <Text style={styles.settingsSectionTitle}>{title}</Text>
      
      {settings.map((setting, index) => (
        <View key={index} style={styles.settingItem}>
          <View style={styles.settingItemLeft}>
            <Text style={styles.settingItemIcon}>{setting.icon}</Text>
            <Text style={styles.settingItemText}>{setting.text}</Text>
          </View>
          <Switch
            value={setting.value}
            onValueChange={setting.onValueChange}
            trackColor={{ false: '#e0e0e0', true: '#c0c0ff' }}
            thumbColor={setting.value ? '#4040ff' : '#f0f0f0'}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  settingsSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  settingsSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  settingItemText: {
    fontSize: 16,
  },
});

export default SettingsSection;
