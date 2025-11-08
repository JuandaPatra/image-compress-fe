export const generatePreviewUrls = (files: File[]): string[] => {
  return files.map((file) => URL.createObjectURL(file));
};
