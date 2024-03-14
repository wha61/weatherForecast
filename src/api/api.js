import axios from 'axios'
const appid = '029289fc705bb0228328a14a9fb022ad'
export const getWeatherByCity = ({ cityName,lang }) => axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${appid}&lang=${lang}`)
export const getWeatherByLocation = ({ lat,lon,lang }) => axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appid}&lang=${lang}`)