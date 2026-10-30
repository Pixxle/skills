# Mobile drive recipes

Use these when the repo has no mobile harness the generated skill can call. Reuse an existing XCUITest, Espresso, Compose, Detox, Maestro, or Appium suite first, along with its accessibility identifiers and launch arguments.

A runtime may offer its own simulator or device control (tap, swipe, type, screenshot). Use it to explore while generating. Then write the equivalent shell command into the generated skill, so any runtime can repeat the drive.

## Rules for both platforms

- Drive a simulator or emulator this run created. Never drive, reset, or erase the device the user already has open.
- Ready means the first screen is interactive. Wait for a known accessibility element, not for boot to finish.
- Target elements by accessibility identifier, test ID, or content description. Reach deep screens with deep links. Coordinates are a last resort, and each coordinate tap needs a fresh screenshot first.
- Pre-grant every permission a journey needs before launch. A system permission dialog blocks every drive behind it.
- Point the app at a backend this run controls. The iOS simulator shares the host network, so `localhost` works. The Android emulator reaches the host at `10.0.2.2`.
- Sign in with seeded test accounts from the project's fixtures. Never use a real user's account.
- A mobile proof holds a screenshot or recording of the action and the result, the app log for the same window, and the backend side effect (API response or stored row).
- A proof on one platform says nothing about the other. Report the platform with every artifact.

## iOS simulator

- **Launch.** Pick a device type and runtime from `xcrun simctl list devicetypes` and `xcrun simctl list runtimes`. `xcrun simctl create verify-<app> "<device type>" "<runtime>"` prints the UDID. `xcrun simctl bootstatus <udid> -b` boots it and waits. Build with the repo's command for that UDID, then run `xcrun simctl install <udid> <path>.app` and `xcrun simctl launch --terminate-running-process <udid> <bundle-id>`. Set app env vars as `SIMCTL_CHILD_<NAME>=<value>` in the calling shell.
- **Doctor.** `xcrun simctl list devices` shows the UDID as Booted. `xcrun simctl listapps <udid>` shows the bundle with the build number you built. The backend health check passes from the host.
- **Drive.** Use the repo's UI test target or a flow runner pinned to the UDID. `xcrun simctl openurl <udid> <url>` follows a deep link. `xcrun simctl privacy <udid> grant location <bundle-id>` pre-grants a permission and can terminate a running app, so grant before launch. `xcrun simctl location <udid> set <lat>,<lon>` fixes the location. `xcrun simctl push <udid> <bundle-id> <payload>.json` delivers a push.
- **Evidence.** `xcrun simctl io <udid> screenshot <path>.png` takes a screenshot. `xcrun simctl io <udid> recordVideo <path>.mov` records until it gets SIGINT. Start `xcrun simctl spawn <udid> log stream --predicate 'process == "<executable>"' > <path>.log` before the drive and stop it after. App files live under `xcrun simctl get_app_container <udid> <bundle-id> data`.
- **Cleanup.** Run `xcrun simctl shutdown <udid>`, then `xcrun simctl delete <udid>`. Delete only the UDID this run created.

## Android emulator

- **Launch.** Create a dedicated AVD with `avdmanager create avd -n verify-<app> -k "<system-image>"`, or run an existing AVD with `-read-only` so nothing persists. `emulator -avd verify-<app> -port 5580 -no-snapshot-save &` starts serial `emulator-5580`. Pick a free even port. Run `adb -s <serial> wait-for-device`, then poll `adb -s <serial> shell getprop sys.boot_completed` until it prints `1`. Install with `adb -s <serial> install -r <apk>` and start with `adb -s <serial> shell am start -W -n <package>/<activity>`.
- **Doctor.** `adb devices` lists the serial as `device`. `adb -s <serial> shell dumpsys package <package> | grep versionCode` matches the build. The backend health check passes from the host.
- **Drive.** Use the repo's Espresso, UI Automator, or Compose tests, or a flow runner pinned to the serial. `adb -s <serial> shell am start -W -a android.intent.action.VIEW -d '<url>' <package>` follows a deep link. `adb -s <serial> shell pm grant <package> android.permission.ACCESS_FINE_LOCATION` pre-grants a permission. `adb -s <serial> emu geo fix <lon> <lat>` fixes the location, longitude first. `adb -s <serial> shell pm clear <package>` resets app data, so grant permissions again after it. `adb -s <serial> exec-out uiautomator dump /dev/tty` prints the UI tree.
- **Evidence.** `adb -s <serial> exec-out screencap -p > <path>.png` takes a screenshot. `adb -s <serial> shell screenrecord /sdcard/<name>.mp4` records, then `adb -s <serial> pull` copies it out. Run `adb -s <serial> logcat -c` before the drive and `adb -s <serial> logcat -d --pid=$(adb -s <serial> shell pidof -s <package>)` after. A crashed app has no pid, so read `adb -s <serial> logcat -d -b crash` instead.
- **Cleanup.** `adb -s <serial> emu kill` stops the emulator this run started. Delete an AVD this run created with `avdmanager delete avd -n verify-<app>`. Never run `adb kill-server` or kill emulators by name.
