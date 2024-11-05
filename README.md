# create-super-vite-express-app

An NPX command for quickly generating a new project based on the [super-vite-express-app](https://github.com/graciegould/super-vite-express-app) template. This CLI tool sets up a full-stack project using Vite for the frontend and Express for the backend, giving you a clean starting point for building JavaScript applications with React and Express.

## Getting Started

To create a new project, just use the following command:

```bash
npx create-super-vite-express-app my-app
```

### Options for Running the Command

- **New Folder**:
    
    Run the command with a folder name (e.g., `my-app`) to generate the project in a new directory:
    
    ```bash
    npx create-super-vite-express-app my-app
    
    ```
    
- **Current Folder**:
    
    To set up the project in your current directory, use:
    
    ```bash
    npx create-super-vite-express-app .
    
    ```
    
    If the current folder already has contents, the CLI will prompt you to confirm whether you want to overwrite existing files.
    

## What You Get

- A full-stack setup with:
    - **Vite** as the frontend bundler (defaulting to React).
    - **Express** as the backend server.
    - Preconfigured API routing and scripts for development, production, and deployment.
- Clean API structure and same-origin setup for easy client-server communication.
- Customizable development workflows and scripts.


For more information, visit the [super-vite-express-app GitHub repository](https://github.com/graciegould/super-vite-express-app).