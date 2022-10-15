<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <table>
    <tr>
      <td>S</td>
      <td>寒いし凍える</td>
    </tr>
    <tr>
      <td>S</td>
      <td>
        <label for="yourname"></label>
        <input
        id="yourname" class="suggest" type="text" name="yourarea" autocomplete="on" list="food"/>
        <datalist id="food">
        <option v-for="n in ['ハンバーガー','てりやきバーガー','ポテト']" :key="n">{{n}}</option>
        </datalist>
      </td>
    </tr>
    <tr>
      <td>S</td>
      <td>{{ test }}</td>
    </tr>
    <tr>
      <td>S</td>
      <td>寒いし凍える</td>
    </tr>
  </table>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  data() {
    return {
      test: '',
    };
  },
  mounted() {
    axios
      .get('http://localhost:8010/api/v1/soap-record-support/feedback')
      // eslint-disable-next-line no-return-assign
      .then((response) => (this.test = response));
  },
};
</script>

<style scoped>
table{
  border-collapse:collapse;
  margin:0 auto;
  width: 100%;
}
td,th{
  border:1px solid #ccc;
}
th{
  border-left:5px solid #005ab3;
  color:#005ab3;
}

.suggest {
    width: 100%;
    border: none;
}
</style>
