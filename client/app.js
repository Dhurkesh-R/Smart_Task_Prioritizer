document.getElementById("task-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  try {
    const taskType = document.getElementById("task_type").value;
    const durationHours = parseInt(document.getElementById("duration_hours").value) || 0;
    const durationMinutes = parseInt(document.getElementById("duration_minutes").value) || 0;
    const durationTotal = (durationHours * 60) + durationMinutes;

    const urgency = parseInt(document.getElementById("urgency").value);
    const importanceToGoals = parseInt(document.getElementById("importance_to_goals").value);
    const dependsOnYou = parseInt(document.querySelector('input[name="depends_on_you"]:checked').value);
    const stressLevel = parseInt(document.getElementById("stress_level").value);
    const motivationLevel = parseInt(document.getElementById("motivation_level").value);
    const enjoymentLevel = parseInt(document.getElementById("enjoyment_level").value);
    const taskBlockingOthers = parseInt(document.querySelector('input[name="task_blocking_others"]:checked').value);
    const deadlineUrgency = document.getElementById("deadline_urgency").value;

    const payload = {
      task_type: taskType,
      duration_minutes: durationTotal,
      urgency: urgency,
      importance_to_goals: importanceToGoals,
      depends_on_you: dependsOnYou,
      stress_level: stressLevel,
      motivation_level: motivationLevel,
      enjoyment_level: enjoymentLevel,
      task_blocking_others: taskBlockingOthers,
      deadline_urgency: deadlineUrgency
    };

    const response = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Server error");
    }

    const data = await response.json();
    document.getElementById("result").textContent = "Predicted Priority: " + data.priority;
    document.getElementById('result').style.display = 'block';

    const taskTitle = document.getElementById("taskTitle").value;
    // Store in localStorage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({
      title: taskTitle,
      priority: data.priority,
      timestamp: Date.now()
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));

  } catch (error) {
    console.error("Prediction error:", error);
    document.getElementById("result").textContent = "Prediction failed. Check input values or server.";
  }
});
