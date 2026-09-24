# Task Manager

A client-side task management application for organizing projects and the tasks assigned to them. Users can create an account, manage projects, create and update tasks, assign tasks to project members, and filter task lists.

## Technologies Used

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Sonner for toast notifications
- Browser localStorage for persistence

## Setup

Requirements:

- Node.js 20 or newer
- npm

Install the dependencies from the project directory:

```bash
npm install
```

## Run the Project

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

To create and run a production build:

```bash
npm run build
npm run start
```

To run lint checks:

```bash
npm run lint
```

## Features

- Account creation, sign-in, sign-out, and user settings
- Project creation, editing, deletion, and member selection
- Task creation, editing, deletion, status updates, priorities, and assignees
- Task search and filtering
- Project and task detail panels
- Form validation
- Loading indicators and toast feedback
- Handling of missing or corrupted localStorage data
