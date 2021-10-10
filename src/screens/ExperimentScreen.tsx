import * as React from 'react';
import { StyleSheet } from 'react-native';
import TrackingButton from '../components/TrackingButton';
import { Text, View } from '../components/Themed';

export default function ExperimentScreen() {
  return (
    TrackingButton()
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
