import * as functions from 'firebase-functions';
import db from '../utils/db';
import Spotify, {getAccessToken} from '../utils/spotify';
import sleep from '../utils/sleepProcess';

const getTracksOfAlbum = functions.region('europe-west2')
    .firestore.document('albums/{spotifyAlbumId}')
    .onCreate(async (snap, context) => {
      const {spotifyAlbumId} = context.params;
      functions.logger.info(`AlbumID: ${spotifyAlbumId}`);

      sleep(700);

      await getAccessToken();
      const result = await Spotify.getAlbumTracks(spotifyAlbumId);

      const tracks = result.body.items.map((track:any) => {
        return {
          spotifyTrackId: track.id,
          name: track.name,
        };
      });

      functions.logger.info(`AlbumTracks: ${JSON.stringify(tracks)}`);

      const batch = db.batch();

      tracks.forEach((track:any) => {
        const trackRef = db
            .collection('albums').doc(spotifyAlbumId)
            .collection('tracks').doc(track.spotifyTrackId);

        batch.set(trackRef, track);
      });

      return batch.commit();
    });


export default getTracksOfAlbum;
