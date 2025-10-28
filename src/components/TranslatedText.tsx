import React, { useState, useEffect } from 'react';

interface TranslatedTextProps {
  text: string;
  translate: (text: string) => Promise<string>;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
}

export const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  text, 
  translate, 
  className = '', 
  tag: Tag = 'span' 
}) => {
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    const translateText = async () => {
      try {
        const translated = await translate(text);
        setTranslatedText(translated);
      } catch (error) {
        console.warn('Translation failed for:', text);
        setTranslatedText(text);
      }
    };

    translateText();
  }, [text, translate]);

  return <Tag className={className}>{translatedText}</Tag>;
};