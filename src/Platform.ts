import { Platform } from 'react-native';

class PlatformInfo {
  constructor(
    public os: string,
    public version: string | number
  ) {}
}

function getCurrentPlatform(): PlatformInfo {
  return new PlatformInfo(Platform.OS, Platform.Version);
}

export { getCurrentPlatform, PlatformInfo };
