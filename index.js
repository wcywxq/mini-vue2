import Vue from "./vue.js";

const vm = new Vue({
  el: "#app",
  data: {
    msg: "hello",
    count: "100",
    testHtml: '<ul><li>123</li></ul>'
  },
  methods: {
    handler() {
      alert(111);
    }
  }
});

console.log(vm);
