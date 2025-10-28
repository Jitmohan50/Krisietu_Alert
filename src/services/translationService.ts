import { TranslationCache } from '../types/language';

class TranslationService {
  private cache: TranslationCache = {};
  private readonly API_URL = 'https://api.mymemory.translated.net/get';

  async translateText(text: string, targetLanguage: string): Promise<string> {
    // Return original text if target is English
    if (targetLanguage === 'en' || !text.trim()) {
      return text;
    }

    // Check cache first
    const cacheKey = `${text}_${targetLanguage}`;
    if (this.cache[text] && this.cache[text][targetLanguage]) {
      return this.cache[text][targetLanguage];
    }

    try {
      const response = await fetch(
        `${this.API_URL}?q=${encodeURIComponent(text)}&langpair=en|${targetLanguage}`
      );
      
      if (!response.ok) {
        throw new Error('Translation API request failed');
      }

      const data = await response.json();
      
      if (data.responseStatus === 200 && data.responseData) {
        const translatedText = data.responseData.translatedText;
        
        // Cache the translation
        if (!this.cache[text]) {
          this.cache[text] = {};
        }
        this.cache[text][targetLanguage] = translatedText;
        
        return translatedText;
      } else {
        throw new Error('Translation failed');
      }
    } catch (error) {
      console.warn('Translation failed, using original text:', error);
      return text; // Fallback to original text
    }
  }

  async translateMultiple(texts: string[], targetLanguage: string): Promise<string[]> {
    if (targetLanguage === 'en') {
      return texts;
    }

    const translations = await Promise.all(
      texts.map(text => this.translateText(text, targetLanguage))
    );
    
    return translations;
  }

  clearCache() {
    this.cache = {};
  }
}

export const translationService = new TranslationService();