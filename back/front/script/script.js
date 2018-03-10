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
      axios.get('http://localhost:25565/zombo/zombos/stats').then(response => {
        console.log(response);
        this.totalZombos = response.data.totalZ;
        this.yourZombos = response.data.yourZ;
        this.totalStorage = response.data.totalS;
        this.yourStorage = response.data.yourS;
      });
    },
    getZombos: function() {
      axios.get('http://localhost:25565/zombo/zombos/mine').then(response => {
        console.log(response);
        this.zombos = response.data;
      });
    },
    addZombo: function() {
      axios.post("http://localhost:25565/zombo/zombos/mine").then(response => {
        this.zombos.unshift(response.data);
        this.getStats();
      });
    },
    deleteZombo: function(zombo) {
      axios.delete("http://localhost:25565/zombo/zombos/mine/" + zombo.id).then(response => {
        this.getStats();
        this.getZombos();
      })
    },
    copyZombo: function(zombo) {
      axios.put("http://localhost:25565/zombo/zombos/mine/" + zombo.id).then(response => {
        this.getStats();
        this.getZombos();
      });
    }
  },
  computed: {}
});
