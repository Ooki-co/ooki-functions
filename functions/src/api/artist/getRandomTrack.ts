import {logger} from 'firebase-functions';
import db from '../../utils/db';
import {Request, Response} from 'express';


/**
 * get random track from first 20 new releases
 * @param {Request} req
 * @param {Response} res
 */
export async function getRandomTrack(req:Request, res:Response): Promise<any> {
  try {
    const limit = randomInt(20);

    const albums = await db.collection('albums')
        .orderBy('releaseDate', 'desc')
        .limit(limit)
        .get();

    const album = albums.docs[albums.docs.length - 1].data();

    const trackIndex = randomInt(album.tracks.length - 2);

    const track = album.tracks[trackIndex];

    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    return res.status(200).json({
      imageUrl: album.images[0].url,
      trackId: track.spotifyTrackId,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send('Something went wrong!');
  }
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
