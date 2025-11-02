<template>
  <div class="dashboard">
    <div id="map" ref="map" style="height: 80vh;"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import L from 'leaflet';
import { useSocketStore } from '../stores/socket';
import { useFleetStore } from '../stores/fleet';

const map = ref(null);
const markers = new Map();
const socketStore = useSocketStore();
const fleetStore = useFleetStore();

onMounted(async () => {
  map.value = L.map('map').setView([28.6139, 77.2090], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map.value);

  socketStore.connect(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000');
  socketStore.on('employee-location', (data) => {
    fleetStore.updateLatest(data);
    const { userId, latitude, longitude } = data;
    if (markers.has(userId)) {
      markers.get(userId).setLatLng([latitude, longitude]);
    } else {
      const m = L.marker([latitude, longitude]).addTo(map.value);
      markers.set(userId, m);
    }
  });
});
</script>
