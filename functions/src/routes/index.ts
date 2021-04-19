import addFeedback from '../api/feedback';
import Artist from '../api/artist';
import User from '../api/user';
import Track from '../api/track';
import Playlist from '../api/playlist';
import {auth} from '../middlewares/auth';

const setRoutes = (app:any) => {
  app.get('/artists', Artist.getAll);

  app.post('/artists', Artist.add);

  app.get('/track', Artist.getRandomTrack);

  app.get('/sanlar', Artist.getNumbers);

  app.post('/feedback', addFeedback);

  app.post('/users/login', User.login);

  app.get('/tracks',
      auth,
      Track.getTracks
  );

  app.get('/users/me/playlists', auth, Playlist.getUserPlaylists);
  app.post('/playlists', auth, Playlist.add);
  app.put('/playlists', auth, Playlist.update);

  app.delete('/tracks', auth, Track.deleteTracks);
};

export default setRoutes;
