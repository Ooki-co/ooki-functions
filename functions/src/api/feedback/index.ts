import {firestore} from 'firebase-admin';
import db from '../../utils/db';

const {FieldValue} = firestore;

interface IFeedback {
  email: string,
  message: string
}

/**
 *
 * @param {Object} data
 */
async function add(data: IFeedback): Promise<any> {
  const {
    email,
    message,
  } = data;

  const feedbackRef = db.collection('feedback').doc();
  await feedbackRef.set({
    email,
    message,
    createdAt: FieldValue.serverTimestamp(),
  });

  return true;
}

export default add
;
