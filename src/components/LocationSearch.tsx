import React, { useState } from 'react';
import { Search, MapPin, Loader2, Navigation, Clock } from 'lucide-react';
import { GeocodingService, CityResult } from '../services/geocodingService';

interface LocationSearchProps {
  onLocationSelect: (location: string) => void;
  onCurrentLocation: () => void;
  loading: boolean;
  translate: (text: string) => Promise<string>;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({ 
  onLocationSelect, 
  onCurrentLocation, 
  loading,
  translate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<CityResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [translatedTexts, setTranslatedTexts] = useState({
    location: 'Location',
    enterCity: 'Enter city name...',
    search: 'Search',
    currentLocation: 'Current Location',
    suggestions: [] as string[]
  });

  // Debounce timer
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    const translateTexts = async () => {
      const [location, enterCity, search, currentLocation, ...suggestionsTranslated] = await Promise.all([
        translate('Location'),
        translate('Enter city name...'),
        translate('Search'),
        translate('Current Location'),
      ]);

      setTranslatedTexts({
        location,
        enterCity,
        search,
        currentLocation,
      });
    };

    translateTexts();
  }, [translate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onLocationSelect(searchTerm.trim());
      setSearchTerm('');
      setShowSuggestions(false);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (value.length >= 2) {
      setIsSearching(true);
      setShowSuggestions(true);
      
      // Debounce the search to avoid too many API calls
      const timer = setTimeout(async () => {
        try {
          const results = await GeocodingService.searchCities(value);
          setSuggestions(results);
          setIsSearching(false);
        } catch (error) {
          console.error('Error searching cities:', error);
          setSuggestions([]);
          setIsSearching(false);
        }
      }, 300); // 300ms delay
      
      setDebounceTimer(timer);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (suggestion: CityResult) => {
    const cityName = suggestion.name.split(',')[0].trim();
    setSearchTerm(cityName);
    setShowSuggestions(false);
    onLocationSelect(cityName);
  };

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{translatedTexts.location}</h2>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder={translatedTexts.enterCity}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchTerm.trim()}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              <span className="hidden sm:inline">{translatedTexts.search}</span>
            </button>
          </form>
          
          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              {isSearching && (
                <div className="px-4 py-3 text-center text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Searching cities...</span>
                  </div>
                </div>
              )}
              
              {!isSearching && suggestions.length === 0 && searchTerm.length >= 2 && (
                <div className="px-4 py-3 text-center text-gray-500">
                  <span className="text-sm">No cities found matching "{searchTerm}"</span>
                </div>
              )}
              
              {!isSearching && suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.name}-${suggestion.region}-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0 focus:bg-blue-50 focus:outline-none"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900">{suggestion.name}</div>
                        <div className="text-sm text-gray-500">{suggestion.region}, {suggestion.country}</div>
                      </div>
                    </div>
                    <Clock className="w-3 h-3 text-gray-300" />
                  </div>
                </button>
              ))}
              
              {!isSearching && suggestions.length > 0 && (
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>Powered by WeatherAPI</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <button
          onClick={onCurrentLocation}
          disabled={loading}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Navigation className="w-5 h-5" />
          )}
          <span className="hidden sm:inline">{translatedTexts.currentLocation}</span>
          <span className="sm:hidden">GPS</span>
        </button>
      </div>
    </div>
  );
};