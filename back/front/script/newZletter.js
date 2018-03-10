var zombo = new Vue({
  el: "#zombo",
  data: {
    firstname:"",
    lastname:"",
    email:"",
    username:"",
    totalUsers: 1000000000000
  },
  created: function() {
    this.getTotal();
  },
  methods: {
    getTotal: function() {
      console.log("getTotal");
      axios.get('http://localhost:25565/zombo/newZletter').then(response => {
        console.log(response);
        this.totalUsers = 1000000000000 + response.data.totalUsers;
      });
    },
    signUp: function() {
      axios.post('http://localhost:25565/zombo/newZletter', {
        fname: this.firstname,
        lname: this.lastname,
        email: this.email,
        username: this.username
      }).then(response => {
        this.firstname = "";
        this.lastname = "";
        this.email = "";
        this.username = "";
        this.getTotal();
        return true;
      });
    }
  },
  computed: {
    total: function() {
      return this.totalUsers.toLocaleString();
    }
  }
});
