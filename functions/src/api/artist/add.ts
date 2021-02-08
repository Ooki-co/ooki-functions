import {firestore} from 'firebase-admin';
import {logger} from 'firebase-functions';
import {Request, Response} from 'express';
import Spotify, {getAccessToken} from '../../utils/spotify';
import sleep from '../../utils/sleepProcess';
import db from '../../utils/db';

const {FieldValue} = firestore;

interface IArtist {
  spotifyId: string,
  artistName: string,
  instagramUsername?: string,
  email?: string,
  youtubeChannelId?: string,
  addedBy: 'manual' | 'web',
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
export async function add(req:Request, res:Response): Promise<any> {
  logger.info({
    env: process.env.APP_ENV,
    spotify: process.env.SPOTIFY_CLIENT_ID,
  });
  const data:IArtist = req.body;
  const {
    spotifyId,
    email = '',
    instagramUsername = '',
    youtubeChannelId = '',
    addedBy = 'manual',
  } = data;

  let result = null;
  let tries = 0;
  do {
    if (tries > 0) {
      sleep(2000);
    }
    await getAccessToken();
    tries++;
    result = await Spotify.getArtist(spotifyId);
  } while (!result || !result.body);

  logger.info('Tries[Artist.add]: ', tries);

  try {
    const artist = result.body;
    if (!artist) {
      return res.status(200).json({status: false});
    }

    const artistRef = db.collection('artists').doc(spotifyId);
    const existingArtist = await artistRef.get();
    if (existingArtist.exists) {
      return res.status(200).json({
        status: true,
        message: `Hey, we have already have your artist profile.
          Stay tuned we're working on the mobile app now`,
      });
    }

    await artistRef.set({
      name: artist.name,
      addedBy,
      email,
      genres: artist.genres,
      images: artist.images,
      instagramUsername,
      spotifyArtistId: spotifyId,
      youtubeChannelId,
      createdAt: FieldValue.serverTimestamp(),
      modifiedAt: FieldValue.serverTimestamp(),
    });

    return res.status(200).json({status: true});
  } catch (err) {
    logger.error(err);
    return res.status(500).send('Something went wrong!');
  }
}