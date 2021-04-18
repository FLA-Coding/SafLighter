#!/bin/sh

# Placer le .app dans un sous-dossier « source_folder »

test -f Application-Installer.dmg && rm Application-Installer.dmg
create-dmg \
  --volname "SafLighter" \
  --volicon "SafLighter_logo.icns" \
  --background "dmg_background.png" 700 600 \
  --window-pos 200 120 \
  --window-size 700 600 \
  --icon-size 150 \
  --icon "SafLighter.app" 150 380 \
  --hide-extension "SafLighter.app" \
  --app-drop-link 550 380 \
  "SafLighter.dmg" \
  "source_folder/"
