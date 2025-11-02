const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID is required'],
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contact: {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
    },
    website: String
  },
  settings: {
    trackingInterval: {
      type: Number,
      default: 30, // seconds
      min: [10, 'Tracking interval cannot be less than 10 seconds'],
      max: [300, 'Tracking interval cannot exceed 300 seconds']
    },
    geofenceEnabled: {
      type: Boolean,
      default: false
    },
    workingHoursOnly: {
      type: Boolean,
      default: false
    },
    workingHours: {
      start: {
        type: String,
        default: '09:00',
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
      },
      end: {
        type: String,
        default: '17:00',
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
      },
      timezone: {
        type: String,
        default: 'UTC'
      }
    },
    dataRetentionDays: {
      type: Number,
      default: 90,
      min: [1, 'Data retention must be at least 1 day'],
      max: [365, 'Data retention cannot exceed 365 days']
    }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium'],
      default: 'free'
    },
    employeeLimit: {
      type: Number,
      default: 5
    },
    expiresAt: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
companySchema.index({ ownerId: 1 });
companySchema.index({ name: 1 });
companySchema.index({ isActive: 1 });

// Virtual for employee count
companySchema.virtual('employeeCount', {
  ref: 'User',
  localField: '_id',
  foreignField: 'companyId',
  count: true,
  match: { role: 'employee', isActive: true }
});

// Method to check if company can add more employees
companySchema.methods.canAddEmployee = async function() {
  const User = mongoose.model('User');
  const currentEmployeeCount = await User.countDocuments({
    companyId: this._id,
    role: 'employee',
    isActive: true
  });
  
  return currentEmployeeCount < this.subscription.employeeLimit;
};

// Method to check if tracking is allowed at current time
companySchema.methods.isTrackingAllowed = function() {
  if (!this.settings.workingHoursOnly) {
    return true;
  }
  
  const now = new Date();
  const currentTime = now.toTimeString().substr(0, 5);
  
  return currentTime >= this.settings.workingHours.start && 
         currentTime <= this.settings.workingHours.end;
};

module.exports = mongoose.model('Company', companySchema);
