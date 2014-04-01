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
                     'src/js/bubbles.js',
                     'src/js/graph.js',
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