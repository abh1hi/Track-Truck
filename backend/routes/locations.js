const router = require('express').Router();
const Joi = require('joi');
const auth = require('../middleware/auth');
const Location = require('../models/Location');

const locationSchema = Joi.object({
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  accuracy: Joi.number().min(0).optional(),
  altitude: Joi.number().optional(),
  heading: Joi.number().min(0).max(360).optional(),
  speed: Joi.number().min(0).optional(),
  battery: Joi.number().min(0).max(100).optional(),
  isCharging: Joi.boolean().optional(),
  networkType: Joi.string().valid('wifi','4g','3g','2g','unknown').optional(),
  signalStrength: Joi.number().min(0).max(100).optional(),
  timestamp: Joi.date().optional()
});

// Employee sends current location
router.post('/update', auth(), async (req, res) => {
  try {
    const payload = await locationSchema.validateAsync(req.body);

    const loc = await Location.create({
      userId: req.user.id,
      coordinates: {
        latitude: payload.latitude,
        longitude: payload.longitude,
        accuracy: payload.accuracy ?? null,
        altitude: payload.altitude ?? null,
        heading: payload.heading ?? null,
        speed: payload.speed ?? null
      },
      timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date(),
      deviceInfo: {
        battery: payload.battery ?? null,
        isCharging: payload.isCharging ?? false,
        networkType: payload.networkType ?? 'unknown',
        signalStrength: payload.signalStrength ?? null
      },
      isActive: true,
      source: 'gps'
    });

    // Emit real-time event via Socket.io room per company (set in socket handler)
    req.app.get('io').to(req.user.companyId || req.user.id).emit('employee-location', {
      userId: req.user.id,
      latitude: loc.coordinates.latitude,
      longitude: loc.coordinates.longitude,
      accuracy: loc.coordinates.accuracy,
      timestamp: loc.timestamp
    });

    res.status(201).json({ message: 'Location updated', location: loc });
  } catch (err) {
    if (err.isJoi) return res.status(400).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
});

// Owner fetches latest locations of all employees
router.get('/employees', auth('owner'), async (req, res) => {
  try {
    const companyId = req.user.id; // owner id reference resolved in query below
    const pipeline = [
      { $match: { isActive: true } },
      { $sort: { timestamp: -1 } },
      { $group: { _id: "$userId", latest: { $first: "$$ROOT" } } },
      { $replaceWith: "$latest" }
    ];
    const latest = await Location.aggregate(pipeline);
    res.json(latest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// History for an employee
router.get('/history/:employeeId', auth(), async (req, res) => {
  try {
    const { from, to, limit } = req.query;
    const list = await Location.getHistory(
      req.params.employeeId,
      from ? new Date(from) : undefined,
      to ? new Date(to) : undefined,
      limit ? parseInt(limit) : 500
    );
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;