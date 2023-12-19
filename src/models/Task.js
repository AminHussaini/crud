import mongoose from "mongoose";

let Task;

try {
  // Try to retrieve the existing model
  Task = mongoose.model("Task");
} catch (error) {
  // Model doesn't exist, define it
  const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    hour: { type: String, required: true },
    date: { type: String, required: true },
    pass: { type: String, required: true },
  });

  Task = mongoose.model("Task", taskSchema);
}

export default Task;
