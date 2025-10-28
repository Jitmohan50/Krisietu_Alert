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
    const tomorrow = forecast.forecastday[1];
    const dayAfter = forecast.forecastday[2];

    // Critical frost alert
    if (temp < 2 || (tomorrow && tomorrow.day.mintemp_c < 2) || (dayAfter && dayAfter.day.mintemp_c < 2)) {
      alerts.push({
        id: 'frost-critical',
        cropType: 'All Sensitive Crops',
        alertType: 'protection',
        severity: 'critical',
        title: 'Critical Frost Warning',
        description: 'Temperatures below 2°C expected in the next 2 days will damage or kill most crops.',
        recommendation: 'Immediately cover crops with frost cloth, use heaters, or harvest what you can. Move potted plants indoors.',
        timeframe: 'Next 48 hours',
        weatherCondition: 'Freezing temperatures'
      });
    }

    // Extended frost warning (2-5°C)
    if ((tomorrow && tomorrow.day.mintemp_c >= 2 && tomorrow.day.mintemp_c <= 5) || 
        (dayAfter && dayAfter.day.mintemp_c >= 2 && dayAfter.day.mintemp_c <= 5)) {
      alerts.push({
        id: 'frost-warning',
        cropType: 'Tender Crops',
        alertType: 'protection',
        severity: 'high',
        title: 'Frost Warning - Protect Tender Plants',
        description: 'Temperatures between 2-5°C expected. Tender plants and seedlings are at risk.',
        recommendation: 'Cover sensitive plants, bring potted plants indoors, and avoid watering late in the day.',
        timeframe: 'Next 48 hours',
        weatherCondition: 'Near-freezing temperatures'
      });
    }

    // Heavy rain alert
    const tomorrowRain = tomorrow ? tomorrow.day.totalprecip_mm : 0;
    const dayAfterRain = dayAfter ? dayAfter.day.totalprecip_mm : 0;
    const totalRain = tomorrowRain + dayAfterRain;
    
    if (totalRain > 50) {
      alerts.push({
        id: 'heavy-rain',
        cropType: 'All Crops',
        alertType: 'protection',
        severity: 'high',
        title: 'Heavy Rainfall Expected',
        description: `${Math.round(totalRain)}mm of rain expected over next 2 days. Risk of waterlogging and crop damage.`,
        recommendation: 'Ensure proper drainage, avoid field operations, harvest ready crops before rain starts.',
        timeframe: 'Next 48 hours',
        weatherCondition: 'Heavy precipitation'
      });
    } else if (totalRain > 25) {
      alerts.push({
        id: 'moderate-rain',
        cropType: 'Field Crops',
        alertType: 'irrigation',
        severity: 'medium',
        title: 'Moderate Rainfall Expected',
        description: `${Math.round(totalRain)}mm of rain expected. Good for crops but may delay field work.`,
        recommendation: 'Postpone irrigation, delay harvesting operations, ensure equipment is protected.',
        timeframe: 'Next 48 hours',
        weatherCondition: 'Moderate precipitation'
      });
    }

    // Heat wave alert
    const tomorrowMaxTemp = tomorrow ? tomorrow.day.maxtemp_c : 0;
    const dayAfterMaxTemp = dayAfter ? dayAfter.day.maxtemp_c : 0;
    
    if (tomorrowMaxTemp > 35 || dayAfterMaxTemp > 35) {
      alerts.push({
        id: 'heat-wave',
        cropType: 'All Crops',
        alertType: 'irrigation',
        severity: 'high',
        title: 'Heat Wave Warning',
        description: 'Extreme temperatures above 35°C expected. High risk of heat stress and crop damage.',
        recommendation: 'Increase irrigation frequency, provide shade for sensitive crops, harvest early morning.',
        timeframe: 'Next 48 hours',
        weatherCondition: 'Extreme heat'
      });
    } else if (tomorrowMaxTemp > 30 || dayAfterMaxTemp > 30) {
      alerts.push({
        id: 'high-temperature',
        cropType: 'Sensitive Crops',
        alertType: 'irrigation',
        severity: 'medium',
        title: 'High Temperature Alert',
        description: 'Temperatures above 30°C expected. Monitor crops for heat stress.',
        recommendation: 'Increase watering, mulch around plants, avoid midday field work.',
        timeframe: 'Next 48 hours',
        weatherCondition: 'High temperatures'
      });
    }

    // Strong wind alert
    const tomorrowWind = tomorrow ? tomorrow.day.maxwind_kph : 0;
    const dayAfterWind = dayAfter ? dayAfter.day.maxwind_kph : 0;
    const maxWind = Math.max(tomorrowWind, dayAfterWind);
    
    if (maxWind > 40) {
      alerts.push({
        id: 'strong-winds',
        cropType: 'Tall Crops & Trees',
        alertType: 'protection',
        severity: 'high',
        title: 'Strong Wind Warning',
        description: `Wind speeds up to ${Math.round(maxWind)} km/h expected. Risk of crop lodging and tree damage.`,
        recommendation: 'Stake tall plants, secure greenhouse structures, avoid spraying operations.',
        timeframe: 'Next 48 hours',
        weatherCondition: 'Strong winds'
      });
    }

    // Drought conditions developing
    if (totalRain < 2 && (tomorrowMaxTemp > 28 || dayAfterMaxTemp > 28)) {
      const tomorrowHumidity = tomorrow ? tomorrow.day.avghumidity : 50;
      const dayAfterHumidity = dayAfter ? dayAfter.day.avghumidity : 50;
      const avgHumidity = (tomorrowHumidity + dayAfterHumidity) / 2;
      
      if (avgHumidity < 40) {
        alerts.push({
          id: 'drought-developing',
          cropType: 'All Crops',
          alertType: 'irrigation',
          severity: 'medium',
          title: 'Dry Conditions Developing',
          description: 'No significant rain expected with low humidity. Soil moisture will decrease rapidly.',
          recommendation: 'Plan increased irrigation, apply mulch to retain moisture, monitor soil conditions.',
          timeframe: 'Next 48 hours',
          weatherCondition: 'Hot and dry'
        });
      }
    }

    // Optimal planting window
    if (tomorrow && dayAfter) {
      const avgTemp = (tomorrow.day.avgtemp_c + dayAfter.day.avgtemp_c) / 2;
      const avgHumidity = (tomorrow.day.avghumidity + dayAfter.day.avghumidity) / 2;
      const maxWind = Math.max(tomorrow.day.maxwind_kph, dayAfter.day.maxwind_kph);
      
      if (avgTemp >= 15 && avgTemp <= 25 && avgHumidity >= 50 && avgHumidity <= 70 && 
          maxWind < 20 && totalRain > 5 && totalRain < 20) {
        alerts.push({
          id: 'optimal-planting-window',
          cropType: 'Spring Crops',
          alertType: 'planting',
          severity: 'low',
          title: 'Excellent Planting Conditions Ahead',
          description: 'Perfect weather conditions for planting over the next 2 days.',
          recommendation: 'Ideal time for sowing seeds, transplanting seedlings, and general planting activities.',
          timeframe: 'Next 48 hours',
          weatherCondition: 'Optimal growing conditions'
        });
      }
    }

    // Harvest timing alert
    if (tomorrow && dayAfter && totalRain < 1) {
      const avgWind = ((tomorrow.day.maxwind_kph + dayAfter.day.maxwind_kph) / 2);
      if (avgWind < 15) {
        alerts.push({
          id: 'harvest-opportunity',
          cropType: 'Ready Crops',
          alertType: 'harvest',
          severity: 'low',
          title: 'Ideal Harvest Window',
          description: 'Dry conditions with light winds perfect for harvesting operations.',
          recommendation: 'Schedule harvesting for ready crops. Excellent conditions for grain drying.',
          timeframe: 'Next 48 hours',
          weatherCondition: 'Dry with light winds'
        });
      }
    }

    // Disease risk from humidity patterns
    if (tomorrow && dayAfter) {
      const avgHumidity = (tomorrow.day.avghumidity + dayAfter.day.avghumidity) / 2;
      const avgTemp = (tomorrow.day.avgtemp_c + dayAfter.day.avgtemp_c) / 2;
      
      if (avgHumidity > 80 && avgTemp > 20 && totalRain > 10) {
        alerts.push({
          id: 'disease-risk-forecast',
          cropType: 'All Crops',
          alertType: 'disease',
          severity: 'medium',
          title: 'High Disease Risk Developing',
          description: 'Combination of high humidity, warm temperatures, and moisture creates ideal disease conditions.',
          recommendation: 'Apply preventive fungicides, improve air circulation, monitor for early disease symptoms.',
          timeframe: 'Next 48-72 hours',
          weatherCondition: 'Warm, humid, and wet'
        });
      }
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