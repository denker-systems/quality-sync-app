import React, { useRef, useState } from 'react';
import { StyleSheet, View, PanResponder, Dimensions } from 'react-native';
import { Button, Surface, Text } from 'react-native-paper';
import Svg, { Path } from 'react-native-svg';

interface SignatureCanvasProps {
  onComplete: (signatureData: string) => void;
  onCancel: () => void;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  onComplete,
  onCancel,
}) => {
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath(`M${locationX},${locationY}`);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath(prev => `${prev} L${locationX},${locationY}`);
      },
      onPanResponderRelease: () => {
        if (currentPath) {
          setPaths(prev => [...prev, currentPath]);
          setCurrentPath('');
        }
      },
    })
  ).current;

  const handleClear = () => {
    setPaths([]);
    setCurrentPath('');
  };

  const handleConfirm = () => {
    if (paths.length === 0) return;
    
    // Generate SVG data string
    const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150">
      ${paths.map(p => `<path d="${p}" stroke="#000" stroke-width="2" fill="none"/>`).join('')}
    </svg>`;
    
    // Convert to base64
    const base64 = btoa(svgData);
    onComplete(`data:image/svg+xml;base64,${base64}`);
  };

  const canvasWidth = Dimensions.get('window').width - 64;
  const canvasHeight = 150;

  return (
    <View style={styles.container}>
      <Text variant="bodySmall" style={styles.instruction}>
        Rita din signatur nedan
      </Text>
      
      <Surface style={styles.canvasContainer} elevation={1}>
        <View
          style={[styles.canvas, { width: canvasWidth, height: canvasHeight }]}
          {...panResponder.panHandlers}
        >
          <Svg width={canvasWidth} height={canvasHeight}>
            {paths.map((path, index) => (
              <Path
                key={index}
                d={path}
                stroke="#000"
                strokeWidth={2}
                fill="none"
              />
            ))}
            {currentPath && (
              <Path
                d={currentPath}
                stroke="#000"
                strokeWidth={2}
                fill="none"
              />
            )}
          </Svg>
          
          {paths.length === 0 && !currentPath && (
            <View style={styles.placeholder}>
              <Text variant="bodyMedium" style={styles.placeholderText}>
                Rita här
              </Text>
            </View>
          )}
        </View>
      </Surface>

      <View style={styles.buttonRow}>
        <Button mode="outlined" onPress={onCancel} style={styles.button}>
          Avbryt
        </Button>
        <Button mode="outlined" onPress={handleClear} style={styles.button}>
          Rensa
        </Button>
        <Button 
          mode="contained" 
          onPress={handleConfirm} 
          style={styles.button}
          disabled={paths.length === 0}
        >
          Bekräfta
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12,
  },
  instruction: {
    color: '#6b7280',
    textAlign: 'center',
  },
  canvasContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  canvas: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#d1d5db',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
  },
});
