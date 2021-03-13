import {config} from 'dotenv';
import {resolve} from 'path';

const envFilename = process.env.GCLOUD_PROJECT == 'ooki-prod' ?
  'prod.env' :
  'dev.env';

config({
  path: resolve(__dirname, `../../${envFilename}`),
});

export default {
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,

  MONGODB_URI: `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}`,
};
