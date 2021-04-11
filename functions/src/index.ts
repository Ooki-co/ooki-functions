import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import * as helmet from 'helmet';
import setRoutes from './routes';
import config from './config';
require('./models');

import {
  getAlbumsOfArtistOnCreate,
  getAlbumsOfArtistOnUpdate,
} from './triggers/getAlbumsOfArtist';
import getTracksOfAlbumTrigger from './triggers/getTracksOfAlbum';
import getAudioFeatureOfTrackTrigger from './triggers/getAudioFeaturesOfTrack';

const app = express();

const corsOptionsDelegate = (
    req: express.Request,
    callback: any
): void => {
  const corsOptions = {
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length', 'Authorization'],
  };

  if (config.CORS_ORIGINS.includes(req.headers.origin as string)) {
    corsOptions.origin = true;
  }

  callback(null, corsOptions);
};


app.use(helmet());
app.use(cors(corsOptionsDelegate));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

setRoutes(app);

const memory = config.APP_ENV === 'prod' ? '512MB' : '256MB';
export const api = functions
    .runWith({
      memory,
      timeoutSeconds: 60,
    })
    .region('europe-west2')
    .https.onRequest(app);

export const getAlbumsOfArtistManual = getAlbumsOfArtistOnCreate;
export const getAlbumsOfArtistWeb = getAlbumsOfArtistOnUpdate;
export const getTracksOfAlbum = getTracksOfAlbumTrigger;
export const getAudioFeatureOfTrack = getAudioFeatureOfTrackTrigger;
