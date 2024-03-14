<template>
  <SearchView v-if="state === 0" @getData="handleData" />
  <WeatherApp v-else :weatherInfo="weatherInfo" @change-city="changeCity"></WeatherApp>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import SearchView from './components/SearchView.vue'
import WeatherApp from './components/WeatherApp.vue'

export default {
  name: 'App',
  components: {
    SearchView,
    WeatherApp
  },
  setup() {
    let state = ref(0)
    let weatherInfo = reactive({})
    const handleData = (data) => {
      state.value = 1
      weatherInfo.data = data
    }
    const changeCity =()=>{
      localStorage.removeItem('save_city')
      localStorage.removeItem('save_location')
      state.value=0
    }
    return {
      state,
      handleData,
      weatherInfo,changeCity
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
:root{
  font-size: 14px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100vw;
  height: 100vh;
  background-image: -webkit-linear-gradient(
    rgb(231, 210, 210),
    rgb(191, 209, 149)
  );
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
