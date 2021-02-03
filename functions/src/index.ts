import * as functions from 'firebase-functions';
import * as express from 'express';
import * as dotenv from 'dotenv';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import {resolve} from 'path';
dotenv.config({path: resolve(__dirname, '../.env')});

import getAlbumsOfArtistTrigger from './triggers/getAlbumsOfArtist';
import getTracksOfAlbumTrigger from './triggers/getTracksOfAlbum';
import getAudioFeatureOfTrackTrigger from './triggers/getAudioFeaturesOfTrack';
import addFeedback from './api/feedback';
import Artist from './api/artist';

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/artists', Artist.getAll);

app.post('/artists', Artist.add);

app.post('/feedback', addFeedback);

app.get('/track', Artist.getRandomTrack);

export const api = functions.region('europe-west2').https.onRequest(app);

export const getAlbumsOfArtist = getAlbumsOfArtistTrigger;
export const getTracksOfAlbum = getTracksOfAlbumTrigger;
export const getAudioFeatureOfTrack = getAudioFeatureOfTrackTrigger;
