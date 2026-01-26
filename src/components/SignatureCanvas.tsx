import React, { useRef, useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { Button, Text } from 'react-native-paper';
import SignatureScreen from 'react-native-signature-canvas';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const canvasRef = useRef<any>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const signatureRef = useRef<any>(null);

  const canvasBg = isDark ? '#262626' : '#ffffff';
  const penColor = isDark ? '#FAFAFA' : '#000000';
  const borderColor = isDark ? '#333' : '#e5e7eb';
  const mutedColor = isDark ? '#A3A3A3' : '#6b7280';

  const canvasWidth = Math.min(Dimensions.get('window').width - 64, 400);
  const canvasHeight = 180;

  // Initialize canvas context
  useEffect(() => {
    if (Platform.OS === 'web' && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.fillStyle = canvasBg;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.strokeStyle = penColor;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [canvasWidth, canvasHeight, canvasBg, penColor]);

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

  const startDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const point = getCanvasPoint(e);
      if (!point) return;

      console.log('✍️ SignatureCanvas: Drawing started');
      setIsDrawing(true);
      setIsEmpty(false);
      lastPointRef.current = point;
      onScrollChange?.(false);
    },
    [getCanvasPoint, onScrollChange],
  );

  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
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
    },
    [isDrawing, getCanvasPoint],
  );

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
        ctx.fillStyle = canvasBg;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }
    }
    setIsEmpty(true);
  }, [canvasWidth, canvasHeight, canvasBg]);

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
        <Text variant="bodySmall" style={[styles.instruction, { color: mutedColor }]}>
          {t('signature.instruction')}
        </Text>

        <div
          style={{
            borderRadius: 8,
            overflow: 'hidden',
            alignItems: 'center',
            touchAction: 'none',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none',
          }}
        >
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            style={{
              width: canvasWidth,
              height: canvasHeight,
              backgroundColor: canvasBg,
              borderRadius: 8,
              cursor: 'crosshair',
              touchAction: 'none',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
            }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        <View style={styles.buttonRow}>
          <Button mode="outlined" onPress={onCancel} style={styles.button}>
            {t('signature.cancel')}
          </Button>
          <Button mode="outlined" onPress={handleClear} style={styles.button}>
            {t('signature.clear')}
          </Button>
          <Button mode="contained" onPress={handleConfirm} style={styles.button} disabled={isEmpty}>
            {t('signature.confirm')}
          </Button>
        </View>
      </View>
    );
  }

  // Native implementation using react-native-signature-canvas
  const handleNativeSignature = (signature: string) => {
    console.log('✅ SignatureCanvas (Native): Signature captured');
    onComplete(signature);
  };

  const handleNativeClear = () => {
    console.log('🗑️ SignatureCanvas (Native): Clearing signature');
    signatureRef.current?.clearSignature();
  };

  const handleNativeEnd = () => {
    console.log('📝 SignatureCanvas (Native): Reading signature');
    signatureRef.current?.readSignature();
  };

  const style = `
    .m-signature-pad {
      box-shadow: none;
      border: none;
    }
    .m-signature-pad--body {
      border: none;
    }
    .m-signature-pad--footer {
      display: none;
    }
    body,html {
      width: 100%;
      height: 100%;
    }
  `;

  return (
    <View style={styles.container}>
      <Text variant="bodySmall" style={[styles.instruction, { color: mutedColor }]}>
        {t('signature.instruction')}
      </Text>

      <View
        style={[
          styles.canvas,
          { width: canvasWidth, height: canvasHeight, backgroundColor: canvasBg, borderColor },
        ]}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
      >
        <SignatureScreen
          ref={signatureRef}
          onOK={handleNativeSignature}
          onEmpty={() => console.log('⚠️ SignatureCanvas (Native): Empty signature')}
          onClear={() => console.log('🗑️ SignatureCanvas (Native): Cleared')}
          onBegin={() => {
            console.log('✍️ SignatureCanvas (Native): Drawing started');
            onScrollChange?.(false);
          }}
          onEnd={() => {
            console.log('✍️ SignatureCanvas (Native): Drawing ended');
            onScrollChange?.(true);
          }}
          descriptionText=""
          webStyle={style}
          backgroundColor={canvasBg}
          penColor={penColor}
        />
      </View>

      <View style={styles.buttonRow}>
        <Button mode="outlined" onPress={onCancel} style={styles.button}>
          {t('signature.cancel')}
        </Button>
        <Button mode="outlined" onPress={handleNativeClear} style={styles.button}>
          {t('signature.clear')}
        </Button>
        <Button mode="contained" onPress={handleNativeEnd} style={styles.button}>
          {t('signature.confirm')}
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
    textAlign: 'center',
  },
  canvasContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },
  canvas: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
  },
});
