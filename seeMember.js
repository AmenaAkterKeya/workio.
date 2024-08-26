document.addEventListener('DOMContentLoaded', function() {
    const boardId = getQueryParams('id');
    if (boardId) {
        fetchBoardMembers(boardId);
    } else {
        console.error('Board ID is missing in the URL.');
    }
});

function getQueryParams(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function fetchBoardMembers(boardId) {
    const token = localStorage.getItem("token");

    fetch(`https://workio-ypph.onrender.com/board/board/${boardId}/`, {
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
        displayBoardMembers(data.members); 
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function displayBoardMembers(members) {
    const tbody = document.getElementById('table');
    const noDataDiv = document.getElementById('nodata_instructor');
    const theadDark = document.getElementById('thead-dark');
    const memberCount = document.getElementById('memberCount');
    
    if (members.length === 0) {
        noDataDiv.style.display = 'flex';
        noDataDiv.style.justifyContent = 'center';
        theadDark.style.display = 'none';
        tbody.innerHTML = ''; 
        memberCount.textContent = `Members (0)`;
    } else {
        noDataDiv.style.display = 'none'; 
        theadDark.style.display = 'table-header-group'; 
        tbody.innerHTML = ''; 
        
        memberCount.textContent = `Members (${members.length})`;
        members.forEach((member, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${member.first_name} ${member.last_name}</td>
                <td>${member.email}</td>
                <td>
                    <a href="board.html?id=${member.id}" class="btn btn-info">Board</a>
                  
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}
