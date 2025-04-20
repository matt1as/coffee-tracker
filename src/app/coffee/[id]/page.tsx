'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Rating as MuiRating,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { CoffeeEntry } from '@/types/coffee';
import { useTranslation, useLanguage } from '@/context/LanguageContext';

export default function CoffeeEntryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [entry, setEntry] = useState<CoffeeEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState<number | null>(null);
  const [location, setLocation] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const showNotification = useCallback((message: string, severity: 'success' | 'error') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  }, []);

  const fetchEntry = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/coffee/${params.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setEntry(data);
        setRating(data.rating || null);
        setLocation(data.location || '');
      } else {
        showNotification(t('notifications.notFound'), 'error');
      }
    } catch (error) {
      console.error('Error fetching entry:', error);
      showNotification(t('notifications.loadError'), 'error');
    } finally {
      setLoading(false);
    }
  }, [params.id, showNotification, t]);

  useEffect(() => {
    fetchEntry();
  }, [fetchEntry]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/coffee/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          location,
        }),
      });

      if (response.ok) {
        const updatedEntry = await response.json();
        setEntry(updatedEntry);
        showNotification(t('notifications.updateSuccess'), 'success');
        
        // Delay navigation to allow user to see the success notification
        setTimeout(() => {
          router.push('/');
        }, 1500); // 1.5 seconds delay before navigation
      } else {
        const error = await response.json();
        showNotification(error.error || t('notifications.updateError'), 'error');
      }
    } catch (error) {
      console.error('Error updating entry:', error);
      showNotification(t('notifications.updateError'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const formatDate = (timestamp: string) => {
    // Format date according to the current language locale
    return new Date(timestamp).toLocaleString(
      language === 'en' ? 'en-US' : 
      language === 'sv' ? 'sv-SE' : 
      language === 'nl' ? 'nl-NL' : 
      'fr-FR'
    );
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!entry) {
    return (
      <Container maxWidth="sm">
        <Paper sx={{ p: 3, my: 4 }}>
          <Typography variant="h6">{t('notifications.notFound')}</Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/')}
            sx={{ mt: 2 }}
          >
            {t('details.backHome')}
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t('details.title')}
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {entry.amount} {entry.unit}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {formatDate(entry.timestamp)}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              label={t('details.location')}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              placeholder={t('details.locationPlaceholder')}
              sx={{ mb: 2 }}
            />
            
            <Typography component="legend" sx={{ mt: 1 }}>
              {t('details.rating')}
            </Typography>
            <MuiRating
              name="coffee-rating"
              value={rating}
              onChange={(_, newValue) => {
                setRating(newValue);
              }}
              sx={{ mt: 0.5 }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              fullWidth
            >
              {saving ? t('common.saving') : t('common.save')}
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push('/')}
              fullWidth
            >
              {t('common.back')}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}