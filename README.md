# Whiteboard App

This project is a simple web-based whiteboard application built using Flask. It allows users to draw on a canvas using their mouse, providing a fun and interactive way to create and share drawings.

## Project Structure

```
whiteboard-app
├── src
│   ├── app.py                # Entry point of the application, sets up the Flask server and routes.
│   ├── static
│   │   ├── css
│   │   │   └── style.css     # Styles for the whiteboard web page.
│   │   └── js
│   │       └── whiteboard.js  # JavaScript logic for handling drawing on the canvas.
│   └── templates
│       └── index.html        # HTML template for the whiteboard interface.
├── requirements.txt          # List of required Python packages for the project.
└── README.md                 # Project description and usage instructions.
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd whiteboard-app
   ```

2. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

## Usage

1. Run the application:
   ```
   python src/app.py
   ```

2. Open your web browser and navigate to `http://127.0.0.1:5000` to access the whiteboard.

## Features

- Draw on the canvas using your mouse.
- Clear the canvas to start a new drawing.

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project.