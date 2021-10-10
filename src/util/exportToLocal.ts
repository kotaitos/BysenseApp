import * as FileSystem from 'expo-file-system';

const exportToLocal = async (csvText: string, id: string, type: string): Promise<string> => {
    const fileUri = `${FileSystem.documentDirectory}${id}/${type}.tsv`;
    await FileSystem.writeAsStringAsync(fileUri, csvText, { encoding: FileSystem.EncodingType.UTF8 }); 
    return fileUri;
};

export { exportToLocal };
