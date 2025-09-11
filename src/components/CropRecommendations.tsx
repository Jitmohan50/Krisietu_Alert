import React from 'react';
import { 
  Lightbulb, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight 
} from 'lucide-react';
import { CropRecommendation } from '../types/farmer';

interface CropRecommendationsProps {
  recommendations: CropRecommendation[];
}

export const CropRecommendations: React.FC<CropRecommendationsProps> = ({ recommendations }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'medium': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'low': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <Lightbulb className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <Lightbulb className="w-6 h-6 mr-2 text-blue-600" />
        Crop Recommendations
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {recommendations.map((rec, index) => (
          <div key={index} className={`rounded-lg border p-4 ${getPriorityColor(rec.priority)}`}>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getPriorityIcon(rec.priority)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{rec.action}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(rec.priority)}`}>
                    {rec.priority.toUpperCase()}
                  </span>
                </div>
                
                <div className="mb-3">
                  <span className="inline-flex items-center text-sm font-medium mb-2">
                    <ArrowRight className="w-4 h-4 mr-1" />
                    {rec.cropType}
                  </span>
                  <p className="text-sm leading-relaxed">{rec.description}</p>
                </div>
                
                <div className="flex items-center space-x-1 text-sm">
                  <Clock className="w-4 h-4" />
                  <span><strong>Timing:</strong> {rec.timing}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};