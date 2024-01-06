import { FirebaseApp, initializeApp } from "firebase/app";
import { getDatabase, ref, Database, DatabaseReference } from "firebase/database";
import { getStorage, FirebaseStorage } from "firebase/storage";


const firebaseConfig: any = {
    apiKey: process.env.NEXT_PUBLIC_FIRE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    databaseURL: process.env.NEXT_PUBLIC_DATA_URL
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const db: Database = getDatabase(app); 
export const storage: FirebaseStorage = getStorage(app);

export const schoolDataReference: DatabaseReference = ref(db, 'schoolData');
export const workDataReference: DatabaseReference = ref(db, 'workData');
export const projectDataReference: DatabaseReference = ref(db, 'projectData');
export const achievementDataReference: DatabaseReference = ref(db, 'achievementData');
export const toolDataReference: DatabaseReference = ref(db, 'toolData');
export const contactDataReference: DatabaseReference = ref(db, 'contactData');

export const schoolImageReference: DatabaseReference = ref(db, 'schoolImages');
export const imagesListLeft: DatabaseReference = ref(db, 'leftAchievementImages');
export const imagesListRight: DatabaseReference = ref(db, 'rightAchievementImages');