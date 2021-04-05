import {Schema} from 'mongoose';

const trackSchema = new Schema({
  spotifyTrackId: {
    type: String,
    require: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    require: true,
    index: true,
  },
  album: {
    name: String,
    images: [{
      _id: false,
      width: Number,
      height: Number,
      url: String,
    }],
    spotifyAlbumId: String,
  },
  artists: [{
    _id: false,
    spotifyArtistId: String,
    name: String,
  }],
  durationMs: {
    type: Number,
    require: true,
  },
  explicit: {
    type: Boolean,
    require: true,
  },
  previewUrl: {
    type: String,
    require: true,
  },
  trackNumber: {
    type: Number,
    require: true,
  },
  audioFeatures: {
    danceability: Number,
    energy: Number,
    key: Number,
    loudness: Number,
    mode: Number,
    speechiness: Number,
    acousticness: Number,
    instrumentalness: Number,
    liveness: Number,
    valence: Number,
    tempo: Number,
    timeSignature: Number,
  },
}, {
  timestamps: true,
});

export default trackSchema;
