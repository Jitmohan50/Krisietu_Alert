import React from 'react';
import { 
  AlertTriangle, 
  Droplets, 
  Bug, 
  Shield, 
  Sprout, 
  Scissors,
  Clock,
  Thermometer
} from 'lucide-react';
import { CropAlert } from '../types/farmer';

interface CropAlertsProps {
  alerts: CropAlert[];
}

export const CropAlerts: React.FC<CropAlertsProps> = ({ alerts }) => {
  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'irrigation': return <Droplets className="w-5 h-5" />;
      case 'pest': return <Bug className="w-5 h-5" />;
      case 'disease': return <Shield className="w-5 h-5" />;
      case 'harvest': return <Scissors className="w-5 h-5" />;
      case 'planting': return <Sprout className="w-5 h-5" />;
      case 'protection': return <Thermometer className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'high': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <Sprout className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-800">All Clear!</h3>
            <p className="text-green-700">No active crop alerts at this time. Conditions are favorable for farming operations.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
        <AlertTriangle className="w-6 h-6 mr-2 text-orange-600" />
        Active Crop Alerts
      </h2>
      
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className={`rounded-xl border-2 p-6 ${getSeverityColor(alert.severity)}`}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                {getAlertIcon(alert.alertType)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold">{alert.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSeverityBadgeColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="text-sm bg-white bg-opacity-50 px-2 py-1 rounded">
                      {alert.cropType}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium mb-2">Description:</h4>
                    <p className="text-sm leading-relaxed">{alert.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Recommended Action:</h4>
                    <p className="text-sm leading-relaxed">{alert.recommendation}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span><strong>Timeframe:</strong> {alert.timeframe}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Thermometer className="w-4 h-4" />
                    <span><strong>Conditions:</strong> {alert.weatherCondition}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};