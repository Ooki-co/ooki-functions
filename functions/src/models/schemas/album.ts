import {Schema} from 'mongoose';

const albumSchema = new Schema({
  spotifyAlbumId: {
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
  artists: [{
    _id: false,
    spotifyArtistId: String,
    name: String,
  }],
  images: [{
    _id: false,
    width: Number,
    height: Number,
    url: String,
  }],
  releaseDate: {
    type: Date,
    require: true,
  },
  releaseDatePrecision: {
    type: String,
    require: true,
    enum: ['year', 'month', 'day'],
  },
  totalTracks: {
    type: Number,
    require: true,
  },
  copyrights: [{
    _id: false,
    type: {
      type: String,
      require: true,
      enum: ['C', 'P'],
    },
    text: {
      type: String,
      require: true,
    },
  }],
  tracks: [{
    _id: false,
    artists: [{
      spotifyArtistId: String,
      name: String,
    }],
    durationMs: Number,
    explicit: Boolean,
    spotifyTrackId: String,
    name: String,
    previewUrl: String,
    trackNumber: Number,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default albumSchema;
