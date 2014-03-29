module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
            options: {
            },
            dist: {
                src: [
                     'src/start.js',
                     'src/bubbles.js',
                     'src/end.js'
                     ],
                dest: 'nod.js'
            }
        },
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
};