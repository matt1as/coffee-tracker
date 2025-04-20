'use client';

import { useState, useEffect } from 'react';
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
  Divider,
} from '@mui/material';
import type { MeasurementSystem, Unit, CoffeeEntry } from '../types/coffee';

export default function Home() {
  const [amount, setAmount] = useState<string>('');
  const [unit, setUnit] = useState<Unit>('cups');
  const [measurementSystem, setMeasurementSystem] = useState<MeasurementSystem>('metric');
  const [entries, setEntries] = useState<CoffeeEntry[]>([]);

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
        fetchEntries();
      }
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatAmount = (amount: number, unit: Unit) => {
    return `${amount} ${unit}`;
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Coffee Tracker
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
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
            />
            
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Unit</InputLabel>
              <Select
                value={unit}
                label="Unit"
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

          <Button
            variant="contained"
            onClick={handleAddCoffee}
            fullWidth
            disabled={!amount}
          >
            Add Coffee
          </Button>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Entries
          </Typography>
          <List>
            {entries.map((entry, index) => (
              <Box key={entry.timestamp}>
                <ListItem>
                  <ListItemText
                    primary={formatAmount(entry.amount, entry.unit)}
                    secondary={formatDate(entry.timestamp)}
                  />
                </ListItem>
                {index < entries.length - 1 && <Divider />}
              </Box>
            ))}
            {entries.length === 0 && (
              <ListItem>
                <ListItemText primary="No entries yet" />
              </ListItem>
            )}
          </List>
        </Paper>
      </Box>
    </Container>
  );
}
