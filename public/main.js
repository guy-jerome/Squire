
$("#submit").on("click",()=>{

  let inputValue = $("#input").val();
  $("#input").val("");
  $.ajax({
    method:"POST",
    url: "/data",
    data: JSON.stringify({message: inputValue}),
    contentType: "application/json",
    success: data=>{
      let output = ""
      for (message of data){
        output += `${message.role}: ${message.content}\n`
      }
      $("#output").text(output)
    },
    error: (err)=>{
      $("#output").text(err)
    }
  })
})
