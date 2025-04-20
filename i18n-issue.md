# Add Multi-Language Support (Swedish, Dutch, French)

## Overview
We need to add internationalization (i18n) to the coffee-tracker application to support multiple languages: Swedish, Dutch, and French, in addition to English (default). This will make our application accessible to a wider audience.

## Requirements

### Translations
- Translate all UI text content into:
  - Swedish (Svenska)
  - Dutch (Nederlands)
  - French (Français)
  - Keep English as the default language

### User Interface
- Add a language selector dropdown in the upper corner of the application
- Use flag icons to represent each language:
  - 🇸🇪 For Swedish
  - 🇳🇱 For Dutch
  - 🇫🇷 For French
  - 🇬🇧 For English (default)
- The selected language should be stored in user preferences/local storage
- The application should load with the previously selected language on subsequent visits

### Technical Implementation
- Use Next.js Internationalization (i18n) routing features
- Create a language context to manage the current language across the application
- Implement translation files (JSON) for each supported language
- All text, labels, buttons, notifications, and error messages should be translatable
- Ensure date and number formats respect locale conventions

### Affected Files
- Layout components to include the language selector
- All pages with user-visible text
- API responses with user-visible messages

## Acceptance Criteria
- [ ] Language selector dropdown is visible in the upper corner with flag icons
- [ ] Selecting a language immediately updates all text on the page
- [ ] Language preference persists between sessions
- [ ] All application text is properly translated in all supported languages
- [ ] Date and time formats respect the selected language conventions
- [ ] Code is well-documented with comments explaining the i18n implementation

## Resources
- Example flag icons can be added to the `/public` directory
- Translation JSON files should be organized in a new `/src/translations` directory
- Consider using `next-i18next` or a similar library for managing translations

## Priority
Medium

## Estimated Effort
3-4 days of development work