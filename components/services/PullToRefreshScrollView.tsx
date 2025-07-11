import { REFRESH_COLORS } from "@/constants";
import { ReactNode } from "react";
import { RefreshControl, ScrollView, ScrollViewProps } from "react-native";

interface Props extends Omit<ScrollViewProps, "refreshControl"> {
  refreshing: boolean;
  onRefresh: () => Promise<any>;
  children: ReactNode;
}

const PullToRefreshScrollView = ({
  refreshing,
  onRefresh,
  children,
  ...rest
}: Props) => {
  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={REFRESH_COLORS.tintColor}
          colors={REFRESH_COLORS.colors}
        />
      }
      {...rest}
    >
      {children}
    </ScrollView>
  );
};

export default PullToRefreshScrollView;
