const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  coordinates: {
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180']
    },
    accuracy: {
      type: Number,
      default: null,
      min: [0, 'Accuracy cannot be negative']
    },
    altitude: {
      type: Number,
      default: null
    },
    heading: {
      type: Number,
      default: null,
      min: [0, 'Heading must be between 0 and 360'],
      max: [360, 'Heading must be between 0 and 360']
    },
    speed: {
      type: Number,
      default: null,
      min: [0, 'Speed cannot be negative']
    }
  },
  timestamp: {
    type: Date,
    required: [true, 'Timestamp is required'],
    default: Date.now,
    index: true
  },
  deviceInfo: {
    battery: {
      type: Number,
      min: [0, 'Battery level must be between 0 and 100'],
      max: [100, 'Battery level must be between 0 and 100']
    },
    isCharging: {
      type: Boolean,
      default: false
    },
    networkType: {
      type: String,
      enum: ['wifi', '4g', '3g', '2g', 'unknown'],
      default: 'unknown'
    },
    signalStrength: {
      type: Number,
      min: [0, 'Signal strength must be between 0 and 100'],
      max: [100, 'Signal strength must be between 0 and 100']
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  source: {
    type: String,
    enum: ['gps', 'network', 'passive'],
    default: 'gps'
  }
}, {
  timestamps: true
});

// Compound indexes for better query performance
locationSchema.index({ userId: 1, timestamp: -1 });
locationSchema.index({ userId: 1, isActive: 1, timestamp: -1 });
locationSchema.index({ timestamp: 1 }); // For cleanup operations

// GeoJSON index for geospatial queries
locationSchema.index({ 
  "coordinates.latitude": 1, 
  "coordinates.longitude": 1 
});

// Virtual for GeoJSON format
locationSchema.virtual('geoJSON').get(function() {
  return {
    type: 'Point',
    coordinates: [this.coordinates.longitude, this.coordinates.latitude]
  };
});

// Static method to get latest location for user
locationSchema.statics.getLatestByUser = function(userId) {
  return this.findOne({ 
    userId: userId, 
    isActive: true 
  }).sort({ timestamp: -1 });
};

// Static method to get location history
locationSchema.statics.getHistory = function(userId, startDate, endDate, limit = 100) {
  const query = { 
    userId: userId,
    isActive: true
  };
  
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }
  
  return this.find(query)
    .sort({ timestamp: -1 })
    .limit(limit);
};

// Method to calculate distance from another location
locationSchema.methods.distanceTo = function(otherLocation) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = this.coordinates.latitude * Math.PI/180;
  const φ2 = otherLocation.coordinates.latitude * Math.PI/180;
  const Δφ = (otherLocation.coordinates.latitude - this.coordinates.latitude) * Math.PI/180;
  const Δλ = (otherLocation.coordinates.longitude - this.coordinates.longitude) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
};

module.exports = mongoose.model('Location', locationSchema);
