const habitInput = document.getElementById("habitInput");
const addButton = document.getElementById("addButton");
const habitList = document.getElementById("habitList");

let habits = JSON.parse(localStorage.getItem("habits")) || [];

const today = new Date().toLocaleDateString("en-CA");

function saveHabits() {
    localStorage.setItem("habits", JSON.stringify(habits));
}

function addHabit() {
    const habitName = habitInput.value.trim();

    if (habitName === "") {
        alert("Please enter a habit name!");
        return;
    }

    habits.push({
        id: Date.now(),
        name: habitName,
        completedDate: ""
    });

    habitInput.value = "";

    saveHabits();
    displayHabits();
}

function completeHabit(id) {
    habits = habits.map(habit => {
        if (habit.id === id) {
            habit.completedDate =
                habit.completedDate === today ? "" : today;
        }
        return habit;
    });

    saveHabits();
    displayHabits();
}

function deleteHabit(id) {
    habits = habits.filter(habit => habit.id !== id);

    saveHabits();
    displayHabits();
}

function displayHabits() {
    habitList.innerHTML = "";

    let completedCount = habits.filter(
        habit => habit.completedDate === today
    ).length;

    let totalCount = habits.length;

    let percentage = totalCount === 0
        ? 0
        : Math.round((completedCount / totalCount) * 100);

    document.getElementById("totalHabits").textContent = totalCount;
    document.getElementById("completedHabits").textContent = completedCount;
    document.getElementById("progress").textContent = percentage + "%";

    if (totalCount === 0) {
        habitList.innerHTML =
            '<p class="empty-message">No habits yet. Add your first habit!</p>';
        return;
    }

    habits.forEach(habit => {
        const isCompleted = habit.completedDate === today;

        const habitItem = document.createElement("div");
        habitItem.className = "habit-item";

        if (isCompleted) {
            habitItem.classList.add("completed");
        }

        const name = document.createElement("span");
        name.className = "habit-name";
        name.textContent = habit.name;

        const completeButton = document.createElement("button");
        completeButton.className = "complete-button";
        completeButton.textContent = isCompleted
            ? "Completed ✓"
            : "Mark Done";

        completeButton.addEventListener("click", () => {
            completeHabit(habit.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            deleteHabit(habit.id);
        });

        habitItem.appendChild(name);
        habitItem.appendChild(completeButton);
        habitItem.appendChild(deleteButton);

        habitList.appendChild(habitItem);
    });
}

addButton.addEventListener("click", addHabit);

habitInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addHabit();
    }
});

displayHabits();