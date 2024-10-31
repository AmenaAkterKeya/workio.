document.addEventListener('DOMContentLoaded', function() {
    const customuser_id = localStorage.getItem("customuser_id");
    const token = localStorage.getItem("token");
    const noDataDiv = document.getElementById('nodata_instructor');
    const boardList = document.getElementById('boardinvited');
    const apiUrl = `https://workio-theta.vercel.app/board/allMember/?customuser_id=${customuser_id}`;

    fetch(apiUrl, {
        headers: {
            'Authorization': `Token ${token}`, 
            'Content-Type': 'application/json' 
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.length === 0) {
          
            noDataDiv.style.display = "flex";
            boardList.style.display = "none";
        } else {
            noDataDiv.style.display = "none";
            boardList.style.display = "flex";

            boardList.innerHTML = '';
            data.forEach(item => {
                if (item.boards && item.boards.color) {
                    const board = item.boards;
                    const textColor = LightColor(board.color) ? 'black' : 'white'; 
                    const listItem = `
                        <li class="col-lg-3 col-md-4 col-sm-4 mb-3 d-flex align-items-stretch">
                            <a href="invitedBoardList.html?id=${board.id}" class="card board" style="background-color: ${board.color}; color: ${textColor}">
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="font-size: 20px; font-weight: 500; display: flex;">
                                        ${board.name.slice(0, 20)}..
                                    </span>
                                    <span class="btn btn-outline-dark">Enter</span>
                                </div>
                                <div style="font-weight: 500; display: flex;">Members: ${board.members_num}</div>
                            </a>
                        </li>
                    `;
                    boardList.innerHTML += listItem;
                } else {
                    console.warn('Board color is undefined or not present in boards:', item);
                }
            });
        }
    })
    .catch(error => console.error('Error fetching boards:', error));
});

function LightColor(color) {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

    return brightness > 0.5;
}
