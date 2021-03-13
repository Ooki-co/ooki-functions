import * as functions from 'firebase-functions';
import {firestore} from 'firebase-admin';
import {db} from '../utils/firebase';
import Spotify, {getAccessToken} from '../utils/spotify';
import sleep from '../utils/sleepProcess';
import {IAlbum} from '../types/album';
import {ITrack} from '../types/track';
import {getArtistsMap, getTracksMap, getAlbumMap} from '../utils/mapper';
const {FieldValue} = firestore;
import mongodb from '../models';
const Album = mongodb.model('Album');
const Track = mongodb.model('Track');

const getTracksOfAlbum = functions.region('europe-west2')
    .firestore.document('albums/{spotifyAlbumId}')
    .onCreate(async (snap, context) => {
      const {spotifyAlbumId} = context.params;

      functions.logger.info(`AlbumID: ${spotifyAlbumId}`);

      const album:IAlbum = snap.data() as IAlbum;

      let result = null;
      let tries = 0;

      do {
        if (tries > 0) {
          sleep(4000);
        }
        await getAccessToken();
        tries++;
        result = await Spotify.getAlbumTracks(spotifyAlbumId);
      } while (!result || !result.body);

      functions.logger.info('Tries[getTracksOfAlbum]: ', tries);

      try {
        const tracks:ITrack[] = result.body.items.map((track:any):ITrack => {
          return {
            artists: getArtistsMap(track.artists),
            album: getAlbumMap(album),
            name: track.name,
            durationMs: track.duration_ms,
            explicit: track.explicit,
            spotifyTrackId: track.id,
            previewUrl: track.preview_url,
            trackNumber: track.track_number,
            audioFeatures: null,
            createdAt: FieldValue.serverTimestamp(),
            modifiedAt: FieldValue.serverTimestamp(),
          };
        });

        functions.logger.info(`AlbumTracks: ${tracks.length}`);

        const tracksForMongodb = tracks.map((track) => {
          return {
            ...track,
            createdAt: undefined,
            modifiedAt: undefined,
          };
        });

        const batch = db.batch();

        tracks.forEach((track:ITrack) => {
          const trackRef = db
              .collection('tracks').doc(track.spotifyTrackId);

          batch.set(trackRef, track);
        });

        // set tracks on the album.tracks[ITrackMap]
        const albumRef = db.collection('albums').doc(spotifyAlbumId);
        batch.set(albumRef, {
          tracks: getTracksMap(tracks),
        }, {merge: true});

        return Promise.all([
          batch.commit(),
          Track.create(tracksForMongodb),
          Album.findOneAndUpdate({
            spotifyAlbumId,
          }, {
            tracks: getTracksMap(tracks),
          }),
        ]);
      } catch (err) {
        functions.logger.error(err);
        return Promise.reject(err);
      }
    });

export default getTracksOfAlbum;
