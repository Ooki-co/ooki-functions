// eslint-disable-next-line @typescript-eslint/no-var-requires
const SpotifyAPI = require('spotify-web-api-node');
import config from '../config';

const spotifyApi = ():any => {
  const credentials = {
    clientId: config.SPOTIFY_CLIENT_ID,
    clientSecret: config.SPOTIFY_CLIENT_SECRET,
    redirectUri: config.SPOTIFY_REDIRECT_URI,
  };
  return new SpotifyAPI(credentials);
};

export default spotifyApi;
