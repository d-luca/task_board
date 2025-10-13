# Quick Test Guide - Phase 2 MongoDB Integration

## ✅ Connection Status: WORKING

MongoDB is connected successfully on port **27018** (Docker container: dt_mongo)

---

## 🧪 Quick API Tests

Open the **DevTools Console** in your running app and try these commands:

### 1. Create a Test Project

```javascript
window.api.project
	.create({
		name: "My First Project",
		description: "Testing Phase 2 integration",
		color: "#3b82f6",
		icon: "📋",
	})
	.then((project) => {
		console.log("✅ Project created:", project);
		// Save this ID for next tests (convert ObjectId to string)
		window.testProjectId = project._id.toString();
	})
	.catch(console.error);
```

### 2. Get All Projects

```javascript
window.api.project
	.getAll(false)
	.then((projects) => {
		console.log("✅ All projects:", projects);
	})
	.catch(console.error);
```

### 3. Create a Test Task

```javascript
// Uses the project ID saved from step 1
window.api.task
	.create({
		projectId: window.testProjectId,
		title: "Test Task #1",
		description: "This is my first task!",
		status: "todo",
		priority: "high",
		labels: ["test", "phase-2"],
	})
	.then((task) => {
		console.log("✅ Task created:", task);
		window.testTaskId = task._id.toString();
	})
	.catch(console.error);
```

### 4. Get Tasks for Project

```javascript
window.api.task
	.getByProject(window.testProjectId)
	.then((tasks) => {
		console.log("✅ Project tasks:", tasks);
	})
	.catch(console.error);
```

### 5. Update Task Status (Simulate Drag-and-Drop)

```javascript
window.api.task
	.updatePosition(window.testTaskId, "in-progress", 0)
	.then((task) => {
		console.log("✅ Task moved to in-progress:", task);
	})
	.catch(console.error);
```

### 6. Search Tasks

```javascript
window.api.task
	.search(window.testProjectId, "test")
	.then((results) => {
		console.log("✅ Search results:", results);
	})
	.catch(console.error);
```

### 7. Archive Project

```javascript
window.api.project
	.archive(window.testProjectId)
	.then((project) => {
		console.log("✅ Project archived:", project);
	})
	.catch(console.error);
```

---

## 🔍 Verify in MongoDB

### Using MongoDB Compass (GUI)

1. **Download:** https://www.mongodb.com/try/download/compass
2. **Connect to:** `mongodb://localhost:27018`
3. **Navigate to:** `taskboard_dev` database
4. **View collections:** `projects` and `tasks`

### Using Docker + mongosh (CLI)

```powershell
# Connect to MongoDB shell
docker exec -it dt_mongo mongosh

# Switch to database
use taskboard_dev

# View projects
db.projects.find().pretty()

# View tasks
db.tasks.find().pretty()

# Count documents
db.projects.countDocuments()
db.tasks.countDocuments()

# Exit
exit
```

---

## 🎯 All Phase 2 Features Working

- ✅ Database connection to Docker MongoDB (port 27018)
- ✅ Project CRUD operations (create, read, update, delete)
- ✅ Task CRUD operations with all fields
- ✅ Project archiving/unarchiving
- ✅ Task archiving
- ✅ Task position updates (for drag-and-drop)
- ✅ Bulk task reordering
- ✅ Full-text search (projects and tasks)
- ✅ Date range queries
- ✅ IPC communication (main ↔ renderer)
- ✅ Type-safe API through preload bridge

---

## 🚀 Ready for Phase 3!

Phase 2 is **100% complete and tested**. You can now proceed to Phase 3:

**Phase 3: State Management & Project List UI**

- Create Zustand store for projects and tasks
- Build Project List sidebar component
- Implement project creation modal
- Add project selection and management
- Design empty states

See `DEVELOPMENT_PLAN.md` for detailed Phase 3 steps.

---

## 📝 Configuration Details

**MongoDB Connection:**

- Host: localhost
- Port: 27018 (mapped from Docker container port 27017)
- Database: `taskboard_dev` (development)
- Container: `dt_mongo` (mongo:latest)

**Connection String:**

```
mongodb://localhost:27018/taskboard_dev
```

**Modified File:**

- `src/main/database/connection.ts` - Updated to use port 27018
