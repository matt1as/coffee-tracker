import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CoffeeEntryPage from '@/app/coffee/[id]/page';
import { LanguageProvider } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';

// Mock the LanguageContext's useTranslation hook
jest.mock('@/context/LanguageContext', () => {
  const actual = jest.requireActual('@/context/LanguageContext');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => {
        const translations = {
          'details.title': 'Coffee Details',
          'details.location': 'Location',
          'details.locationPlaceholder': 'Where did you have this coffee?',
          'details.rating': 'Rating',
          'details.backHome': 'Back to Home',
          'common.save': 'Save Changes',
          'common.saving': 'Saving...',
          'common.back': 'Back',
          'notifications.notFound': 'Coffee entry not found',
          'notifications.loadError': 'Failed to load coffee entry',
          'notifications.updateError': 'Failed to update coffee entry',
          'notifications.updateSuccess': 'Coffee entry updated successfully'
        };
        return translations[key] || key;
      }
    }),
    useLanguage: () => ({
      language: 'en',
      setLanguage: jest.fn(),
      translations: {}
    })
  };
});

// Mock router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
    refresh: jest.fn()
  })
}));

// Mock fetch
global.fetch = jest.fn() as jest.Mock;

// Mock coffee entry
const mockCoffeeEntry = {
  id: '123',
  amount: 200,
  unit: 'ml',
  timestamp: '2023-04-20T12:00:00Z',
  rating: 4,
  location: 'Office'
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  (fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => mockCoffeeEntry
  });
});

// Wrap component with necessary providers
const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <LanguageProvider>
      {component}
    </LanguageProvider>
  );
};

describe('CoffeeEntryPage Component', () => {
  it('should fetch coffee entry data once when mounted', async () => {
    const params = Promise.resolve({ id: '123' });
    renderWithProviders(<CoffeeEntryPage params={params} />);
    
    // Wait for loading state to finish
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Verify fetch was called only once
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/api/coffee/123');
    
    // Verify entry data is displayed
    expect(screen.getByText('200 ml')).toBeInTheDocument();
  });

  it('should update coffee entry when save button is clicked', async () => {
    const user = userEvent.setup();
    const params = Promise.resolve({ id: '123' });
    
    (fetch as jest.Mock).mockImplementation(async (url, options) => {
      if (options?.method === 'PUT') {
        return {
          ok: true,
          json: async () => ({ ...mockCoffeeEntry, rating: 5, location: 'Home' })
        };
      }
      
      return {
        ok: true,
        json: async () => mockCoffeeEntry
      };
    });

    renderWithProviders(<CoffeeEntryPage params={params} />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Change location
    const locationInput = screen.getByLabelText('Location');
    await user.clear(locationInput);
    await user.type(locationInput, 'Home');
    
    // Click save button
    const saveButton = screen.getByText('Save Changes');
    await user.click(saveButton);

    // Verify PUT request was made
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/coffee/123', expect.objectContaining({
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }));
    });
    
    // Verify success notification and redirect
    expect(await screen.findByText('Coffee entry updated successfully')).toBeInTheDocument();
    
    // Verify redirect after successful save
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    }, { timeout: 2000 });
  });

  it('should show error notification when fetch fails', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));
    
    const params = Promise.resolve({ id: '123' });
    renderWithProviders(<CoffeeEntryPage params={params} />);
    
    // The component shows a Snackbar notification for errors, which is inside an Alert component
    await waitFor(() => {
      // When fetch fails, the component shows the error in a notification
      // and displays the "Coffee entry not found" on the page
      expect(screen.getByText('Coffee entry not found')).toBeInTheDocument();
    });
  });
});