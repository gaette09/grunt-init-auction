/**
 * Created by jihwan on 15. 4. 27..
 *
 * grunt-init-auction
 * https://gruntjs.com/
 *
 * Copyright (c) 2015 "Auction Template" jihwan, contributors
 * Licensed under the MIT license.
 */


'use strict';

// 필요한 Node 모듈들을 불러온다.
var http = require('http'),
    join = require("path").join,
    fs   = require('fs');

// 프로젝트 설명 글.
exports.description = '옥션 프로모션 템플릿.';

// 프롬프트 입력이 시작되기 전에 출력될 글.
exports.notes = '옥션 프로모션 작업의 기본적인 구조를 생성합니다.';

// 템플릿 생성 완료 후 출력될 글.
exports.after = '';

// 아래 와일드 카드와 일치하는 파일 또는 디렉토리가 존재하면 경고 발생.
exports.warnOn = '*';

// 템플릿 초기화.
exports.template = function(grunt, init, done) {

    var requestCount  = 0,
        responseCount = 0;

    // 전달인자로 전달된 url로 get 요청하고 결과를 지정된 path에 저장한다.
    // requestLibraryFile을 사용하는 곳에서 requestCount를 + 1 해주고
    // 여기에서 responseCount와 비교하여 요청이 모두 완료됬을때 done 함수를
    // 호출한다.
    function requestLibraryFile(url, filename, done){
        var fullpath = join(init.destpath() + '/vendor/', filename),
            file     = fs.createWriteStream(fullpath);

        http.get(url, function(res) {
            res.on('data', function(chunk){ file.write(chunk); })
                .on('end',  function(){
                    grunt.log.writeln('Download '+filename+'...' + 'OK'.cyan);
                    file.end();

                    responseCount++;
                    if(requestCount === responseCount){
                        done();
                    }
                });
        });
    }

    // 라이브러리 사용을 묻는 프롬프트 옵션 객체를 생성한다.
    function createLibraryPrompt(name, version){
        return {
            name      : name,
            message   : name + '를 사용합니까?',
            validator : /(^[0-9]+.[0-9]+.[0-9]$|^n[o]?$)/,
            warning   : '버전명이 올바르지 않습니다. \n' +
            '사용하지 않으려면 no를 입력하세요.',
            default   : version
        };
    }

    // 디렉토리를 생성한다. root 파일 안의 디렉토리가 파일을 가지고
    // 있지 않으면 복사되지 않으므로 파일이 없는 디렉토리는 강제로
    // 생성해야한다.
    function makeEmptyDirectory(dirpaths){
        var i, n;

        for(i = 0, n = dirpaths.length; i< n; i++){
            grunt.file.mkdir(join(init.destpath(), dirpaths[i]));
            grunt.log.writeln('Writing '+dirpaths[i]+'...' + 'OK'.cyan);
        }
    }

    // 사용자가 입력한 버전명을 기준으로 파일 명과 다운로드 주소를
    // 만들어 반환한다. 만약 사용자가 no를 입력했다면 값은 false
    // 로 셋팅된다.
    function getLibraryUrlList(props){
        var libraryList  = {},
            use          = /^n[o]?$/,
            jquery       = props.jquery,
            underscore   = props.underscore,
            qunit        = props.qunit;

        libraryList['jquery-'+jquery+'.js']     = !use.test(jquery)? 'http://code.jquery.com/'+'jquery-'+jquery+'.js'     : false;
        libraryList['jquery-'+jquery+'.min.js'] = !use.test(jquery)? 'http://code.jquery.com/'+'jquery-'+jquery+'.min.js' : false;
        libraryList['qunit-'+qunit+'.js']       = !use.test(qunit)? 'http://code.jquery.com/qunit/qunit-'+qunit+'.js'     : false;
        libraryList['qunit-'+qunit+'.css']      = !use.test(qunit)? 'http://code.jquery.com/qunit/qunit-'+qunit+'.css'    : false;
        libraryList['underscore-'+underscore+'.js']     = !use.test(underscore)? 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/'+underscore+'/underscore.js'     : false;
        libraryList['underscore-'+underscore+'.min.js'] = !use.test(underscore)? 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/'+underscore+'/underscore-min.js' : false;

        return {list : libraryList, count : 7};
    }

    // Run grunt-init process
    init.process({}, [
        init.prompt('name',        'AuctionCode'),
        init.prompt('namespace',   'PromotionName'),
        init.prompt('description', '옥션 탬플릿'),
        init.prompt('version',     '0.0.1'),
        init.prompt('author_name'),
        init.prompt('author_email'),
        init.prompt('licenses',    'MIT'),
        createLibraryPrompt('jquery',     '1.11.0'),
        createLibraryPrompt('underscore', '1.6.0'),
        createLibraryPrompt('qunit',      '1.14.0')
    ], function(err, props) {

        var files    = null,
            librarys = null,
            filename = '';

        // 파일을 가지고 있지 않은 디렉토리를 강제로 생성한다.
        makeEmptyDirectory([
            'build',
            'build/images',
            'build/iframes',
            'dev',
            'dev/js',
            'dev/sass',
            'dev/sass/core',
            'dev/sass/module',
            'dev/sass/sprite',
            'dev/images',
            'dev/images/sprite',
            'dev/images/sprite2x',
            'dev/iframes',
            'dev/iframes/include',
            'vendor',
            'docs'
        ]);

        // name의 앞글자만 대문자로 한 클래스 명을 만든다.
        props.class_name = props.name.charAt(0).toUpperCase() + props.name.slice(1);

        // 다운로드가 필요한 라이브러리의 url 목록을 가져온다.
        props.librarys = getLibraryUrlList(props);

        // 파일을 복사한다. (and process).
        files = init.filesToCopy(props);

        // 라이센스 파일을 추가한다.
        init.addLicenseFiles(files, props.licenses);

        // 실제로 파일을 복사한다.
        init.copyAndProcess(files, props);

        // 다운로드가 필요한 라이브러리를 웹에 요청한다.
        for(filename in props.librarys.list){
            if(props.librarys.list.hasOwnProperty(filename) &&
                props.librarys.list[filename]){
                requestCount++;
                requestLibraryFile(props.librarys.list[filename], filename, done);
            }
        }
    });
};