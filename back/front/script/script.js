var zombo = new Vue({
  el: "#zombo",
  data: {
    zombos: [],
    totalZombos: 0,
    yourZombos: 0,
    totalStorage: 0,
    yourStorage: 0
  },
  created: function() {
    this.getStats();
    this.getZombos();
  },
  methods: {
    getStats: function() {
      axios.get('/zombo/zombos/stats').then(response => {
        console.log(response);
        this.totalZombos = response.data.totalZ;
        this.yourZombos = response.data.yourZ;
        this.totalStorage = response.data.totalS;
        this.yourStorage = response.data.yourS;
      });
    },
    getZombos: function() {
      axios.get('/zombo/zombos/mine').then(response => {
        console.log(response);
        this.zombos = response.data;
      });
    },
    addZombo: function() {
      axios.post("/zombo/zombos/mine").then(response => {
        this.zombos.unshift(response.data);
        this.getStats();
      });
    },
    deleteZombo: function(zombo) {
      axios.delete("/zombo/zombos/mine/" + zombo.id).then(response => {
        this.getStats();
        this.getZombos();
      })
    },
    copyZombo: function(zombo) {
      axios.put("/zombo/zombos/mine/" + zombo.id).then(response => {
        this.getStats();
        this.getZombos();
      });
    },
    renameZombo: function(zombo) {
      axios.put("/zombo/zombos/mine/" + zombo.id + "/rename").then(response => {
        this.getZombos();
      });
    }
  },
  computed: {}
});
