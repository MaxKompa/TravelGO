import { DimensionValue, ImageSourcePropType } from "react-native";

export type HeaderProps = {
  text: string;
};

export type ContentCardProps = {
  children: React.ReactNode;
  height: DimensionValue;
  label: string;
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
  todaySchedule: string;
  discription: string;
  photo_url: string;
  priceAvg: number;
  id: number;
};

export type LocationListItem = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  google_rating: number;
  price_avg: number;
  latitude: number;
  longitude: number;
  hours: {
    day: string;
    open_time?: string;
    close_time?: string;
  }[];
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
  icon?: React.ComponentType<any>;
  href?: string | null;
};

export type ToolsListOptionProps = {
  title: string;
  handleOpenPress: () => void;
};

export type InfoForCreateAcc = {
  username: string;
  password: string;
  email: string;
};

export type RegistrationFormProps = {
  accountCreatingFormInfo: {
    username: string;
    email: string;
    password: string;
  };

  setAccountCreatingFormInfo: React.Dispatch<
    React.SetStateAction<{ username: string; email: string; password: string }>
  >;
};
