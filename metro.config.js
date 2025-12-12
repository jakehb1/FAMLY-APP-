// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Custom transformer to fix HTML output for Vercel
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

// Add a custom serializer to modify HTML output
const originalSerializer = config.serializer;
config.serializer = {
  ...originalSerializer,
  customSerializer: async (entryPoint, preModules, graph, options) => {
    const result = await originalSerializer.customSerializer?.(
      entryPoint,
      preModules,
      graph,
      options
    );
    
    // If this is a web build, modify the HTML output
    if (options.platform === 'web' && result && typeof result === 'object') {
      // This will be handled by the post-build script
      // Metro doesn't directly output HTML, so we'll use the fix script
    }
    
    return result;
  },
};

module.exports = config;

