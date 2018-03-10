var zombo = new Vue({
  el: "#zombo",
  data: {
    zombos: []
  },
  created: function() {
    this.getZombos();
  },
  methods: {
    getZombos: function() {
      axios.get('http://localhost:25565/zombo/zombos/mine').then(response => {
        console.log(response);
        this.zombos = response.data;
      });
    },
    addZombo: function() {
      axios.post("http://localhost:25565/zombo/zombos/mine").then(response => {
        this.zombos.unshift(response.data);
      });
    }
  },
  computed: {}
});
