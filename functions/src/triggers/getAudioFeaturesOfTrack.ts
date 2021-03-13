import * as functions from 'firebase-functions';
import {db} from '../utils/firebase';
import Spotify, {getAccessToken} from '../utils/spotify';
import sleep from '../utils/sleepProcess';
import {IAudioFeatures} from '../types/track';
import mongodb from '../models';
const Track = mongodb.model('Track');

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

        const audioFeatures: IAudioFeatures = {
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
        };

        const setFirestore = trackRef.set({audioFeatures}, {merge: true});

        const setMongodb = Track.findOneAndUpdate({
          spotifyTrackId,
        }, {
          audioFeatures,
        });

        return Promise.all([
          setFirestore,
          setMongodb,
        ]);
      } catch (err) {
        functions.logger.error(err);
        return Promise.reject(err);
      }
    });


export default getAudioFeatureOfTrack;
