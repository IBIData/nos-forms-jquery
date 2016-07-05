module.exports = function(grunt) {

    grunt.initConfig({

        // Import package manifest
        pkg: grunt.file.readJSON("package.json"),

        // Banner definitions
        meta: {
            banner: "/*\n" +
                " *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
                " *  <%= pkg.description %>\n" +
                " *  <%= pkg.homepage %>\n" +
                " *\n" +
                " *  Made by <%= pkg.author.name %>\n" +
                " *  Under <%= pkg.license %> License\n" +
                " */\n"
        },

        // Concat js
        concat: {
            options: {
                banner: "<%= meta.banner %>",
                sourceMap: true
            },
            js: {
                src: ["src/nosform-jquery.js"],
                dest: "dist/nosform-jquery.js"
            }
        },

        // Lint js
        jshint: {
            files: ["src/nosform-jquery.js"],
            options: {
                jshintrc: ".jshintrc"
            }
        },

        // Minify js
        uglify: {
            my_target: {
                src: ["dist/nosform-jquery.js"],
                dest: "dist/nosform-jquery.min.js"
            },
            options: {
                banner: "<%= meta.banner %>"
            }
        },

        // Minify CSS
        cssmin: {
            options: {
                banner: "<%= meta.banner %>"
            },
            combine: {
            files: {
                'dist/nosform-jquery.min.css': ['src/nosform-jquery.css']
            }
          }
        },

        // watch for changes to source
        watch: {
            options: {
              livereload: true,
              spawn: false
            },
            js: {
                files: ['src/*.js'],
                tasks: ['build-js']
            },
            css: {
                files: ['src/*.css'],
                tasks: ['build-css']
            },
            html: {
                files: ['demo/**'],
                tasks: ['build']
            }
        },

        // server
        connect: {
            server: {
                options: {
                    port: 3000,
                    base: ["demo", "src"]
                }
            }
        }

    });

    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-cssmin");

    grunt.registerTask("build", ['jshint', 'concat', 'uglify', 'cssmin']);
    grunt.registerTask('build-js', ['jshint', 'concat', 'uglify']);
    grunt.registerTask('build-css', ['cssmin']);
    grunt.registerTask("default", ["build", "connect", "watch"]);
    grunt.registerTask("travis", ["build-js"]);

};
