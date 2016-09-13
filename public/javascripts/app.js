$(".button-new-document").on('click', function(){
  $.get({
    url: '/api/documents/new',
    success: function(data){
      createDocumentRow(data)
    }
  })
});

$('.button-show-profile').on('click', function(){
  $('.block-profile').animate({"top":"0", "bottom":"0"});
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

$(".close-block-document").on('click', function(){
  $(".block-document").animate({"right":"0%","left":"0%"})
  stopSocket();
});

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