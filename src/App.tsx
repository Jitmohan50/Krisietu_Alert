import React from 'react';
import { useState } from 'react';
import { Cloud, Settings, RefreshCw } from 'lucide-react';
import { useWeather } from './hooks/useWeather';
import { LocationSearch } from './components/LocationSearch';
import { CurrentWeather } from './components/CurrentWeather';
import { CropAlerts } from './components/CropAlerts';
import { FarmingConditions } from './components/FarmingConditions';
import { CropRecommendations } from './components/CropRecommendations';
import { ForecastCard } from './components/ForecastCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';

function App() {
  const { 
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
  } = useWeather();
  const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('celsius');

  const handleLocationSelect = (location: string) => {
    fetchWeatherByCity(location);
  };

  const toggleUnit = () => {
    setUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  const formatLastUpdate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Cloud className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">KrisiSetu Alerts</h1>
                <p className="text-sm text-gray-600">Smart farming weather alerts & recommendations</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {lastUpdate && (
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                  <RefreshCw className="w-4 h-4" />
                  <span>Updated: {formatLastUpdate(lastUpdate)}</span>
                </div>
              )}
              <button
                onClick={toggleUnit}
                className="flex items-center space-x-2 px-3 py-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors duration-200"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {unit === 'celsius' ? '°C' : '°F'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LocationSearch 
          onLocationSelect={handleLocationSelect}
          onCurrentLocation={getCurrentLocationWeather}
          loading={loading}
        />

        {error && (
          <ErrorMessage message={error} onRetry={retry} />
        )}

        {loading && !weather && (
          <LoadingSpinner />
        )}

        {weather && (
          <div className="space-y-6">
            {/* Current Weather */}
            <CurrentWeather weather={weather} unit={unit} />

            {/* Crop Alerts */}
            <CropAlerts alerts={cropAlerts} />

            {/* Farming Conditions */}
            {farmingConditions && (
              <FarmingConditions conditions={farmingConditions} />
            )}

            {/* Crop Recommendations */}
            <CropRecommendations recommendations={cropRecommendations} />

            {/* 7-Day Forecast */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7-Day Forecast</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                {weather.forecast.forecastday.map((day, index) => (
                  <ForecastCard key={index} forecast={day} unit={unit} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Smart weather monitoring for modern agriculture
            </p>
            <p className="text-xs mt-2">
              Real-time weather data with AI-powered farming recommendations.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
