const UPDATE_INTERVAL = 3000;
const NUMBER_OF_POINTS = 100;

const app = Vue.createApp({
  data() {
    return {
      measurements: [],
      chart: null,
    };
  },
  async mounted() {
    this.measurements = await this.getMeasurements();
    this.getChart();
    this.addMeasurements();
  },
  methods: {
    // Initial measurements load
    async getMeasurements() {
      apiUrl = document.URL + "/api/get_measurements";
      res = await fetch(apiUrl);
      msg = await res.json();
      return await msg;
    },

    // Update measurements
    addMeasurements() {
      apiUrl = document.URL + "/api/get_new_measurements";
      setInterval(async () => {
        const res = await await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({ last_msr: this.measurements[0].pk }),
        });
        const data = await res.json();
        this.measurements.unshift(...data);
        for (msr of [...data].reverse()) {
          this.addPointToChart(msr);
        }
      }, UPDATE_INTERVAL);
    },

    // Formating time to HH:MM:SS DD.MM.YY from unix timestamp
    formatTime(time) {
      time = new Date(time);
      return time.toLocaleTimeString("ru-RU") + " " + formatDate(time);
    },

    // Chart initialization
    getChart() {
      this.chart = getChart(this.measurements.slice(0, NUMBER_OF_POINTS));
    },
    // Update points on chart
    addPointToChart(measurement) {
      m = measurement;
      series = m.transmitter - 1;
      point = {
        x: m.time_create,
        y: m.co2,
        pk: m.pk,
        ps: m.ps,
        tco2: m.tco2,
      };
      while (this.chart.series[series].data.length >= NUMBER_OF_POINTS) {
        this.chart.series[series].data[0].remove(false, false);
      }
      this.chart.series[series].addPoint(point);
    },
  },
});

app.mount("#app");
