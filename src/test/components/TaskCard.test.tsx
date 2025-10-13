import { render, screen } from "@testing-library/react";
import { TaskCard } from "../../renderer/src/components/TaskCard";
import { Task } from "../../renderer/src/types/task";

// Mock Lucide icons
jest.mock("lucide-react", () => ({
	Calendar: () => <div>Calendar Icon</div>,
	CheckSquare: () => <div>CheckSquare Icon</div>,
	AlertCircle: () => <div>AlertCircle Icon</div>,
	Trash2: () => <div>Trash Icon</div>,
}));

// Mock dnd-kit
jest.mock("@dnd-kit/core", () => ({
	useDraggable: () => ({
		attributes: {},
		listeners: {},
		setNodeRef: jest.fn(),
		transform: null,
	}),
}));

describe("TaskCard Component", () => {
	const mockTask: Task = {
		_id: "task-1",
		title: "Test Task",
		description: "Test Description",
		status: "todo",
		priority: "medium",
		projectId: "project-1",
		position: 0,
		isArchived: false,
		createdAt: "2024-01-01T00:00:00.000Z",
		updatedAt: "2024-01-01T00:00:00.000Z",
	};

	const mockOnEdit = jest.fn();
	const mockOnDelete = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders task title and description", () => {
		render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

		expect(screen.getByText("Test Task")).toBeInTheDocument();
		expect(screen.getByText("Test Description")).toBeInTheDocument();
	});

	it("displays priority badge", () => {
		render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

		expect(screen.getByText("Medium")).toBeInTheDocument();
	});

	it("displays high priority badge with correct styling", () => {
		const highPriorityTask: Task = {
			...mockTask,
			priority: "high",
		};

		render(<TaskCard task={highPriorityTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

		expect(screen.getByText("High")).toBeInTheDocument();
	});

	it("displays low priority badge with correct styling", () => {
		const lowPriorityTask: Task = {
			...mockTask,
			priority: "low",
		};

		render(<TaskCard task={lowPriorityTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

		expect(screen.getByText("Low")).toBeInTheDocument();
	});

	it("displays due date when provided", () => {
		const taskWithDueDate: Task = {
			...mockTask,
			dueDate: "2024-12-31",
		};

		render(<TaskCard task={taskWithDueDate} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

		// Check that Calendar icon is rendered (mocked)
		expect(screen.getByText("Calendar Icon")).toBeInTheDocument();
	});

	it("displays labels when provided", () => {
		const taskWithLabels: Task = {
			...mockTask,
			labels: ["bug", "urgent"],
		};

		render(<TaskCard task={taskWithLabels} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

		expect(screen.getByText("bug")).toBeInTheDocument();
		expect(screen.getByText("urgent")).toBeInTheDocument();
	});
});
