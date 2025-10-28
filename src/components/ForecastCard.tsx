import React from 'react';
import { ForecastDay } from '../types/weather';
import { TranslatedText } from './TranslatedText';

interface ForecastCardProps {
  forecast: ForecastDay;
  unit: 'celsius' | 'fahrenheit';
  translate: (text: string) => Promise<string>;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast, unit, translate }) => {
  const { day, date } = forecast;
  
  const maxTemp = unit === 'celsius' ? day.maxtemp_c : day.maxtemp_f;
  const minTemp = unit === 'celsius' ? day.mintemp_c : day.mintemp_f;
  const tempUnit = unit === 'celsius' ? '°C' : '°F';
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  const [translatedDate, setTranslatedDate] = React.useState(formatDate(date));
  const [translatedCondition, setTranslatedCondition] = React.useState(day.condition.text);

  React.useEffect(() => {
    const translateTexts = async () => {
      const dateText = formatDate(date);
      const [translatedDateText, translatedConditionText] = await Promise.all([
        translate(dateText),
        translate(day.condition.text)
      ]);
      setTranslatedDate(translatedDateText);
      setTranslatedCondition(translatedConditionText);
    };

    translateTexts();
  }, [date, day.condition.text, translate]);
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="text-center">
        <h3 className="font-semibold text-gray-800 mb-2">
          {translatedDate}
        </h3>
        
        <img 
          src={`https:${day.condition.icon}`} 
          alt={day.condition.text}
          className="w-12 h-12 mx-auto mb-2"
        />
        
        <p className="text-sm text-gray-600 mb-3 capitalize">
          {translatedCondition}
        </p>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-bold text-gray-800">
            {Math.round(maxTemp)}{tempUnit}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(minTemp)}{tempUnit}
          </span>
        </div>
        
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <TranslatedText text="Rain" translate={translate} />:
            <span>{day.daily_chance_of_rain}%</span>
          </div>
          <div className="flex justify-between">
            <TranslatedText text="Humidity" translate={translate} />:
            <span>{day.avghumidity}%</span>
          </div>
          <div className="flex justify-between">
            <TranslatedText text="UV" translate={translate} />:
            <span>{day.uv}</span>
          </div>
        </div>
      </div>
    </div>
  );
};