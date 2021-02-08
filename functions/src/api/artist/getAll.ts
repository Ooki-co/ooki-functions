import {logger} from 'firebase-functions';
import db from '../../utils/db';
import {Request, Response} from 'express';

interface IQuery {
  limit?: number,
  offset?: number
}
interface IArtistPublic {
  imageUrl: string,
  name: string,
  spotifyArtistId: string,
  instagramUsername: string,
  genres: string[]
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
export async function getAll(req:Request, res:Response): Promise<any> {
  try {
    const query: IQuery = {
      limit: req.query.limit && Number(req.query.limit) ?
        Number(req.query.limit) :
        undefined,
      offset: req.query.offset && Number(req.query.offset) ?
        Number(req.query.offset) :
        undefined,
    };
    const {limit = 8, offset = 1} = query;

    const first = db.collection('artists')
        .orderBy('spotifyArtistId')
        .limit(offset);
    const snapshot = await first.get();
    const last = snapshot.docs[snapshot.docs.length - 1];
    const artistRef = db.collection('artists')
        .orderBy('spotifyArtistId')
        .startAfter(last.data().spotifyArtistId)
        .limit(limit);

    const artists = await artistRef.get();

    const artistList: IArtistPublic[] = [];
    artists.forEach((artist) => {
      artistList.push(artistMapper(artist.data()) as IArtistPublic);
    });

    return res.status(200).json(artistList);
  } catch (err) {
    logger.error(err);
    return res.status(500).send('Something went wrong!');
  }
}

/**
 *
 * @param {object} artist
 * @return {IArtistPublic}
 */
function artistMapper(artist: any): IArtistPublic {
  return {
    imageUrl: artist.images[1].url,
    name: artist.name,
    spotifyArtistId: artist.spotifyArtistId,
    instagramUsername: artist.instagramUsername,
    genres: artist.genres,
  };
}
