var editor = ace.edit("editor");
var editSession = editor.getSession();
var Range = ace.require('ace/range').Range;

editor.setTheme('ace/theme/terminal');
editSession.setMode('ace/mode/javascript');
editor.$blockScrolling = Infinity;

$('.button-open-editor').on('click', function(){
  $('.editors').toggleClass('hidden');
});

$(".documentTitle").on("keypress", function(e){
  var thisDoc = $(this);
  var newTitle = thisDoc.html();
  if(e.keyCode === 13){
    e.preventDefault();
    $.ajax({
      method: 'PUT',
      url: '/api/documents/',
      data: {
        name: newTitle
      },
      success: function(){
        console.log('Successfully posted');
      }
    })
  }
});

$('.button-save-document').on('click', function(){
  var content = editor.getValue().toString();
  $.ajax({
    url: '/api/documents',
    method: 'put',
    data: {content: content},
    success: function(){console.log("success!")}
  });
});

$('.chat-input').on('keypress', function(e){
  var commentText = $(this).val();
  if(e.keyCode === 13){
    emitChatEvent(commentText);
    $(this).val('')
  }
});

$('.language-select').on("change", function(){
  var lang = $(this).val();
  $.ajax({
    url: '/api/documents',
    method: 'put',
    data: {language: lang},
    success: console.log
  })
  setDocumentLanguage(lang);
});

function addChatComment(data){
  var $chatCommentNode = $('<div>').addClass('chat-comment')
  $chatCommentNode
    .text(data.username + ": " + data.text)
    .appendTo($('.chat-comments'))
  $(this).val('');
}

function addUserNode(user){
  var $userNode = $('<li>');
  var $editorList = $('.editorList');
  $userNode
    .addClass("editor")
    .text(user.firstName + " " + user.lastName + " " + "(" + user.username + ")")
  $('<a>')
    .addClass("removeEditor")
    .attr("data-user-id", user.id)
    .text("X")
    .appendTo($userNode);  

  $userNode.appendTo($editorList);
}

function loadUsers(doc){
  $('.editorList').empty();
  var users = doc.Users;
  users.forEach(user=>{
    addUserNode(user);
  });
}

function loadDocument(doc){
  $('.chat-comments').empty();
  editor.setValue(doc.content);
  loadDocumentMeta(doc);
  loadUsers(doc);
  startSocket();
}

function loadDocumentMeta(doc){
  $('.documentTitle').text(doc.name);
  $('.documentOwner').text(doc.Owner.username);
  $('.language-select').val(doc.language);
  $('.documentCreatedAt').text(doc.createdAt);
  $('.documentUpdatedAt').text(doc.updatedAt);
}

function setDocumentLanguage(lang){
  var filePath = 'ace/mode/' + lang;
  editSession.setMode(filePath);
}