'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: ['build']
    },

    copy: {
      build: {
        files: [{
          expand: true,
          cwd: 'src',
          src: [
            'fonts/**',
            'img/**',
            '*.html'
          ],
          dest: 'build'
        }]
      }
    },

    csscomb: {
      style: {
        expand: true,
        src: ['src/sass/**/*.scss']
      }
    },

    sass: {
      style: {
        files: {
          'build/css/style.css': ['src/sass/style.scss']
        }
      }
    },

    postcss: {
      options: {
        processors: [
          require('autoprefixer')({browsers: 'last 2 versions'})
        ]
      },
      style: {
        src: 'build/css/style.css'
      }
    },

    cmq: {
      style: {
        files: {
          'build/css/style.css': ['build/css/style.css']
        }
      }
    },

    cssmin: {
      style: {
        options: {
          keepSpecialComments: 0
        },
        files: {
          'build/css/style.min.css': ['build/css/style.css']
        }
      }
    },

    imagemin: {
      images: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          src: ['build/img/**/*.{png,jpg,gif,svg}']
        }]
      }
    },

    htmlmin: {
      options: {
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        caseSensitive: true,
        keepClosingSlash: false
      },
      html: {
        files: {
          'build/index.min.html': 'build/index.html',
          'build/form.min.html': 'build/form.html',
          'build/blog.min.html': 'build/blog.html',
          'build/post.min.html': 'build/post.html'
        }
      }
    },

    concat: {
      start: {
        src: [
          'src/js/script.js',
          'src/js/components/map.js',
          'src/js/components/moment-with-locales.js',
          'src/js/components/mustache.min.js',
          'src/js/components/pikaday.js',
          'src/js/components/form.js'
        ],
        dest: 'build/js/script.js'
      }
    },

    uglify: {
      start: {
        files: {
          'build/js/script.min.js': ['build/js/script.js']
        }
      }
    },

    watch: {
      style: {
        files: ['src/sass/**/*.scss'],
        tasks: ['sass', 'postcss', 'cmq', 'cssmin'],
        options: {
          spawn: false,
          livereload: true
        },
      },
      scripts: {
        files: ['src/js/**/*.js'],
        tasks: ['concat', 'uglify', 'copy'],
        options: {
          spawn: false,
          livereload: true
        },
      },
      images: {
        files: ['src/img/**/*.{png,jpg,gif,svg}'],
        tasks: ['imagemin', 'copy'],
        options: {
          spawn: false,
          livereload: true
        },
      },
      html: {
        files: ['src/*.html'],
        tasks: ['copy'],
        options: {
          spawn: false,
          livereload: true
        },
      },
    },

    browserSync: {
      dev: {
        bsFiles: {
          src : [
            'build/css/*.css',
            'build/js/*.js',
            'build/img/*.{png,jpg,gif,svg}',
            'build/*.html'
          ]
        },
        options: {
          watchTask: true,
          server: {
            baseDir: "build/"
          },
          startPath: "/index.html",
          ghostMode: {
            clicks: true,
            forms: true,
            scroll: false
          }
        }
      }
    }
  });

  grunt.registerTask('default', [
    'browserSync',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean',
    'copy',
    'sass',
    //'csscomb',
    'postcss',
    'cmq',
    'cssmin',
    'concat',
    'uglify',
    'imagemin',
    'htmlmin'
  ]);

  var config = require('./.gosha')(grunt, config);

};
