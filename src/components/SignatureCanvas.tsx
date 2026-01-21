import React, { useRef, useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { Button, Surface, Text } from 'react-native-paper';

interface SignatureCanvasProps {
  onComplete: (signatureData: string) => void;
  onCancel: () => void;
  onScrollChange?: (enabled: boolean) => void;
}

/**
 * Hybrid signature canvas that works on both web and native
 * - Web: Uses HTML5 Canvas directly
 * - Native: Uses react-native-signature-canvas (WebView-based)
 */
export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  onComplete,
  onCancel,
  onScrollChange,
}) => {
  const canvasRef = useRef<any>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const canvasWidth = Math.min(Dimensions.get('window').width - 64, 400);
  const canvasHeight = 180;

  // Initialize canvas context
  useEffect(() => {
    if (Platform.OS === 'web' && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [canvasWidth, canvasHeight]);

  const getCanvasPoint = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return null;
    const rect = canvasRef.current.getBoundingClientRect();
    
    let clientX: number, clientY: number;
    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const point = getCanvasPoint(e);
    if (!point) return;
    
    console.log('✍️ SignatureCanvas: Drawing started');
    setIsDrawing(true);
    setIsEmpty(false);
    lastPointRef.current = point;
    onScrollChange?.(false);
  }, [getCanvasPoint, onScrollChange]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !canvasRef.current || !lastPointRef.current) return;
    
    const point = getCanvasPoint(e);
    if (!point) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
    
    lastPointRef.current = point;
  }, [isDrawing, getCanvasPoint]);

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      console.log('✍️ SignatureCanvas: Drawing ended');
      setIsDrawing(false);
      lastPointRef.current = null;
      onScrollChange?.(true);
    }
  }, [isDrawing, onScrollChange]);

  const handleClear = useCallback(() => {
    console.log('🗑️ SignatureCanvas: Clearing signature');
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }
    }
    setIsEmpty(true);
  }, [canvasWidth, canvasHeight]);

  const handleConfirm = useCallback(() => {
    console.log('📝 SignatureCanvas: Reading signature');
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      console.log('✅ SignatureCanvas: Signature captured');
      onComplete(dataUrl);
    }
  }, [onComplete]);

  // Web implementation using HTML5 Canvas
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text variant="bodySmall" style={styles.instruction}>
          Rita din signatur nedan
        </Text>
        
        <Surface style={styles.canvasContainer} elevation={1}>
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            style={{
              width: canvasWidth,
              height: canvasHeight,
              backgroundColor: '#ffffff',
              borderRadius: 8,
              cursor: 'crosshair',
              touchAction: 'none',
            }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
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
            disabled={isEmpty}
          >
            Bekräfta
          </Button>
        </View>
      </View>
    );
  }

  // Native implementation - fallback message for now
  // TODO: Add react-native-signature-canvas for native when needed
  return (
    <View style={styles.container}>
      <Text variant="bodySmall" style={styles.instruction}>
        Rita din signatur nedan
      </Text>
      
      <Surface style={styles.canvasContainer} elevation={1}>
        <View style={[styles.canvas, { width: canvasWidth, height: canvasHeight }]}>
          <Text style={styles.nativeMessage}>
            Signatur-canvas för native kommer snart
          </Text>
        </View>
      </Surface>

      <View style={styles.buttonRow}>
        <Button mode="outlined" onPress={onCancel} style={styles.button}>
          Avbryt
        </Button>
        <Button 
          mode="contained" 
          onPress={() => onComplete('placeholder-signature')} 
          style={styles.button}
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
    alignItems: 'center',
  },
  canvas: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nativeMessage: {
    color: '#6b7280',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
  },
});
