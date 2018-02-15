'use strict';

const async = require('async');

(() => {

  let alterations = [
    require('./styleurls-to-styles'),
    require('./templateurl-to-template')
  ];

  async.eachSeries(alterations, (alteration, next) => {

    let alterer = new alteration();

    if (alterer && alterer.run) {

      alterer
        .run()
        .then(() => {

          next();

        });

    }

  }, () => {

    console.log('Asset Converter - Finished!');

  });

})();
