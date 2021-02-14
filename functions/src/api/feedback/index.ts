import {firestore} from 'firebase-admin';
import {logger} from 'firebase-functions';
import db from '../../utils/db';
import {Request, Response} from 'express';

const {FieldValue} = firestore;
interface IFeedback {
  email: string,
  message: string
}

/**
 *
 * @param {Request} req
 * @param {Response }res
 */
async function add(req:Request, res:Response): Promise<any> {
  try {
    const data:IFeedback = req.body;
    const {
      email,
      message,
    } = data;

    if (!email) {
      return res.sendStatus(200);
    }

    const feedbackRef = db.collection('feedback').doc();
    await feedbackRef.set({
      email,
      message,
      createdAt: FieldValue.serverTimestamp(),
    });

    res.sendStatus(200);
  } catch (err) {
    logger.error(err);
    res.status(500).send('Something broke!');
  }
}

export default add;
