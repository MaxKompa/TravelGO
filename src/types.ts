import { DimensionValue, ImageSourcePropType } from "react-native";

export type HeaderProps = {
  text: string;
  setIsConfirmModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
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

export type OperationHours = {
  day: string;
  open_time?: string;
  close_time?: string;
};

export type LocationCardProps = {
  label: string;
  rating: number;
  todaySchedule: string;
  discription: string;
  photo_url: string;
  priceAvg: number;
  id: number;
  fullSchedule: OperationHours[];
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

  isUserLogged: boolean | null;

  setIsUserLogged: React.Dispatch<React.SetStateAction<boolean | null>>;
};

export type LogInFormProps = {
  onClose: () => void;
  isLogInOpen: boolean;
};

export type LogoutButtonProps = {
  setIsConfirmModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export type ConfirmModalProps = {
  isConfirmModalOpen: boolean;
};
