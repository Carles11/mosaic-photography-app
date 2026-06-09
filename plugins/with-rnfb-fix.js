const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const RNFB_TARGETS = ["RNFBApp", "RNFBAnalytics"]; // add others you use

const PATCH = `
    # [rnfb-fix] Allow non-modular React headers in Firebase targets
    installer.pods_project.targets.each do |t|
      if ${JSON.stringify(RNFB_TARGETS)}.include?(t.name)
        t.build_configurations.each do |config|
          config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
          flags = config.build_settings['OTHER_CFLAGS'] ||= ['$(inherited)']
          config.build_settings['OTHER_CFLAGS'] = (flags + ['-Wno-non-modular-include-in-framework-module']).uniq
        end
      end
    end
`;

const withRNFBFix = (config) =>
  withDangerousMod(config, [
    "ios",
    async (cfg) => {
      const podfilePath = path.join(
        cfg.modRequest.platformProjectRoot,
        "Podfile",
      );
      const content = fs.readFileSync(podfilePath, "utf8");
      if (content.includes("[rnfb-fix]")) return cfg; // already patched
      const updated = content.replace(
        /post_install do \|installer\|([\s\S]*?)(\n\s*end\s*$)/m,
        (_m, body, end) => `post_install do |installer|${body}\n${PATCH}${end}`,
      );
      fs.writeFileSync(podfilePath, updated);
      return cfg;
    },
  ]);

module.exports = withRNFBFix;
