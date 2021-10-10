import * as React from 'react';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import {
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from '../components/Themed';


interface MapProps { };
interface MapState {
  region: {
    latitude: number | undefined;
    longitude: number | undefined;
    latitudeDelta: number;
    longitudeDelta: number;
  },
  message: string;
};

export default class App extends React.Component<MapProps, MapState>{
  constructor(props: MapProps){
    super(props);
    this.state ={
      region: {
        latitude: undefined,
        longitude: undefined,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      },
      message: '位置情報を取得しています...',
    }
  }
  componentDidMount(){
    this.getLocationAsync()
  }
  getLocationAsync = async() =>{
    const { status } = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted'){
      this.setState({
        message:'位置情報のパーミッションの取得に失敗しました'
      })
      return
    }
    const location = await Location.getCurrentPositionAsync({});
    this.setState({
      message:'位置情報を取得しました'
    })
    this.setState({
      region: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: this.state.region.latitudeDelta,
        longitudeDelta: this.state.region.longitudeDelta
      }
    });
  }
  render(){
    if(this.state.region.latitude && this.state.region.longitude){
      console.log(this.state);
      return (
        <View style={styles.container}>
          <MapView
            style={{flex: 1}}
            initialRegion={{
              latitude: this.state.region.latitude,
              longitude: this.state.region.longitude,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta,
            }}
            region={{
              latitude: this.state.region.latitude,
              longitude: this.state.region.longitude,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta,
            }}
            showsUserLocation={ true }
          />
          <TouchableOpacity onPress={this.getLocationAsync} style={styles.now}>
            <Ionicons name="navigate-circle" size={64} color='red' />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={ styles.container }>
          <Text>
              {this.state.message}
          </Text>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  now:{
    position:'absolute',
    right:10,
    bottom:30,
    padding: 5,
  }
});
