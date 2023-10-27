//CREATES A NEW SQUIRE
$("#make").on("click", ()=>{
  //PARSE THE INFO
  let name = $("#name").val()
  let background = $("#background").val()
  let description = $("#description").val()
  let info = $("#info").val()
  let infoArry = info.split(';')
  let output = {name: name, background:background, description:description, info: infoArry}
  //POST REQUEST
  if (info && name && background && description){
    $.ajax({
      method:"POST",
      url: "/create",
      data: JSON.stringify(output),
      contentType: "application/json",
      success: data=>{
        window.location.href = "/converse/converse.html"
        console.log(data)
      },
      error: (err)=>{
        console.log(err)
      }
    })
  }else{
    //MAKE SURE TO FILL OUT ALL FIELD
    $("#warning").text("Please Fill Out All Fields")
  }
//BACK BUTTON
})
$("#back").on("click", ()=>{
  window.location.href = "/index/index.html";
});