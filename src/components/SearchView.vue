<template>
  <div class="search-view">
    <div class="container">
      <div class="title">{{ msg }}</div>
      <div class="img-wrap">
        <img src="@/assets/1.gif" alt="Weather Icon" />
      </div>
      <div class="input">
        <input
          type="text"
          v-model="cityName"
          placeholder="City Name，ex. Shanghai"
          @keyup.enter="search"
        />
        <button @click="search">Enter</button>
        <button @click="searchByLocation">
          <i class="iconfont icon-dingweixiao"></i>
        </button>
      </div>
      <div
        class="input-message"
        :class="{ info: !errorState, error: errorState }"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import { getWeatherByCity, getWeatherByLocation } from '../api/api'
export default {
  name: 'SearchView',
  emits: ['getData'],
  setup(props, context) {
    let msg = 'Welcome to Vue Weather App'
    let cityName = ref('')
    let message = ref('Please enter city name or click location to enter app')
    let errorState = ref(false)

    /* 通过城市进行查找 */
    const search = async () => {
      message.value = 'Loading...'
      if (cityName.value == '') {
        message.value = 'Please enter city name'
        errorState.value = true
        return
      }
      const params = { cityName: cityName.value, lang: 'zh_cn' }
      const res = await getWeatherByCity(params)
        .then((res) => res.data)
        .catch((error) => error)

      console.log(res)
      if (res.cod !== 200) {
        message.value = 'Please check if enter incorrectly'
        errorState.value = true
        return
      }
      localStorage.setItem('save_city', cityName.value)
      context.emit('getData', res)
    }

    /* 获取地理定位 */
    const getLocation = () =>
      new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve(position)
            },
            (err) => {
              console.warn('ERROR(' + err.code + '): ' + err.message)
              errorState.value = true
              if (err.code === 1) message.value = '用户拒绝获取位置信息'
              else if (err.code === 2) message.value = '无法获取位置信息'
              else if (err.code === 3)
                message.value =
                  '获取地理位置信息超时(未开启定位开关/chrome需使用VPN)'
            },
            {
              // 指示浏览器获取高精度的位置，默认为false
              enableHighAccuracy: true,
              // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
              timeout: 5000,
              // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
              maximumAge: 3000
            }
          )
        } else {
          message.value = '浏览器不支持定位'
          reject(new Error('浏览器不支持定位'))
        }
      })
    /* 发送位置获取天气 */
    const sendLocation = async (position) => {
      const res = await getWeatherByLocation({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        lang: 'zh_cn'
      })
        .then((res) => res.data)
        .catch((error) => error)

      console.log(res)
      if (res.cod !== 200) {
        message.value = '出错了'
        errorState.value = true
        return
      }

      localStorage.setItem(
        'save_location',
        JSON.stringify({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        })
      )
      context.emit('getData', res)
    }
    /* 定位按钮回调 */
    const searchByLocation = async () => {
      message.value = 'Locating...'
      const position = await getLocation()
      alert(
        `精确度:${Math.round(
          position.coords.accuracy
        )}米,纬度:${position.coords.latitude.toFixed(
          2
        )},经度:${position.coords.longitude.toFixed(2)}
提示：使用手机定位较准确,但天气API不一定收录该城市`
      )
      console.log(position)
      sendLocation(position)
    }

    /* 如果有save_city */
    let save_city =
      localStorage.getItem('save_city') === null
        ? ''
        : localStorage.getItem('save_city')
    if (save_city !== '') {
      cityName.value = save_city
      search()
    }
    let save_location =
      localStorage.getItem('save_location') === null
        ? null
        : JSON.parse(localStorage.getItem('save_location'))
    if (save_location !== null) {
      sendLocation(save_location)
    }
    return {
      msg,
      cityName,
      search,
      message,
      errorState,
      searchByLocation
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.search-view {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.container {
  height: 400px;
  width: 375px;
  box-sizing: border-box;
  border-radius: 4px;
  box-shadow: 0 4px 8px #2c3e50;
  padding: 30px 0;
  background-color: rgb(255, 255, 255);
}
.title {
  font-size: 20px;
  font-weight: bold;
}
.input {
  margin: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  input {
    display: inline-block;
    outline: none;
    padding: 10px;
    font-size: 14px;
  }
  button {
    padding: 10px;
    margin-left: -1px;
    font-size: 14px;
    &:nth-child(3) {
      margin-left: 10px;
    }
  }
}
.input-message {
  margin-top: 10px;
}
.info {
  color: #8352dd;
}
.error {
  color: #ff0000;
}
.img-wrap {
  margin: 20px 0;
}
.icon-tianqi-copy {
  font-size: 10em;
}
.img-wrap img {
  max-width: 75%; /* 限制图片最大宽度，保持图片的响应性 */
  height:75%; /* 设置高度为自动，以保持图片的纵横比 */
}

</style>
