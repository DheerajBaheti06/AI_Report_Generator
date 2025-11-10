# 🚀 AI Report Generator 📄✨

**Create, edit & export professional reports — instantly.**
Built with **Google Gemini AI**, **React**, and **modern export engines** (PDF + DOCX).

<!-- ![AI Report Generator Demo](demo.gif) -->

---

## 🧭 Overview

A sleek web app to generate AI-powered, multi-page reports with real-time editing.
Customize fonts, layout, and page styles — then export polished PDFs or DOCX files in seconds.

---

## ⚡ Key Features

- 🧠 **Gemini AI-Powered Reports** — Generate full reports from just a topic prompt.
- ✍️ **WYSIWYG Live Editor** — Edit text directly on the preview.
- 🎨 **Pro Formatting Tools** — Fonts, colors, alignment, spacing, and themes.
- 📏 **Auto-Fit Pages** — Smart text resizing to match target page count.
- 📄 **Headers & Footers** — Customizable titles, dates, and page numbers.
- 📥 **One-Click Export** — Export to PDF 📚 or DOCX 📝 instantly.
- 🌓 **Dark & Light Mode** — Sleek UI for every environment.
- 📱 **Responsive Design** — Works beautifully on all screen sizes.

---

## 🛠️ Built With

- ⚛️ [React](https://react.dev/)
- 🤖 [@google/genai](https://www.npmjs.com/package/@google/genai)
- 📘 [docx.js](https://docx.js.org/)
- 🧾 [jsPDF](https://github.com/parallax/jsPDF) + [html2canvas](https://html2canvas.hertzen.com/)
- 💅 HTML5 + CSS3 (Theming with CSS Variables)

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

# Install dependencies
npm install

# Add your Gemini API key
echo "GEMINI_API_KEY=your_google_gemini_api_key_here" > .env.local

# Run in development
npm run dev
```

Now open 👉 **[http://localhost:3000](http://localhost:3000)**

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

### 📦 Alternative Production Build

```bash
# Create optimized build
npm run build

# Start production server
npm start
```

Can be deployed on **Vercel**, **Netlify**, or any Node.js host.
Just add your `GEMINI_API_KEY` in environment variables.

---

## 💡 Usage

1. Enter a topic and select your page count.
2. Let Gemini AI generate your full report.
3. Edit text, style, layout, and headers live.
4. Export to **PDF** or **DOCX** — ready to share or print.

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
