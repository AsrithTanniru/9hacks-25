// screens/ScanScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Modal, 
  Linking, 
  ActivityIndicator,
  Animated,
  Dimensions,
  Pressable
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { Accelerometer } from 'expo-sensors';
import Header from '../components/Header';

const { width, height } = Dimensions.get('window');

const ScanScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [showGameModal, setShowGameModal] = useState(false);
  const [activeGame, setActiveGame] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);

  // Game states
  const [tapScore, setTapScore] = useState(0);
  const [tapTimeLeft, setTapTimeLeft] = useState(15);
  const [tapGameActive, setTapGameActive] = useState(false);
  const [shakeScore, setShakeScore] = useState(0);
  const [shakeTimeLeft, setShakeTimeLeft] = useState(15);
  const [shakeGameActive, setShakeGameActive] = useState(false);
  const [mazePosition, setMazePosition] = useState({ x: 0, y: 0 });
  const [mazeComplete, setMazeComplete] = useState(false);

  // Refs
  const tapTimerRef = useRef(null);
  const shakeTimerRef = useRef(null);
  const accelerometerSubscription = useRef(null);
  const lastShakeTime = useRef(0);
  
  // Handle QR code scanning
  const handleBarCodeScanned = ({ type, data }) => {
    if (scanning) return;
    
    setScanning(true);
    console.log('QR Code detected:', data);
    
    setQrData(data);
    setCameraActive(false);
    setShowGameModal(true);
    setScanning(false);
  };

  const resetScanner = () => {
    setQrData(null);
    setShowGameModal(false);
    setCameraActive(true);
    setActiveGame(null);
    resetAllGames();
  };

  const resetAllGames = () => {
    // Reset tap game
    setTapScore(0);
    setTapTimeLeft(15);
    setTapGameActive(false);
    if (tapTimerRef.current) clearInterval(tapTimerRef.current);

    // Reset shake game
    setShakeScore(0);
    setShakeTimeLeft(15);
    setShakeGameActive(false);
    if (shakeTimerRef.current) clearInterval(shakeTimerRef.current);
    if (accelerometerSubscription.current) accelerometerSubscription.current.remove();

    // Reset maze game
    setMazePosition({ x: 0, y: 0 });
    setMazeComplete(false);
  };

  const startGame = (gameType) => {
    setActiveGame(gameType);
    setShowGameModal(false);
    
    if (gameType === 'TapGame') {
      startTapGame();
    } else if (gameType === 'ShakeGame') {
      startShakeGame();
    } else if (gameType === 'MazeGame') {
      // The maze game starts in a ready state
    }
  };

  // TAP GAME LOGIC
  const startTapGame = () => {
    setTapGameActive(true);
    setTapScore(0);
    setTapTimeLeft(15);

    tapTimerRef.current = setInterval(() => {
      setTapTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(tapTimerRef.current);
          setTapGameActive(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleTap = () => {
    if (tapGameActive) {
      setTapScore(prevScore => prevScore + 1);
    }
  };

  // SHAKE GAME LOGIC
  const startShakeGame = () => {
    setShakeGameActive(true);
    setShakeScore(0);
    setShakeTimeLeft(15);
    lastShakeTime.current = 0;

    Accelerometer.setUpdateInterval(100);
    accelerometerSubscription.current = Accelerometer.addListener(({ x, y, z }) => {
      const now = Date.now();
      if (now - lastShakeTime.current > 300) {
        const magnitude = Math.sqrt(x * x + y * y + z * z);
        if (magnitude > 1.8 && shakeGameActive) {
          setShakeScore(prevScore => prevScore + 1);
          lastShakeTime.current = now;
        }
      }
    });

    shakeTimerRef.current = setInterval(() => {
      setShakeTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(shakeTimerRef.current);
          setShakeGameActive(false);
          if (accelerometerSubscription.current) {
            accelerometerSubscription.current.remove();
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  // MAZE GAME LOGIC
  const MAZE_SIZE = width * 0.8;
  const PLAYER_SIZE = 30;
  const GOAL_SIZE = 50;
  const OBSTACLE_WIDTH = 20;
  
  const handleMazeMove = (dx, dy) => {
    setMazePosition(prevPos => {
      const newX = Math.max(0, Math.min(MAZE_SIZE - PLAYER_SIZE, prevPos.x + dx));
      const newY = Math.max(0, Math.min(MAZE_SIZE - PLAYER_SIZE, prevPos.y + dy));
      
      // Check if player reached the goal
      const goalX = MAZE_SIZE - GOAL_SIZE - 10;
      const goalY = MAZE_SIZE - GOAL_SIZE - 10;
      
      if (
        newX > goalX - PLAYER_SIZE/2 && 
        newY > goalY - PLAYER_SIZE/2 && 
        newX < goalX + GOAL_SIZE && 
        newY < goalY + GOAL_SIZE
      ) {
        setMazeComplete(true);
      }
      
      // Check collisions with obstacles (simplified)
      // Obstacle 1 (horizontal)
      const obstacle1X = 0;
      const obstacle1Y = MAZE_SIZE * 0.33;
      const obstacle1Width = MAZE_SIZE * 0.7;
      
      // Obstacle 2 (vertical)
      const obstacle2X = MAZE_SIZE * 0.5;
      const obstacle2Y = MAZE_SIZE * 0.5;
      const obstacle2Height = MAZE_SIZE * 0.4;
      
      // Check collision with obstacle 1
      if (
        newY + PLAYER_SIZE > obstacle1Y && 
        newY < obstacle1Y + OBSTACLE_WIDTH && 
        newX < obstacle1X + obstacle1Width && 
        newX + PLAYER_SIZE > obstacle1X
      ) {
        return prevPos; // Collision detected, don't move
      }
      
      // Check collision with obstacle 2
      if (
        newX + PLAYER_SIZE > obstacle2X && 
        newX < obstacle2X + OBSTACLE_WIDTH && 
        newY < obstacle2Y + obstacle2Height && 
        newY + PLAYER_SIZE > obstacle2Y
      ) {
        return prevPos; // Collision detected, don't move
      }
      
      return { x: newX, y: newY }; // No collision, allow move
    });
  };

  // Clean up timers and listeners on component unmount
  useEffect(() => {
    return () => {
      if (tapTimerRef.current) clearInterval(tapTimerRef.current);
      if (shakeTimerRef.current) clearInterval(shakeTimerRef.current);
      if (accelerometerSubscription.current) accelerometerSubscription.current.remove();
    };
  }, []);

  if (!permission) {
    return (
      <View style={styles.containerDark}>
        <Header title="Scan QR Code" showBackButton={true} isDarkMode={true} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4040ff" />
          <Text style={styles.permissionText}>Loading camera...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.containerDark}>
        <Header title="Scan QR Code" showBackButton={true} isDarkMode={true} />
        <View style={styles.centerContainer}>
          <Ionicons name="camera-off" size={60} color="#ff4040" />
          <Text style={styles.permissionText}>Camera access denied</Text>
          <TouchableOpacity 
            style={styles.permissionButton} 
            onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Camera Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.permissionButton, { marginTop: 10, backgroundColor: '#333' }]} 
            onPress={() => Linking.openSettings()}>
            <Text style={styles.permissionButtonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.containerDark}>
      <Header title="Scan QR Code" showBackButton={true} isDarkMode={true} />

      <View style={styles.scanContainer}>
        <Text style={styles.instructionText}>
          Align QR code within the frame
        </Text>
        
        <View style={styles.cameraViewContainer}>
          {cameraActive ? (
            <CameraView
              style={styles.cameraView}
              facing="back"
              onBarcodeScanned={scanning ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
            >
              {/* Scanner overlay */}
              <View style={styles.scannerOverlay}>
                {/* Top left corner */}
                <View style={[styles.cornerTopLeft, styles.corner]} />
                {/* Top right corner */}
                <View style={[styles.cornerTopRight, styles.corner]} />
                {/* Bottom left corner */}
                <View style={[styles.cornerBottomLeft, styles.corner]} />
                {/* Bottom right corner */}
                <View style={[styles.cornerBottomRight, styles.corner]} />
              </View>
            </CameraView>
          ) : (
            <View style={styles.cameraPlaceholder}>
              <View style={styles.scannerOverlay}>
                {/* Top left corner */}
                <View style={[styles.cornerTopLeft, styles.corner]} />
                {/* Top right corner */}
                <View style={[styles.cornerTopRight, styles.corner]} />
                {/* Bottom left corner */}
                <View style={[styles.cornerBottomLeft, styles.corner]} />
                {/* Bottom right corner */}
                <View style={[styles.cornerBottomRight, styles.corner]} />
              </View>
              
              <View style={styles.placeholderInner}>
                <Ionicons name="qr-code" size={40} color="#bbbbbb" />
                <Text style={styles.placeholderText}>
                  QR Code Scanner
                </Text>
              </View>
            </View>
          )}
        </View>
        
        {!cameraActive && (
          <TouchableOpacity 
            style={styles.scanButton} 
            onPress={resetScanner}
          >
            <View style={styles.scanButtonContent}>
              <Ionicons name="scan" size={24} color="#fff" style={styles.scanIcon} />
              <Text style={styles.scanButtonText}>Scan Another Code</Text>
            </View>
          </TouchableOpacity>
        )}

        {scanning && (
          <View style={styles.scanningOverlay}>
            <ActivityIndicator size="large" color="#4040ff" />
            <Text style={styles.scanningText}>Scanning...</Text>
          </View>
        )}

        <Text style={styles.tipText}>
          Make sure your QR code is well-lit and clearly visible
        </Text>
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
              QR Code: {qrData && qrData.length > 20 ? `${qrData.substring(0, 20)}...` : qrData}
            </Text>

            <TouchableOpacity style={styles.gameButton} onPress={() => startGame('TapGame')}>
              <View style={styles.gameButtonContent}>
                <Ionicons name="finger-print" size={24} color="#fff" style={styles.gameIcon} />
                <View>
                  <Text style={styles.gameButtonText}>Tap Challenge</Text>
                  <Text style={styles.gameDescription}>
                    Tap as fast as you can to earn points!
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gameButton} onPress={() => startGame('ShakeGame')}>
              <View style={styles.gameButtonContent}>
                <Ionicons name="phone-portrait" size={24} color="#fff" style={styles.gameIcon} />
                <View>
                  <Text style={styles.gameButtonText}>Shake Challenge</Text>
                  <Text style={styles.gameDescription}>
                    Shake your phone to collect points!
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gameButton} onPress={() => startGame('MazeGame')}>
              <View style={styles.gameButtonContent}>
                <Ionicons name="map" size={24} color="#fff" style={styles.gameIcon} />
                <View>
                  <Text style={styles.gameButtonText}>Maze Challenge</Text>
                  <Text style={styles.gameDescription}>Navigate through a fun maze!</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={resetScanner}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Tap Game Modal */}
      <Modal
        visible={activeGame === 'TapGame'}
        transparent={true}
        animationType="slide"
        onRequestClose={resetScanner}
      >
        <View style={styles.gameModalContainer}>
          <View style={styles.gameModalContent}>
            <Text style={styles.gameModalTitle}>Tap Challenge</Text>
            
            <View style={styles.gameStatsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Score</Text>
                <Text style={styles.statValue}>{tapScore}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Time Left</Text>
                <Text style={styles.statValue}>{tapTimeLeft}s</Text>
              </View>
            </View>

            <View style={styles.gameAreaContainer}>
              {tapGameActive ? (
                <TouchableOpacity 
                  activeOpacity={0.7}
                  style={styles.tapButton} 
                  onPress={handleTap}
                >
                  <Text style={styles.tapButtonText}>TAP!</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.gameResultContainer}>
                  <Text style={styles.gameResultText}>Game Over!</Text>
                  <Text style={styles.gameResultScore}>You scored: {tapScore} taps</Text>
                  <TouchableOpacity 
                    style={styles.playAgainButton} 
                    onPress={() => startTapGame()}
                  >
                    <Text style={styles.playAgainButtonText}>Play Again</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.gameExitButton} onPress={resetScanner}>
              <Text style={styles.gameExitButtonText}>Exit Game</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Shake Game Modal */}
      <Modal
        visible={activeGame === 'ShakeGame'}
        transparent={true}
        animationType="slide"
        onRequestClose={resetScanner}
      >
        <View style={styles.gameModalContainer}>
          <View style={styles.gameModalContent}>
            <Text style={styles.gameModalTitle}>Shake Challenge</Text>
            
            <View style={styles.gameStatsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Shakes</Text>
                <Text style={styles.statValue}>{shakeScore}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Time Left</Text>
                <Text style={styles.statValue}>{shakeTimeLeft}s</Text>
              </View>
            </View>

            <View style={styles.gameAreaContainer}>
              {shakeGameActive ? (
                <View style={styles.shakeInstructions}>
                  <Ionicons name="phone-portrait-outline" size={80} color="#4040ff" />
                  <Text style={styles.shakeInstructionsText}>
                    Shake your device!
                  </Text>
                </View>
              ) : (
                <View style={styles.gameResultContainer}>
                  <Text style={styles.gameResultText}>Game Over!</Text>
                  <Text style={styles.gameResultScore}>You scored: {shakeScore} shakes</Text>
                  <TouchableOpacity 
                    style={styles.playAgainButton} 
                    onPress={() => startShakeGame()}
                  >
                    <Text style={styles.playAgainButtonText}>Play Again</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.gameExitButton} onPress={resetScanner}>
              <Text style={styles.gameExitButtonText}>Exit Game</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Maze Game Modal */}
      <Modal
        visible={activeGame === 'MazeGame'}
        transparent={true}
        animationType="slide"
        onRequestClose={resetScanner}
      >
        <View style={styles.gameModalContainer}>
          <View style={styles.gameModalContent}>
            <Text style={styles.gameModalTitle}>Maze Challenge</Text>
            
            <View style={styles.mazeContainer}>
              {/* Maze game board */}
              <View style={styles.mazeBoard}>
                {/* Player */}
                <View 
                  style={[
                    styles.mazePlayer, 
                    { left: mazePosition.x, top: mazePosition.y }
                  ]} 
                />
                
                {/* Goal */}
                <View style={styles.mazeGoal} />
                
                {/* Obstacles */}
                <View style={styles.mazeObstacle1} />
                <View style={styles.mazeObstacle2} />
              </View>
              
              {/* Controls */}
              <View style={styles.mazeControls}>
                <TouchableOpacity 
                  style={styles.mazeControlButton}
                  onPress={() => handleMazeMove(0, -15)}
                >
                  <Ionicons name="arrow-up" size={30} color="#fff" />
                </TouchableOpacity>
                
                <View style={styles.mazeControlRow}>
                  <TouchableOpacity 
                    style={styles.mazeControlButton}
                    onPress={() => handleMazeMove(-15, 0)}
                  >
                    <Ionicons name="arrow-back" size={30} color="#fff" />
                  </TouchableOpacity>
                  
                  <View style={{ width: 60 }} />
                  
                  <TouchableOpacity 
                    style={styles.mazeControlButton}
                    onPress={() => handleMazeMove(15, 0)}
                  >
                    <Ionicons name="arrow-forward" size={30} color="#fff" />
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity 
                  style={styles.mazeControlButton}
                  onPress={() => handleMazeMove(0, 15)}
                >
                  <Ionicons name="arrow-down" size={30} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
            
            {mazeComplete && (
              <View style={styles.mazeCompletedOverlay}>
                <Text style={styles.mazeCompletedText}>Maze Completed!</Text>
                <TouchableOpacity 
                  style={styles.playAgainButton}
                  onPress={() => {
                    setMazePosition({ x: 0, y: 0 });
                    setMazeComplete(false);
                  }}
                >
                  <Text style={styles.playAgainButtonText}>Play Again</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity style={styles.gameExitButton} onPress={resetScanner}>
              <Text style={styles.gameExitButtonText}>Exit Game</Text>
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
    backgroundColor: '#222',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scanContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  instructionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },
  cameraViewContainer: {
    width: 280,
    height: 280,
    borderRadius: 20,
    padding: 6, // For gradient border effect
    backgroundColor: '#4040ff',
    // Shadow for the camera view container
    shadowColor: '#4040ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
  },
  cameraView: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cameraPlaceholder: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#4040ff',
    borderWidth: 3,
  },
  cornerTopLeft: {
    top: 20,
    left: 20,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 10,
  },
  cornerTopRight: {
    top: 20,
    right: 20,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 10,
  },
  cornerBottomLeft: {
    bottom: 20,
    left: 20,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
  },
  cornerBottomRight: {
    bottom: 20,
    right: 20,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 10,
  },
  placeholderInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#bbbbbb',
    fontSize: 18,
    marginTop: 10,
    fontWeight: '500',
  },
  scanButton: {
    backgroundColor: '#4040ff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 30,
    minWidth: 280,
    // Shadow for button
    shadowColor: '#4040ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  scanButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanIcon: {
    marginRight: 10,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tipText: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
    maxWidth: 300,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: '#222',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    // Shadow for modal
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalSubtitle: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 24,
  },
  gameButton: {
    backgroundColor: '#4040ff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    // Shadow for game buttons
    shadowColor: '#4040ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  gameButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameIcon: {
    marginRight: 12,
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
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#666',
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#4040ff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 20,
    // Shadow for button
    shadowColor: '#4040ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  scanningText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
    fontWeight: '500',
  },
  
  // Game Modal Styles
  gameModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameModalContent: {
    backgroundColor: '#222',
    borderRadius: 24,
    width: '90%',
    padding: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#4040ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  gameModalTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  gameStatsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    width: '100%',
    justifyContent: 'space-around',
  },
  statBox: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  statLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  // Continuing the styles for the game implementation
  gameAreaContainer: {
    width: '100%',
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#181818',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  gameExitButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#666',
    marginTop: 10,
  },
  gameExitButtonText: {
    color: '#ddd',
    fontSize: 16,
    fontWeight: '500',
  },
  gameResultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameResultText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  gameResultScore: {
    color: '#4040ff',
    fontSize: 22,
    marginBottom: 20,
  },
  playAgainButton: {
    backgroundColor: '#4040ff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    // Shadow for button
    shadowColor: '#4040ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  playAgainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Tap Game Styles
  tapButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#4040ff',
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow for tap button
    shadowColor: '#4040ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  tapButtonText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  
  // Shake Game Styles
  shakeInstructions: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  shakeInstructionsText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  
  // Maze Game Styles
  mazeContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 300,
  },
  mazeBoard: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: '#333',
    borderRadius: 12,
    position: 'relative',
    borderWidth: 2,
    borderColor: '#555',
    maxHeight: 220,
    maxWidth: 220,
  },
  mazePlayer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4040ff',
    position: 'absolute',
    shadowColor: '#4040ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
  },
  mazeGoal: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#40ff40',
    position: 'absolute',
    bottom: 10,
    right: 10,
    shadowColor: '#40ff40',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  mazeObstacle1: {
    width: '70%',
    height: 20,
    backgroundColor: '#ff4040',
    position: 'absolute',
    top: '33%',
    left: 0,
  },
  mazeObstacle2: {
    width: 20,
    height: '40%',
    backgroundColor: '#ff4040',
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
  mazeControls: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  mazeControlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  mazeControlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderWidth: 1,
    borderColor: '#555',
  },
  mazeCompletedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  mazeCompletedText: {
    color: '#40ff40',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default ScanScreen;
