import { defineStore } from 'pinia';
import axios from 'axios';

export const useFleetStore = defineStore('fleet', {
  state: () => ({
    employees: [],
    latest: new Map()
  }),
  actions: {
    async fetchEmployees() {
      const { data } = await axios.get('/api/locations/employees');
      this.employees = data;
    },
    updateLatest({ userId, latitude, longitude, timestamp }) {
      this.latest.set(userId, { latitude, longitude, timestamp });
    }
  }
});
