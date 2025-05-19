"use client";

import React from 'react';
import RailsProvider from '@/rails/provider/rails-context-provider';

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RailsProvider>
      {children}
    </RailsProvider>
  );
}
