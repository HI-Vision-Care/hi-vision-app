import React from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';

const { width } = Dimensions.get('window');

interface ExpoTabBarProps {
    state: any;
    descriptors: any;
    navigation: any;
}

export default function BottomTabBar({ state, navigation }: ExpoTabBarProps) {
    const router = useRouter();
    const pathname = usePathname();

    // Multiple animations for smoother effects
    const slideAnim = React.useRef(new Animated.Value(0)).current;
    const scaleAnim = React.useRef(new Animated.Value(1)).current;
    const fadeAnim = React.useRef(new Animated.Value(1)).current;
    const bounceAnim = React.useRef(new Animated.Value(0)).current;

    const tabs = [
        { route: 'medicine-calendar', icon: '💙', label: 'Trang chủ' },
        { route: 'add-reminder', icon: '📅+', label: 'Thêm lịch\nnhắc mới', isCenter: true },
        { route: 'my-prescriptions', icon: '📋', label: 'Đơn thuốc\ncủa tôi' }
    ];

    // Hide on certain screens with fade animation
    if (pathname.includes('arv-reminder') || pathname.includes('prep-reminder')) {
        return null;
    }

    const handleTabPress = (route: string) => {
        // Complex animation sequence
        Animated.sequence([
            // Press down effect
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 0.95,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.8,
                    duration: 100,
                    useNativeDriver: true,
                })
            ]),

            // Release and slide effect
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 300,
                    friction: 10,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ])
        ]).start(() => {
            // Navigate after smooth animation
            router.push(`/(medicine-reminder)/${route}` as any);

            // Bounce effect after navigation
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(bounceAnim, {
                    toValue: 0,
                    tension: 200,
                    friction: 8,
                    useNativeDriver: true,
                })
            ]).start();

            // Reset slide animation
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        });
    };

    return (
        <SafeAreaView edges={[ 'bottom' ]} style={styles.safeArea}>
            <Animated.View
                style={[
                    styles.tabContainer,
                    {
                        opacity: fadeAnim,
                        transform: [
                            { scale: scaleAnim },
                            {
                                translateY: slideAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, -5]
                                })
                            }
                        ]
                    }
                ]}
            >
                {/* Animated background indicator */}
                <Animated.View
                    style={[
                        styles.indicator,
                        {
                            transform: [{
                                scaleX: slideAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 1]
                                })
                            }]
                        }
                    ]}
                />

                <View style={styles.row}>
                    {tabs.map((tab, index) => {
                        const isActive = pathname.includes(tab.route);

                        return (
                            <TouchableOpacity
                                key={index}
                                style={styles.tab}
                                onPress={() => handleTabPress(tab.route)}
                                activeOpacity={0.6}
                            >
                                <Animated.View
                                    style={[
                                        styles.iconWrapper,
                                        tab.isCenter ? styles.centerIconWrapper : styles.defaultIconWrapper,
                                        {
                                            transform: [
                                                { scale: isActive ? 1.15 : 1 },
                                                {
                                                    translateY: bounceAnim.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, -8]
                                                    })
                                                },
                                                {
                                                    rotate: slideAnim.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: ['0deg', '5deg']
                                                    })
                                                }
                                            ]
                                        }
                                    ]}
                                >
                                    <Animated.Text
                                        style={[
                                            tab.isCenter ? styles.centerIconText : styles.defaultIconText,
                                            { transform: [{ scale: isActive ? 1.1 : 1 }] }
                                        ]}
                                    >
                                        {tab.icon}
                                    </Animated.Text>
                                </Animated.View>

                                <Animated.Text
                                    style={[
                                        isActive ? styles.activeLabel : styles.inactiveLabel,
                                        {
                                            opacity: fadeAnim,
                                            transform: [{ translateY: isActive ? -2 : 0 }]
                                        }
                                    ]}
                                >
                                    {tab.label}
                                </Animated.Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: 'white',
    },
    tabContainer: {
        backgroundColor: 'white',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#E5E7EB',
      
    },
    indicator: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#3B82F6',
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
    },
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    defaultIconWrapper: {
        width: 32,
        height: 32,
    },
    centerIconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#3B82F6',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    defaultIconText: {
        fontSize: 24,
        color: '#3B82F6',
        opacity: 0.6,
    },
    centerIconText: {
        fontSize: 16,
        color: 'white',
        fontWeight: '600',
    },
    activeLabel: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 14,
        color: '#3B82F6',
        fontWeight: '600',
    },
    inactiveLabel: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 14,
        color: '#3B82F6',
    },
});
