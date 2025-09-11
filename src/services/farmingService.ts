import { WeatherData } from '../types/weather';
import { CropAlert, CropRecommendation, FarmingConditions } from '../types/farmer';

export class FarmingService {
  static analyzeFarmingConditions(weather: WeatherData): FarmingConditions {
    const { current } = weather;
    const temp = current.temp_c;
    const humidity = current.humidity;
    const precipitation = current.precip_mm;
    const windSpeed = current.wind_kph;

    // Determine soil moisture
    let soilMoisture: 'dry' | 'optimal' | 'wet';
    if (precipitation > 5 || humidity > 80) {
      soilMoisture = 'wet';
    } else if (precipitation < 1 && humidity < 40) {
      soilMoisture = 'dry';
    } else {
      soilMoisture = 'optimal';
    }

    // Determine growing conditions
    let growingConditions: 'poor' | 'fair' | 'good' | 'excellent';
    if (temp >= 15 && temp <= 25 && humidity >= 50 && humidity <= 70) {
      growingConditions = 'excellent';
    } else if (temp >= 10 && temp <= 30 && humidity >= 40 && humidity <= 80) {
      growingConditions = 'good';
    } else if (temp >= 5 && temp <= 35) {
      growingConditions = 'fair';
    } else {
      growingConditions = 'poor';
    }

    // Determine pest and disease risk
    const pestRisk = (temp > 20 && humidity > 60) ? 'high' : 
                    (temp > 15 && humidity > 50) ? 'medium' : 'low';
    
    const diseaseRisk = (humidity > 70 && temp > 15) ? 'high' : 
                       (humidity > 60) ? 'medium' : 'low';

    // Determine irrigation needs
    const irrigationNeeded = soilMoisture === 'dry' || (temp > 25 && humidity < 50);

    // Determine field work suitability
    let fieldWorkSuitability: 'unsuitable' | 'poor' | 'fair' | 'good' | 'excellent';
    if (precipitation > 10 || windSpeed > 30) {
      fieldWorkSuitability = 'unsuitable';
    } else if (precipitation > 5 || windSpeed > 20 || soilMoisture === 'wet') {
      fieldWorkSuitability = 'poor';
    } else if (precipitation > 2 || windSpeed > 15) {
      fieldWorkSuitability = 'fair';
    } else if (windSpeed < 10 && soilMoisture === 'optimal') {
      fieldWorkSuitability = 'excellent';
    } else {
      fieldWorkSuitability = 'good';
    }

    return {
      soilMoisture,
      growingConditions,
      pestRisk,
      diseaseRisk,
      irrigationNeeded,
      fieldWorkSuitability
    };
  }

  static generateCropRecommendations(weather: WeatherData, conditions: FarmingConditions): CropRecommendation[] {
    const recommendations: CropRecommendation[] = [];
    const { current, forecast } = weather;
    const temp = current.temp_c;
    const nextDayForecast = forecast.forecastday[1];

    // Irrigation recommendations
    if (conditions.irrigationNeeded) {
      recommendations.push({
        cropType: 'All Crops',
        action: 'Increase Irrigation',
        priority: 'high',
        description: 'Dry conditions detected. Increase watering frequency to prevent crop stress.',
        timing: 'Immediate - Early morning or evening'
      });
    }

    // Pest management
    if (conditions.pestRisk === 'high') {
      recommendations.push({
        cropType: 'Vegetables & Fruits',
        action: 'Monitor for Pests',
        priority: 'medium',
        description: 'High temperature and humidity create favorable conditions for pest activity.',
        timing: 'Daily monitoring recommended'
      });
    }

    // Disease prevention
    if (conditions.diseaseRisk === 'high') {
      recommendations.push({
        cropType: 'All Crops',
        action: 'Disease Prevention',
        priority: 'medium',
        description: 'High humidity increases fungal disease risk. Ensure good air circulation.',
        timing: 'Apply preventive treatments now'
      });
    }

    // Planting recommendations
    if (temp >= 15 && temp <= 25 && conditions.soilMoisture === 'optimal') {
      recommendations.push({
        cropType: 'Spring Crops',
        action: 'Optimal Planting Time',
        priority: 'high',
        description: 'Perfect conditions for planting lettuce, spinach, peas, and other cool-season crops.',
        timing: 'Next 2-3 days'
      });
    }

    // Harvesting recommendations
    if (conditions.fieldWorkSuitability === 'excellent' && current.precip_mm === 0) {
      recommendations.push({
        cropType: 'Ready Crops',
        action: 'Harvest Operations',
        priority: 'high',
        description: 'Excellent field conditions for harvesting. Dry weather ensures good crop quality.',
        timing: 'Today and tomorrow'
      });
    }

    // Frost protection
    if (nextDayForecast && nextDayForecast.day.mintemp_c < 5) {
      recommendations.push({
        cropType: 'Sensitive Plants',
        action: 'Frost Protection',
        priority: 'high',
        description: 'Prepare frost protection measures for temperature-sensitive crops.',
        timing: 'Before sunset today'
      });
    }

    return recommendations;
  }

  static generateCropAlerts(weather: WeatherData, conditions: FarmingConditions): CropAlert[] {
    const alerts: CropAlert[] = [];
    const { current, forecast } = weather;
    const temp = current.temp_c;
    const nextDayForecast = forecast.forecastday[1];

    // Critical frost alert
    if (temp < 2 || (nextDayForecast && nextDayForecast.day.mintemp_c < 2)) {
      alerts.push({
        id: 'frost-critical',
        cropType: 'All Sensitive Crops',
        alertType: 'protection',
        severity: 'critical',
        title: 'Critical Frost Warning',
        description: 'Temperatures below 2°C will damage or kill most crops.',
        recommendation: 'Immediately cover crops with frost cloth, use heaters, or harvest what you can. Move potted plants indoors.',
        timeframe: 'Next 12 hours',
        weatherCondition: 'Freezing temperatures'
      });
    }

    // Severe drought alert
    if (conditions.soilMoisture === 'dry' && temp > 30) {
      alerts.push({
        id: 'drought-severe',
        cropType: 'All Crops',
        alertType: 'irrigation',
        severity: 'high',
        title: 'Severe Drought Stress',
        description: 'Extremely dry conditions with high temperatures are causing severe plant stress.',
        recommendation: 'Implement emergency irrigation. Apply mulch to conserve moisture. Consider shade cloth for sensitive crops.',
        timeframe: 'Immediate action required',
        weatherCondition: 'Hot and dry'
      });
    }

    // Pest outbreak risk
    if (conditions.pestRisk === 'high' && temp > 25) {
      alerts.push({
        id: 'pest-outbreak',
        cropType: 'Vegetables & Fruits',
        alertType: 'pest',
        severity: 'medium',
        title: 'High Pest Activity Risk',
        description: 'Warm, humid conditions are ideal for rapid pest reproduction.',
        recommendation: 'Inspect crops daily. Apply organic pest control measures. Consider beneficial insect releases.',
        timeframe: 'Monitor for next 5-7 days',
        weatherCondition: 'Warm and humid'
      });
    }

    // Disease outbreak alert
    if (conditions.diseaseRisk === 'high' && current.humidity > 75) {
      alerts.push({
        id: 'disease-risk',
        cropType: 'All Crops',
        alertType: 'disease',
        severity: 'medium',
        title: 'Fungal Disease Risk',
        description: 'High humidity creates perfect conditions for fungal diseases.',
        recommendation: 'Improve air circulation around plants. Apply preventive fungicide if needed. Avoid overhead watering.',
        timeframe: 'Next 3-5 days',
        weatherCondition: 'High humidity'
      });
    }

    // Optimal planting alert
    if (conditions.growingConditions === 'excellent' && conditions.fieldWorkSuitability === 'excellent') {
      alerts.push({
        id: 'optimal-planting',
        cropType: 'Seasonal Crops',
        alertType: 'planting',
        severity: 'low',
        title: 'Perfect Planting Conditions',
        description: 'Ideal weather conditions for planting and transplanting.',
        recommendation: 'Plant cool-season crops like lettuce, spinach, peas. Transplant seedlings. Prepare soil for upcoming plantings.',
        timeframe: 'Next 2-3 days',
        weatherCondition: 'Mild and optimal'
      });
    }

    return alerts;
  }
}