'use client';

import { useState } from 'react';
import { 
  Box,
  Menu,
  MenuItem,
  IconButton,
  Typography
} from '@mui/material';
import { useLanguage, Language } from '../context/LanguageContext';

// Define language options with their flags and names
const languageOptions: { code: Language; flag: string; name: string }[] = [
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'sv', flag: '🇸🇪', name: 'Svenska' },
  { code: 'nl', flag: '🇳🇱', name: 'Nederlands' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Get the current language option
  const currentLanguage = languageOptions.find((option) => option.code === language) || languageOptions[0];

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (code: Language) => {
    setLanguage(code);
    handleClose();
  };

  return (
    <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
      <IconButton
        onClick={handleClick}
        aria-controls={open ? 'language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        sx={{ 
          border: '1px solid #ddd', 
          borderRadius: 2, 
          px: 1, 
          py: 0.5,
          backgroundColor: 'background.paper',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <Typography variant="body2" sx={{ mr: 1 }}>
          {currentLanguage.flag}
        </Typography>
        <Typography variant="body2">
          {currentLanguage.code.toUpperCase()}
        </Typography>
      </IconButton>
      
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {languageOptions.map((option) => (
          <MenuItem 
            key={option.code} 
            onClick={() => handleLanguageSelect(option.code)}
            selected={option.code === language}
          >
            <Typography variant="body2" sx={{ mr: 1 }}>
              {option.flag}
            </Typography>
            <Typography variant="body2">
              {option.name}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}