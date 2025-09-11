import React from 'react';
import { AlertTriangle, Clock, MapPin } from 'lucide-react';
import { WeatherAlert as WeatherAlertType } from '../types/weather';

interface WeatherAlertProps {
  alert: WeatherAlertType;
}

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'minor':
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    case 'moderate':
      return 'bg-orange-50 border-orange-200 text-orange-800';
    case 'severe':
      return 'bg-red-50 border-red-200 text-red-800';
    case 'extreme':
      return 'bg-purple-50 border-purple-200 text-purple-800';
    default:
      return 'bg-blue-50 border-blue-200 text-blue-800';
  }
};

const getSeverityIcon = (severity: string) => {
  const baseClasses = "w-5 h-5";
  switch (severity.toLowerCase()) {
    case 'minor':
      return <AlertTriangle className={`${baseClasses} text-yellow-600`} />;
    case 'moderate':
      return <AlertTriangle className={`${baseClasses} text-orange-600`} />;
    case 'severe':
      return <AlertTriangle className={`${baseClasses} text-red-600`} />;
    case 'extreme':
      return <AlertTriangle className={`${baseClasses} text-purple-600`} />;
    default:
      return <AlertTriangle className={`${baseClasses} text-blue-600`} />;
  }
};

export const WeatherAlert: React.FC<WeatherAlertProps> = ({ alert }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className={`rounded-lg border-2 p-4 mb-4 ${getSeverityColor(alert.severity)}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {getSeverityIcon(alert.severity)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">{alert.headline}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white bg-opacity-50">
              {alert.severity}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm mb-3">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{alert.areas}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>Until {formatDate(alert.expires)}</span>
            </div>
          </div>
          
          <p className="text-sm mb-3 leading-relaxed">{alert.desc}</p>
          
          {alert.instruction && (
            <div className="bg-white bg-opacity-30 rounded-md p-3">
              <h4 className="font-medium text-sm mb-1">Instructions:</h4>
              <p className="text-sm">{alert.instruction}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};