import {firestore} from 'firebase-admin';
import {IArtist} from './types';
import Spotify, {getAccessToken} from '../../utils/spotify';
import db from '../../utils/db';
import sleep from '../../utils/sleepProcess';

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
 */
class Artist {
  /**
   * add a new artist
   * @param {Object} data artist data object
   * @return {Object}
   */
  static async add(data: IArtist): Promise<any> {
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

    if (!artist) return false;

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
    return true;
  }

  /**
   * get list of Artists by query
   * @param {String} query
   * @return {String} list of artists
   */
  static async getAll(query: IQueryArtist): Promise<any> {
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
      artistList.push(this.artistMapper(artist.data()));
    });

    return artistList;
  }

  /**
   *
   * @param {object} artist
   * @return {IArtistPublic}
   */
  private static artistMapper(artist: any): IArtistPublic {
    return {
      imageUrl: artist.images.find((img:any) => img.height === 320).url,
      artistName: artist.artistName,
      spotifyId: artist.spotifyId,
      instagramUsername: artist.instagramUsername,
      genres: artist.genres,
    };
  }
}

export default Artist;
