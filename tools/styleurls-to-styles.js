'use strict';

/**
 * @class AlterAngularStyles
 * Converts style urls to the actual styles inside an angular transpiled
 * component; this is useful when we don't want to lazy-load them.
 */

const q = require('q');
const globby = require('globby');
const async = require('async');
const path = require('path');
const fs = require('fs');
const promisify = require('promisify-node');
const sass = require('node-sass');

const readFile = promisify(fs.readFile);
const unlinkFile = promisify(fs.unlink);
const writeFile = promisify(fs.writeFile);

const templateNeedleBegin = `styleUrls': [`;
const templateNeedleEnd = `]`;
const templateReplacementRegex = /('styleUrls':\s\[[aA\--zZ.,']+\])/g;

const UTF = 'utf8';

module.exports = exports = class AlterAngularStyles {

  run () {

    let root = process.cwd(),

      deferred = q.defer();

    globby([
      `${root}/core/src/scripts/**/*.js`
    ])
      .then((paths) => {

        async.each(paths, (p, next) => {

          let styles = [];

          readFile(p, UTF)
            .then((data) => {

              let startNeedleIndex = data.indexOf(templateNeedleBegin),

                endNeedleIndex =  data.indexOf(templateNeedleEnd, startNeedleIndex + templateNeedleBegin.length);

              if (startNeedleIndex !== -1) {

                let relativeSourcePaths = data.substr(
                    startNeedleIndex + templateNeedleBegin.length,
                    endNeedleIndex - startNeedleIndex - templateNeedleBegin.length
                  )
                  .replace(/\'/g, '')
                  .split(',');

                async.each(relativeSourcePaths, (relativeSourcePath, relativeNext) => {

                  let resolvedPath = path.resolve(path.dirname(p).replace('core/', ''), relativeSourcePath);

                  sass.render({

                    'file': resolvedPath

                  }, (err, result) => {

                    if (
                      !err &&
                      result &&
                      result.css
                    ) {

                      let css = result.css.toString();

                      styles.push(`\`${css}\``);

                      relativeNext();

                    } else {

                      relativeNext();

                    }

                  });

                }, () => {

                  data = data.replace(templateReplacementRegex, `'styles': [${styles.join(',')}]`);

                  unlinkFile(p)
                    .then(() => {

                      writeFile(p, data)
                        .then(() => {

                          next();

                        });

                    });

                });

              } else {

                next();

              }

            });

        }, () => {

          console.log('Asset Converter - Styles Finished');

          deferred.resolve(true);

        });

      });

    return deferred.promise;

  }

};
