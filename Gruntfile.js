module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['public/lib/*.js', 'public/*.js'],
        dest: 'public/dist/build.js',
      },
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'nyan',
          timeout: 8000,
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      myTarget: {
        files: {
          'public/dist/output.min.js': ['public/dist/build.js']
        }
      }
    },

    eslint: {
      target: [
        'public/client/*.js', 'lib/*.js', 'app/**/*.js', 'server-config.js'
      ]
    },

    cssmin: {
      target: {
        files: {
          'public/dist/output.min.css': ['public/style.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'env:prod',
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: 'git push live master'
      }
    },

    env: {
      dev: {
        NODE_STATE: 'development'
      },
      prod: {
        NODE_STATE: 'production'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-env');
  // grunt.loadNpmTasks('grunt-contrib-clean');


  grunt.registerTask('server-dev', function (target) {
    grunt.task.run(['env:dev', 'nodemon', 'watch']);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', ['test', 'eslint', 'concat', 'uglify', 'cssmin'
  ]);

  grunt.registerTask('upload', function (n) {
    if (grunt.option('prod')) {
      grunt.task.run(['env:prod', 'build']);
    } else {
      grunt.task.run(['server-dev']);
    }
  });

  grunt.registerTask('deploy', (n) => {
    if (grunt.option('prod')) {
      grunt.task.run(['env:prod', 'build']);
    } else {
      grunt.task.run(['server-dev']);
    }
  });


};