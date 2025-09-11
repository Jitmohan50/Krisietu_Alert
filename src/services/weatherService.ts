import axios from 'axios';
import { WeatherData, LocationCoords } from '../types/weather';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = import.meta.env.VITE_WEATHER_API_URL || 'https://api.weatherapi.com/v1';

export class WeatherService {
  static async getCurrentPosition(): Promise<LocationCoords> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  static async getWeatherData(coords: LocationCoords): Promise<WeatherData> {
    try {
      if (!WEATHER_API_KEY || WEATHER_API_KEY === 'demo_key' || WEATHER_API_KEY.trim() === '') {
        // Return enhanced mock data for demo
        return this.getMockWeatherData(coords);
      }

      const response = await axios.get(
        `${BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${coords.latitude},${coords.longitude}&days=7&aqi=yes&alerts=yes`
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.warn('Weather API authentication failed. Using demo data. Please check your VITE_WEATHER_API_KEY in the .env file.');
        throw new Error('Invalid API key. Please check your VITE_WEATHER_API_KEY in the .env file and refresh the page.');
      } else {
        console.error('Error fetching weather data:', error);
        throw new Error('Failed to fetch weather data. Please try again.');
      }
    }
  }

  static async getWeatherByCity(city: string): Promise<WeatherData> {
    try {
      if (!WEATHER_API_KEY || WEATHER_API_KEY === 'demo_key' || WEATHER_API_KEY.trim() === '') {
        // Return enhanced mock data for demo
        return this.getMockWeatherDataByCity(city);
      }

      const response = await axios.get(
        `${BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${city}&days=7&aqi=yes&alerts=yes`
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.warn('Weather API authentication failed. Using demo data. Please check your VITE_WEATHER_API_KEY in the .env file.');
        throw new Error('Invalid API key. Please check your VITE_WEATHER_API_KEY in the .env file and refresh the page.');
      } else {
        console.error('Error fetching weather data:', error);
        throw new Error('Failed to fetch weather data. Please try again.');
      }
    }
  }

  private static getMockWeatherData(coords: LocationCoords): WeatherData {
    const now = new Date();
    const currentTemp = 18 + Math.random() * 15; // 18-33°C
    const humidity = 45 + Math.random() * 40; // 45-85%
    const windSpeed = 5 + Math.random() * 20; // 5-25 km/h
    
    return {
      location: {
        name: "Current Location",
        region: "Your Area",
        country: "Your Country",
        lat: coords.latitude,
        lon: coords.longitude,
        localtime: now.toISOString().slice(0, 16).replace('T', ' ')
      },
      current: {
        temp_c: currentTemp,
        temp_f: (currentTemp * 9/5) + 32,
        condition: {
          text: humidity > 70 ? "Overcast" : humidity > 50 ? "Partly cloudy" : "Sunny",
          icon: humidity > 70 ? "//cdn.weatherapi.com/weather/64x64/day/122.png" : 
                humidity > 50 ? "//cdn.weatherapi.com/weather/64x64/day/116.png" : 
                "//cdn.weatherapi.com/weather/64x64/day/113.png",
          code: humidity > 70 ? 1009 : humidity > 50 ? 1003 : 1000
        },
        wind_mph: windSpeed * 0.621371,
        wind_kph: windSpeed,
        wind_dir: "SW",
        pressure_mb: 1013 + (Math.random() - 0.5) * 20,
        pressure_in: 29.92,
        precip_mm: humidity > 75 ? Math.random() * 5 : 0,
        precip_in: 0,
        humidity: Math.round(humidity),
        cloud: humidity > 70 ? 85 : humidity > 50 ? 50 : 15,
        feelslike_c: currentTemp + (Math.random() - 0.5) * 4,
        feelslike_f: 0,
        vis_km: 16.0,
        vis_miles: 10.0,
        uv: Math.round(Math.random() * 8 + 1),
        gust_mph: windSpeed * 0.621371 * 1.5,
        gust_kph: windSpeed * 1.5
      },
      forecast: {
        forecastday: Array.from({ length: 7 }, (_, i) => {
          const date = new Date(now);
          date.setDate(date.getDate() + i);
          const dayTemp = 15 + Math.random() * 20;
          const dayHumidity = 40 + Math.random() * 50;
          
          return {
            date: date.toISOString().split('T')[0],
            date_epoch: Math.floor(date.getTime() / 1000),
            day: {
              maxtemp_c: dayTemp + 5,
              maxtemp_f: (dayTemp + 5) * 9/5 + 32,
              mintemp_c: dayTemp - 5,
              mintemp_f: (dayTemp - 5) * 9/5 + 32,
              avgtemp_c: dayTemp,
              avgtemp_f: dayTemp * 9/5 + 32,
              maxwind_mph: (windSpeed + Math.random() * 10) * 0.621371,
              maxwind_kph: windSpeed + Math.random() * 10,
              totalprecip_mm: dayHumidity > 70 ? Math.random() * 10 : 0,
              totalprecip_in: 0,
              totalsnow_cm: 0,
              avgvis_km: 16.0,
              avgvis_miles: 10.0,
              avghumidity: Math.round(dayHumidity),
              daily_will_it_rain: dayHumidity > 70 ? 1 : 0,
              daily_chance_of_rain: Math.round(dayHumidity > 70 ? 60 + Math.random() * 40 : Math.random() * 30),
              daily_will_it_snow: 0,
              daily_chance_of_snow: 0,
              condition: {
                text: dayHumidity > 70 ? "Light rain" : dayHumidity > 50 ? "Partly cloudy" : "Sunny",
                icon: dayHumidity > 70 ? "//cdn.weatherapi.com/weather/64x64/day/296.png" : 
                      dayHumidity > 50 ? "//cdn.weatherapi.com/weather/64x64/day/116.png" : 
                      "//cdn.weatherapi.com/weather/64x64/day/113.png",
                code: dayHumidity > 70 ? 1183 : dayHumidity > 50 ? 1003 : 1000
              },
              uv: Math.round(Math.random() * 8 + 1)
            },
            astro: {
              sunrise: "06:15 AM",
              sunset: "07:45 PM",
              moonrise: "11:30 PM",
              moonset: "12:45 PM",
              moon_phase: "Waxing Crescent",
              moon_illumination: "25"
            },
            hour: []
          };
        })
      },
      alerts: {
        alert: this.generateFarmingAlerts(currentTemp, humidity, windSpeed)
      }
    };
  }

  static getMockWeatherDataByCity(city: string): WeatherData {
    const mockCoords = { latitude: 40.7128, longitude: -74.0060 };
    const data = this.getMockWeatherData(mockCoords);
    data.location.name = city;
    return data;
  }

  private static generateFarmingAlerts(temp: number, humidity: number, windSpeed: number) {
    const alerts = [];

    // Frost warning
    if (temp < 5) {
      alerts.push({
        headline: "Frost Warning - Protect Your Crops",
        msgtype: "Alert",
        severity: "Severe",
        urgency: "Immediate",
        areas: "All farming areas",
        category: "Agricultural",
        certainty: "Likely",
        event: "Frost Warning",
        note: "",
        effective: new Date().toISOString(),
        expires: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        desc: "Temperatures are expected to drop below 5°C, which may damage sensitive crops and plants.",
        instruction: "Cover sensitive plants with frost cloth or plastic sheeting. Move potted plants indoors. Harvest any remaining temperature-sensitive crops immediately. Consider using frost protection methods like sprinklers or heaters for valuable crops."
      });
    }

    // High wind warning
    if (windSpeed > 25) {
      alerts.push({
        headline: "High Wind Advisory - Secure Farm Equipment",
        msgtype: "Alert",
        severity: "Moderate",
        urgency: "Expected",
        areas: "All farming areas",
        category: "Agricultural",
        certainty: "Likely",
        event: "High Wind Advisory",
        note: "",
        effective: new Date().toISOString(),
        expires: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
        desc: "Strong winds may damage crops, greenhouses, and farm structures.",
        instruction: "Secure loose farm equipment and materials. Check greenhouse structures and reinforce if necessary. Avoid spraying pesticides or fertilizers. Consider delaying field operations until winds subside."
      });
    }

    // Drought conditions
    if (humidity < 40 && temp > 25) {
      alerts.push({
        headline: "Drought Conditions - Increase Irrigation",
        msgtype: "Alert",
        severity: "Moderate",
        urgency: "Expected",
        areas: "All farming areas",
        category: "Agricultural",
        certainty: "Observed",
        event: "Drought Advisory",
        note: "",
        effective: new Date().toISOString(),
        expires: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        desc: "Low humidity and high temperatures are creating drought-like conditions that may stress crops.",
        instruction: "Increase irrigation frequency for all crops. Apply mulch to retain soil moisture. Monitor plants for signs of water stress. Consider drought-resistant crop varieties for future planting."
      });
    }

    // Optimal planting conditions
    if (temp >= 15 && temp <= 25 && humidity >= 50 && humidity <= 70 && windSpeed < 15) {
      alerts.push({
        headline: "Optimal Planting Conditions",
        msgtype: "Update",
        severity: "Minor",
        urgency: "Future",
        areas: "All farming areas",
        category: "Agricultural",
        certainty: "Observed",
        event: "Favorable Conditions",
        note: "",
        effective: new Date().toISOString(),
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        desc: "Current weather conditions are ideal for planting and field operations.",
        instruction: "Excellent conditions for planting seeds, transplanting seedlings, and general field work. Soil conditions should be optimal for cultivation. Take advantage of these favorable conditions for outdoor farm activities."
      });
    }

    return alerts;
  }
}