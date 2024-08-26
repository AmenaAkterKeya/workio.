document.addEventListener('DOMContentLoaded', function() {
   
    const url = 'https://workio-ypph.onrender.com/board/board/';
    const token = localStorage.getItem("token");

   
    function fetchAndUpdateTable() {
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.status === 401) {
                
                throw new Error('Unauthorized');
            }
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); 
        })
        .then(data => {
            const tableBody = document.getElementById('table');
            const noDataDiv = document.getElementById('nodata_instructor');
            const theadDark = document.getElementById('thead-dark');
            const memberCount = document.getElementById('memberCount');
            const boardCount = document.getElementById('boardCount');

            // Clear existing rows
            tableBody.innerHTML = '';

            
            let totalMembers = 0;
            let totalBoards = data.length;

            data.forEach(item => {
                totalMembers += item.members.length;
            });

            
            memberCount.textContent = `Members (${totalMembers})`;
            boardCount.textContent = `Board (${totalBoards})`;

            if (data.length > 0) {
                noDataDiv.style.display = 'none'; 
                theadDark.style.display = 'table-header-group'; 
                
            
                data.forEach((item, index) => {
                    const memberEmail = item.members.length > 0 ? item.members[0].email : 'No email available';
                    const memberUsername = item.members.length > 0 ? item.members[0].username : 'No username available';
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <th scope="row">${index + 1}</th>
                        <td>${memberUsername}</td>
                        <td>${memberEmail}</td>
                        <td>
                            <a href="board.html?id=${item.id}" class="btn btn-primary">${item.name}</a>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                noDataDiv.style.display = 'flex';
                noDataDiv.style.justifyContent = 'center';
                theadDark.style.display = 'none';
                memberCount.textContent = `Members (0)`;
                boardCount.textContent = `Board (0)`;
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    fetchAndUpdateTable();
});
