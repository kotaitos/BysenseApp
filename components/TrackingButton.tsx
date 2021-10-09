import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Subscription } from '@unimodules/react-native-adapter';

export default function App() {
  const [acc, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [buffer, setBuffer] = useState({
    acc: new Array(),
  })

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener(accelerometerData => {
        setData(accelerometerData);
      })
    );
    Accelerometer.setUpdateInterval(100);
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
    _reset();
  };

  const _reset = () => {
    setData({
      x: 0,
      y: 0,
      z: 0,
    });
    setBuffer({
      acc: new Array(),
    });
  }

  useEffect(() => {
    setBuffer({
      acc: [...buffer.acc, [ acc.x, acc.y, acc.z ]],
    });
  }, [acc]);

  const { x, y, z } = acc;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Accelerometer</Text>
      <Text style={styles.text}>
        x: {round(x)} y: {round(y)} z: {round(z)}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={subscription ? _unsubscribe : _subscribe} style={styles.button}>
          <Text>{subscription ? 'Stop' : 'Start'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function round(n: number) {
  return n;
} 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  }
}); 
