document.addEventListener('DOMContentLoaded', function () {
    const boardId = getQueryParams('id');
    if (boardId) {
        fetchBoardMembers(boardId);
    } else {
        console.error('Board ID is missing in the URL.');
    }
});

// Function to get query parameters from the URL
function getQueryParams(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to fetch board members using the board ID
function fetchBoardMembers(boardId) {
    const token = localStorage.getItem("token");

    fetch(`https://workio-theta.vercel.app/board/board/${boardId}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('Response status:', response.status); // Log status code
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Network response was not ok. Status: ${response.status}, Message: ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Response data:', data); // Log the response to inspect the data structure
        if (data && data.members) {
            displayBoardMembers(data.members);
        } else {
            console.error('Members field is missing or invalid in the response.');
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

// Function to display board members in the table
function displayBoardMembers(members) {
    const tbody = document.getElementById('table');
    const noDataDiv = document.getElementById('nodata_instructor');
    const theadDark = document.getElementById('thead-dark');
    const memberCount = document.getElementById('memberCount');
    const boardId = getQueryParams('id');
    if (!members || members.length === 0) {
        // Show "no data" message if there are no members
        noDataDiv.style.display = 'flex';
        noDataDiv.style.justifyContent = 'center';
        theadDark.style.display = 'none';
        tbody.innerHTML = '';
        memberCount.textContent = `Members (0)`;
    } else {
        // Show the table and populate it with members
        noDataDiv.style.display = 'none';
        theadDark.style.display = 'table-header-group';
        tbody.innerHTML = '';

        memberCount.textContent = `Members (${members.length})`;
        members.forEach((member, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${member.first_name || 'No first name available'} ${member.last_name || 'No last name available'}</td>
                <td>${member.email || 'No email available'}</td>
                <td>
                    <a href="board.html?id=${boardId}" class="btn btn-outline-dark mem_btn">Board</a>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}
