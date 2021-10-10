import firebase from './app';

const db = firebase.firestore();

class Contoroller {
    static add (name: string, startAt: Date, duration: number): string {
        const experimentRef = db.collection('experiment');
        let document = experimentRef.doc();
        document.set({
            name: name,
            lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            startAt: startAt,
            duration: duration,
            csvPath: `experiment/${document.id}`,
        });
        return document.id;
    }
}

export { db, Contoroller };
