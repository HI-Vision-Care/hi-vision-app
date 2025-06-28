import { Stack } from 'expo-router'

export default function PersonalTab() {
    return (
        <Stack>
            <Stack.Screen name="setting" options={{ headerShown: false }} />
            <Stack.Screen name="history" options={{ headerShown: false }} />
            <Stack.Screen name="personalinfo" options={{
                headerShown: false,
                // Khi vào /menu/:key, ẩn tab bar

            }} />
        </Stack>
    )
}
