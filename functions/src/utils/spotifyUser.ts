// eslint-disable-next-line @typescript-eslint/no-var-requires
const SpotifyAPI = require('spotify-web-api-node');

const spotifyApi = ():any => {
  const credentials = {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  };
  return new SpotifyAPI(credentials);
};

export default spotifyApi;
