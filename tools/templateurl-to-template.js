'use strict';

/**
 * @class AlterAngularTemplates
 * Converts template urls to the actual template inside an angular transpiled
 * component; this is useful when we don't want to lazy-load them.
 */

const q = require('q');
const globby = require('globby');
const async = require('async');
const path = require('path');
const fs = require('fs');
const promisify = require('promisify-node');
const pug = require('pug');

const readFile = promisify(fs.readFile);
const unlinkFile = promisify(fs.unlink);
const writeFile = promisify(fs.writeFile);

const templateNeedleBegin = 'templateUrl\': \'';
const templateNeedleEnd = '\'';
const templateReplacementRegex = /('templateUrl':\s'[aA\--zZ.]+')/g;

const UTF = 'utf8';

module.exports = exports = class AlterAngularTemplates {

  run () {

    let root = process.cwd(),

      deferred = q.defer();

    globby([
      `${root}/core/src/scripts/**/*.js`
    ])
      .then((paths) => {

        async.each(paths, (p, next) => {

          readFile(p, UTF)
            .then((data) => {

              let startNeedleIndex = data.indexOf(templateNeedleBegin),

                endNeedleIndex =  data.indexOf(templateNeedleEnd, startNeedleIndex + templateNeedleBegin.length);

              if (startNeedleIndex !== -1) {

                let relativeSourcePath = data.substr(
                  startNeedleIndex + templateNeedleBegin.length,
                  endNeedleIndex - startNeedleIndex - templateNeedleBegin.length
                ),

                  resolvedPath = path.resolve(path.dirname(p).replace('core/', ''), relativeSourcePath);

                readFile(resolvedPath, UTF)
                  .then((content) => {

                    let template = pug.compile(content)();

                    data = data.replace(templateReplacementRegex, `'template': \`${template}\``);

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

          console.log('Asset Converter - Templates Finished');

          deferred.resolve(true);

        });

      });

    return deferred.promise;

  }

};
