# Tasks

Tasks is a local-first course and assignment planner built with HTML, Sass, and vanilla JavaScript. It helps students organize work by due date, associate tasks with color-coded courses, and personalize the workspace without requiring accounts or a backend.

## Screenshots

> Add updated screenshots here after deploying or capturing the app locally.

| Task board | Course manager | Settings |
| --- | --- | --- |
| `screenshots/tasks-board.png` | `screenshots/courses.png` | `screenshots/settings.png` |

## Features

- Create, edit, complete, and persist tasks in `localStorage`
- Group tasks by due-date windows, including overdue, today, this week, and later
- Add color-coded courses and use them as task labels
- Filter visible task sections from the settings panel
- Customize the background with included images or a two-color gradient
- View local storage usage and clear saved data with confirmation
- Responsive layout, keyboard-friendly dialogs, accessible labels, and visible focus states

## Technologies

- HTML5
- Sass
- CSS3
- Vanilla JavaScript
- Browser `localStorage`

## Project Structure

```text
.
├── Images/                 # Backgrounds, favicon, and UI imagery
├── css/                    # Compiled browser-ready CSS
├── javascript/
│   ├── appState.js          # Shared storage, date, DOM, and formatting helpers
│   ├── background.js        # Background preference handling
│   ├── createTask.js        # Task rendering, validation, editing, and completion
│   ├── pageSwitch.js        # Tasks/Courses view switching
│   ├── pressCreateCourse.js # Course creation, deletion, and rendering
│   ├── pressCreateTask.js   # Create-task action wiring
│   ├── settingsButton.js    # Settings dialog, tabs, cache size, and clear cache
│   └── Shrink.js            # Sidebar collapse behavior
├── sass/
│   ├── base/                # Variables, reset, shared utilities
│   ├── components/          # Buttons, task cards, course cards
│   └── layout/              # App layout, dialogs, settings, sidebar utilities
├── index.html
└── README.md
```

## Getting Started

Clone the repository and open `index.html` in a browser.

For local development with a simple static server:

```bash
python3 -m http.server 4173
```

Then visit:

```text
http://localhost:4173
```

## Development

Compile Sass after style changes:

```bash
sass sass/main.scss css/styles.css
```

The app does not require package installation or a backend. Saved tasks, courses, filters, sidebar state, settings position, and background preferences are stored locally in the browser.

## Maintenance Notes

- Keep `css/styles.css` committed because the project is served as a static site.
- Prefer adding shared browser helpers to `javascript/appState.js` before duplicating storage, date, or DOM logic.
- Preserve the local-first workflow: new features should not require authentication, cloud sync, or external APIs.

## Future Improvements

- Add import/export for local task backups.
- Add a non-destructive archive view for completed tasks.
- Add optional drag-and-drop ordering inside each due-date section.
