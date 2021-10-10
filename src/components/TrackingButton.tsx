import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Platform } from 'react-native';
import {
  Accelerometer,
  Barometer,
  Gyroscope,
  Magnetometer,
} from 'expo-sensors';
import { Subscription } from '@unimodules/react-native-adapter';
import { Contoroller as FirestoreContoroller } from '../firebase/firestore';
import { Contoroller as StorageController } from '../firebase/storage';
import { arr1DToString, arr2DToString } from '../util/arrToString';
import { SensorDataBuffer } from '../interfaces';

export default function App() {
  const [startAt, setStartAt] = useState<Date>(new Date(1970, 1, 1));
  const [experimentName, setExperimentName] = useState<string>('');
  const [buffer, setBuffer] = useState<SensorDataBuffer>({
    accelerometer: new Array<number[]>(),
    gyroscope: new Array<number[]>(),
    barometer: {
      pressure: new Array<number>(),
    },
    magnetometer: new Array<number[]>(),
  });
  const [accelerometer, setAcc] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [barometer, setBarometer] = useState({
    pressure: 0
  });
  const [gyroscope, setGyro] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [magnetometer, setMagnetometer] = useState({
    x: 0,
    y: 0,
    z: 0,
  })
  const [accSubscription, setAccSubscription] = useState<Subscription | null>(null);
  const [gyroSubscription, setGyroSubscription] = useState<Subscription | null>(null);
  const [baroSubscription, setBaroSubscription] = useState<Subscription | null>(null);
  const [magnetoSubscription, setMagnetoSubscription] = useState<Subscription | null>(null);

  const _subscribe = () => {
    setStartAt(new Date());
    setAccSubscription(
      Accelerometer.addListener(accelerometerData => {
        setAcc(accelerometerData);
      })
    );
    setBaroSubscription(
      Barometer.addListener(barimeterData => {
        setBarometer(barimeterData);
      })
    );
    setGyroSubscription(
      Gyroscope.addListener(gyroscopeData => {
        setGyro(gyroscopeData);
      })
    );
    setMagnetoSubscription(
      Magnetometer.addListener(magnetometerData => {
        setMagnetometer(magnetometerData);
      })
    )
    Accelerometer.setUpdateInterval(100);
  };

  const _unsubscribe = async () => {
    accSubscription && accSubscription.remove();
    gyroSubscription && gyroSubscription.remove();
    baroSubscription && baroSubscription.remove();
    magnetoSubscription && magnetoSubscription.remove();
    setAccSubscription(null);
    setGyroSubscription(null);
    setBaroSubscription(null);
    setMagnetoSubscription(null);
    const id = FirestoreContoroller.add(experimentName, startAt, buffer.accelerometer.length / 10);
    const accCsvText = arr2DToString(buffer.accelerometer, '\t', '\r\n');
    const gyroCsvText = arr2DToString(buffer.gyroscope, '\t', '\r\n');
    const baroCsvText = arr1DToString(buffer.barometer.pressure);
    const magnetoCsvText = arr2DToString(buffer.magnetometer, '\t', '\r\n');
    const [accelerometerURL, gyroscopeURL, barometerURL, magnetometerURL] = await Promise.all([
      StorageController.upload(id, 'accelerometer', accCsvText),
      StorageController.upload(id, 'gyroscope', gyroCsvText),
      StorageController.upload(id, 'barometer', baroCsvText),
      StorageController.upload(id, 'magnetometer', magnetoCsvText)
    ])
    FirestoreContoroller.appendFileUrls(id, {
      accelerometer: accelerometerURL,
      gyroscope: gyroscopeURL,
      barometer: barometerURL,
      magnetometer: magnetometerURL
    })
    _reset();
  };

  const _reset = () => {
    setStartAt(new Date(1970, 1, 1));
    setExperimentName('');
    setAcc({
      x: 0,
      y: 0,
      z: 0,
    });
    setBarometer({
      pressure: 0
    });
    setGyro({
      x: 0,
      y: 0,
      z: 0,
    });
    setMagnetometer({
      x: 0,
      y: 0,
      z: 0,
    })
    setBuffer({
      accelerometer: new Array<number[]>(),
      gyroscope: new Array<number[]>(),
      barometer: {
        pressure: new Array<number>(),
      },
      magnetometer: new Array<number[]>(),
    });
  };

  useEffect(() => {
    setBuffer({
      accelerometer: [...buffer.accelerometer, [ accelerometer.x, accelerometer.y, accelerometer.z ]],
      gyroscope: [...buffer.gyroscope, [ gyroscope.x, gyroscope.y, gyroscope.z ]],
      barometer: {
        pressure: [...buffer.barometer.pressure, barometer.pressure ],
      },
      magnetometer: [...buffer.magnetometer, [ magnetometer.x, magnetometer.y, magnetometer.z ]],
    });
  }, [accelerometer]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sensors</Text>
      <TextInput
      style={styles.textInputField}
      onChangeText={(text) => setExperimentName(text)}
      placeholder='実験名を入力してください'
      placeholderTextColor="gray"
      value={experimentName}
      />
      <View style={experimentName ? styles.buttonContainer : styles.buttonContainerDisabled}>
        <TouchableOpacity onPress={accSubscription && gyroSubscription ? _unsubscribe : _subscribe} style={styles.button} disabled={experimentName ? false : true}>
          <Text>{accSubscription && gyroSubscription ? 'Stop' : 'Start'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
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
