/**
 * @class
 * @author    {%= author_name %}
 * @version   {%= version %}
 * @copyright {%= grunt.template.today('yyyy') %} {%= author_name %} Licensed under the {%= licenses.join(', ') %} license{%= licenses.length === 1 ? '' : 's' %}.
 * @ignore
 */

{%= namespace %}.{%= class_name %} = function(){this.init.apply(this, arguments);};
{%= namespace %}.{%= class_name %}.prototype = {
    /**
     * @constructs
     */
    init : function(){
        // do something...
    }
};
