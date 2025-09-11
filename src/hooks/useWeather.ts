import { useState, useEffect, useCallback } from 'react';
import { WeatherData, LocationCoords } from '../types/weather';
import { WeatherService } from '../services/weatherService';
import { FarmingService } from '../services/farmingService';
import { FarmingConditions, CropAlert, CropRecommendation } from '../types/farmer';

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [farmingConditions, setFarmingConditions] = useState<FarmingConditions | null>(null);
  const [cropAlerts, setCropAlerts] = useState<CropAlert[]>([]);
  const [cropRecommendations, setCropRecommendations] = useState<CropRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchWeatherByCoords = useCallback(async (coords: LocationCoords) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await WeatherService.getWeatherData(coords);
      setWeather(data);
      
      // Analyze farming conditions
      const conditions = FarmingService.analyzeFarmingConditions(data);
      setFarmingConditions(conditions);
      
      // Generate crop alerts and recommendations
      const alerts = FarmingService.generateCropAlerts(data, conditions);
      const recommendations = FarmingService.generateCropRecommendations(data, conditions);
      
      setCropAlerts(alerts);
      setCropRecommendations(recommendations);
      setLastUpdate(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      
      // Only fallback to mock data if it's an API key issue
      if (errorMessage.includes('Invalid API key') || errorMessage.includes('authentication failed')) {
        try {
          const mockData = await WeatherService.getMockWeatherData(coords);
          setWeather(mockData);
          
          const conditions = FarmingService.analyzeFarmingConditions(mockData);
          setFarmingConditions(conditions);
          
          const alerts = FarmingService.generateCropAlerts(mockData, conditions);
          const recommendations = FarmingService.generateCropRecommendations(mockData, conditions);
          
          setCropAlerts(alerts);
          setCropRecommendations(recommendations);
          setLastUpdate(new Date());
        } catch (mockError) {
          console.error('Failed to load mock data:', mockError);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeatherByCity = useCallback(async (city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await WeatherService.getWeatherByCity(city);
      setWeather(data);
      
      // Analyze farming conditions
      const conditions = FarmingService.analyzeFarmingConditions(data);
      setFarmingConditions(conditions);
      
      // Generate crop alerts and recommendations
      const alerts = FarmingService.generateCropAlerts(data, conditions);
      const recommendations = FarmingService.generateCropRecommendations(data, conditions);
      
      setCropAlerts(alerts);
      setCropRecommendations(recommendations);
      setLastUpdate(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      
      // Only fallback to mock data if it's an API key issue
      if (errorMessage.includes('Invalid API key') || errorMessage.includes('authentication failed')) {
        try {
          const mockData = await WeatherService.getMockWeatherDataByCity(city);
          setWeather(mockData);
          
          const conditions = FarmingService.analyzeFarmingConditions(mockData);
          setFarmingConditions(conditions);
          
          const alerts = FarmingService.generateCropAlerts(mockData, conditions);
          const recommendations = FarmingService.generateCropRecommendations(mockData, conditions);
          
          setCropAlerts(alerts);
          setCropRecommendations(recommendations);
          setLastUpdate(new Date());
        } catch (mockError) {
          console.error('Failed to load mock data:', mockError);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentLocationWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const coords = await WeatherService.getCurrentPosition();
      await fetchWeatherByCoords(coords);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get current location');
      setLoading(false);
    }
  }, [fetchWeatherByCoords]);

  const retry = useCallback(() => {
    if (weather?.location) {
      fetchWeatherByCoords({
        latitude: weather.location.lat,
        longitude: weather.location.lon
      });
    } else {
      getCurrentLocationWeather();
    }
  }, [weather, fetchWeatherByCoords, getCurrentLocationWeather]);

  // Auto-fetch weather for current location on mount
  useEffect(() => {
    // Only auto-fetch if we don't already have weather data
    if (!weather) {
      getCurrentLocationWeather();
    }
    
    // Set up auto-refresh every 10 minutes
    const interval = setInterval(() => {
      if (weather?.location) {
        fetchWeatherByCoords({
          latitude: weather.location.lat,
          longitude: weather.location.lon
        });
      }
    }, 10 * 60 * 1000); // 10 minutes
    
    return () => clearInterval(interval);
  }
  )

  return {
    weather,
    farmingConditions,
    cropAlerts,
    cropRecommendations,
    loading,
    error,
    lastUpdate,
    fetchWeatherByCity,
    getCurrentLocationWeather,
    retry
  };
};