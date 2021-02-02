import * as functions from 'firebase-functions';
import db from '../utils/db';
import Spotify, {getAccessToken} from '../utils/spotify';
import sleep from '../utils/sleepProcess';

const getAlbumsOfArtist = functions.region('europe-west2')
    .firestore.document('artists/{spotifyId}')
    .onCreate(async (snap, context) => {
      const {spotifyId} = context.params;
      await getAccessToken();

      let body;
      let current = 0;
      const albums:any = [];
      do {
        sleep(500);
        const result = await Spotify.getArtistAlbums(spotifyId, {
          limit: 50,
          offset: current,
        });

        body = result.body;
        body.items.forEach((album:any) => {
          albums.push({
            spotifyAlbumId: album.id,
            image: album.images,
            artists: album.artists.map((artist:any) => artist.id),
            name: album.name,
            releasedAt: new Date(album.release_date),
            totalTracks: album.total_tracks,
          });
        });
        current += 50;
      } while (body.total > current);

      const batch = db.batch();
      albums.forEach((album:any) => {
        const albumRef = db.collection('albums').doc(album.spotifyAlbumId);
        batch.set(albumRef, album);
      });

      return batch.commit();
    });

export default getAlbumsOfArtist;
