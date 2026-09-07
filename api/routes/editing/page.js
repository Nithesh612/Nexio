const mongoose = require('mongoose');

const editingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true
  },
  category: {
    type: String,
    default: 'Editing',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  collection: {
    type: String,
    default: 'Editing',
    trim: true
  },
  badge: {
    type: String,
    default: '',
    trim: true
  },
  logoUrl: {
    type: String,
    default: '',
    trim: true
  },
  bannerUrl: {
    type: String,
    default: '',
    trim: true
  },
  favorite: {
    type: Boolean,
    default: false
  },
  readLater: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  suppressReservedKeysWarning: true,
  strict: false,
  collection: 'editing'
});

editingSchema.index({ createdAt: -1 });
editingSchema.index({ url: 1 });
editingSchema.index({ category: 1 });
editingSchema.index({ collection: 1 });
editingSchema.index({ favorite: 1 });

editingSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.models.Editing || mongoose.model('Editing', editingSchema);
