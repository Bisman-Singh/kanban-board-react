# Kanban Board

A feature-rich Kanban board with drag-and-drop built with React and Vite.

## Features

- **Multiple Boards**: Create, rename, and delete boards
- **Customizable Columns**: Default columns (Backlog, To Do, In Progress, Review, Done) with ability to add/rename/delete
- **Card Management**: Add, edit, and delete cards with title, description, priority, due date, and assignee
- **Drag & Drop**: Drag cards between columns and reorder within columns using HTML5 Drag and Drop API
- **Column Reordering**: Drag columns to reorder them
- **Card Count**: Each column shows its card count
- **Search/Filter**: Filter cards across all columns
- **Persistence**: All board data saved to localStorage

## Priority Colors

- **Critical**: Red
- **High**: Orange
- **Medium**: Yellow
- **Low**: Green

## Tech Stack

- React 18+ with hooks and functional components
- Vite for build tooling
- HTML5 Drag and Drop API (no external DnD library)
- localStorage for data persistence

## Getting Started

```bash
npm install
npm run dev
```
