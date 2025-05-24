"use client";

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export function useAuthSetup() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const setupUser = async () => {
      if (!user || !isLoaded) return;

      const email = user.primaryEmailAddress?.emailAddress;
      if (!email) return;

      try {
        // Check if user exists in our database
        const checkResponse = await fetch(`/api/users/email/${email}`);
        
        if (checkResponse.status === 404) {
          // User doesn't exist in our database, create them
          const createResponse = await fetch(`/api/users/email/${email}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              image: user.imageUrl || '',
            }),
          });

          if (!createResponse.ok) {
            throw new Error('Failed to create user');
          }
        } else if (!checkResponse.ok) {
          throw new Error('Failed to check user existence');
        }
      } catch (error) {
        console.error('Error setting up user:', error);
      }
    };

    setupUser();
  }, [user, isLoaded]);
} 