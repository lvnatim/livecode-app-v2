$(".button-new-document").on('click', function(){
  $.get({
    url: '/api/documents/new',
    success: function(data){
      createDocumentRow(data)
    }
  })
});

$('.button-show-profile').on('click', function(){
  $('.block-profile').toggleClass('hidden');
});

$('.button-browse-users').on('click', function(){
  $('.block-users').toggleClass('hidden');
});

$('.button-browse-documents').on('click', function(){
  $('.block-docs').toggleClass('hidden');
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
  $(".block-document").animate({"right":"100%","left":"-100%"});
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
  $(".block-document").animate({"right":"0%","left":"0%"})
  stopSocket();
});

$('.close-block-users').on('click', function(){
  $('.block-users').toggleClass('hidden');
});

$('.close-block-docs').on('click', function(){
  $('.block-docs').toggleClass('hidden');
})

function createDocumentRow(doc){
  $newRow = $('<tr>')
    .attr("data-document-id", doc.id)
    .addClass("document");
  $('<td>').text("tempname").appendTo($newRow);
  $('<td>').text(doc.name).appendTo($newRow);
  $('<td>').text(doc.language).appendTo($newRow);
  $('<td>').text(doc.createdAt).appendTo($newRow);
  $('<td>').text(doc.updatedAt).appendTo($newRow);
  $('<td>').text("open")
    .addClass("button-load-document")
    .appendTo($newRow);
  $('<td>').text("delete")
    .addClass("button-delete-document")
    .appendTo($newRow);
  $newRow.appendTo($('.documents'));
}