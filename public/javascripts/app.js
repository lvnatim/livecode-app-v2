$(".button-new-mydoc").on('click', function(){
  $.get({
    url: '/api/documents/new',
    success: function(data){
      $('.block-editor').toggleClass("hidden");
      console.log(data)
      createDocumentRow(data);
      $.get({
        url: "/api/documents",
        data: {docId: data.doc.id},
        success: loadDocument
      });
    }
  })
});

$('.button-show-profile').on('click', function(){
  $('.block-profile').toggleClass('hidden');
  $.get({
    url: 'api/users/profile',
    success: loadProfile
  });
});

$('.button-browse-users').on('click', function(){
  $('.block-users').toggleClass('hidden');
});

$('.button-browse-documents').on('click', function(){
  $('.block-docs').toggleClass('hidden');
});

$('.logout').on('click', function(){
  $.get({
    url: 'api/users/logout',
    success: function(){window.location.href = '/'} 
  })
});

$("table").on('click', ".button-delete-document", function(){
  var $document = $(this).parent()
  var docId = $document.data("documentId")
  $.ajax({
    url: '/api/documents',
    method: 'delete',
    data: {docId: docId},
    success: function(){
      $document.remove();
    },
    error: function(){console.log("Couldn't delete document.")}
  });
});

$("table").on('click', '.button-load-document', function(){
  var docId = $(this).parent().data('documentId');
  $('.block-editor').toggleClass("hidden");
  $.get({
    url: "/api/documents",
    data: {docId: docId},
    success: loadDocument
  });
});

//load document from profile page
$("table").on('click', '.button-load-document-profile', function(){
  var docId = $(this).parent().data('document-id');
  console.log(docId)
  $(".block-document").animate({"right":"100%","left":"-100%"});
  $(".block-profile").animate({"top":"100%","bottom":"-100%"});
  $.get({
    url: "/api/documents",
    data: {docId: docId},
    success: loadDocument
  });
});

$(".close-block-document").on('click', function(){
  $('.block-editor').toggleClass("hidden");
  stopSocket();
});

$('.close-block-users').on('click', function(){
  $('.block-users').toggleClass('hidden');
});

$('.close-block-docs').on('click', function(){
  $('.block-docs').toggleClass('hidden');
});

$(".githublink").on('click', function(){
  var githubLink = $(".githublink");
  var originalText = githubLink.text();
  var fileName = $(".documentTitle").html();
  var content = editor.getValue(); 
  $.ajax({
    method: 'get',
    url: '/app/auth/github',
    data: {fileName: fileName, content: content},
    success: function(){
      githubLink.text('New Gist created! Click to create another');
      setTimeout(function(){
        githubLink.text(originalText);
      }, 5000);
    },
    error: function(){
      console.log('failed to do ajax request')
      githubLink.text('Something went wrong. Try again');
      setTimeout(function(){
        githubLink.text(originalText);
      }, 5000);
    }
  });
});

$("table").on("keypress", ".profileDocumentTitle", function(e){
  var thisDoc = $(this);
  var docId = thisDoc.parent().data("document-id");
  var newTitle = thisDoc.html();
  if(e.keyCode === 13){
    e.preventDefault();
    thisDoc.next().focus();
    $.ajax({
      method: 'POST',
      url: '/app/rename/',
      data: {
        docId: docId,
        newTitle: newTitle
      },
      success: function(data){
        console.log('Successfully posted');
        thisDoc.blur().next().focus();
        return false;
      }
    })
  }else{
    console.log("Nothing registered");
  }
});

function createDocumentRow(doc){
  $newRow = $('<tr>')
    .attr("data-document-id", doc.doc.id)
    .addClass("document");
  $('<td>').text(doc.user.username).appendTo($newRow);
  $('<td contenteditable="true">').text(doc.doc.name).appendTo($newRow).addClass('profileDocumentTitle');
  $('<td>').text(doc.doc.language).appendTo($newRow);
  $('<td>').text(doc.createdate).appendTo($newRow);
  $('<td>').text(doc.updateddate).appendTo($newRow);
  $('<td>').text("open")
    .addClass("button-load-document")
    .appendTo($newRow);
  $('<td>').text("delete")
    .addClass("button-delete-document")
    .appendTo($newRow);
  $newRow.appendTo($('.documents'));
}