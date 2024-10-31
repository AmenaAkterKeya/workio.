document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem("token");  

    fetch("https://workio-theta.vercel.app/board/boardCount/", {
        headers: {
            'Authorization': `Token ${token}`,  
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        document.getElementById("total-todo").textContent = data.todo_count;
        document.getElementById("total-in-progress").textContent = data.in_progress_count;
        document.getElementById("total-done").textContent = data.completed_count;
    })
    .catch(error => {
        console.error("Error fetching data:", error);
        document.getElementById("total-todo").textContent = "Error";
        document.getElementById("total-in-progress").textContent = "Error";
        document.getElementById("total-done").textContent = "Error";
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem("token");

    fetch("https://workio-theta.vercel.app/board/board/", {
        headers: {
            'Authorization': `Token ${token}`, 
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const tableBody = document.getElementById("board-table-body");
        tableBody.innerHTML = "";  

        if (Array.isArray(data) && data.length > 0) {  
            const boardPromises = data.map((board, index) => {
                return fetch(`https://workio-theta.vercel.app/board/board/${board.id}/cardCounts/`, {
                    headers: {
                        "Authorization": `Token ${token}`, 
                        "Content-Type": "application/json"
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Status: ${response.status}`);
                    }
                    return response.json().then(taskCounts => {
                        return {
                            id: board.id, 
                            name: board.name,
                            members_num: board.members_num,
                            todo_count: taskCounts.todo_count,
                            in_progress_count: taskCounts.in_progress_count,
                            completed_count: taskCounts.completed_count,
                        };
                    });
                });
            });

            Promise.all(boardPromises)
                .then(boardsWithCounts => {
                    boardsWithCounts.forEach((board, index) => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td class="text-center">${index + 1}</td>
                            <td>${board.name}</td>
                            <td class="text-center">${board.members_num}</td>
                            <td class="text-center">${board.todo_count}</td>
                            <td class="text-center">${board.in_progress_count}</td>
                            <td class="text-center">${board.completed_count}</td>
                            <td class="text-center">
                                <a href="board.html?id=${board.id}" class="btn btn-sm btn-outline-dark mem_btn">View</a>
                            </td>
                        `;
                        tableBody.appendChild(row);
                    });
                })
                .catch(error => {
                    console.error("Error fetching task counts:", error);
                    tableBody.innerHTML = "<tr><td colspan='7' class='text-center'>Error loading data</td></tr>";
                });
        } else {
            
            tableBody.innerHTML = "<tr><td colspan='7' class='text-center'>No boards found</td></tr>";
        }
    })
    .catch(error => {
        console.error("Error fetching boards:", error);
        const tableBody = document.getElementById("board-table-body");
        tableBody.innerHTML = "<tr><td colspan='7' class='text-center'>Error loading data</td></tr>";
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem("token");
    const loadingSpinner = document.getElementById("loading-spinner-map");
    const ctx = document.getElementById('myPieChart');

    if (!token) {
        console.error("No token found in local storage");
        return;
    }

    loadingSpinner.style.display = "block"; 

    fetch("https://workio-theta.vercel.app/board/boardCount/", {
        headers: {
            'Authorization': `Token ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        loadingSpinner.style.display = "none";  

        const todo_count = data.todo_count || 0;
        const in_progress_count = data.in_progress_count || 0;
        const completed_count = data.completed_count || 0;

     
        if (todo_count === 0 && in_progress_count === 0 && completed_count === 0) {
            createNoDataChart();
        } else {
            createPieChart(todo_count, in_progress_count, completed_count);
        }
    })
    .catch(error => {
        loadingSpinner.style.display = "none";  
        console.error("Error fetching board counts:", error);
    });
});

function createNoDataChart() {
    const ctx = document.getElementById('myPieChart');
    const noDataChart = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ["No Data"],
            datasets: [{
                data: [0],  
                backgroundColor: ['rgba(255, 255, 255, 0)'],  
                borderColor: ['black'],  
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false  
                },
                title: {
                    display: true,
                    text: 'No Data',
                    color: 'black'
                }
            }
        }
    });
}

function createPieChart(todo_count, in_progress_count, completed_count) {
    const ctx = document.getElementById('myPieChart');

    const myPieChart = new Chart(ctx.getContext('2d'), {
        type: 'pie',
        data: {
            labels: ['To Do', 'In Progress', 'Completed'],
            datasets: [{
                label: 'Task Counts',
                data: [todo_count, in_progress_count, completed_count],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)', 
                    'rgba(255, 206, 86, 0.6)', 
                    'rgba(75, 192, 192, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Task Distribution'
                }
            }
        }
    });
}
