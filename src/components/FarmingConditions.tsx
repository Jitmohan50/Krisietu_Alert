import React from 'react';
import { 
  Droplets, 
  Sprout, 
  Bug, 
  Shield, 
  Tractor,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { FarmingConditions as FarmingConditionsType } from '../types/farmer';

interface FarmingConditionsProps {
  conditions: FarmingConditionsType;
}

export const FarmingConditions: React.FC<FarmingConditionsProps> = ({ conditions }) => {
  const getConditionColor = (condition: string, type: 'risk' | 'quality' | 'boolean') => {
    if (type === 'risk') {
      switch (condition) {
        case 'low': return 'text-green-600 bg-green-50';
        case 'medium': return 'text-yellow-600 bg-yellow-50';
        case 'high': return 'text-red-600 bg-red-50';
        default: return 'text-gray-600 bg-gray-50';
      }
    } else if (type === 'quality') {
      switch (condition) {
        case 'excellent': return 'text-green-600 bg-green-50';
        case 'good': return 'text-green-600 bg-green-50';
        case 'fair': return 'text-yellow-600 bg-yellow-50';
        case 'poor': return 'text-orange-600 bg-orange-50';
        case 'unsuitable': return 'text-red-600 bg-red-50';
        case 'optimal': return 'text-green-600 bg-green-50';
        case 'wet': return 'text-blue-600 bg-blue-50';
        case 'dry': return 'text-orange-600 bg-orange-50';
        default: return 'text-gray-600 bg-gray-50';
      }
    } else {
      return condition ? 'text-orange-600 bg-orange-50' : 'text-green-600 bg-green-50';
    }
  };

  const getConditionIcon = (condition: string, needed: boolean) => {
    if (needed) return <AlertTriangle className="w-5 h-5" />;
    if (['excellent', 'good', 'optimal', 'low'].includes(condition)) {
      return <CheckCircle className="w-5 h-5" />;
    }
    if (['poor', 'unsuitable', 'high'].includes(condition)) {
      return <XCircle className="w-5 h-5" />;
    }
    return <AlertTriangle className="w-5 h-5" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <Tractor className="w-6 h-6 mr-2 text-green-600" />
        Current Farming Conditions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Soil Moisture */}
        <div className={`rounded-lg p-4 ${getConditionColor(conditions.soilMoisture, 'quality')}`}>
          <div className="flex items-center space-x-2 mb-2">
            <Droplets className="w-5 h-5" />
            <span className="font-medium">Soil Moisture</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold capitalize">{conditions.soilMoisture}</span>
            {getConditionIcon(conditions.soilMoisture, false)}
          </div>
        </div>

        {/* Growing Conditions */}
        <div className={`rounded-lg p-4 ${getConditionColor(conditions.growingConditions, 'quality')}`}>
          <div className="flex items-center space-x-2 mb-2">
            <Sprout className="w-5 h-5" />
            <span className="font-medium">Growing Conditions</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold capitalize">{conditions.growingConditions}</span>
            {getConditionIcon(conditions.growingConditions, false)}
          </div>
        </div>

        {/* Pest Risk */}
        <div className={`rounded-lg p-4 ${getConditionColor(conditions.pestRisk, 'risk')}`}>
          <div className="flex items-center space-x-2 mb-2">
            <Bug className="w-5 h-5" />
            <span className="font-medium">Pest Risk</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold capitalize">{conditions.pestRisk}</span>
            {getConditionIcon(conditions.pestRisk, conditions.pestRisk === 'high')}
          </div>
        </div>

        {/* Disease Risk */}
        <div className={`rounded-lg p-4 ${getConditionColor(conditions.diseaseRisk, 'risk')}`}>
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Disease Risk</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold capitalize">{conditions.diseaseRisk}</span>
            {getConditionIcon(conditions.diseaseRisk, conditions.diseaseRisk === 'high')}
          </div>
        </div>

        {/* Irrigation Needed */}
        <div className={`rounded-lg p-4 ${getConditionColor('', 'boolean')}`}>
          <div className="flex items-center space-x-2 mb-2">
            <Droplets className="w-5 h-5" />
            <span className="font-medium">Irrigation Status</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">
              {conditions.irrigationNeeded ? 'Needed' : 'Adequate'}
            </span>
            {getConditionIcon('', conditions.irrigationNeeded)}
          </div>
        </div>

        {/* Field Work Suitability */}
        <div className={`rounded-lg p-4 ${getConditionColor(conditions.fieldWorkSuitability, 'quality')}`}>
          <div className="flex items-center space-x-2 mb-2">
            <Tractor className="w-5 h-5" />
            <span className="font-medium">Field Work</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold capitalize">{conditions.fieldWorkSuitability}</span>
            {getConditionIcon(conditions.fieldWorkSuitability, conditions.fieldWorkSuitability === 'unsuitable')}
          </div>
        </div>
      </div>
    </div>
  );
};