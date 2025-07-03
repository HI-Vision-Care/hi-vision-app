import React from 'react';
import { Stack } from 'expo-router';

export default function ChatbotLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="chat-bot"
                options={{
                    title: 'AI Chat',
                }}
            />
        </Stack>
    );
}