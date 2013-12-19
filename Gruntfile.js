module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    markdown: {
        all: {
            files: [
                {
                    expand: true,
                    cwd:'static/md/',
                    src: '*.md',
                    dest: 'static/doc/',
                    ext: '.html'
                }
            ],
            options: {
                template: 'template/doc.jst',
                preCompile: function(src, context) {},
                postCompile: function(src, context) {},
                templateContext: {title:"<%= basename %>"},
                highlight: 'manual',
                markdownOptions: {
                    gfm: true,                  
                    codeLines: {
                        before: '<span>',
                        after: '</span>'
                    }
                }
            }/**/
        }
    }
  });

  // 加载包含 "grunt-markdown" 任务的插件。
  grunt.loadNpmTasks('grunt-markdown');

  grunt.registerTask('default',['markdown']);
};