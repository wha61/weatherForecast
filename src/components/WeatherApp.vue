<template>
  <div class="weather-app">
    <div class="container">
      <div class="city">
        <span class="city-name">{{ weatherInfo.data.name }}</span>
        <span class="city-country">-{{ weatherInfo.data.sys.country }}</span>
      </div>
      <div class="weather-container">
        <div class="weather-icon">
          <img
            :src="`http://openweathermap.org/img/wn/${weatherInfo.data.weather[0].icon}@2x.png`"
            alt=""
          />
        </div>
        <div class="weather">
          <div class="weather-temp">
            {{ (weatherInfo.data.main.temp - 273.15).toFixed(0) }}℃
          </div>
          <div class="weather-info">
            <span>{{ weatherInfo.data.weather[0].main }}</span>
            <span></span>
            <span>{{ weatherInfo.data.weather[0].description }}</span>
          </div>
        </div>
      </div>
      <div class="time">
        <span>{{ time }}</span>
        <span>{{ week }}</span>
      </div>
      <div class="other">
        <div class="other-item">
          <div class="other-item-title">Temperature</div>
          <div class="other-item-info">
            {{ (weatherInfo.data.main.feels_like - 273.15).toFixed(0) }}℃
          </div>
        </div>
        <div class="other-item">
          <div class="other-item-title">Humidity</div>
          <div class="other-item-info">
            {{ weatherInfo.data.main.humidity }}%
          </div>
        </div>
        <div class="other-item">
          <div class="other-item-title">Air Pressure</div>
          <div class="other-item-info">
            <template v-if="weatherInfo.data.main.grnd_level">
              {{ weatherInfo.data.main.grnd_level }}hPa
            </template>
            <template v-else>
              {{ weatherInfo.data.main.pressure }}hPa
            </template>
          </div>
        </div>
        <div class="other-item">
          <div class="other-item-title">Visibility</div>
          <div class="other-item-info">
            {{ weatherInfo.data.visibility / 1000 }}KM
          </div>
        </div>

        <div class="other-item">
          <div class="other-item-title">Sunrise</div>
          <div class="other-item-info">
            {{ time_sunrise }}
          </div>
        </div>
        <div class="other-item">
          <div class="other-item-title">Sunset</div>
          <div class="other-item-info">
            {{ time_sunset }}
          </div>
        </div>
        <div class="other-item">
          <div class="other-item-title">{{ wind_direction }}</div>
          <div class="other-item-info">Level {{ wind_level }}</div>
        </div>
        <div class="other-item">
          <div class="other-item-title">1h P</div>
          <div class="other-item-info">
            {{ rain_1h }}<span v-if="rain_1h !== 0">mm</span>
          </div>
        </div>
        <div class="other-item">
          <div class="other-item-title">3h P</div>
          <div class="other-item-info">
            {{ rain_3h }}<span v-if="rain_3h !== 0">mm</span>
          </div>
        </div>
      </div>
      <div class="button-wrap">
        <button @click="changeCity">Choose another city</button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from '@vue/runtime-core'
export default {
  name: 'WeatherApp',
  props: ['weatherInfo'],
  emits: ['change-city'],
  setup(props, context) {
    /* 风向 */
    const wind = computed(() => props.weatherInfo.data.wind)
    const wind_direction = computed(() => {
      if (wind.value.deg === 0 || wind.value.deg === 360) return 'NE wind'
      else if (wind.value.deg > 0 && wind.value.deg < 90) return 'N wind'
      else if (wind.value.deg === 90) return 'E wind'
      else if (wind.value.deg > 90 && wind.value.deg < 180) return 'SE wind'
      else if (wind.value.deg === 180) return 'S wind'
      else if (wind.value.deg > 180 && wind.value.deg < 270) return 'SW wind'
      else if (wind.value.deg === 270) return 'W wind'
      else if (wind.value.deg > 270 && wind.value.deg < 360) return 'NW wind'
    })
    /* 风速等级 */
    const wind_level = computed(() => {
      if (wind.value.speed < 0.2) return 0
      else if (wind.value.speed > 0.2 && wind.value.speed <= 1.5) return 1
      else if (wind.value.speed > 1.5 && wind.value.speed <= 3.3) return 2
      else if (wind.value.speed > 3.3 && wind.value.speed <= 5.4) return 3
      else if (wind.value.speed > 5.4 && wind.value.speed <= 7.9) return 4
      else if (wind.value.speed > 7.9 && wind.value.speed <= 10.7) return 5
      else if (wind.value.speed > 10.7 && wind.value.speed <= 13.8) return 6
      else if (wind.value.speed > 13.8 && wind.value.speed <= 17.1) return 7
      else if (wind.value.speed > 17.1 && wind.value.speed <= 20.7) return 8
      else if (wind.value.speed > 20.7 && wind.value.speed <= 24.4) return 9
      else if (wind.value.speed > 24.4 && wind.value.speed <= 28.4) return 10
      else if (wind.value.speed > 28.4 && wind.value.speed <= 32.6) return 11
      else if (wind.value.speed > 32.6 && wind.value.speed <= 36.9) return 12
      else if (wind.value.speed > 36.9 && wind.value.speed <= 41.4) return 13
      else if (wind.value.speed > 41.4 && wind.value.speed <= 46.1) return 14
      else if (wind.value.speed > 46.1 && wind.value.speed <= 50.9) return 15
      else if (wind.value.speed > 50.9 && wind.value.speed <= 56.0) return 16
      else if (wind.value.speed > 56.0 && wind.value.speed <= 61.2) return 17
    })
    /* 将unix时间戳的时间转换为hh:mm */
    const FormatUnixTime = (unix_time) => {
      if (typeof unix_time !== 'number') return '获取错误'
      const time = new Date(unix_time * 1000)
      let hour = time.getHours()
      let minutes = time.getMinutes()
      return `${hour}:${minutes < 10 ? '0' + minutes : minutes}`
    }
    let time_sunrise = FormatUnixTime(props.weatherInfo.data.sys.sunrise)
    let time_sunset = FormatUnixTime(props.weatherInfo.data.sys.sunset)

    const time_today = new Date()
    /* 获取星期 */
    const FormatWeek = (weekday) => {
      if (typeof weekday !== 'number') return '获取错误'
      let week = ['日', '一', '二', '三', '四', '五', '六']
      return `星期${week[weekday]}`
    }
    let time = time_today.toLocaleString()
    let week = FormatWeek(time_today.getDay())
    const changeCity = () => {
      context.emit('change-city')
    }
    let rain = computed(() => props.weatherInfo.data.rain)
    let rain_1h = ref(0),
      rain_3h = ref(0)
    if (rain.value) {
      if (rain.value['1h']) {
        rain_1h.value = rain.value['1h']
      }
      if (rain.value['3h']) {
        rain_1h.value = rain.value['3h']
      }
    }
    return {
      wind_direction,
      wind_level,
      time_sunrise,
      time_sunset,
      time,
      week,
      changeCity,
      rain_1h,
      rain_3h
    }
  }
}
</script>

<style scoped lang="less">
.weather-app {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container {
  height: 500px;
  width: 360px;
  box-sizing: border-box;
  border-radius: 4px;
  box-shadow: 0 4px 8px #2c3e50;
  padding: 30px 0;
  background-color: rgb(255, 255, 255);
}
.city {
  text-align: center;
  &-name {
    font-size: 2rem;
  }
}
.weather-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.weather {
  &-temp {
    font-size: 24px;
  }
  &-info {
    span {
      &:nth-child(2) {
        margin: 0.5em;
      }
    }
  }
}
.time {
  text-align: center;
  span {
    &:nth-child(2) {
      margin-left: 1em;
    }
  }
}
.other {
  display: grid;
  justify-content: center;
  grid-template-columns: 80px 80px 80px;
  grid-template-rows: 80px 80px 80px;
  &-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &-title {
      color: #2c3e50;
      height: 24px;
    }
    &-info {
      font-weight: bold;
      font-size: 18px;
      height: 24px;
      line-height: 24px;
    }
  }
}
.button-wrap {
  display: flex;
  justify-content: center;
  button {
    border: 1px solid #bbb;
    height: 30px;
    padding: 0 10px;
    border-radius: 15px;
    background-color: #fff;
    &:hover {
      border: 1px solid rgb(62, 190, 62);
      color: rgb(62, 190, 62);
    }
  }
}
</style>