// screens/ScanScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Linking, Platform } from 'react-native';
import { QRreader } from 'react-native-qr-decode-image-camera';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Header from '../components/Header';

const ScanScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [showGameModal, setShowGameModal] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (!hasPermission) return;
    
    setScanning(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        aspect: [1, 1],
        quality: 0.5,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        processQRCode(uri);
      } else {
        setScanning(false);
      }
    } catch (error) {
      console.log('Error taking picture:', error);
      setScanning(false);
    }
  };

  const processQRCode = async (uri) => {
    try {
      const data = await QRreader(uri);
      console.log('QR Code detected:', data);
      if (data) {
        setQrData(data);
        setShowGameModal(true);
      } else {
        alert('No QR code found in image');
      }
    } catch (error) {
      console.log('Error processing QR code:', error);
      alert('Error processing QR code');
    }
    setScanning(false);
  };

  const resetScanner = () => {
    setQrData(null);
    setShowGameModal(false);
  };

  const startGame = (gameType) => {
    navigation.navigate(gameType, { qrData });
    resetScanner();
  };

  if (hasPermission === null) {
    return (
      <View style={styles.containerDark}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.containerDark}>
        <Text style={styles.permissionText}>No access to camera</Text>
        <TouchableOpacity 
          style={styles.permissionButton} 
          onPress={() => Linking.openSettings()}>
          <Text style={styles.permissionButtonText}>Grant Permission in Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.containerDark}>
      <Header title="Scan QR Code" showBackButton={true} isDarkMode={true} />

      <View style={styles.scanContainer}>
        <View style={styles.cameraPlaceholder}>
          <Text style={styles.placeholderText}>
            QR Code Scanner
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.scanButton} 
          onPress={takePicture}
          disabled={scanning}
        >
          <Text style={styles.scanButtonText}>
            {scanning ? 'Processing...' : 'Tap to Scan QR Code'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Game Selection Modal */}
      <Modal
        visible={showGameModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGameModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose a Game</Text>
            <Text style={styles.modalSubtitle}>
              QR Code: {qrData && qrData.substring(0, 20)}...
            </Text>

            <TouchableOpacity style={styles.gameButton} onPress={() => startGame('TapGame')}>
              <Text style={styles.gameButtonText}>Tap Challenge</Text>
              <Text style={styles.gameDescription}>
                Tap as fast as you can to earn points!
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gameButton} onPress={() => startGame('ShakeGame')}>
              <Text style={styles.gameButtonText}>Shake Challenge</Text>
              <Text style={styles.gameDescription}>
                Shake your phone to collect points!
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gameButton} onPress={() => startGame('MazeGame')}>
              <Text style={styles.gameButtonText}>Maze Challenge</Text>
              <Text style={styles.gameDescription}>Navigate through a fun maze!</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={resetScanner}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  containerDark: {
    flex: 1,
    backgroundColor: '#333',
  },
  scanContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cameraPlaceholder: {
    width: 250,
    height: 250,
    borderRadius: 20,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4040ff',
    marginBottom: 30,
  },
  placeholderText: {
    color: '#fff',
    fontSize: 18,
  },
  scanButton: {
    backgroundColor: '#4040ff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#333',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalSubtitle: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 20,
  },
  gameButton: {
    backgroundColor: '#4040ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  gameButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameDescription: {
    color: '#ddd',
    fontSize: 14,
    marginTop: 4,
  },
  cancelButton: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  permissionButton: {
    backgroundColor: '#4040ff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default ScanScreen;
