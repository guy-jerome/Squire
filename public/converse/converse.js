let output = ""

$.ajax({
  method:"POST",
  url: "/data",
  data: JSON.stringify({message: "Good day my squire"}),
  contentType: "application/json",
  success: data=>{

    output += `Squire ${data.name}: ${data.message}\n`
    $("#squire").text(data.name)
    $("#output").text(output)
  },
  error: (err)=>{
    $("#output").text(err)
  }
})





$("#submit").on("click",()=>{

  let inputValue = $("#input").val();
  output += `Knight: ${inputValue}`
  $("#output").text(output)
  $("#input").val("");
  $.ajax({
    method:"POST",
    url: "/data",
    data: JSON.stringify({message: inputValue}),
    contentType: "application/json",
    success: data=>{

      output += `Squire ${data.name}: ${data.message}`
      $("#squire").text(data.name)
      $("#output").text(output)
    },
    error: (err)=>{
      $("#output").text(err)
    }
  })
})

$("#back").on("click", ()=>{
  window.location.href = "/index/index.html";
});
