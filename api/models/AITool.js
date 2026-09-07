const mongoose = require('mongoose');

const aiToolSchema = new mongoose.Schema({
  toolId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    default: 'ui-web'
  },
  desc: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    required: true
  },
  pricing: {
    type: String,
    required: true
  },
  isPartner: {
    type: Boolean,
    default: false
  },
  showInEssential: {
    type: Boolean,
    default: false
  },
  url: {
    type: String,
    required: true
  },
  bannerType: {
    type: String,
    required: true
  },
  bannerUrl: {
    type: String
  }
}, {
  timestamps: true,
  collection: 'ai-tools'
});

module.exports = mongoose.model('AITool', aiToolSchema);
