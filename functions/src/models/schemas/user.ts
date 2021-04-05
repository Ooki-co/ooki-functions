import {Schema} from 'mongoose';

/**
 * @implements {IUserObject}
 */
const userSchema = new Schema({
  spotifyUserId: {
    type: String,
    require: true,
    unique: true,
    index: true,
  },
  displayName: {
    type: String,
    require: true,
    index: true,
  },
  email: {
    type: String,
    index: true,
    // TODO: add validator
  },
  country: String,
  explicitContent: {
    type: Boolean,
    default: false,
  },
  externalUrls: {
    type: Map,
    of: String,
  },
  images: [{
    width: Number,
    height: Number,
    url: String,
  }],
  settings: {
    type: Map,
  },
  auth: {
    provider: {
      type: String,
      default: 'spotify',
      enum: ['spotify'],
    },
    accessToken: String,
    refreshToken: String,
    expiresAt: Date,
  },
}, {
  timestamps: true,
});

export default userSchema;
