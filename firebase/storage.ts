import firebase from './app';

const storage = firebase.storage();

class Contoroller {
    static async upload(id: string, type: string, csvText: string) {
        const blob = new Blob([csvText], {type : 'text/tsv'});
        const ref = storage.ref(`experiment/${id}/${type}.tsv`);
        await ref.put(blob);
    }
}

export { storage, Contoroller };
