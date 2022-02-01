import * as Location from "expo-location"
import React, { useState, useEffect} from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import axios from "axios"
import { Fontisto } from '@expo/vector-icons';
const { width: SCREEN_WIDTH } = Dimensions.get("window")

const API_KEY = "4ce1ff19763060b177586dba39d26283"

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning"
}

export default function App() {
  const [city, setCity] = useState("Loading..")
  const [days, setDays] = useState([])
  const [ok, setOk] = useState(true)

  const getWeather = async () => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
  }
  const {
    coords:{latitude,longitude}
  } = await Location.getCurrentPositionAsync({ accuracy:5 })
  const location = await Location.reverseGeocodeAsync({latitude,longitude}, {useGoogleMaps:false})
  setCity(location[0].city)

  const {data} = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude={alerts}&appid=${API_KEY}&units=metric`)
  setDays(data.daily)
  console.log("####################",days)
}

  useEffect(() => {
    getWeather();
  }, []);
  

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView showsHorizontalScrollIndicator={false} pagingEnabled horizontal contentContainerStyle={styles.weather}>
        {days.length === 0 ?(
        <View style={styles.day}>
          <ActivityIndicator color="white" size="large" />
        </View>) : (
        days.map((day, index)=> 
          <View key={index} style={styles.day}>
            <View style={styles.tempicon}>
            <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
            <Fontisto name={icons[day.weather[0].main]} size={100} color="white" />
            </View>
            <Text style={styles.desc}>{day.weather[0].main}</Text>
            <Text style={styles.tinyText}>{day.weather[0].description}</Text>
          </View>
        )
          )}
      </ScrollView>
      {/* <StatusBar style='light'/> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex:1.2,
    justifyContent: "center",
    alignItems: "center"
  },
  cityName: {
    color: "white",
    fontSize: 68,
    fontFamily:"Roboto",
    fontWeight: "500",
  },
  weather: {
    
  },
  day: {
    width: SCREEN_WIDTH,
    paddingLeft: 20,
    // alignItems: "center",
  },
  tempicon: {
    // backgroundColor: "teal",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width:"100%",
  },
  temp: {
    marginTop: 50,
    fontSize: 100,
    color: "white",
  },
  desc: {
    marginTop: -30,
    fontSize: 50,
    color: "white"
  },
  tinyText: {
    fontSize: 20,
    color: "white"
  }
});
