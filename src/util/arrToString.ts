const arrToString = (array: number[][], colDelimeter='\t', rowDelimeter = '\r\n') => {
    return array.map((row) => row.map((cell) => cell).join(colDelimeter)).join(rowDelimeter);
};

export { arrToString };
