#!/bin/bash

# Patch Podfile to allow non-modular includes inside framework modules
echo "Patching Podfile for non-modular includes (RNFBApp fix)..."

PODFILE="ios/Podfile"
if [ -f "$PODFILE" ]; then
   echo "" >> "$PODFILE"
   echo "# Patch for RNFBApp non-modular headers" >> "$PODFILE"
   echo "post_install do |installer|" >> "$PODFILE"
   echo "  installer.pods_project.targets.each do |target|" >> "$PODFILE"
   echo "    target.build_configurations.each do |config|" >> "$PODFILE"
   echo "      config.build_settings['CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER'] = 'NO'" >> "$PODFILE"
   echo "    end" >> "$PODFILE"
   echo "  end" >> "$PODFILE"
   echo "end" >> "$PODFILE"
fi