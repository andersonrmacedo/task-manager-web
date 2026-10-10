"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/services/api";

type TaskStatus = "pending" | "in_progress" | "done";

type Task = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  created_at: string;
};

type Filter = "all" | TaskStatus;

const STATUS_STYLE: Record<TaskStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  done: "bg-green-100 text-green-800 border-green-200",
};

const FILTER_LABEL: Record<Filter, string> = {
  all: "All",
  pending: "Pending",
  in_progress: "In Progress",
  done: "Done",
};

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userName] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      return JSON.parse(localStorage.getItem("user") || "{}").name || "";
    } catch {
      return "";
    }
  });

  const fetchTasks = useCallback(
    async (currentFilter: Filter) => {
      setLoading(true);
      try {
        const params =
          currentFilter !== "all" ? `?status=${currentFilter}` : "";
        const data = await apiRequest(`/tasks${params}`);
        setTasks(data);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    void (async () => {
      setLoading(true);
      try {
        const params = filter !== "all" ? `?status=${filter}` : "";
        const data = await apiRequest(`/tasks${params}`);
        setTasks(data);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [filter, router]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      await apiRequest("/tasks", {
        method: "POST",
        body: JSON.stringify({
          title: newTitle,
          description: newDescription || null,
        }),
      });
      setNewTitle("");
      setNewDescription("");
      setShowForm(false);
      fetchTasks(filter);
    } finally {
      setCreating(false);
    }
  }

  async function handleStatusChange(task: Task, newStatus: TaskStatus) {
    await apiRequest(`/tasks/${task.id}`, {
      method: "PUT",
      body: JSON.stringify({ status: newStatus }),
    });
    fetchTasks(filter);
  }

  async function handleDelete(id: number) {
    await apiRequest(`/tasks/${id}`, { method: "DELETE" });
    fetchTasks(filter);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-muted/60 to-muted">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Task Manager</h1>
            {userName && (
              <p className="text-sm text-muted-foreground">
                Hello, {userName} 👋
              </p>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Title + button */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">My Tasks</h2>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ New Task"}
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleCreate} className="space-y-3">
                <Input
                  placeholder="Task title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  autoFocus
                />
                <Input
                  placeholder="Description (optional)"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
                <Button type="submit" className="w-full" disabled={creating}>
                  {creating ? "Saving..." : "Save Task"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {(["all", "pending", "in_progress", "done"] as Filter[]).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {FILTER_LABEL[f]}
            </Button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <p className="text-center text-muted-foreground py-12">
            Loading...
          </p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No tasks found.
          </p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className={task.status === "done" ? "opacity-60" : ""}
              >
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    {/* Título e descrição */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium text-sm leading-snug ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {task.description}
                        </p>
                      )}
                    </div>

                    {/* Dropdown de status + delete */}
                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task, e.target.value as TaskStatus)
                        }
                        className={`text-xs font-medium px-2 py-1 rounded-full border cursor-pointer focus:outline-none ${STATUS_STYLE[task.status]}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(task.id)}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
