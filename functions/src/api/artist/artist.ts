import {firestore} from 'firebase-admin';
import {logger} from 'firebase-functions';
import {IArtist} from './types';
import Spotify, {getAccessToken} from '../../utils/spotify';
import db from '../../utils/db';
import sleep from '../../utils/sleepProcess';
import {Request, Response} from 'express';

const {FieldValue} = firestore;

interface IQueryArtist {
  limit?: number,
  offset?: number
}
interface IArtistPublic {
  imageUrl: string,
  artistName: string,
  spotifyId: string,
  instagramUsername: string,
  genres: string[]
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
async function add(req:Request, res:Response): Promise<any> {
  try {
    const data:IArtist = req.body;
    const {
      spotifyId,
      email = '',
      instagramUsername = '',
      youtubeChannelId = '',
      addedBy = 'manual',
    } = data;
    sleep(500);

    const artistRef = db.collection('artists').doc(spotifyId);
    await getAccessToken();

    const {body: artist} = await Spotify.getArtist(spotifyId);

    if (!artist) return res.status(200).json({status: false});

    await artistRef.set({
      spotifyId,
      artistName: artist.name,
      email,
      instagramUsername,
      youtubeChannelId,
      addedBy,
      genres: artist.genres,
      images: artist.images,
      createdAt: FieldValue.serverTimestamp(),
    });

    return res.status(200).json({status: true});
  } catch (err) {
    logger.error(err);
    res.status(500).send('Something broke!');
  }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
async function getAll(req:Request, res:Response): Promise<any> {
  try {
    const query: IQueryArtist = {
      limit: req.query.limit && Number(req.query.limit) ?
        Number(req.query.limit) :
        undefined,
      offset: req.query.offset && Number(req.query.offset) ?
        Number(req.query.offset) :
        undefined,
    };
    const {limit = 8, offset = 1} = query;

    const first = db.collection('artists')
        .orderBy('spotifyId')
        .limit(offset);
    const snapshot = await first.get();
    const last = snapshot.docs[snapshot.docs.length - 1];
    const artistRef = db.collection('artists')
        .orderBy('spotifyId')
        .startAfter(last.data().spotifyId)
        .limit(limit);

    const artists = await artistRef.get();

    const artistList: FirebaseFirestore.DocumentData[] = [];
    artists.forEach((artist) => {
      artistList.push(artistMapper(artist.data()));
    });

    return res.status(200).json(artistList);
  } catch (err) {
    logger.error(err);
    res.status(500).send('Something broke!');
  }
}

/**
 * get random track from first 20 new releases
 * @param {Request} req
 * @param {Response} res
 */
async function getRandomTrack(req:Request, res:Response): Promise<any> {
  try {
    const limit = randomInt(20);

    const albums = await db.collection('albums')
        .orderBy('releasedAt', 'desc')
        .limit(limit)
        .get();

    const album = albums.docs[albums.docs.length - 1];

    const tracks = await db.collection('albums')
        .doc(album.id).collection('tracks')
        .get();

    const trackIndex = randomInt(tracks.docs.length - 2);

    const track = tracks.docs[trackIndex];

    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    return res.status(200).json({
      imageUrl: album.data().image[0].url,
      trackId: track.id,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send('Something broke!');
  }
}

/**
 *
 * @param {object} artist
 * @return {IArtistPublic}
 */
function artistMapper(artist: any): IArtistPublic {
  return {
    imageUrl: artist.images.find((img:any) => img.height === 320).url,
    artistName: artist.artistName,
    spotifyId: artist.spotifyId,
    instagramUsername: artist.instagramUsername,
    genres: artist.genres,
  };
}

/**
 *
 * @param {Number} max
 * @return {Number}
 */
function randomInt(max: number): number {
  const min = 1;
  if (max < min) {
    return 0;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {add, getAll, getRandomTrack};
