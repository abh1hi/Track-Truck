<template>
  <div class="container">
    <h2>Track Truck - Employee</h2>
    <button :class="{ on: tracking }" @click="toggleTracking">
      {{ tracking ? 'Turn Off Tracking' : 'Turn On Tracking' }}
    </button>
    <p v-if="last">Lat: {{ last?.coords?.latitude?.toFixed(5) }} | Lng: {{ last?.coords?.longitude?.toFixed(5) }}</p>
    <p>Status: {{ status }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Geolocation } from '@capacitor/geolocation';
import axios from 'axios';

const tracking = ref(false);
const last = ref(null);
const status = ref('Idle');
let watchId = null;

async function toggleTracking() {
  tracking.value = !tracking.value;
  if (tracking.value) {
    status.value = 'Requesting permissions…';
    await Geolocation.requestPermissions();
    status.value = 'Tracking…';
    watchId = await Geolocation.watchPosition({ enableHighAccuracy: true }, async (position, err) => {
      if (err) {
        status.value = 'Error: ' + err.message;
        return;
      }
      last.value = position;
      try {
        await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/locations/update', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString()
        }, { headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` } });
      } catch (e) {
        status.value = 'Network issue';
      }
    });
  } else {
    status.value = 'Stopped';
    if (watchId) await Geolocation.clearWatch({ id: watchId });
  }
}
</script>

<style>
.container { display: flex; flex-direction: column; gap: 12px; padding: 16px; }
button { padding: 12px 16px; font-size: 16px; }
button.on { background: #d9534f; color: white; }
</style>
