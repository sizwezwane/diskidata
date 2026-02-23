# DiskiData Mobile Deployment (iOS & Android)

This project uses **Expo** to provide a native experience for iOS and Android using a shared TypeScript codebase.

## Prerequisites
1.  **Node.js** installed.
2.  **Expo Go** app installed on your physical device (find it on the App Store or Google Play).
3.  **Local Network**: Ensure your development machine and your phone are on the same Wi-Fi.

## Local Development

1.  **Navigate to the mobile directory**:
    ```bash
    cd mobile
    ```

2.  **Install dependencies** (if not done):
    ```bash
    npm install
    ```

3.  **Configure the API URL**:
    Open `mobile/app.json` and update the `extra.apiUrl` to your machine's local IP address (e.g., `http://192.168.1.50:8000`).
    *Note: `localhost` will not work on a physical device.*

4.  **Start the Expo server**:
    ```bash
    npx expo start
    ```

5.  **Run on your device**:
    *   **Android**: Scan the QR code in the terminal using the Expo Go app.
    *   **iOS**: Scan the QR code with your Camera app and open the link in Expo Go.

## Building for Production (iOS & Android)

To build a standalone app that you can submit to the App Store or Play Store, use **EAS (Expo Application Services)**.

1.  **Install EAS CLI**:
    ```bash
    npm install -g eas-cli
    ```

2.  **Login to Expo**:
    ```bash
    eas login
    ```

3.  **Configure the build**:
    ```bash
    eas build:configure
    ```

4.  **Build for Android**:
    ```bash
    eas build --platform android
    ```

5.  **Build for iOS**:
    ```bash
    eas build --platform ios
    ```
    *Note: iOS builds require an Apple Developer account.*

## Shared Logic
The mobile app shares its data interfaces and API logic with the web frontend. All schemas are defined in `mobile/services/api.ts` to ensure consistency across platforms.
