import * as fireAdmin from 'firebase-admin';
import {readFileSync} from 'fs';
import {resolve} from 'path';

const keyPath = process.env.GCLOUD_PROJECT == 'ooki-prod' ?
  'prod.serviceAccountKey.json' :
  'dev.serviceAccountKey.json';

const serviceAccount = readFileSync(resolve(__dirname, `../../${keyPath}`))
    .toString();

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG || '');
adminConfig.credential = fireAdmin.credential.cert(JSON.parse(serviceAccount));

fireAdmin.initializeApp(adminConfig);

const firestore = fireAdmin.firestore();
firestore.settings({ignoreUndefinedProperties: true});


export const db = firestore;
export const admin = fireAdmin;
