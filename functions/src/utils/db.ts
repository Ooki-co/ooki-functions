import * as admin from 'firebase-admin';
import {readFileSync} from 'fs';
import {resolve} from 'path';

const keyPath = process.env.APP_ENV == 'prod' ?
  'prod.serviceAccountKey.json' :
  'dev.serviceAccountKey.json';

const serviceAccount = readFileSync(resolve(__dirname, `../../${keyPath}`))
    .toString();

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG || '');
adminConfig.credential = admin.credential.cert(JSON.parse(serviceAccount));

admin.initializeApp(adminConfig);

const db = admin.firestore();
db.settings({ignoreUndefinedProperties: true});

export default db;
