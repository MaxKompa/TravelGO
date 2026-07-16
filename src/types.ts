export type HeaderProps = {
  text: string;
};

export type BackgroundProps = {
  children: React.ReactNode;
};

export type ThemeCardProps = {
  text: string;
  width: number;
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
