let output = ""

$("#chat").hide()

$("#make").on("click", ()=>{
  let name = $("#name").val()
  let background = $("#background").val()
  let description = $("#description").val()
  let info = $("#info").val()
  let infoArry = info.split(',')
  let output = {name: name, background:background, description:description, info: infoArry}
  if (info && name && background && description){
    $.ajax({
      method:"POST",
      url: "/create",
      data: JSON.stringify(output),
      contentType: "application/json",
      success: data=>{
        console.log(data)
        $("#make-char").hide()
        $("#chat").show()
      },
      error: (err)=>{
        console.log(err)
      }
    })
  }else{
    $("#warning").text("Please Fill Out All Fields")
  }

})



$("#submit").on("click",()=>{

  let inputValue = $("#input").val();
  output += `Knight: ${inputValue}\n`
  $("#output").text(output)
  $("#input").val("");
  $.ajax({
    method:"POST",
    url: "/data",
    data: JSON.stringify({message: inputValue}),
    contentType: "application/json",
    success: data=>{

      output += `Squire: ${data}\n`

      $("#output").text(output)
    },
    error: (err)=>{
      $("#output").text(err)
    }
  })
})
