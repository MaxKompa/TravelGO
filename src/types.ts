import { ImageSourcePropType } from "react-native";

export type HeaderProps = {
  text: string;
};

export type BackgroundProps = {
  children: React.ReactNode;
};

export type ThemeCardProps = {
  text: string;
  width: number;
  image: ImageSourcePropType;
  onPress: () => void;
};

export type LocationCardProps = {
  label: string;
  rating: number;
  shedule: string;
  short_description: string;
  photo_url: string;
};

export type DataItem = {
  id?: string;
  name: string;
  rating: number;
  short_description: string;
  sheduleString: string;
  photo_url: string;
  open_time?: string;
  close_time?: string;
};

export type TabIconProps = {
  IconComponent: React.ComponentType<any>;
  activeColor: string;
  inactiveColor: string;
  iconWidth: number;
  iconHeight: number;
};

export type TAB_SCREEN_CONFIG = {
  title: string;
  name: string;
  icon: React.ComponentType<any>;
};
