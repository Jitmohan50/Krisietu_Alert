export interface CityResult {
  name: string;
  country: string;
  region: string;
  lat: number;
  lon: number;
  displayName: string;
}

export class GeocodingService {
  private static readonly BASE_URL = 'https://api.weatherapi.com/v1';
  private static readonly API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  static async searchCities(query: string): Promise<CityResult[]> {
    if (!query || query.length < 2) {
      return [];
    }

    try {
      // If no API key, return mock suggestions
      if (!this.API_KEY || this.API_KEY === 'demo_key' || this.API_KEY.trim() === '') {
        return this.getMockCitySuggestions(query);
      }

      const response = await fetch(
        `${this.BASE_URL}/search.json?key=${this.API_KEY}&q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch city suggestions');
      }

      const data = await response.json();
      
      return data.map((city: any) => ({
        name: city.name,
        country: city.country,
        region: city.region,
        lat: city.lat,
        lon: city.lon,
        displayName: `${city.name}, ${city.region}, ${city.country}`
      })).slice(0, 8); // Limit to 8 suggestions

    } catch (error) {
      console.warn('City search failed, using mock data:', error);
      return this.getMockCitySuggestions(query);
    }
  }

  private static getMockCitySuggestions(query: string): CityResult[] {
    const mockCities = [
      { name: 'New Delhi', region: 'Delhi', country: 'India', lat: 28.6139, lon: 77.2090 },
      { name: 'Mumbai', region: 'Maharashtra', country: 'India', lat: 19.0760, lon: 72.8777 },
      { name: 'Bangalore', region: 'Karnataka', country: 'India', lat: 12.9716, lon: 77.5946 },
      { name: 'Chennai', region: 'Tamil Nadu', country: 'India', lat: 13.0827, lon: 80.2707 },
      { name: 'Kolkata', region: 'West Bengal', country: 'India', lat: 22.5726, lon: 88.3639 },
      { name: 'Hyderabad', region: 'Telangana', country: 'India', lat: 17.3850, lon: 78.4867 },
      { name: 'Pune', region: 'Maharashtra', country: 'India', lat: 18.5204, lon: 73.8567 },
      { name: 'Ahmedabad', region: 'Gujarat', country: 'India', lat: 23.0225, lon: 72.5714 },
      { name: 'Jaipur', region: 'Rajasthan', country: 'India', lat: 26.9124, lon: 75.7873 },
      { name: 'Surat', region: 'Gujarat', country: 'India', lat: 21.1702, lon: 72.8311 },
      { name: 'Lucknow', region: 'Uttar Pradesh', country: 'India', lat: 26.8467, lon: 80.9462 },
      { name: 'Kanpur', region: 'Uttar Pradesh', country: 'India', lat: 26.4499, lon: 80.3319 },
      { name: 'Nagpur', region: 'Maharashtra', country: 'India', lat: 21.1458, lon: 79.0882 },
      { name: 'Indore', region: 'Madhya Pradesh', country: 'India', lat: 22.7196, lon: 75.8577 },
      { name: 'Thane', region: 'Maharashtra', country: 'India', lat: 19.2183, lon: 72.9781 },
      { name: 'Bhopal', region: 'Madhya Pradesh', country: 'India', lat: 23.2599, lon: 77.4126 },
      { name: 'Visakhapatnam', region: 'Andhra Pradesh', country: 'India', lat: 17.6868, lon: 83.2185 },
      { name: 'Pimpri-Chinchwad', region: 'Maharashtra', country: 'India', lat: 18.6298, lon: 73.7997 },
      { name: 'Patna', region: 'Bihar', country: 'India', lat: 25.5941, lon: 85.1376 },
      { name: 'Vadodara', region: 'Gujarat', country: 'India', lat: 22.3072, lon: 73.1812 },
      { name: 'Ghaziabad', region: 'Uttar Pradesh', country: 'India', lat: 28.6692, lon: 77.4538 },
      { name: 'Ludhiana', region: 'Punjab', country: 'India', lat: 30.9010, lon: 75.8573 },
      { name: 'Agra', region: 'Uttar Pradesh', country: 'India', lat: 27.1767, lon: 78.0081 },
      { name: 'Nashik', region: 'Maharashtra', country: 'India', lat: 19.9975, lon: 73.7898 },
      { name: 'Faridabad', region: 'Haryana', country: 'India', lat: 28.4089, lon: 77.3178 },
      { name: 'Meerut', region: 'Uttar Pradesh', country: 'India', lat: 28.9845, lon: 77.7064 },
      { name: 'Rajkot', region: 'Gujarat', country: 'India', lat: 22.3039, lon: 70.8022 },
      { name: 'Kalyan-Dombivli', region: 'Maharashtra', country: 'India', lat: 19.2403, lon: 73.1305 },
      { name: 'Vasai-Virar', region: 'Maharashtra', country: 'India', lat: 19.4912, lon: 72.8054 },
      { name: 'Varanasi', region: 'Uttar Pradesh', country: 'India', lat: 25.3176, lon: 82.9739 },
      { name: 'Srinagar', region: 'Jammu and Kashmir', country: 'India', lat: 34.0837, lon: 74.7973 },
      { name: 'Aurangabad', region: 'Maharashtra', country: 'India', lat: 19.8762, lon: 75.3433 },
      { name: 'Dhanbad', region: 'Jharkhand', country: 'India', lat: 23.7957, lon: 86.4304 },
      { name: 'Amritsar', region: 'Punjab', country: 'India', lat: 31.6340, lon: 74.8723 },
      { name: 'Navi Mumbai', region: 'Maharashtra', country: 'India', lat: 19.0330, lon: 73.0297 },
      { name: 'Allahabad', region: 'Uttar Pradesh', country: 'India', lat: 25.4358, lon: 81.8463 },
      { name: 'Ranchi', region: 'Jharkhand', country: 'India', lat: 23.3441, lon: 85.3096 },
      { name: 'Howrah', region: 'West Bengal', country: 'India', lat: 22.5958, lon: 88.2636 },
      { name: 'Coimbatore', region: 'Tamil Nadu', country: 'India', lat: 11.0168, lon: 76.9558 },
      { name: 'Jabalpur', region: 'Madhya Pradesh', country: 'India', lat: 23.1815, lon: 79.9864 },
      { name: 'Gwalior', region: 'Madhya Pradesh', country: 'India', lat: 26.2183, lon: 78.1828 },
      { name: 'Vijayawada', region: 'Andhra Pradesh', country: 'India', lat: 16.5062, lon: 80.6480 },
      { name: 'Jodhpur', region: 'Rajasthan', country: 'India', lat: 26.2389, lon: 73.0243 },
      { name: 'Madurai', region: 'Tamil Nadu', country: 'India', lat: 9.9252, lon: 78.1198 },
      { name: 'Raipur', region: 'Chhattisgarh', country: 'India', lat: 21.2514, lon: 81.6296 },
      { name: 'Kota', region: 'Rajasthan', country: 'India', lat: 25.2138, lon: 75.8648 },
      { name: 'Chandigarh', region: 'Chandigarh', country: 'India', lat: 30.7333, lon: 76.7794 },
      { name: 'Guwahati', region: 'Assam', country: 'India', lat: 26.1445, lon: 91.7362 },
      { name: 'Solapur', region: 'Maharashtra', country: 'India', lat: 17.6599, lon: 75.9064 },
      { name: 'Hubli-Dharwad', region: 'Karnataka', country: 'India', lat: 15.3647, lon: 75.1240 },
      { name: 'Bareilly', region: 'Uttar Pradesh', country: 'India', lat: 28.3670, lon: 79.4304 },
      { name: 'Moradabad', region: 'Uttar Pradesh', country: 'India', lat: 28.8386, lon: 78.7733 },
      { name: 'Mysore', region: 'Karnataka', country: 'India', lat: 12.2958, lon: 76.6394 },
      { name: 'Gurgaon', region: 'Haryana', country: 'India', lat: 28.4595, lon: 77.0266 },
      { name: 'Aligarh', region: 'Uttar Pradesh', country: 'India', lat: 27.8974, lon: 78.0880 },
      { name: 'Jalandhar', region: 'Punjab', country: 'India', lat: 31.3260, lon: 75.5762 },
      { name: 'Tiruchirappalli', region: 'Tamil Nadu', country: 'India', lat: 10.7905, lon: 78.7047 },
      { name: 'Bhubaneswar', region: 'Odisha', country: 'India', lat: 20.2961, lon: 85.8245 },
      { name: 'Salem', region: 'Tamil Nadu', country: 'India', lat: 11.6643, lon: 78.1460 },
      { name: 'Mira-Bhayandar', region: 'Maharashtra', country: 'India', lat: 19.2952, lon: 72.8544 },
      { name: 'Warangal', region: 'Telangana', country: 'India', lat: 17.9689, lon: 79.5941 },
      { name: 'Thiruvananthapuram', region: 'Kerala', country: 'India', lat: 8.5241, lon: 76.9366 },
      { name: 'Guntur', region: 'Andhra Pradesh', country: 'India', lat: 16.3067, lon: 80.4365 },
      { name: 'Bhiwandi', region: 'Maharashtra', country: 'India', lat: 19.3002, lon: 73.0635 },
      { name: 'Saharanpur', region: 'Uttar Pradesh', country: 'India', lat: 29.9680, lon: 77.5552 },
      { name: 'Gorakhpur', region: 'Uttar Pradesh', country: 'India', lat: 26.7606, lon: 83.3732 },
      { name: 'Bikaner', region: 'Rajasthan', country: 'India', lat: 28.0229, lon: 73.3119 },
      { name: 'Amravati', region: 'Maharashtra', country: 'India', lat: 20.9374, lon: 77.7796 },
      { name: 'Noida', region: 'Uttar Pradesh', country: 'India', lat: 28.5355, lon: 77.3910 },
      { name: 'Jamshedpur', region: 'Jharkhand', country: 'India', lat: 22.8046, lon: 86.2029 },
      { name: 'Bhilai Nagar', region: 'Chhattisgarh', country: 'India', lat: 21.1938, lon: 81.3509 },
      { name: 'Cuttack', region: 'Odisha', country: 'India', lat: 20.4625, lon: 85.8828 },
      { name: 'Firozabad', region: 'Uttar Pradesh', country: 'India', lat: 27.1592, lon: 78.3957 },
      { name: 'Kochi', region: 'Kerala', country: 'India', lat: 9.9312, lon: 76.2673 },
      { name: 'Nellore', region: 'Andhra Pradesh', country: 'India', lat: 14.4426, lon: 79.9865 },
      { name: 'Bhavnagar', region: 'Gujarat', country: 'India', lat: 21.7645, lon: 72.1519 },
      { name: 'Dehradun', region: 'Uttarakhand', country: 'India', lat: 30.3165, lon: 78.0322 },
      { name: 'Durgapur', region: 'West Bengal', country: 'India', lat: 23.4841, lon: 87.3119 },
      { name: 'Asansol', region: 'West Bengal', country: 'India', lat: 23.6739, lon: 86.9524 },
      { name: 'Rourkela', region: 'Odisha', country: 'India', lat: 22.2604, lon: 84.8536 },
      { name: 'Nanded', region: 'Maharashtra', country: 'India', lat: 19.1383, lon: 77.3210 },
      { name: 'Kolhapur', region: 'Maharashtra', country: 'India', lat: 16.7050, lon: 74.2433 },
      { name: 'Ajmer', region: 'Rajasthan', country: 'India', lat: 26.4499, lon: 74.6399 },
      { name: 'Akola', region: 'Maharashtra', country: 'India', lat: 20.7002, lon: 77.0082 },
      { name: 'Gulbarga', region: 'Karnataka', country: 'India', lat: 17.3297, lon: 76.8343 },
      { name: 'Jamnagar', region: 'Gujarat', country: 'India', lat: 22.4707, lon: 70.0577 },
      { name: 'Ujjain', region: 'Madhya Pradesh', country: 'India', lat: 23.1765, lon: 75.7885 },
      { name: 'Loni', region: 'Uttar Pradesh', country: 'India', lat: 28.7333, lon: 77.2833 },
      { name: 'Siliguri', region: 'West Bengal', country: 'India', lat: 26.7271, lon: 88.3953 },
      { name: 'Jhansi', region: 'Uttar Pradesh', country: 'India', lat: 25.4484, lon: 78.5685 },
      { name: 'Ulhasnagar', region: 'Maharashtra', country: 'India', lat: 19.2215, lon: 73.1645 },
      { name: 'Jammu', region: 'Jammu and Kashmir', country: 'India', lat: 32.7266, lon: 74.8570 },
      { name: 'Sangli-Miraj & Kupwad', region: 'Maharashtra', country: 'India', lat: 16.8524, lon: 74.5815 },
      { name: 'Mangalore', region: 'Karnataka', country: 'India', lat: 12.9141, lon: 74.8560 },
      { name: 'Erode', region: 'Tamil Nadu', country: 'India', lat: 11.3410, lon: 77.7172 },
      { name: 'Belgaum', region: 'Karnataka', country: 'India', lat: 15.8497, lon: 74.4977 },
      { name: 'Ambattur', region: 'Tamil Nadu', country: 'India', lat: 13.1143, lon: 80.1548 },
      { name: 'Tirunelveli', region: 'Tamil Nadu', country: 'India', lat: 8.7139, lon: 77.7567 },
      { name: 'Malegaon', region: 'Maharashtra', country: 'India', lat: 20.5579, lon: 74.5287 },
      { name: 'Gaya', region: 'Bihar', country: 'India', lat: 24.7914, lon: 85.0002 },
      { name: 'Jalgaon', region: 'Maharashtra', country: 'India', lat: 21.0077, lon: 75.5626 },
      { name: 'Udaipur', region: 'Rajasthan', country: 'India', lat: 24.5854, lon: 73.7125 },
      { name: 'Maheshtala', region: 'West Bengal', country: 'India', lat: 22.5093, lon: 88.2482 }
    ];

    const filtered = mockCities.filter(city => 
      city.name.toLowerCase().includes(query.toLowerCase()) ||
      city.region.toLowerCase().includes(query.toLowerCase())
    );

    return filtered.map(city => ({
      ...city,
      displayName: `${city.name}, ${city.region}, ${city.country}`
    })).slice(0, 8);
  }
}