import * as functions from 'firebase-functions';
import {firestore} from 'firebase-admin';
import {db} from '../utils/firebase';
import Spotify, {getAccessToken} from '../utils/spotify';
import sleep from '../utils/sleepProcess';
import {IAlbum} from '../types/album';
import {IArtist} from '../types/artist';
import {getArtistsMap} from '../utils/mapper';
const {FieldValue} = firestore;
import mongodb from '../models';
const Album = mongodb.model('Album');

export const getAlbumsOfArtistOnUpdate = functions.region('europe-west2')
    .firestore.document('artists/{spotifyArtistId}')
    .onUpdate(async (change, context) => {
      const {spotifyArtistId} = context.params;

      const {before, after} = change as any;
      const artistBefore = before.data();
      const artistAfter = after.data();

      if (artistBefore.approved) {
        functions.logger.info(
            `Albums already fetched - ArtistID: ${spotifyArtistId}`
        );
        return Promise.resolve();
      }

      if (!artistAfter.approved) {
        functions.logger.info(
            `[Approved:False] Not fetching albums,  
            ArtistID: ${spotifyArtistId}`
        );
        return Promise.resolve();
      }

      functions.logger.info(`Fetching Albums - ArtistID: ${spotifyArtistId}`);

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

        const albumsForMongodb = albums.map((album) => {
          return {
            ...album,
            createdAt: undefined, // mongoose will set default value
            modifiedAt: undefined,
          };
        });

        return Promise.all([
          batch.commit(),
          Album.create(albumsForMongodb),
        ]);
      } catch (err) {
        functions.logger.error(err);
        return Promise.reject(err);
      }
    });

export const getAlbumsOfArtistOnCreate = functions.region('europe-west2')
    .firestore.document('artists/{spotifyArtistId}')
    .onCreate(async (snap, context) => {
      const {spotifyArtistId} = context.params;

      const artist = snap.data() as IArtist;

      if (artist.addedBy !== 'manual' || !artist.approved) {
        return Promise.resolve();
      }

      functions.logger.info(`Fetching Albums - ArtistID: ${spotifyArtistId}`);

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

        const albumsForMongodb = albums.map((album) => {
          return {
            ...album,
            createdAt: undefined, // mongoose will set default value
            modifiedAt: undefined,
          };
        });

        return Promise.all([
          batch.commit(),
          Album.create(albumsForMongodb),
        ]);
      } catch (err) {
        functions.logger.error(err);
        return Promise.reject(err);
      }
    });
