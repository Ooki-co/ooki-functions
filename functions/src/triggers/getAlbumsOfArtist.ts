import * as functions from 'firebase-functions';
import {firestore} from 'firebase-admin';
import db from '../utils/db';
import Spotify, {getAccessToken} from '../utils/spotify';
import sleep from '../utils/sleepProcess';
import {IAlbum} from '../types/album';
import {getArtistsMap} from '../utils/mapper';
const {FieldValue} = firestore;


const getAlbumsOfArtist = functions.region('europe-west2')
    .firestore.document('artists/{spotifyArtistId}')
    .onCreate(async (snap, context) => {
      const {spotifyArtistId} = context.params;

      functions.logger.info(`ArtistID: ${spotifyArtistId}`);

      let result = null;
      let tries = 0;
      let body;
      let current = 0;
      const albums:IAlbum[] = [];

      do {
        if (tries > 0) {
          sleep(3000);
        }
        await getAccessToken();
        tries++;
        result = await Spotify.getArtistAlbums(spotifyArtistId, {
          limit: 50,
          offset: current,
        });
      } while (!result || !result.body);

      functions.logger.info('Tries[getAlbumsOfArtist]: ', tries);

      try {
        do {
          body = result.body;
          body.items.forEach((album:any) => {
            albums.push({
              artists: getArtistsMap(album.artists),
              images: album.images,
              name: album.name,
              releaseDate: Date.parse(album.release_date),
              releaseDatePrecision: album.release_date_precision,
              spotifyAlbumId: album.id,
              totalTracks: album.total_tracks,
              copyrights: album.copyrights,
              tracks: [],
              createdAt: FieldValue.serverTimestamp(),
              modifiedAt: FieldValue.serverTimestamp(),
            } as IAlbum);
          });
          current += 50;
        } while (body.total > current);

        const batch = db.batch();
        albums.forEach((album:IAlbum) => {
          const albumRef = db.collection('albums').doc(album.spotifyAlbumId);
          batch.set(albumRef, album);
        });

        return batch.commit();
      } catch (err) {
        functions.logger.error(err);
        return Promise.reject(err);
      }
    });

export default getAlbumsOfArtist;
