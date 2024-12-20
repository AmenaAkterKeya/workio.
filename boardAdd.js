
function isLightColor(color) {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

  return brightness > 0.5;
}


const loadCustomUser = () => {
  const customuser_id = localStorage.getItem("customuser_id");

  if (!customuser_id) {
      console.error('Custom user ID not found in localStorage.');
      return;
  }

  fetch(`https://workio-theta.vercel.app/account/user/?user_id=${customuser_id}`)
      .then(res => res.json())
      .then(data => {

          console.log('User data:', data);
      })
      .catch(error => console.error('Error loading user:', error));
};


async function fetchBoards() {
  const customuser_id = localStorage.getItem("customuser_id");
  const token = localStorage.getItem("token");
  const loadingSpinner = document.getElementById("loading-spinner-map");
  loadingSpinner.style.display = "block";
  try {
      const response = await fetch(`https://workio-theta.vercel.app/board/board/?customuser=${customuser_id}`, {
          headers: {
              'Authorization': `Token ${token}`,
          },
      });

      if (!response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("text/html")) {
              const errorText = await response.text();
              console.error('Received HTML response:', errorText);
          } else {
              const errorData = await response.json();
              console.error('Error fetching boards:', errorData);
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      loadingSpinner.style.display = "none";
      const data = await response.json();
      const boardList = document.getElementById('boardList');
      boardList.innerHTML = '';

      if (Array.isArray(data) && data.length > 0) {
          data.forEach(board => {
              const isLight = isLightColor(board.color);
              const textColor = isLight ? '#000000' : '#FFFFFF';

              const boardItem = document.createElement('li');
              boardItem.className = 'col-lg-3 col-md-4 col-sm-4 mb-3 d-flex align-items-stretch';
              boardItem.innerHTML = `
                  <a href="board.html?id=${board.id}" class="card board" style="background-color: ${board.color}; color: ${textColor}">
                      <span style="font-size: 20px; font-weight: 500; display: flex;">
                          ${board.name.slice(0, 20)}..
                      </span>
                      <div style="font-weight: 500; display: flex;">Members: ${board.members_num}</div>
                  </a>
              `;
              boardList.appendChild(boardItem);
          });
      }

      const createBoardItem = document.createElement('li');
      createBoardItem.className = 'col-lg-3 col-md-4 col-sm-4 mb-3 d-flex align-items-stretch';
      createBoardItem.innerHTML = `
          <div class="card board" data-bs-toggle="modal" data-bs-target="#createBoardModal">
              <span>Create new board</span>
          </div>
      `;
      boardList.appendChild(createBoardItem);
  } catch (error) {
      console.error('Fetch error:', error);
  }
}


document.getElementById('createBoardForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const boardName = document.getElementById('boardName').value;
  const boardColor = document.getElementById('boardColor').value;
  const boardMembersInput = document.getElementById('boardMembers').value;

  const customuser_id = localStorage.getItem("customuser_id");
  const token = localStorage.getItem("token");


  const boardMembersNum = parseInt(boardMembersInput, 10);
  if (isNaN(boardMembersNum) || boardMembersNum < 0 || boardMembersNum > 10) {
      displayValidationErrors('You cannot add more than 10 members to a board.');
      const modalElement = document.getElementById('createBoardModal');
      if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();
      }
      return;
  }

  if (!customuser_id || !token) {
      console.error('User ID or Token not found.');
      return;
  }

  try {
      const response = await fetch('https://workio-theta.vercel.app/board/board/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`,
          },
          body: JSON.stringify({
              name: boardName,
              color: boardColor,
              members_num: boardMembersNum,
              customuser_id: customuser_id,
          }),
      });

      if (!response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
              const errorData = await response.json();
              displayValidationErrors(errorData);
          } else {
              const errorText = await response.text();
              console.error('Error:', errorText);
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Board created:', data);

  
      fetchBoards();


      document.getElementById('createBoardForm').reset();

    
      const modalElement = document.getElementById('createBoardModal');
      if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();
      }
  } catch (error) {
      console.error('Error submitting form:', error);
  }
});


function displayValidationErrors(errors) {
  const errorContainer = document.getElementById('error');
  if (!errorContainer) {
      console.error('Error container not found.');
      return;
  }

  errorContainer.innerHTML = ''; 

  if (typeof errors === 'string') {
   
      const errorMessage = document.createElement('div');
      errorMessage.className = 'alert alert-danger';
      errorMessage.textContent = errors;
      errorContainer.appendChild(errorMessage);
      errorContainer.style.display = 'block'; 

     
      setTimeout(() => {
          errorContainer.style.display = 'none';
      }, 5000); 
  } else if (typeof errors === 'object') {
    
      for (const [field, messages] of Object.entries(errors)) {
          messages.forEach(message => {
              const errorMessage = document.createElement('div');
              errorMessage.className = 'alert alert-danger';
              errorMessage.textContent = `${field}: ${message}`;
              errorContainer.appendChild(errorMessage);
          });
      }
      errorContainer.style.display = 'block'; 


      setTimeout(() => {
          errorContainer.style.display = 'none';
      }, 5000); 
  } else {
      errorContainer.style.display = 'none'; 
  }
}


document.addEventListener('DOMContentLoaded', () => {
  loadCustomUser();
  fetchBoards();
});
