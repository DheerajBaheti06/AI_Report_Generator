# 🚀 AI Report Generator 📄✨

**Create, edit & export professional reports — instantly.**
Built with **Google Gemini 2.5 AI** (Flash & Pro), **React**, **Vite**, and **modern export engines** (PDF + DOCX).

<!-- ![AI Report Generator Demo](demo.gif) -->

---

## Compass Overview

A sleek web app to generate AI-powered, multi-page reports with real-time editing.
Customize fonts, layout, and page styles — then export polished PDFs or DOCX files in seconds.

Now features a **High-Quality "Thinking" Mode** using Gemini 2.5 Pro for deeper, more reasoned content generation.

---

## ⚡ Key Features

- 🧠 **Gemini AI-Powered Reports** — Generate full reports from just a topic prompt.
- 🤯 **High-Quality "Thinking" Mode** — Toggles Gemini 2.5 Pro for complex, detailed analysis.
- 🎯 **Custom Outlines** — Provide specific main headings to guide the AI's structure.
- ✍️ **WYSIWYG Live Editor** — Edit text, reorder blocks, and refine content directly on the preview.
- 🎨 **Pro Formatting Tools** — Fonts, colors, alignment, spacing, and custom themes.
- 📏 **Auto-Fit Pages** — Smart text resizing to match your target page count exactly.
- �️ **History & Undo/Redo** — Never lose your progress with full state management.
- �📄 **Headers & Footers** — Customizable titles, dates, page numbers, and borders.
- 📥 **One-Click Export** — Export to PDF 📚 or DOCX 📝 instantly.
- 🌓 **Dark & Light Mode** — Sleek UI for every environment.
- 📱 **Responsive Design** — Works beautifully on desktops, tablets, and mobile phones.

---

## 🛠️ Built With

- ⚛️ [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- 💎 [TypeScript](https://www.typescriptlang.org/)
- 🤖 [@google/genai](https://www.npmjs.com/package/@google/genai)
- 📘 [docx.js](https://docx.js.org/)
- 🧾 [jsPDF](https://github.com/parallax/jsPDF) + [html2canvas](https://html2canvas.hertzen.com/)
- 💅 **Modular Architecture** (`src/` structure with segregated components)

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 16
- Gemini API Key → [Get it here](https://aistudio.google.com/app/apikey)

---

### 🧩 Installation (Local Setup)

```bash
# Clone the repo
git clone https://github.com/DheerajBaheti06/ai-report-generator.git
cd ai-report-generator

# Install dependencies (using Vite)
npm install

# Add your Gemini API key
echo "GEMINI_API_KEY=your_google_gemini_api_key_here" > .env

# Run in development
npm run dev
```

Now open 👉 **[http://localhost:5173](http://localhost:5173)**

---

### ☁️ Deployment (Vercel)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/) and create a new project
3. Import your repository
4. Add your `GEMINI_API_KEY` as an environment variable in Vercel project settings
5. Deploy!

**Note**: Make sure to configure your build settings in Vercel Project Settings:

- Build Command: `npm run build`
- Output Directory: `dist`

---

## � Usage

1. **Topic & Settings**: Enter a topic (e.g., "The Future of AI").
2. **Structure (Optional)**: Paste specific headings you want the report to cover.
3. **Target Length**: Set the number of pages.
4. **Mode**: Enable "High-Quality Mode" for deeper research (takes longer).
5. **Generate**: Click "Generate Report".
6. **Edit**: Use the floating toolbar to format text, or the sidebar to change global styles.
7. **Auto-Fit**: If the report is too long/short, use "Auto-Fit" to adjust it to your target page count.
8. **Export**: Download as **PDF** or **DOCX**.

---

## 📤 Export Options

| Format  | Type        | Description                    |
| ------- | ----------- | ------------------------------ |
| 🧾 PDF  | Print-ready | Preserves full visual layout   |
| 📘 DOCX | Editable    | Perfect for Word & Google Docs |

---

## 📜 License

Licensed under the **Apache 2.0 License**.

---

## 👤 Author

**Dheeraj Baheti**

- 🌐 GitHub: [@DheerajBaheti06](https://github.com/DheerajBaheti06)
- 💼 LinkedIn: [in/dheeraj-baheti1](https://www.linkedin.com/in/dheeraj-baheti1)
