/* eslint-env node */
'use strict';

module.exports = function (deployTarget) {
  let ENV = {
    build: {},
    // include other plugin configuration that applies to all deploy targets here
  };

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';
    // configure other plugins for development deploy target here
  }

  if (deployTarget === 'staging') {
    ENV.build.environment = 'production';
    // configure other plugins for staging deploy target here
  }

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    // configure other plugins for production deploy target here
    ENV.s3 = {
      accessKeyId: process.env['AWS_PERSONAL_IAM_WAIHON_ACCESS_KEY_ID'],
      secretAccessKey: process.env['AWS_PERSONAL_IAM_WAIHON_SECRET_ACCESS_KEY'],
      bucket: 'rarweo',
      region: 'ap-southeast-1',
    };
    ENV['s3-index'] = {
      accessKeyId: process.env['AWS_PERSONAL_IAM_WAIHON_ACCESS_KEY_ID'],
      secretAccessKey: process.env['AWS_PERSONAL_IAM_WAIHON_SECRET_ACCESS_KEY'],
      bucket: 'rarweo',
      region: 'ap-southeast-1',
    };
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
