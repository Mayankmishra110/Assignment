const form = document.querySelector('#upload-form');
const message = document.querySelector('#message');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get the file input and create a FileReader object
  const fileInput = document.querySelector('#file-input');
  const file = fileInput.files[0];
  
  if (file) {
    const reader = new FileReader();
    reader.readAsText(file);

    reader.addEventListener('load', (event) => {
      const contents = event.target.result;

      // Send the file contents to the server using a fetch request
      fetch('/candidates/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contents }),
      })
        .then((res) => res.text())
        .then((data) => {
          // Display success message
          message.innerHTML = data;
          message.style.color = 'green';

          // Clear file input
          fileInput.value = '';
        })
        .catch((err) => {
          // Display error message
          message.innerHTML = 'Error';
          message.style.color = 'red';
          console.log(err);
        });
    });

  } else {
    console.log("No file selected.");
  }
});
