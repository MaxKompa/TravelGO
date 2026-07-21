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
};

export type LocationCardProps = {
  label: string;
  googleRewiew: string;
  travelGoRewiew: string;
  shedule: string[];
  specification: string;
};

export type DataItem = {
  id: string;
  label: string;
  googleRewiew: string;
  travelGoRewiew: string;
  specification: string;
  shedule: string[];
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
