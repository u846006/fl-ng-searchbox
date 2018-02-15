'use strict';

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

let pkg = require('./package.json'),

  external = Object.keys(pkg.dependencies || {});

export default {

  'input': 'core/index.js',

  'output': {

    'file': 'core/bundles/searchbox.umd.js',

    'format': 'umd'

  },

  'plugins': [

    resolve(),
    commonjs()

  ],

  'external': [

    '@angular/core',
    '@angular/forms',
    '@angular/common',
    'rxjs/operator/add/*',
    'rxjs/Subject',
    'rxjs/Observable',
    'rxjs/observable/fromEvent',
    'rxjs/ReplaySubject',
    'rxjs/BehaviorSubject',
    'rxjs/Subscription',
    'rxjs/add/observable/of',
    'rxjs/add/operator/catch',
    'rxjs/add/operator/do',
    'rxjs/add/operator/map',
    'rxjs/add/operator/merge',
    'rxjs/add/operator/share',
    'rxjs/add/operator/startWith',
    'rxjs/add/operator/debounceTime',
    'rxjs/add/operator/distinctUntilChanged',
    'rxjs/add/operator/first',
    'rxjs/add/operator/take',
    'rxjs/add/operator/filter',
    'rxjs/add/operator/merge',
    'rxjs/add/operator/switchMap',
    'rxjs/add/operator/mergeMap',
    'rxjs/add/operator/flatMap',
    'rxjs/add/operator/takeLast',
    'rxjs/Subscription',
    'rxjs/operators/map',
    'rxjs/util/pipe',
    'rxjs/add/operator/let',
    '@fortawesome/fontawesome',
    '@fortawesome/fontawesome-free-brands',
    '@fortawesome/fontawesome-free-regular',
    '@fortawesome/fontawesome-free-solid',
    'lodash'

  ],

  'sourceMap': false,

  'name': 'ngSearchbox',

  onwarn: (warning) => {

    const skip_codes = [
      'THIS_IS_UNDEFINED',
      'MISSING_GLOBAL_NAME'
    ];

    if (skip_codes.indexOf(warning.code) !== -1) {

      return;

    }

    return warning;

  }

}
