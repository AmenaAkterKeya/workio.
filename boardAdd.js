
function isLightColor(color) {

  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);


  const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;


  return brightness > 0.5;
}


const loadcustomuserOne = () => {
  const customuser_id = localStorage.getItem("customuser_id");

  if (!customuser_id) {
    console.error('Custom user ID not found in localStorage.');
    return;
  }

  fetch(`https://workio-ypph.onrender.com/account/user/?user_id=${customuser_id}`)
    .then((res) => res.json())
    .then((data) => {
      // console.log('Fetched user data:', data);
    
    })
    .catch((error) => console.error('Error loading user:', error));
};


async function fetchBoards() {
  const customuser_id = localStorage.getItem("customuser_id");
  const token = localStorage.getItem("token");

  if (!customuser_id) {
    // console.error('User ID not found in localStorage.');
    return;
  }

  if (!token) {
    // console.error('Token not found in localStorage.');
    return;
  }

  // console.log(`Fetching boards for customuser_id: ${customuser_id}`);

  try {
    const response = await fetch(`https://workio-ypph.onrender.com/board/board/?customuser_id=${customuser_id}`, {
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        const errorText = await response.text();
        // console.error('Received HTML response:', errorText);
      } else {
        const errorData = await response.json();
        // console.error('Error fetching boards:', errorData);
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // console.log('Fetched boards data:', data);

    const boardList = document.getElementById('boardList');
    boardList.innerHTML = '';

    if (Array.isArray(data) && data.length > 0) {
      data.forEach(board => {
        const isLight = isLightColor(board.color);
        const textColor = isLight ? '#000000' : '#FFFFFF';

        const boardItem = document.createElement('li');
        boardItem.className = 'col-lg-3 col-md-4 col-sm-4 mb-3 d-flex align-items-stretch';
        boardItem.innerHTML = `
          <a href="board.html?id=${board.id}" class="card board" style="background-color: ${board.color}; color: ${textColor}" >
            <span style="
    font-size: 20px;
    font-weight: 500;
        margin-top: -72px;
        display:flex;
">${board.name.slice(0,20)}..</span>
          </a>
        `;
        boardList.appendChild(boardItem);
      });
    } else {
      console.log('No boards available.');
      boardList.innerHTML = '<li>No boards available</li>';
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

  if (!customuser_id || !token) {
    console.error('User ID or Token not found.');
    return;
  }

  try {
    const response = await fetch('https://workio-ypph.onrender.com/board/board/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({
        name: boardName,
        color: boardColor,
        members: boardMembersInput,
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
        // console.error('Error:', errorText);
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // console.log('Board created:', data);


    fetchBoards();

    const modal = bootstrap.Modal.getInstance(document.getElementById('createBoardModal'));
    modal.hide();
  } catch (error) {
    // console.error('Error submitting form:', error);
  }
});


function displayValidationErrors(errors) {
  const errorContainer = document.getElementById('validationErrors');
  if (!errorContainer) {
    // console.error('Error container not found.');
    return;
  }


  errorContainer.innerHTML = '';

  if (errors) {
    for (const [field, messages] of Object.entries(errors)) {
      messages.forEach(message => {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'alert alert-danger';
        errorMessage.textContent = `${field}: ${message}`;
        errorContainer.appendChild(errorMessage);
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadcustomuserOne();
  fetchBoards();
});
