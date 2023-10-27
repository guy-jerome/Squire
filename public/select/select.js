//SELECT EACH OF THE SQUIRES AND SHOW THEM ON 
$(document).ready(function () {
  // Make a GET request to retrieve all squires
  $.get('/get-all-squires', function (squires) {
    // Handle the data received
    const squireButtons = $('#squire-buttons');

    squires.forEach((squire) => {
      // Create a button element for each squire
      const button = $('<button>')
      button.text(squire.name)
        .addClass('squire-button')
        .on('click', function () {
          // Attach a click event handler to make a POST request and then reroute
          $.ajax({
            method: "POST",
            url: "/load",
            data: JSON.stringify({ squireName: button.text() }), // Include the data you want to send
            contentType: "application/json",
            success: (data) => {
              window.location.href = "/converse/converse.html";
              console.log(data);
            },
            error: (err) => {
              console.log(err);
            }
          });
        });
      // Append the button to the container
      squireButtons.append(button);
    });
  }).fail(function () {
    console.error('Request failed.');
  });
});

//HEAD BACK TO THE MAIN PAGE
$("#back").on("click", ()=>{
  window.location.href = "/index/index.html";
});