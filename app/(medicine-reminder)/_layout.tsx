import React from 'react';
import { Tabs } from 'expo-router';
import BottomTabBar from '@/components/layout/BottomTabBar';

export default function MedicineReminderLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
            }}
            // custom BottomTabBar component
            tabBar={props => <BottomTabBar {...props} />}
        >
            <Tabs.Screen
                name="medicine-calendar"
                options={{
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="add-reminder"
                options={{
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="my-prescriptions"
                options={{
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="arv-reminder"
                options={{
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="prep-reminder"
                options={{
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}