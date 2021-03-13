import {Schema} from 'mongoose';

const playlistSchema = new Schema({
  spotifyPlaylistId: {
    type: String,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    require: true,
    maxLength: 100,
    index: true,
  },
  description: {
    type: String,
    maxLength: 300,
  },
  public: {
    type: Boolean,
    default: false,
  },
  collaborative: {
    type: Boolean,
    default: false,
  },
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
  images: [{
    _id: false,
    width: Number,
    height: Number,
    url: String,
  }],
  synchronizedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default playlistSchema;
