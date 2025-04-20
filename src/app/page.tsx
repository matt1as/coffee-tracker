'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Rating as MuiRating,
} from '@mui/material';
import type { MeasurementSystem, Unit, CoffeeEntry } from '../types/coffee';
import { useTranslation, useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [amount, setAmount] = useState<string>('');
  const [unit, setUnit] = useState<Unit>('cups');
  const [measurementSystem, setMeasurementSystem] = useState<MeasurementSystem>('metric');
  const [entries, setEntries] = useState<CoffeeEntry[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [location, setLocation] = useState<string>('');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/coffee');
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const handleAddCoffee = async () => {
    const entry = {
      userId: 'default-user',
      timestamp: new Date().toISOString(),
      amount: parseFloat(amount),
      unit,
      // Include optional fields only if they have values
      ...(rating !== null && { rating }),
      ...(location && { location }),
    };

    try {
      const response = await fetch('/api/coffee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });

      if (response.ok) {
        setAmount('');
        setRating(null);
        setLocation('');
        fetchEntries();
      }
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };

  const formatDate = (timestamp: string) => {
    // Format date according to the current language
    return new Date(timestamp).toLocaleString(
      language === 'en' ? 'en-US' : 
      language === 'sv' ? 'sv-SE' : 
      language === 'nl' ? 'nl-NL' : 
      'fr-FR'
    );
  };

  const formatAmount = (amount: number, unit: Unit) => {
    return `${amount} ${unit}`;
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t('home.title')}
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          {t('home.subtitle')}
        </Typography>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ mb: 3 }}>
            <ToggleButtonGroup
              value={measurementSystem}
              exclusive
              onChange={(_, newSystem) => newSystem && setMeasurementSystem(newSystem)}
              fullWidth
            >
              <ToggleButton value="metric">Metric</ToggleButton>
              <ToggleButton value="imperial">Imperial</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              label={t('home.amountLabel')}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
            />
            
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>{t('home.unitLabel')}</InputLabel>
              <Select
                value={unit}
                label={t('home.unitLabel')}
                onChange={(e) => setUnit(e.target.value as Unit)}
              >
                {measurementSystem === 'metric' ? (
                  <MenuItem value="ml">ml</MenuItem>
                ) : (
                  <>
                    <MenuItem value="cups">Cups</MenuItem>
                    <MenuItem value="fl_oz">fl oz</MenuItem>
                  </>
                )}
              </Select>
            </FormControl>
          </Box>

          {/* New fields for rating and location */}
          <Box sx={{ mb: 3 }}>
            <TextField
              label={t('details.location') + ' (' + t('common.optional') + ')'}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              placeholder={t('details.locationPlaceholder')}
              sx={{ mb: 2 }}
            />
            
            <Typography component="legend" sx={{ mt: 1 }}>
              {t('details.rating')} ({t('common.optional')})
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

          <Button
            variant="contained"
            onClick={handleAddCoffee}
            fullWidth
            disabled={!amount}
          >
            {t('home.addCoffee')}
          </Button>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('home.recentEntries')}
          </Typography>
          <List>
            {entries.map((entry, index) => (
              <Box key={entry.timestamp}>
                <ListItemButton component={Link} href={`/coffee/${entry.timestamp}`}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box>
                          {formatAmount(entry.amount, entry.unit)}
                        </Box>
                        {entry.rating && (
                          <Box>
                            <MuiRating value={entry.rating} readOnly size="small" />
                          </Box>
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        {formatDate(entry.timestamp)}
                        {entry.location && (
                          <Typography variant="body2" component="span" display="block">
                            {t('details.location')}: {entry.location}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItemButton>
                {index < entries.length - 1 && <Divider />}
              </Box>
            ))}
            {entries.length === 0 && (
              <ListItem>
                <ListItemText primary={t('home.noCoffee')} />
              </ListItem>
            )}
          </List>
        </Paper>
      </Box>
    </Container>
  );
}
