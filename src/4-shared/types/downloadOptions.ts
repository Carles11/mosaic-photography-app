export type DownloadImageProps = {
  option: { url: string; folder?: string };
  selectedImage?: { id?: string | number } | null;
  user?: any;
  logEvent?: (name: string, params?: object) => void;
  showSuccessToast: (msg: string, hint?: string) => void;
  showErrorToast: (msg: string) => void;
  onRequireLogin?: () => void;
  origin: string;
};
