import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Subscription } from '@unimodules/react-native-adapter';
import { Contoroller as FirestoreContoroller } from '../firebase/firestore';
import { Contoroller as StorageController } from '../firebase/storage';
import { arrToString } from '../util/arrToString';
import { exportToLocal } from '../util/exportToLocal';

export default function App() {
  const [acc, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [buffer, setBuffer] = useState({
    acc: new Array(),
  });
  const [startAt, setStartAt] = useState<Date>(new Date(1970, 1, 1));
  const [experimentName, setExperimentName] = useState<string>('');

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener(accelerometerData => {
        setData(accelerometerData);
      })
    );
    setStartAt(new Date());
    Accelerometer.setUpdateInterval(100);
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
    const id = FirestoreContoroller.add(experimentName, startAt, buffer.acc.length / 10);
    let type = 'acc';
    const csvText = arrToString(buffer.acc, '\t', '\r\n');
    StorageController.upload(id, type, csvText);
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
    setStartAt(new Date(1970, 1, 1));
    setExperimentName('');
  };

  useEffect(() => {
    setBuffer({
      acc: [...buffer.acc, [ acc.x, acc.y, acc.z ]],
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
