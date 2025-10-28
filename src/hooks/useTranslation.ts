import { useState, useCallback, useEffect } from 'react';
import { translationService } from '../services/translationService';

export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  const translate = useCallback(async (text: string): Promise<string> => {
    if (currentLanguage === 'en' || !text.trim()) {
      return text;
    }

    try {
      setIsTranslating(true);
      const translated = await translationService.translateText(text, currentLanguage);
      return translated;
    } catch (error) {
      console.warn('Translation failed:', error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage]);

  const translateMultiple = useCallback(async (texts: string[]): Promise<string[]> => {
    if (currentLanguage === 'en') {
      return texts;
    }

    try {
      setIsTranslating(true);
      const translated = await translationService.translateMultiple(texts, currentLanguage);
      return translated;
    } catch (error) {
      console.warn('Translation failed:', error);
      return texts;
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage]);

  const changeLanguage = useCallback((languageCode: string) => {
    setCurrentLanguage(languageCode);
  }, []);

  return {
    currentLanguage,
    isTranslating,
    translate,
    translateMultiple,
    changeLanguage
  };
};