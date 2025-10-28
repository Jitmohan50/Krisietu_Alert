import React from 'react';
import { 
  Lightbulb, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight,
  MessageCircle,
  Send,
  Bot,
  User
} from 'lucide-react';
import { CropRecommendation } from '../types/farmer';
import { WeatherData } from '../types/weather';
import { FarmingConditions } from '../types/farmer';
import { TranslatedText } from './TranslatedText';

interface CropRecommendationsProps {
  recommendations: CropRecommendation[];
  weather: WeatherData;
  farmingConditions: FarmingConditions;
  translate: (text: string) => Promise<string>;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: Date;
}

export const CropRecommendations: React.FC<CropRecommendationsProps> = ({ 
  recommendations, 
  weather, 
  farmingConditions, 
  translate 
}) => {
  const [showChat, setShowChat] = React.useState(false);
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

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

  const generateAIResponse = async (userQuestion: string): Promise<string> => {
    // Simulate AI processing delay
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const { current, location } = weather;
          const temp = current.temp_c;
          const humidity = current.humidity;
          const precipitation = current.precip_mm;
          const windSpeed = current.wind_kph;
          
          const question = userQuestion.toLowerCase();
          
          // Weather-based responses
          if (question.includes('plant') || question.includes('sow') || question.includes('seed')) {
            if (temp >= 15 && temp <= 25 && farmingConditions.soilMoisture === 'optimal') {
              resolve(`Perfect planting conditions in ${location.name}! With temperatures at ${temp}°C and optimal soil moisture, this is an excellent time to plant cool-season crops like lettuce, spinach, peas, and radishes. The ${humidity}% humidity provides good growing conditions.`);
            } else if (temp > 30) {
              resolve(`Current temperature of ${temp}°C in ${location.name} is quite high for most plantings. Consider waiting for cooler weather or focus on heat-tolerant crops like okra, eggplant, or peppers. Ensure adequate irrigation if planting now.`);
            } else if (farmingConditions.soilMoisture === 'dry') {
              resolve(`Soil conditions in ${location.name} are currently dry. Before planting, ensure proper irrigation. With ${temp}°C temperature, consider drought-resistant varieties and apply mulch to retain moisture.`);
            } else {
              resolve(`For planting in ${location.name} with current conditions (${temp}°C, ${humidity}% humidity), I recommend checking soil moisture and choosing appropriate seasonal varieties.`);
            }
            return;
          }
          
          if (question.includes('water') || question.includes('irrigat')) {
            if (farmingConditions.irrigationNeeded) {
              resolve(`Yes, irrigation is needed in ${location.name}. With ${temp}°C temperature and ${humidity}% humidity, your crops need additional water. Water early morning or evening to reduce evaporation. Current precipitation is ${precipitation}mm.`);
            } else {
              resolve(`Current conditions in ${location.name} show adequate moisture levels. With ${humidity}% humidity and recent precipitation of ${precipitation}mm, you can reduce irrigation frequency but monitor soil moisture regularly.`);
            }
            return;
          }
          
          if (question.includes('harvest') || question.includes('crop ready')) {
            if (farmingConditions.fieldWorkSuitability === 'excellent' && precipitation === 0) {
              resolve(`Excellent harvesting conditions in ${location.name}! Dry weather with ${windSpeed} km/h winds and no precipitation makes this perfect for harvesting. Plan your harvest operations for the next few days.`);
            } else if (precipitation > 5) {
              resolve(`Current precipitation of ${precipitation}mm in ${location.name} makes harvesting challenging. Wait for drier conditions to ensure crop quality and avoid soil compaction.`);
            } else {
              resolve(`Field work suitability in ${location.name} is ${farmingConditions.fieldWorkSuitability}. Consider weather conditions before harvesting operations.`);
            }
            return;
          }
          
          if (question.includes('pest') || question.includes('insect') || question.includes('bug')) {
            if (farmingConditions.pestRisk === 'high') {
              resolve(`High pest risk in ${location.name} due to ${temp}°C temperature and ${humidity}% humidity. Monitor crops daily for aphids, thrips, and other pests. Consider organic neem oil treatments or beneficial insects like ladybugs.`);
            } else {
              resolve(`Current pest risk in ${location.name} is ${farmingConditions.pestRisk}. With ${temp}°C and ${humidity}% humidity, maintain regular monitoring but pest pressure should be manageable.`);
            }
            return;
          }
          
          if (question.includes('disease') || question.includes('fungus') || question.includes('blight')) {
            if (farmingConditions.diseaseRisk === 'high') {
              resolve(`High disease risk in ${location.name} with ${humidity}% humidity and ${temp}°C temperature. Watch for fungal diseases like powdery mildew and blight. Improve air circulation and consider preventive copper-based fungicides.`);
            } else {
              resolve(`Disease risk in ${location.name} is currently ${farmingConditions.diseaseRisk}. Maintain good plant spacing for air circulation and avoid overhead watering during humid conditions.`);
            }
            return;
          }
          
          if (question.includes('fertiliz') || question.includes('nutrient') || question.includes('feed')) {
            if (farmingConditions.growingConditions === 'excellent') {
              resolve(`Excellent growing conditions in ${location.name}! This is perfect timing for fertilizer application. With ${temp}°C temperature and ${humidity}% humidity, plants will efficiently absorb nutrients. Apply balanced NPK fertilizer early morning.`);
            } else {
              resolve(`With current growing conditions being ${farmingConditions.growingConditions} in ${location.name}, adjust fertilizer application accordingly. Focus on organic compost and ensure proper soil moisture before fertilizing.`);
            }
            return;
          }
          
          if (question.includes('weather') || question.includes('forecast')) {
            resolve(`Current weather in ${location.name}: ${temp}°C temperature, ${humidity}% humidity, ${precipitation}mm precipitation, and ${windSpeed} km/h wind. Growing conditions are ${farmingConditions.growingConditions} with ${farmingConditions.soilMoisture} soil moisture.`);
            return;
          }
          
          // Default response
          resolve(`Based on current conditions in ${location.name} (${temp}°C, ${humidity}% humidity), I'd be happy to help with your farming question. Could you be more specific about what aspect of crop management you'd like advice on? I can help with planting, irrigation, pest control, harvesting, or general crop care.`);
        } catch (error) {
          resolve('Sorry, I encountered an error processing your question. Please try again.');
        }
      }, 1000 + Math.random() * 2000);
    });
  };
    

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage.trim(),
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      const aiResponse = await generateAIResponse(userMessage.message);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: aiResponse,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: 'Sorry, I encountered an error processing your question. Please try again.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center mb-6">
        <Lightbulb className="w-6 h-6 mr-2 text-blue-600" />
        <TranslatedText text="Crop Recommendations" translate={translate} tag="h2" className="text-xl font-semibold text-gray-800" />
      </div>
      
      {/* AI Chat Toggle Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowChat(!showChat)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          title={showChat ? "Hide AI Assistant" : "Ask AI Assistant"}
          aria-label={showChat ? "Hide AI Assistant" : "Ask AI Assistant"}
        >
          <MessageCircle className="w-5 h-5" />
          <TranslatedText text={showChat ? "Hide AI Assistant" : "Ask AI Assistant"} translate={translate} />
        </button>
      </div>

      {/* AI Chat Interface */}
      {showChat && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6 border">
          <div className="flex items-center space-x-2 mb-4">
            <Bot className="w-6 h-6 text-blue-600" />
            <TranslatedText text="AI Crop Assistant" translate={translate} tag="h3" className="text-lg font-semibold text-gray-800" />
          </div>
          
          {/* Chat Messages */}
          <div className="bg-white rounded-lg p-4 mb-4 max-h-80 overflow-y-auto space-y-4">
            {chatMessages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Bot className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <TranslatedText text="Ask me anything about crop management based on your current weather conditions!" translate={translate} tag="p" />
                <div className="mt-3 text-sm space-y-1">
                  <TranslatedText text="Try asking:" translate={translate} tag="p" className="font-medium" />
                  <TranslatedText text="• What should I plant now?" translate={translate} tag="p" />
                  <TranslatedText text="• Do my crops need water?" translate={translate} tag="p" />
                  <TranslatedText text="• Is it good time to harvest?" translate={translate} tag="p" />
                  <TranslatedText text="• How to prevent pests?" translate={translate} tag="p" />
                </div>
              </div>
            )}
            
            {chatMessages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' ? 'bg-blue-600' : 'bg-green-600'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.message}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Chat Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about crops, planting, irrigation, pests..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={isLoading}
            />
            <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  title="Send message"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {recommendations.map((rec, index) => (
          <div key={index} className={`rounded-lg border p-4 ${getPriorityColor(rec.priority)}`}>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getPriorityIcon(rec.priority)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <TranslatedText text={rec.action} translate={translate} tag="h3" className="font-semibold text-lg" />
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(rec.priority)}`}>
                    <TranslatedText text={rec.priority.toUpperCase()} translate={translate} />
                  </span>
                </div>
                
                <div className="mb-3">
                  <span className="inline-flex items-center text-sm font-medium mb-2">
                    <ArrowRight className="w-4 h-4 mr-1" />
                    <TranslatedText text={rec.cropType} translate={translate} />
                  </span>
                  <TranslatedText text={rec.description} translate={translate} tag="p" className="text-sm leading-relaxed" />
                </div>
                
                <div className="flex items-center space-x-1 text-sm">
                  <Clock className="w-4 h-4" />
                  <span><TranslatedText text="Timing" translate={translate} tag="strong" />: <TranslatedText text={rec.timing} translate={translate} /></span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};