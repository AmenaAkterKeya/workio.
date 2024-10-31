document.addEventListener('DOMContentLoaded', function() {
    fetchBoards();
});


function isLightColor(color) {

    color = color.replace('#', '');

    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

   
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    return luminance > 0.5;
}

function fetchBoards() {
    const token = localStorage.getItem("token");

    fetch('https://workio-theta.vercel.app/board/board/', {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    })
    .then(data => {
        displayBoards(data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function displayBoards(boards) {
    const boardList = document.getElementById('boardList');
    const noDataDiv = document.getElementById('nodata_instructor');

    boardList.innerHTML = '';

    if (boards.length === 0) {
        noDataDiv.style.display = "flex"; 
        noDataDiv.style.justifyContent = 'center'; 
        noDataDiv.style.alignItems = 'center'; 
        boardList.style.display = "none"; 
        return;
    } else {
        noDataDiv.style.display = "none";
        boardList.style.display = "flex"; 
    }

   
    boards.forEach(board => {
        const textColor = isLightColor(board.color) ? '#000000' : '#FFFFFF';

        const boardItem = document.createElement('li');
        boardItem.className = 'col-lg-3 col-md-4 col-sm-4 mb-3 d-flex align-items-stretch';
        boardItem.innerHTML = `
            <a href="seeMember.html?id=${board.id}" class="card board" style="background-color: ${board.color}; color: ${textColor}">
                <span style="font-size: 20px; font-weight: 500; display: flex;">
                    ${board.name.slice(0, 20)}..
                </span>
                <div style="font-weight: 500; display: flex;">Members: ${board.members_num}</div>
            </a>
        `;
        boardList.appendChild(boardItem);
    });
}

