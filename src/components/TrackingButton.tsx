import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import {
  Accelerometer,
  Barometer,
  Gyroscope,
  Magnetometer,
  MagnetometerUncalibrated,
  Pedometer,
} from 'expo-sensors';
import { Subscription } from '@unimodules/react-native-adapter';
import { Contoroller as FirestoreContoroller } from '../firebase/firestore';
import { Contoroller as StorageController } from '../firebase/storage';
import { arrToString } from '../util/arrToString';

export default function App() {
  const [acc, setAcc] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [gyro, setGyro] = useState({
    x: 0,
    y: 0,
    z: 0,
  })
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [buffer, setBuffer] = useState({
    acc: new Array(),
    gyroscope: new Array(),
  });
  const [startAt, setStartAt] = useState<Date>(new Date(1970, 1, 1));
  const [experimentName, setExperimentName] = useState<string>('');

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener(accelerometerData => {
        setAcc(accelerometerData);
      })
    );
    setSubscription(
      Gyroscope.addListener(gyroscopeData => {
        setGyro(gyroscopeData);
      })
    );
    setStartAt(new Date());
    Accelerometer.setUpdateInterval(100);
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
    const id = FirestoreContoroller.add(experimentName, startAt, buffer.acc.length / 10);
    const accCsvText = arrToString(buffer.acc, '\t', '\r\n');
    const gyroCsvText = 
    StorageController.upload(id, 'acc', accCsvText);
    _reset();
  };

  const _reset = () => {
    setAcc({
      x: 0,
      y: 0,
      z: 0,
    });
    setGyro({
      x: 0,
      y: 0,
      z: 0,
    })
    setBuffer({
      acc: new Array(),
      gyroscope: new Array(),
    });
    setStartAt(new Date(1970, 1, 1));
    setExperimentName('');
  };

  useEffect(() => {
    setBuffer({
      acc: [...buffer.acc, [ acc.x, acc.y, acc.z ]],
      gyroscope: [...buffer.gyroscope, [ gyro.x, gyro.y, gyro.z ]],
    });
  }, [acc]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Accelerometer</Text>
      <TextInput
      style={styles.textInputField}
      onChangeText={(text) => setExperimentName(text)}
      placeholder='実験名を入力してください'
      placeholderTextColor="gray"
      value={experimentName}
      />
      <View style={experimentName ? styles.buttonContainer : styles.buttonContainerDisabled}>
        <TouchableOpacity onPress={subscription ? _unsubscribe : _subscribe} style={styles.button} disabled={experimentName ? false : true}>
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
  buttonContainerDisabled: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
    opacity: 0.3
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  textInputField: {
    height: 40,
    width: '80%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  }
}); 
