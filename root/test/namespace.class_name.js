QUnit.test( "Number Test", function() {
    //given
    //when
    //then
    ok( 1 == "1", "Passed!" );
});

QUnit.test( "Element Test", function() {
    //given
    window.__html__ = window.__html__ || {};
    document.body.innerHTML = __html__['test/{%= namespace %}.{%= class_name %}.html'];

    //when
    var data = $('#{%= class_name %}').data('value');

    //then
    ok( 1 == data, "Passed!" );
});