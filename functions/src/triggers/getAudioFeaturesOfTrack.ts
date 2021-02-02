import * as functions from 'firebase-functions';
import db from '../utils/db';
import Spotify, {getAccessToken} from '../utils/spotify';
import sleep from '../utils/sleepProcess';

const getAudioFeatureOfTrack = functions.region('europe-west2')
    .firestore.document('albums/{spotifyAlbumId}/tracks/{spotifyTrackId}')
    .onCreate(async (snap, context) => {
      const {spotifyAlbumId, spotifyTrackId} = context.params;
      functions.logger.info(`AlbumID: ${spotifyAlbumId}`);
      functions.logger.info(`TrackID: ${spotifyTrackId}`);

      sleep(1000);

      await getAccessToken();
      const result = await Spotify.getAudioFeatures(spotifyTrackId);
      const trackAudioFeatures = result.body;
      functions.logger.info(`TrackAudioFeatures: ${trackAudioFeatures}`);

      const trackRef = db
          .collection('albums').doc(spotifyAlbumId)
          .collection('tracks').doc(spotifyTrackId);

      return trackRef.set({
        danceability: trackAudioFeatures.danceability,
        energy: trackAudioFeatures.energy,
        key: trackAudioFeatures.key,
        loudness: trackAudioFeatures.loudness,
        mode: trackAudioFeatures.mode,
        speechiness: trackAudioFeatures.speechiness,
        acousticness: trackAudioFeatures.acousticness,
        instrumentalness: trackAudioFeatures.instrumentalness,
        liveness: trackAudioFeatures.liveness,
        valence: trackAudioFeatures.valence,
        tempo: trackAudioFeatures.tempo,
        duration_ms: trackAudioFeatures.duration_ms,
        time_signature: trackAudioFeatures.time_signature,
      }, {merge: true});
    });


export default getAudioFeatureOfTrack;
