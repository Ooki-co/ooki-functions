import * as functions from 'firebase-functions';
import * as express from 'express';
import * as dotenv from 'dotenv';
import * as cors from 'cors';
import * as helmet from 'helmet';
import {resolve} from 'path';

const envFilename = process.env.GCLOUD_PROJECT == 'ooki-prod' ?
  'prod.env' :
  'dev.env';
dotenv.config({path: resolve(__dirname, `../${envFilename}`)});

import getAlbumsOfArtistTrigger from './triggers/getAlbumsOfArtist';
import getTracksOfAlbumTrigger from './triggers/getTracksOfAlbum';
import getAudioFeatureOfTrackTrigger from './triggers/getAudioFeaturesOfTrack';
import addFeedback from './api/feedback';
import Artist from './api/artist';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/artists', Artist.getAll);

app.post('/artists', Artist.add);

app.get('/track', Artist.getRandomTrack);

app.get('/sanlar', Artist.getNumbers);

app.post('/feedback', addFeedback);

export const api = functions
    .runWith({
      memory: '256MB',
      timeoutSeconds: 60,
    })
    .region('europe-west2')
    .https.onRequest(app);

export const getAlbumsOfArtist = getAlbumsOfArtistTrigger;
export const getTracksOfAlbum = getTracksOfAlbumTrigger;
export const getAudioFeatureOfTrack = getAudioFeatureOfTrackTrigger;
