import { Platform } from 'react-native';

class PlatformInfo {
  constructor(
    public os: string,
    public version: string
  ) {}
}

function getCurrentPlatform(): PlatformInfo {
  return new PlatformInfo(Platform.OS, String(Platform.Version));
}

export { getCurrentPlatform, PlatformInfo };
