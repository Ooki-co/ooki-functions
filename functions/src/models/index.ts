import * as mongoose from 'mongoose';
import {logger} from 'firebase-functions';
import albumSchema from './schemas/album';
import artistSchema from './schemas/artist';
import playlistSchema from './schemas/playlist';
import trackSchema from './schemas/track';
import userSchema from './schemas/user';
import config from '../config';

const options = {
  retryWrites: true,
  useNewUrlParser: true,
  autoIndex: false,
  useFindAndModify: false,
  useCreateIndex: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  useUnifiedTopology: true,
};

const conn = mongoose.createConnection(config.MONGODB_URI, options);

conn.on('error', (err) => {
  logger.error(`API DB connection is failed → ${err.message}`);
  // force to terminate
  process.exit(1);
});

conn.on('connected', () => {
  logger.info('App DB connection is successful');
});

// create db collections
conn.model('Album', albumSchema, 'albums');
conn.model('Artist', artistSchema, 'artists');
conn.model('Playlist', playlistSchema, 'playlists');
conn.model('Track', trackSchema, 'tracks');
conn.model('User', userSchema, 'users');

export default conn;
