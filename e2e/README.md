# E2E Testing Setup Guide

This guide shows how to set up E2E testing for the React Native Bucketeer SDK, following the same pattern as the [JavaScript SDK E2E tests](https://github.com/bucketeer-io/javascript-client-sdk/blob/main/e2e/evaluations.spec.ts).

## Prerequisites

### 1. Detox Setup
```bash
# Install Detox CLI
npm install -g detox-cli

# Install Detox for React Native
yarn add --dev detox
```

### 2. Test Environment Setup

#### Staging API Configuration
Create test feature flags in your staging Bucketeer environment:

```typescript
// Required test flags
const TEST_FLAGS = {
  'rn-e2e-string': 'value-1',
  'rn-e2e-boolean': true, 
  'rn-e2e-number': 10,
  'rn-e2e-object': { key: 'value-1' }
};
```

#### Environment Variables
```bash
# .env.test
BKT_API_ENDPOINT=https://api-staging.bucketeer.io
BKT_API_KEY=your-staging-api-key
BKT_FEATURE_TAG=react-native-e2e
```

### 3. Detox Configuration

Create `detox.config.js`:
```javascript
module.exports = {
  testRunner: {
    args: {
      '$0': 'jest',
      config: 'e2e/jest.config.js'
    },
    jest: {
      setupFilesAfterEnv: ['<rootDir>/e2e/init.js']
    }
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/YourApp.app',
      build: 'xcodebuild -workspace ios/YourApp.xcworkspace -scheme YourApp -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build'
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd ..'
    }
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 14'
      }
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_4_API_30'
      }
    }
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug'
    },
    'android.emu.debug': {
      device: 'emulator', 
      app: 'android.debug'
    }
  }
};
```

### 4. Jest Configuration for E2E

Create `e2e/jest.config.js`:
```javascript
module.exports = {
  rootDir: '..',
  testMatch: ['<rootDir>/e2e/**/*.spec.ts'],
  testTimeout: 120000,
  maxWorkers: 1,
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: ['detox/runners/jest/reporter'],
  testEnvironment: 'detox/runners/jest/testEnvironment',
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/e2e/init.ts'],
};
```

### 5. E2E Initialization

Create `e2e/init.ts`:
```typescript
import { cleanup, init } from 'detox';

const config = require('../detox.config.js');

beforeAll(async () => {
  await init(config, { initGlobals: false });
});

afterAll(async () => {
  await cleanup();
});
```

## Test Structure (Following JS SDK Pattern)

### 1. Test Cases Mapping

| JS SDK Test | React Native E2E Test |
|------------|----------------------|
| `client.stringVariation()` | Check UI element with string value |
| `client.booleanVariation()` | Check feature visibility |
| `client.numberVariation()` | Check UI element with number |
| `client.objectVariation()` | Check UI elements using object properties |
| `client.evaluationDetails()` | Check detail UI elements |

### 2. Key Differences

| JS SDK | React Native E2E |
|--------|------------------|
| Direct client API calls | UI element assertions |
| Return value assertions | Text/visibility assertions |
| localStorage.clear() | AsyncStorage cleanup |
| Synchronous testing | Async UI interactions |

## Running Tests

```bash
# Build apps
detox build --configuration ios.sim.debug
detox build --configuration android.emu.debug

# Run tests
detox test --configuration ios.sim.debug
detox test --configuration android.emu.debug

# Run specific test
detox test --configuration ios.sim.debug e2e/evaluations.spec.ts
```

## Test Data Management

### Feature Flag Setup
In your staging Bucketeer environment, create these flags:
- `rn-e2e-string`: String flag with value "value-1"
- `rn-e2e-boolean`: Boolean flag with value `true`
- `rn-e2e-number`: Number flag with value `10`
- `rn-e2e-object`: JSON flag with value `{"key": "value-1"}`

### User Targeting
Configure test user `rn-e2e-user-123` to receive the expected flag values.

## Advantages of This Approach

✅ **Same test structure** as JS SDK
✅ **Real API integration** testing
✅ **React Native specific** behavior validation
✅ **AsyncStorage persistence** testing
✅ **UI/UX validation** included
✅ **Platform specific** testing (iOS/Android)

This approach ensures your React Native SDK wrapper works correctly in the real mobile environment while following the proven pattern from the JavaScript SDK.
