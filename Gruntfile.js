module.exports = function(grunt) {

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
              src:[
                  'js/libs/jquery-2.1.1.min.js','js/libs/*.js','js/src/*.js'
                  ],
              dest: 'js/build/app.js',
            }
        },

        uglify: {
            my_target: {
                files: {
                  'js/build/app.min.js': ['js/build/app.js']
                }
            }
        },

        less: {
          development: {
            options: {
              paths: ["src/less"]
            },
            files: {
              "css/styles.css": "src/less/styles.less"
            }
          },
          production: {
            options: {
              paths: ["src/less"],
              cleancss: true
            },
            files: {
              "css/styles.css": "src/less/styles.less"
            }
          }
        },

        autoprefixer: {
            dist: {
                files: {
                    'css/styles.css': 'css/styles.css'
                }
            }
        },

        cssmin: {
          combine: {
            files: {
              'css/build/allstyles.css': ['css/normalize.css','css/*.css','css/!*.min.css']
            }
          }
        },

        /*smoosher: {
          dist: {
            files: {
              '2014.tumblr': '2014.html',
            },
          },
        },*/

        watch: {
          scripts: {
            files: ['js/*.js','/js/libs/*.js','js/src/*.js'],
            tasks: ['concat', 'uglify'],
            options: {
              spawn: false,
              livereload: true,
            },
          },
          less: {
            files: ['src/less/*.less'],
            tasks: ['less','autoprefixer','cssmin'],
            options: {
              spawn: false,
              livereload: true,
            },
          },
        },

    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    require('./tasks/lib/notify');
    require('load-grunt-tasks')(grunt);

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['watch']);

};
