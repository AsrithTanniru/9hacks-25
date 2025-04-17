// screens/NFCScreen.js
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import NFCList from '../components/NFCList';

const NFCScreen = ({ navigation }) => {
  return (
    <View style={styles.containerGray}>
      <Header 
        title="NFC" 
        showBackButton={true}
        onBackPress={() => navigation && navigation.goBack()}
      />
      
      <NFCList />
      
      <TouchableOpacity style={styles.addNfcButton}>
        <Text style={styles.addNfcButtonIcon}>+</Text>
        <Text style={styles.addNfcButtonText}>Add new NFC</Text>
      </TouchableOpacity>
      
      <View style={styles.nfcSearchContainer}>
        <View style={styles.divider} />
        <Text style={styles.nfcSearchTitle}>Add New NFC</Text>
        
        <View style={styles.nfcSearchImage}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/300x200/6060ff' }}
            style={styles.nfcImage}
          />
        </View>
        
        <Text style={styles.nfcSearchStatus}>Still looking...</Text>
        <Text style={styles.nfcSearchInstructions}>
          Try moving your NFC around to find the NFC reader on your device
        </Text>
      </View>  
    </View>
  );
};

const styles = StyleSheet.create({
  containerGray: {
    flex: 1,
    backgroundColor: '#aaa',
  },
  addNfcButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  addNfcButtonIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  addNfcButtonText: {
    fontSize: 16,
    color: '#4040ff',
  },
  nfcSearchContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  nfcSearchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  nfcSearchImage: {
    alignItems: 'center',
    marginVertical: 20,
  },
  nfcImage: {
    width: 300,
    height: 200,
    borderRadius: 10,
  },
  nfcSearchStatus: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  nfcSearchInstructions: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 30,
  },
});

export default NFCScreen;
