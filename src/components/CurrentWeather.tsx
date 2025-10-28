import React from 'react';
import { 
  Thermometer, 
  Wind, 
  Droplets, 
  Eye, 
  Gauge, 
  Sun,
  MapPin,
  Clock
} from 'lucide-react';
import { WeatherData } from '../types/weather';
import { TranslatedText } from './TranslatedText';

interface CurrentWeatherProps {
  weather: WeatherData;
  unit: 'celsius' | 'fahrenheit';
  translate: (text: string) => Promise<string>;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather, unit, translate }) => {
  const { current, location } = weather;
  
  const temperature = unit === 'celsius' ? current.temp_c : current.temp_f;
  const feelsLike = unit === 'celsius' ? current.feelslike_c : current.feelslike_f;
  const windSpeed = unit === 'celsius' ? current.wind_kph : current.wind_mph;
  const windUnit = unit === 'celsius' ? 'km/h' : 'mph';
  const tempUnit = unit === 'celsius' ? '°C' : '°F';
  const visibility = unit === 'celsius' ? current.vis_km : current.vis_miles;
  const visUnit = unit === 'celsius' ? 'km' : 'miles';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-gray-500" />
          <h2 className="text-xl font-semibold text-gray-800">
            {location.name}, {location.region}
          </h2>
        </div>
        <div className="flex items-center space-x-2 text-gray-500">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{location.localtime}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Temperature Display */}
        <div className="flex items-center space-x-6">
          <img 
            src={`https:${current.condition.icon}`} 
            alt={current.condition.text}
            className="w-20 h-20"
          />
          <div>
            <div className="text-5xl font-bold text-gray-800">
              {Math.round(temperature)}{tempUnit}
            </div>
            <div className="text-lg text-gray-600 capitalize">
              <TranslatedText text={current.condition.text} translate={translate} />
            </div>
            <div className="text-sm text-gray-500">
              <TranslatedText text="Feels like" translate={translate} /> {Math.round(feelsLike)}{tempUnit}
            </div>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Wind className="w-5 h-5 text-blue-600" />
              <TranslatedText text="Wind" translate={translate} className="text-sm font-medium text-blue-800" />
            </div>
            <div className="text-lg font-semibold text-blue-900">
              {windSpeed} {windUnit}
            </div>
            <div className="text-xs text-blue-700">{current.wind_dir}</div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Droplets className="w-5 h-5 text-green-600" />
              <TranslatedText text="Humidity" translate={translate} className="text-sm font-medium text-green-800" />
            </div>
            <div className="text-lg font-semibold text-green-900">
              {current.humidity}%
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Gauge className="w-5 h-5 text-purple-600" />
              <TranslatedText text="Pressure" translate={translate} className="text-sm font-medium text-purple-800" />
            </div>
            <div className="text-lg font-semibold text-purple-900">
              {current.pressure_mb} mb
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="w-5 h-5 text-orange-600" />
              <TranslatedText text="Visibility" translate={translate} className="text-sm font-medium text-orange-800" />
            </div>
            <div className="text-lg font-semibold text-orange-900">
              {visibility} {visUnit}
            </div>
          </div>
        </div>
      </div>

      {/* UV Index */}
      <div className="mt-6 bg-yellow-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sun className="w-5 h-5 text-yellow-600" />
            <TranslatedText text="UV Index" translate={translate} className="text-sm font-medium text-yellow-800" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-lg font-semibold text-yellow-900">
              {current.uv}
            </div>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              current.uv <= 2 ? 'bg-green-100 text-green-800' :
              current.uv <= 5 ? 'bg-yellow-100 text-yellow-800' :
              current.uv <= 7 ? 'bg-orange-100 text-orange-800' :
              current.uv <= 10 ? 'bg-red-100 text-red-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              <TranslatedText 
                text={current.uv <= 2 ? 'Low' :
                     current.uv <= 5 ? 'Moderate' :
                     current.uv <= 7 ? 'High' :
                     current.uv <= 10 ? 'Very High' : 'Extreme'}
                translate={translate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};