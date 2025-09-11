export interface CropAlert {
  id: string;
  cropType: string;
  alertType: 'irrigation' | 'pest' | 'disease' | 'harvest' | 'planting' | 'protection';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  recommendation: string;
  timeframe: string;
  weatherCondition: string;
}

export interface CropRecommendation {
  cropType: string;
  action: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
  timing: string;
}

export interface FarmingConditions {
  soilMoisture: 'dry' | 'optimal' | 'wet';
  growingConditions: 'poor' | 'fair' | 'good' | 'excellent';
  pestRisk: 'low' | 'medium' | 'high';
  diseaseRisk: 'low' | 'medium' | 'high';
  irrigationNeeded: boolean;
  fieldWorkSuitability: 'unsuitable' | 'poor' | 'fair' | 'good' | 'excellent';
}