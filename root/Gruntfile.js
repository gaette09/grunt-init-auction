/**
 * Created by jihwan on 15. 4. 27..
 */
module.exports = function(grunt) {
    // Project configuration.
    var spriteConfig = require('./sprite.config.js');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //스트릿 이미지를 만든다.
        //1x : 비 레티나용
        //2x : 레티나용
        sprite: {
            '1x': spriteConfig('sprite'),
            '2x': spriteConfig('sprite2x')
        },
        //이미지를 압축한다.
        imagemin: {
            dist: {
                options: {
                    title: '이미지 압축 완료',  // optional
                    optimizationLevel: 3
                },
                files: [{
                    expand: true,
                    cwd: 'dev/images',
                    src: ['dev/images/*.{png,jpg,gif}', '!sprite/*.{png,jpg,gif}', '!sprite2x/*.{png,jpg,gif}'],
                    dest: 'build/images'
                }]
            }
        },
        concat: {
            sprites: {
                files: {
                    'src/sass/core/_sprites.scss': ['src/sass/sprites/*.scss']
                }
            }
        },
        //sass 문법 검사.
        scsslint: {
            allFiles: [
                'dev/sass/**/*.scss'
            ],
            options: {
                config: '.scss-lint.yml',
                reporterOutput: false,
                colorizeOutput: true
            }
        },
        sass: {
            dev: {
                options: {
                    style: 'expanded',
                    sourcemap: 'file',
                    noCache: true,
                    'default-encoding': 'UTF-8'
                },
                files: {
                    'dev/sass/{%= namespace %}.css': 'dev/sass/{%= namespace %}.scss'
                }
            },
            min: {
                options: {
                    style: 'compressed',
                    sourcemap: 'none',
                    noCache: true,
                    'default-encoding': 'UTF-8'
                },
                files: {
                    'build/images/{%= namespace %}.min.css': 'dev/sass/{%= namespace %}.scss'
                }
            }
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            dist: {
                options: {
                    import: 2
                },
                src: ['dev/sass/**/*.css']
            }
        },
        autoprefixer: {
            dev: {
                options: {
                    map: {inline: false},
                    browsers: [
                        'last 2 versions',
                        'ie 8',
                        'ie 9',
                        'Android 2.3',
                        'Android >= 4',
                        'Chrome >= 20',
                        'Firefox >= 24', // Firefox 24 is the latest ESR
                        'Explorer >= 8',
                        'iOS >= 6',
                        'Opera >= 12',
                        'Safari >= 6'
                    ]
                },
                src: 'dev/sass/{%= namespace %}.css',
                dest: 'dev/sass/{%= namespace %}.css'
            },
            min: {
                options: {
                    browsers: [
                        'last 2 versions',
                        'ie 8',
                        'ie 9',
                        'Android 2.3',
                        'Android >= 4',
                        'Chrome >= 20',
                        'Firefox >= 24', // Firefox 24 is the latest ESR
                        'Explorer >= 8',
                        'iOS >= 6',
                        'Opera >= 12',
                        'Safari >= 6'
                    ]
                },
                src: 'dev/sass/{%= namespace %}.css',
                dest: 'build/images/{%= namespace %}.min.css'
            }
        },
        includereplace: {
            dist: {
                files: [
                    {src: '*.html', dest: 'build/iframes', expand: true, cwd: 'dev/iframes'}
                ]
            }
        },
        htmlhint: {
            dist: {
                options: {
                    htmlhintrc: '.htmlhintrc'
                },
                src: ['dev/**/*.html']
            }
        },
        watch: {
            html: {
                files: 'dev/ifrmaes/**/*.html',
                tasks: 'includereplace',
                options: {
                    spawn: false
                }
            },
            scss: {
                files: 'dev/sass/**/*.scss',
                tasks: ['sass:dev', 'autoprefixer:dev'],
                options: {
                    spawn: false
                }
            }
        },
        jsdoc : {
            dist : {
                src : ['README.md', 'dev/js/**/*.js'],
                options: {
                    destination: 'docs',
                    encoding : 'utf-8',
                    recurse : true,
                    private : true
                }
            }
        },
        uglify : {
            my_target : {
                files : {
                    'build/images/{%= namespace %}.{%= class_name %}.min.js' : [
                        'build/images/{%= namespace %}.{%= class_name %}.js'
                    ]
                }
            }
        },
        copy: {
            files: [
                // 이미지
                {
                    expand: true,
                    cwd: 'dev/images/',
                    src: ['**', '!sprite/*.{png,jpg,gif}', '!sprite2x/*.{png,jpg,gif}'],
                    dest: 'build/images/'
                },
                // html
                {
                    expand: true,
                    cwd: 'dev/',
                    src: ['*.html'],
                    dest: 'build/'

                }
            ]
        }
    });
    require('jit-grunt')(grunt, {
        sass : 'grunt-sass',
        sprite: 'grunt-spritesmith',
        scsslint: 'grunt-scss-lint',
        includereplace: 'grunt-include-replace'
    });

    // Develop task(s).
    grunt.registerTask('dev', ['sprite', 'concat', 'scsslint', 'sass:dev', 'csslint', 'autoprefixer:dev', 'htmlhint']);

    // Build task(s).
    grunt.registerTask('build', ['newer:imagemin', 'concat', 'sass:min', 'autoprefixer:min', 'includereplace','copy']);

    // Default task(s).
    grunt.registerTask('default', ['dev', 'build', 'uglify', 'jsdoc']);

};

