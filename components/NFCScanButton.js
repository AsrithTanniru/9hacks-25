import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const NFCScanButton = () => {
  return (
    <TouchableOpacity style={styles.nfcScanButton}>
      <Text style={styles.nfcScanIcon}>📶</Text>
      <View style={styles.nfcTextContainer}>
        <Text style={styles.nfcScanTitle}>NFC Scan</Text>
        <Text style={styles.nfcScanSubtitle}>
          Put your friend's NFC on the back of the smartphone
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  nfcScanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
  },
  nfcScanIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  nfcTextContainer: {
    flex: 1,
  },
  nfcScanTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  nfcScanSubtitle: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 5,
  },
});

export default NFCScanButton;
