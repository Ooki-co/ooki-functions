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
  owner: {
    spotifyUserId: String,
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
    spotifyTrackId: String,
    addedBy: String,
    addedAt: Date,
  }],
  images: [{
    _id: false,
    width: Number,
    height: Number,
    url: String,
  }],
  followers: {
    total: Number,
  },
  synchronizedAt: Date,
}, {
  timestamps: true,
});

export default playlistSchema;
