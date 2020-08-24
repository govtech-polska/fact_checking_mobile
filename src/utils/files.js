import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

const IS_ANDROID = Platform.OS === 'android';

export const saveTmpImagesToDevice = async (...paths) => {
  const base = RNFS.DocumentDirectoryPath;
  const timestamp = Date.now().toString();
  const filePrefix = IS_ANDROID ? 'file://' : '';
  const getDestPath = (index) =>
    `${filePrefix}${base}/fakehunter-image-${index}-${timestamp}.jpg`;

  const fileCopyingToResolve = paths.map((sourcePath, i) => {
    if (!sourcePath) {
      return Promise.resolve(null);
    }
    const destPath = getDestPath(i);
    return RNFS.copyFile(sourcePath, destPath).then(() => destPath);
  });

  return Promise.all(fileCopyingToResolve);
};

export const removeImagesFromDevice = async (...paths) => {
  const unlinkingToResolve = paths.map((filePath) =>
    RNFS.exists(filePath).then((exist) => {
      if (exist) {
        return RNFS.unlink(filePath).then(() => filePath);
      } else {
        return Promise.resolve();
      }
    })
  );
  return Promise.all(unlinkingToResolve);
};
