// client/src/types/database.ts
type ImageMetadata = {
  type: string;
  mode: string;
  folder: string;
  format: string;
  bytes: number;
  branch: string;
  width: number;
  tertiary: string;
  height: number;
  primary: string;
  secondary: string;
  megabytes: number;
  original_file_name: string;
  [key: string]: string | number;
};
type EnvironmentEntry = {
  environment_title: string;
  images: ImageMetadata[];
};
export type { EnvironmentEntry, ImageMetadata };
