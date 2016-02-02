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
                banner: "<%= meta.banner %>"
            },
            js: {
                src: ["src/nosform-jquery.js"],
                dest: "dist/nosform-jquery.js"
            },
            css: {
                src: ["src/nosform-jquery.css"],
                dest: "dist/nosform-jquery.css"
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
                'dist/nosform-jquery.min.css': ['dist/nosform-jquery.css']
            }
          }
        },

        // watch for changes to source
        watch: {
            options: {
              livereload: true,
              spawn: false  
            },
            files: ["src/*", "demo/*"],
            tasks: ["build-js"]
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

    grunt.registerTask("build", ["concat", "uglify", "cssmin"]);
    grunt.registerTask("build-js", ["jshint", "build"]);
    grunt.registerTask("default", ["build", "connect", "watch"]);
    grunt.registerTask("travis", ["build-js"]);

};
