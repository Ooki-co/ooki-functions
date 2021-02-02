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

app.use((
    err: any,
    req: express.Request,
    res: express.Response,
    next:express.NextFunction
) => {
  if (!err) {
    return next();
  }
  functions.logger.error(err.stack);
  res.status(500).send('Something broke!');
});

app.get('/artists', async (req, res) => {
  const query = {
    limit: req.query.limit ?
      Number(req.query.limit) :
      undefined,
    offset: req.query.offset ?
      Number(req.query.offset) :
      undefined,
  };
  const result = await Artist.getAll(query);

  res.status(200).json(result);
});

app.post('/artists', async (req, res) => {
  const status = await Artist.add(req.body);

  res.status(200).json({status});
});

app.post('/feedback', async (req, res) => {
  const status = await addFeedback(req.body);

  res.status(200).json({status});
});

export const api = functions.region('europe-west2').https.onRequest(app);

export const getAlbumsOfArtist = getAlbumsOfArtistTrigger;
export const getTracksOfAlbum = getTracksOfAlbumTrigger;
export const getAudioFeatureOfTrack = getAudioFeatureOfTrackTrigger;
