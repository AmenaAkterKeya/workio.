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
            console.log('API response data:', data); // Log the response data

            const tableBody = document.getElementById('table');
            const noDataDiv = document.getElementById('nodata_instructor');
            const theadDark = document.getElementById('thead-dark');
            const memberCount = document.getElementById('memberCount');
            const boardCount = document.getElementById('boardCount');

            // Clear existing rows
            tableBody.innerHTML = '';

            let totalMembers = 0;
            let totalBoards = data.length;
            let rowNumber = 1; // Initialize row number counter

            data.forEach(item => {
                // Ensure 'members' property exists and is an array
                if (Array.isArray(item.members)) {
                    totalMembers += item.members.length;

                    item.members.forEach(member => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <th scope="row">${rowNumber++}</th> <!-- Use rowNumber variable -->
                            <td>${member.username || 'No username available'}</td>
                            <td>${member.email || 'No email available'}</td>
                            <td>
                                <a href="board.html?id=${item.id}" class="btn btn-outline-dark mem_btn">${item.name || 'No name available'}</a>
                            </td>
                        `;
                        tableBody.appendChild(row);
                    });
                } else {
                    console.warn('No members array found for item:', item);
                }
            });

            memberCount.textContent = `Members (${totalMembers})`;
            boardCount.textContent = `Board (${totalBoards})`;

            if (data.length > 0) {
                noDataDiv.style.display = 'none';
                theadDark.style.display = 'table-header-group';
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
