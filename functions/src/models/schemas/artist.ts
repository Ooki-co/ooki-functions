import {Schema} from 'mongoose';

const artistSchema = new Schema({
  spotifyArtistId: {
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
  addedBy: {
    type: String,
    require: true,
    enum: [
      'manual',
      'web',
    ],
  },
  email: String,
  genres: [String],
  images: [{
    _id: false,
    width: Number,
    height: Number,
    url: String,
  }],
  externalUrls: {
    type: Map,
    of: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default artistSchema;
