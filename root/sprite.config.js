module.exports = function(target) {
    var timestamp = new Date().getDate();
    var distFileName = target+'-'+timestamp;

    return {
        cssFormat: 'scss',
        cssVarMap: function(sprite) {
            var name = target.replace('@', '');
            sprite.name = target+'-' + sprite.name;
        },
        imgPath: 'dev/images/'+distFileName+'.png',
        cssTemplate: 'dev/sass/sprite/_'+target+'.scss.mustache',
        src: 'dev/images/'+target+'/*.png',
        dest: 'dev/images/'+distFileName+'.png',
        destCss: 'dev/sass/sprite/_'+target+'.scss'
    };
}
