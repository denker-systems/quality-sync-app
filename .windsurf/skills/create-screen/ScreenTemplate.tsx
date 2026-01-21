import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';

type Props = NativeStackScreenProps<RootStackParamList, 'ScreenName'>;

export const ScreenName = ({ navigation, route }: Props) => {
  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <Text variant="headlineMedium">Screen Title</Text>
        <Text variant="bodyMedium">Screen content goes here.</Text>
        
        <Button 
          mode="contained" 
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Go Back
        </Button>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  button: {
    marginTop: 16,
  },
});
