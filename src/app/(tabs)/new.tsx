import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormularioImpuestos from '@/components/FormularioImpuestos';
import { theme } from '@/theme';

export default function NewPaymentScreen() {
  return (
    <>
      <StatusBar style="light" />
      <LinearGradient
        colors={theme.colors.gradients.dark}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <FormularioImpuestos />
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
