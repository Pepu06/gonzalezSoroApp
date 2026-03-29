import FormularioImpuestos from '@/components/FormularioImpuestos';
import { theme } from '@/theme';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewPaymentScreen() {
  return (
    <>
      <StatusBar style="light" />
      <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>

        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <FormularioImpuestos />
        </SafeAreaView>
      </View>
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
