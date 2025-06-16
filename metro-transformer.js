const { transform } = require('@babel/core');
const pkg = require('./package.json');

module.exports.transform = function ({ src, filename, options }) {
  // Replace __BKT_SDK_VERSION__ with actual version from package.json
  const modifiedSrc = src.replace(/__BKT_SDK_VERSION__/g, `"${pkg.version}"`);
  return transform(modifiedSrc, {
    filename,
    ...options,
  });
};
