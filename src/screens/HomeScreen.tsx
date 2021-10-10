import * as React from 'react';
import { StyleSheet } from 'react-native';
import { RootTabScreenProps } from '../../types';
import Map from '../components/MapConponent';

export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
  return (
    <Map/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
