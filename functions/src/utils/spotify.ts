// eslint-disable-next-line @typescript-eslint/no-var-requires
const SpotifyAPI = require('spotify-web-api-node');
import * as functions from 'firebase-functions';
import config from '../config';

const spotifyApi = new SpotifyAPI({
  clientId: config.SPOTIFY_CLIENT_ID,
  clientSecret: config.SPOTIFY_CLIENT_SECRET,
});

export const getAccessToken = ():Promise<any> =>
  spotifyApi.clientCredentialsGrant().then(
      function(data:any) {
        functions.logger.info('SpotifyAPIAuth: The access token created');
        functions.logger.info(`ClientID: ${config.SPOTIFY_CLIENT_ID}`);
        spotifyApi.setAccessToken(data.body.access_token);
      },
      function(err:any) {
        functions.logger.error(
            `SpotifyAPIAuth: Something went wrong when retrieving an access 
            token ${JSON.stringify(err)}`
        );
      }
  );

interface IQuery {
  limit?: number,
  offset?: number
}
type RecordObj = {
  [key: string]: any
}

/**
 * Spotify API
 */
class Spotify {
  /**
   * get an artist by ID
   * @param {string} id artist spotify ID
   * @return {Promise}
   */
  static getArtist(id: string): Promise<RecordObj> {
    return spotifyApi.getArtist(id).catch((err:any) => {
      functions.logger.error(
          'SpotifyAPIError[getArtist]: ', JSON.stringify(err)
      );
    });
  }

  /**
   *
   * @param {string} id artist spotify ID
   * @param {object} query query options
   * @return {Promise}
   */
  static getArtistAlbums(id: string, query: IQuery = {}): Promise<RecordObj> {
    return spotifyApi.getArtistAlbums(id, {
      include_groups: 'album,single',
      market: 'US',
      ...query,
    }).catch((err:any) => {
      functions.logger.error(
          'SpotifyAPIError[getArtistAlbums]: ', JSON.stringify(err)
      );
    });
  }

  /**
   *
   * @param {string} albumId
   * @return {Promise}
   */
  static getAlbumTracks(albumId: string): Promise<RecordObj> {
    return spotifyApi.getAlbumTracks(albumId, {
      limit: 50,
    }).catch((err:any) => {
      functions.logger.error(
          'SpotifyAPIError[getAlbumTracks]: ', JSON.stringify(err)
      );
    });
  }

  /**
   *
   * @param {string} trackId
   * @return {Promise}
   */
  static getAudioFeatures(trackId: string): Promise<RecordObj> {
    return spotifyApi.getAudioFeaturesForTrack(trackId).catch((err:any) => {
      functions.logger.error(
          'SpotifyAPIError[getAudioFeatures]: ', JSON.stringify(err)
      );
    });
  }
}


export default Spotify;
