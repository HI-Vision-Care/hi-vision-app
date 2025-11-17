import { Tabs } from "expo-router";
import { Dimensions, Image, ImageSourcePropType, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { icons } from "@/constants";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const TAB_HEIGHT = 30;
const NOTCH_WIDTH = 60;
const NOTCH_DEPTH = 20; // deep hơn để nút Add chìm sâu
const SHOW_CENTER_ACTION = false;

const getTabBarBackgroundProps = (
  bottomInset: number
): { path: string; height: number } => {
  const height = TAB_HEIGHT + NOTCH_DEPTH + bottomInset;

  if (!SHOW_CENTER_ACTION) {
    return {
      height,
      path: `
        M0,0
        L${width},0
        L${width},${height}
        L0,${height}Z
      `,
    };
  }

  const notchStartX = (width - NOTCH_WIDTH) / 2;
  const notchEndX = notchStartX + NOTCH_WIDTH;

  return {
    height,
    path: `
      M0,0
      L${notchStartX - 10},0
      C${notchStartX + 5},0 ${notchStartX + 10},${NOTCH_DEPTH} ${
        notchStartX + NOTCH_WIDTH / 2
      },${NOTCH_DEPTH}
      C${notchEndX - 10},${NOTCH_DEPTH} ${notchEndX - 5},0 ${notchEndX + 10},0
      L${width},0
      L${width},${height}
      L0,${height}Z
    `,
  };
};

const TabIcon = ({
  source,
  focused,
  isCenter = false,
}: {
  source: ImageSourcePropType;
  focused: boolean;
  isCenter?: boolean;
}) =>
  isCenter ? (
    <View
      style={{
        marginTop: -NOTCH_DEPTH, // nhô đúng độ sâu mới
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: NOTCH_WIDTH,
          height: NOTCH_WIDTH,
          borderRadius: 12, // radius giảm để ít “bánh mì” hơn
          backgroundColor: "#0066FF",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <Image
          source={source}
          resizeMode="contain"
          style={{ width: 24, height: 24, tintColor: "#FFF" }}
        />
      </View>
    </View>
  ) : (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: focused ? "rgba(59,130,246,0.2)" : "transparent",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={source}
          resizeMode="contain"
          style={{
            width: 24,
            height: 24,
            tintColor: focused ? "#3B82F6" : "#9CA3AF",
          }}
        />
      </View>
    </View>
  );

function LayoutInner() {
  const insets = useSafeAreaInsets(); // đọc safe-area inset
  const { height: tabBarHeight, path: tabBarPath } = getTabBarBackgroundProps(
    insets.bottom
  );

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        // bù thêm paddingBottom = inset.bottom, tăng height cho đủ
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: tabBarHeight,
          paddingBottom: insets.bottom,
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () => (
          <Svg
            width={width}
            height={tabBarHeight}
            style={{ position: "absolute", bottom: 0 }}
          >
            <Path d={tabBarPath} fill="#FFFFFF" />
          </Svg>
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.home2} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.browerHealth} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.gear} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <LayoutInner />
    </SafeAreaProvider>
  );
}
