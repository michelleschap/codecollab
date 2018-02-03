
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/pastel_on_dark");
  editor.getSession().setMode("ace/mode/java");
  editor.resize();

  editor.getSession().on('change', function(e) {
    // e.type, etc
    editor.setTheme("ace/theme/monokai");
});
