# ASCII Art Generator

A modern, interactive image-to-ASCII converter built with React. Features real-time rendering, custom fonts & colors, and HTML/PNG export. Sleek, fast, and fully customizable.
you can use it now 
[**Live Demo**](https://ascii-pic.vercel.app/)


## ✨ Features

- **Interactive Heat Reveal**: Hover over the ASCII art to reveal the original image in full color.
- **Premium UI**: A sleek, monochrome interface designed for focus and clarity.
- **Drag & Drop**: Seamlessly upload images (JPG, PNG, WEBP).
- **Customization**:
  - **Density**: Adjust the resolution of the ASCII grid.
  - **Typography**: Control font size and character sets.
  - **Contrast & Brightness**: Fine-tune the output for any image.
  - **Invert Mode**: Switch between Dark and Light themes.
- **Export Options**:
  - **HTML**: Download a standalone, interactive HTML file.
  - **PNG**: Save the current view as a high-resolution image.
  - **Text**: Copy the raw ASCII characters to your clipboard.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation**: Canvas API + RequestAnimationFrame

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/ascii-pic.git
    cd ascii-pic
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to `http://localhost:5173`.

## 📖 Usage

1.  **Upload**: Drag an image onto the dropzone or click to select one.
2.  **Configure**: Use the sidebar controls to adjust the grid density, font size, and contrast until you're happy with the result.
3.  **Interact**: Move your mouse over the canvas to see the "Heat Reveal" effect.
4.  **Export**: Click "Download HTML" to get a standalone file you can share, or use the "Save PNG" / "Copy Text" buttons.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
