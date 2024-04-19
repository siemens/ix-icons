/*
 * SPDX-FileCopyrightText: 2022 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const gulp = require('gulp');
const svgo = require('gulp-svgo');

gulp.task(
  'symbols',
  gulp.series(() =>
    gulp
      .src('./raw-svg/*.svg')
      .pipe(svgo())
      .pipe(gulp.dest('dist-css/svg'))
      .pipe(gulp.dest('svg'))
  )
);
