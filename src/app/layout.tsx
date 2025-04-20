'use client';
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6F4E37', // Coffee brown
    },
    secondary: {
      main: '#8B4513', // Saddle brown
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LanguageProvider>
            <LanguageSelector />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
