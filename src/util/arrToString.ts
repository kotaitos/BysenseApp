const arr1DToString = (array: number[]) => {
    let tsvText = '';
    for (let v in array) {
        tsvText += `${array[v]}\t\r\n`
    }
    return tsvText;
};

const arr2DToString = (array: number[][], colDelimeter='\t', rowDelimeter = '\r\n') => {
    return array.map((row) => row.map((cell) => cell).join(colDelimeter)).join(rowDelimeter);
};

export { arr1DToString, arr2DToString };
