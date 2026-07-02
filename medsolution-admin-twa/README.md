# MedSolution PWA — Android Trusted Web Activity

Wraps https://medsolutionhealthcare.com as a real Android APK with package name `medsolution.admin.pwa`.

## Quick Start (Debug)

```bash
set JAVA_HOME=C:\Program Files\Android\Android Studio1\jbr
gradlew assembleDebug
```

APK output: `app/build/outputs/apk/debug/app-debug.apk`

Sideload onto any Android device.

## Release Build

1. Generate a keystore:

```bash
keytool -genkey -v -keystore medsolution-keystore.jks -alias medsolution -keyalg RSA -keysize 2048 -validity 10000
```

2. Build:

```bash
set KEYSTORE_PASSWORD=...
set KEY_ALIAS=medsolution
set KEY_PASSWORD=...
gradlew assembleRelease
```

3. Get the SHA256 fingerprint:

```bash
keytool -list -v -keystore medsolution-keystore.jks -alias medsolution -storepass ... -keypass ...
```

4. Update `public/.well-known/assetlinks.json` with the SHA256 fingerprint (colons removed).

5. Deploy the updated `public/.well-known/assetlinks.json` to your website.

## Digital Asset Links

For the TWA to work, `https://medsolutionhealthcare.com/.well-known/assetlinks.json` must be served with the correct SHA256 fingerprint of your signing key.

- Debug file: `./.well-known/assetlinks.json`
- Production file: `../public/.well-known/assetlinks.json`

## Verify the TWA

After installing the APK, visit https://medsolutionhealthcare.com in Chrome. If Digital Asset Links are configured correctly, Chrome will open the TWA (not the browser).
