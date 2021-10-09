import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Subscription } from '@unimodules/react-native-adapter';
import firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAv1ThhbZo9GkjBNoKGfhHZalo0Uby-5Ew",
  authDomain: "bicycle-supporter.firebaseapp.com",
  projectId: "bicycle-supporter",
  storageBucket: "bicycle-supporter.appspot.com",
  messagingSenderId: "879836047331",
  appId: "1:879836047331:web:c9427267150ead733e22d6",
  measurementId: "G-W3VT1BKM6S"
};

try {
  firebase.initializeApp(firebaseConfig);
} catch (error) {
  console.log(error);
  throw error;
}
const db = firebase.firestore();

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
  const [startAt, setStartAt] = useState(new Date());
  const [endAt, setEndAt] = useState(new Date);

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
    setEndAt(new Date());
    _upload();
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
  };

  const _upload = () => {
    const experimentRef = db.collection('experiment');
    let document = experimentRef.doc();
    document.set({
      lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      startAt: startAt,
      duration: Math.floor(endAt.getTime() - startAt.getTime()) / 1000,
      csvPath: `experiment/${document.id}`,
    });
    console.log(document.id);
  };

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
