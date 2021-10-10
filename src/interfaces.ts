import firebase from './firebase/app';

export interface SensorDataBuffer {
    accelerometer: number[][];
    gyroscope: number[][];
    barometer: {
        pressure: number[],
        relativeAltitude?: number[],
    },
    magnetometer: number[][];
};

export interface FileUrls {
    accelerometer: string;
    gyroscope: string;
    barometer: string;
    magnetometer: string;
};
