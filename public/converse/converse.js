let output = ""

// POST REQUEST FOR FIRST REQUEST
$.ajax({
  method:"POST",
  url: "/data",
  data: JSON.stringify({message: "Good day my squire"}),
  contentType: "application/json",
  success: data=>{

    output += `Squire ${data.name}: ${data.message}\n\n`
    $("#squire").text(data.name)
    $("#output").text(output)
  },
  error: (err)=>{
    $("#output").text(err)
  }
})

// THIS IS THE MAIN POST REQUEST TO GET SQUIRE MESSAGE
function processInput() {
  let inputValue = $("#input").val();
  output += `Knight: ${inputValue}\n\n`;
  $("#output").text(output);
  $("#input").val("");
  $.ajax({
    method: "POST",
    url: "/data",
    data: JSON.stringify({ message: inputValue }),
    contentType: "application/json",
    success: function(data) {
      output += `Squire ${data.name}: ${data.message}\n\n`;
      $("#squire").text(data.name);
      $("#output").text(output);
    },
    error: function(err) {
      $("#output").text(err);
    }
  });
}

//CALL THE POST REQUEST FOR ENTER BUTTON
$("#input").on("keypress", function(event) {
  if (event.which === 13) {
    event.preventDefault();
    processInput();
  }
});
//CALL THE POST REQUEST FOR CLICK PRESS
$("#submit").on("click", function() {
  processInput();
});

//GO BACK TO THE MAIN PAGE
$("#back").on("click", ()=>{
  window.location.href = "/index/index.html";
});
