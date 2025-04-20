import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider, useLanguage, useTranslation } from '@/context/LanguageContext';

// Mock translations
jest.mock('@/translations/en.json', () => ({
  default: {
    common: {
      save: 'Save',
      cancel: 'Cancel'
    },
    greeting: 'Hello'
  }
}), { virtual: true });

jest.mock('@/translations/fr.json', () => ({
  default: {
    common: {
      save: 'Enregistrer',
      cancel: 'Annuler'
    },
    greeting: 'Bonjour'
  }
}), { virtual: true });

// Test component to access LanguageContext
const TestComponent = () => {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  
  return (
    <div>
      <p data-testid="current-language">{language}</p>
      <p data-testid="greeting">{t('greeting')}</p>
      <p data-testid="save-text">{t('common.save')}</p>
      
      <button onClick={() => setLanguage('fr')}>Switch to French</button>
      <button onClick={() => setLanguage('en')}>Switch to English</button>
    </div>
  );
};

describe('LanguageContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
  });
  
  it('uses English as default language', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    expect(screen.getByTestId('current-language')).toHaveTextContent('en');
  });
  
  it('changes language when clicking language switch button', async () => {
    const user = userEvent.setup();
    
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    // Switch to French
    await user.click(screen.getByText('Switch to French'));
    
    // Check if language was updated
    expect(screen.getByTestId('current-language')).toHaveTextContent('fr');
    
    // Check if localStorage was updated
    expect(localStorage.getItem('preferredLanguage')).toBe('fr');
  });
  
  it('loads language from localStorage on initialization', () => {
    // Set language preference in localStorage
    localStorage.setItem('preferredLanguage', 'fr');
    
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    // Language should be loaded from localStorage (French)
    expect(screen.getByTestId('current-language')).toHaveTextContent('fr');
  });
});