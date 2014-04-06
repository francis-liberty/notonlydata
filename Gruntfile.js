module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
            options: {
            },
            dist: {
                src: [
                     'src/js/start.js',
                     'src/js/core.js',
                     'src/js/utils/*.js',
                     'src/js/scatter.js',
                     'src/js/bubbles.js',
                     'src/js/line.js',
                     'src/js/graph.js',
                     'src/js/pie.js',
                     'src/js/bundle.js',
                     'src/js/widgets/*.js',
                     'src/js/end.js'
                     ],
                dest: 'nod.js'
            }
        },
    sass: {
          dist: {
            files: {
              'nod.css': 'src/scss/nod.scss'
            }
          }
        }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
};