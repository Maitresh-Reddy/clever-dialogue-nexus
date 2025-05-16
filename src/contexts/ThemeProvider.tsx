
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps as NextThemeProviderProps } from "next-themes"

// Define our props by extending the ones from next-themes
type ThemeProviderProps = {
  children: React.ReactNode;
} & Omit<NextThemeProviderProps, "children">

export function ThemeProvider({ 
  children, 
  ...props 
}: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
