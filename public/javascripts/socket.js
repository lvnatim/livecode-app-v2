var socket;
var onlylisten = true;

function startSocket(){
  socket = io.connect('http://localhost:3000');

  socket.emit('join');

  socket.on('START', function(data){
    onlylisten = false;
  });

  editor.on('change', function(e){
    if(onlylisten){
      return false;
    }
    socket.emit('edit', {event: e});
  });

  socket.on('EDIT', data=>{

    var action = data.action;
    var newText = data.lines.join("\n");
    var position = data.start;

    var startRow = data.start.row
    var startColumn = data.start.column
    var endRow = data.end.row
    var endColumn = data.end.column
    var removeRange = new Range(startRow,startColumn,endRow,endColumn);

    if(action==="insert"){
      onlylisten = true;
      editSession.insert(position, newText);
      onlylisten = false;
    } else if (action==="remove"){
      onlylisten = true;
      editSession.remove(removeRange);
      onlylisten = false;
    }
  });

  socket.on('CHAT', data=>{
    addChatComment(data);
  });



  // socket.on('SAVE', function(data){
  //   var content = editor.getValue();
  //   $.ajax({
  //     url: window.location.pathname,
  //     method: 'put',
  //     data: {content: content},
  //     success: function(){
  //     },
  //     error: function(){
  //     }
  //   });
  // });
}

function emitChatEvent(text){
  socket.emit('chat', text)
}


function stopSocket(){
  socket.disconnect();
}