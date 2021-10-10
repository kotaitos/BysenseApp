import firebase from './app';
import { FileUrls } from '../interfaces';

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

    static appendFileUrls(id: string, urls: FileUrls): string {
        const experimentRef = db.collection('experiment');
        let document = experimentRef.doc(`${id}`);
        document.update({
            urls: urls,
        })
        return document.id;
    }
}

export { db, Contoroller };
