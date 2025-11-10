# AI Report Generator 📄✨

**Instantly create, customize, and export professional, multi-page reports on any topic using the power of Google's Gemini AI.**

---

_(A screenshot or GIF of the application in action would go here.)_

## Table of Contents

- [About The Project](#about-the-project)
- [Key Features](#key-features)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Export Options](#export-options)
- [License](#license)
- [Contact](#contact)

## About The Project

The AI Report Generator is a sophisticated web application designed to streamline the process of report creation. Users can input any topic, specify a target page count, and receive a well-structured, AI-generated report within seconds.

The real power lies in the post-generation workflow. The app features a high-fidelity, interactive preview that allows for granular control over typography, layout, and content. With robust export options to both PDF and DOCX, it bridges the gap from raw idea to polished, professional document.

## Key Features

- 🧠 **AI-Powered Content**: Leverages the Gemini API to generate coherent and relevant report content based on a simple prompt.
- ✍️ **Live WYSIWYG Editor**: What you see is what you get. Edit text directly on the page preview for intuitive content updates.
- 🎨 **Advanced Formatting Suite**:
  - **Typography Controls**: Adjust font family, size, color, and weight.
  - **Layout Adjustments**: Control text alignment (left, center, right, justify) and line spacing.
  - **Document Themes**: Switch between visual themes like 'Default', 'Charcoal', and 'Paper'.
- 📏 **Auto-Fit Magic**: The app automatically adjusts font sizes to ensure your content fits perfectly within the target number of pages.
- 📄 **Custom Headers & Footers**: Add professional touches with customizable header/footer text and automatic page numbering.
- 📥 **Multiple Export Formats**:
  - **PDF**: Generate a pixel-perfect, print-ready PDF document.
  - **DOCX**: Export a fully editable Microsoft Word document, preserving structure and formatting.
- 🌓 **Light & Dark Mode**: A sleek interface that's easy on the eyes, day or night.
- 📱 **Fully Responsive**: A seamless experience whether you're on a desktop, tablet, or mobile device.

## Built With

- [React](https://react.dev/) - The web framework used.
- [@google/genai](https://www.npmjs.com/package/@google/genai) - For interfacing with the Google Gemini API.
- [jsPDF](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/) - For generating PDF exports.
- [docx](https://docx.js.org/) - For generating DOCX exports.
- HTML5 & CSS3 - With modern features like CSS variables for theming.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need a **Google Gemini API key** to use this application.

1.  Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to create your API key.
2.  Ensure you have Node.js and npm installed if you wish to run the project locally.

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/DheerajBaheti06/AI-Report-Generator.git
    cd AI-Report-Generator
    ```

2.  **Set up your API Key:**
    The application requires your Google Gemini API key to function. This key must be available as an environment variable named `API_KEY`.

    Create a `.env` file in the root directory of the project with the following content:

    ```
    API_KEY=your_actual_api_key_here
    ```

    Alternatively, you can provide the `API_KEY` environment variable when you run the development server. The easiest way is to prefix the `npm run dev` command when you start it.

    - **For Deployment (Vercel, Netlify, etc.):**
      In your hosting provider's dashboard, add an environment variable named `API_KEY` to your project's settings. Set its value to your Gemini API key.

    - **For Local Development:**
      You can either use the `.env` file method above, or provide the `API_KEY` environment variable when running the development server.

3.  **Install Dependencies and Run Locally:**
    In your terminal, run the appropriate command for your operating system, replacing `YOUR_API_KEY_HERE` with your actual key.

    _On macOS / Linux:_

    ```sh
    API_KEY="YOUR_API_KEY_HERE" npm install && npm run dev
    ```

    _On Windows (Command Prompt):_

    ```sh
    set API_KEY=YOUR_API_KEY_HERE && npm install && npm run dev
    ```

    _On Windows (PowerShell):_

    ```sh
    $env:API_KEY="YOUR_API_KEY_HERE"; npm install; npm run dev
    ```

4.  Open your browser and navigate to the local address provided (usually `http://localhost:3000`).

## Usage

The application workflow is designed to be simple and efficient:

1.  **Generate**:

    - Navigate to the **Generate** tab.
    - Enter the topic for your report (e.g., "The Impact of Quantum Computing on Cybersecurity").
    - Set the target number of pages. The AI will aim for ~450 words per page.
    - (Optional) Enable "High-Quality Mode" to use a more advanced model for deeper analysis.
    - Click **Generate Report**.

2.  **Preview & Edit**:

    - You will be automatically switched to the **Preview & Edit** tab.
    - **Global Edits**: Use the sidebar (on desktop) or the "Format" and "Header" buttons (on mobile) to change fonts, alignment, themes, and header/footer text for the entire document.
    - **Local Edits**: Click on any text block to edit it directly. A floating toolbar will appear, allowing you to change the style (color, bold, font size) for that specific block or apply the style to all similar blocks.
    - **Page Breaks**: Use the floating toolbar to insert a page break before any block.
    - **Canvas Controls**: Pan the document by clicking and dragging. Zoom using the mouse wheel while holding `Ctrl`/`Cmd` or with the zoom controls in the top bar.

3.  **Export**:
    - When you are satisfied with your report, use the export buttons in the top bar (desktop) or the **Export** tab (mobile).
    - Choose to export as a **DOCX** or **PDF** file.

## Export Options

- **PDF (.pdf)**: Creates a high-fidelity, non-editable document that is ideal for sharing and printing. It captures the exact visual appearance from the preview.
- **DOCX (.docx)**: Creates a Microsoft Word file that preserves the structure (headings, paragraphs, bullets) and basic formatting of your report. This format is best if you or others need to make further edits in a word processor.

## License

This project is licensed under the Apache License, Version 2.0.

## Contact

Dheeraj Baheti

- GitHub: [@DheerajBaheti06](https://github.com/DheerajBaheti06)
- LinkedIn: [in/dheeraj-baheti1](https://www.linkedin.com/in/dheeraj-baheti1)
