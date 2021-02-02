import * as admin from 'firebase-admin';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require('../../devServiceAccountKey.json');
const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG || '');
adminConfig.credential = admin.credential.cert(serviceAccount);

admin.initializeApp(adminConfig);


const db = admin.firestore();
db.settings({ignoreUndefinedProperties: true});

export default db;
