import * as functions from 'firebase-functions';
import {db} from '../utils/firebase';
import Spotify, {getAccessToken} from '../utils/spotify';
import sleep from '../utils/sleepProcess';
import {IAudioFeatures} from '../types/track';

const getAudioFeatureOfTrack = functions.region('europe-west2')
    .firestore.document('tracks/{spotifyTrackId}')
    .onCreate(async (snap, context) => {
      const {spotifyTrackId} = context.params;

      functions.logger.info(`TrackID: ${spotifyTrackId}`);

      let result = null;
      let tries = 0;
      do {
        if (tries > 0) {
          sleep(5000);
        }
        await getAccessToken();
        tries++;
        result = await Spotify.getAudioFeatures(spotifyTrackId);
      } while (!result || !result.body);

      functions.logger.info('Tries[getAudioFeaturesOfTrack]: ', tries);

      try {
        const trackAudioFeatures = result.body;
        functions.logger.info('TrackAudioFeatures: fetched');

        const trackRef = db
            .collection('tracks').doc(spotifyTrackId);

        return trackRef.set({
          audioFeatures: {
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
            timeSignature: trackAudioFeatures.time_signature,
          } as IAudioFeatures,
        }, {merge: true});
      } catch (err) {
        functions.logger.error(err);
        return Promise.reject(err);
      }
    });


export default getAudioFeatureOfTrack;
