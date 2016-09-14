$('.close-block-profile').on('click', function(){
  $('.block-profile').toggleClass('hidden');
});

function createProfileDocumentRow(doc){
  $newRow = $('<tr>')
    .attr("data-document-id", doc.id)
    .addClass("document");
  $('<td>').text("tempname").appendTo($newRow);
  $('<td>').text(doc.name).appendTo($newRow);
  $('<td>').text(doc.language).appendTo($newRow);
  $('<td>').text(doc.updatedAt).appendTo($newRow);
  $('<td>').text("open")
    .addClass("button-load-document")
    .appendTo($newRow);
  $newRow.appendTo($('.profile-documents'));
}

function loadProfile(user){
  $('.profile-documents').empty();
  var documents= user.Documents;
  var profile= user.Profile;
  $('.profile-fullname').text(user.firstName + " " + user.lastName);
  $('.profile-username').text(user.username);
  $('.profile-email').text(user.email);
  documents.forEach(doc=>{
    createProfileDocumentRow(doc);
  });
}