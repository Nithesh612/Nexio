# Nexio — Complete Tech Stack & Installed Packages Documentation

---

## 📌 1. Project Overview & Architecture
**Nexio Hub** is a next-generation central bookmarks, AI tools, and creative assets platform designed for modern creators, designers, and developers.

* **Architecture**: Client-Server Decoupled Architecture (SPA Frontend + RESTful API Backend + MongoDB Database).
* **Frontend Port**: `http://localhost:5173` (Vite Dev Server)
* **Backend Port**: `http://localhost:5000` (Node.js / Express Server)
* **Database**: MongoDB (Local / Atlas Cloud via Mongoose ODM)

---

## 🎨 2. Frontend (`/web`) Tech Stack & Packages

### 🚀 Core Framework & Build Tooling
| Package | Version | Purpose |
| :--- | :---: | :--- |
| **`react`** | `^19.2.8` | Core UI library for component-driven interfaces. |
| **`react-dom`** | `^19.2.8` | DOM rendering layer for React 19. |
| **`vite`** | `^8.2.2` | Ultra-fast next-gen frontend build tool with instantaneous Hot Module Replacement (HMR). |
| **`@vitejs/plugin-react`** | `^6.1.0` | Official Vite plugin for React using Fast Refresh and JSX transformation. |

---

### ✨ Animation & Motion Engine
| Package | Version | Purpose |
| :--- | :---: | :--- |
| **`framer-motion`** | `^13.2.0` | Production-ready declarative animations, spring physics (Command Palette, Toasts, Cards). |
| **`gsap`** | `^3.15.0` | GreenSock Animation Platform for high-performance timeline and smooth motion effects. |
| **`@gsap/react`** | `^2.1.2` | Official React hook (`useGSAP()`) for safe GSAP animation lifecycles. |
| **`lottie-react`** | `^3.1.1` | React wrapper for lightweight vector JSON Lottie animations. |
| **`lottie-web`** | `^5.13.0` | Core Web-based vector animation renderer. |

---

### 🎨 Styling & Iconography
| Package | Version | Purpose |
| :--- | :---: | :--- |
| **`tailwindcss`** | `^4.3.3` | Modern utility-first CSS engine. |
| **`@tailwindcss/postcss`** | `^4.3.3` | Tailwind v4 PostCSS integration. |
| **`postcss`** | `^8.5.26` | CSS transformation pipeline. |
| **`autoprefixer`** | `^10.5.4` | Automatically adds vendor prefixes to CSS rules. |
| **`lucide-react`** | `^1.35.0` | Beautiful, consistent, tree-shakeable SVG icons. |
| **Vanilla CSS** | — | Custom scoped stylesheets for high-control glassmorphism and animations. |

---

### 📄 Document & PDF Engine
| Package | Version | Purpose |
| :--- | :---: | :--- |
| **`pdfjs-dist`** | `^6.3.289` | Mozilla PDF.js distribution for parsing and extracting content from imported PDF link documents. |

---

### 🛠️ Developer Tooling & Linting
| Package | Version | Purpose |
| :--- | :---: | :--- |
| **`eslint`** | `^10.9.0` | JavaScript code quality and linting engine. |
| **`eslint-plugin-react-hooks`** | `^7.1.1` | Enforces the Rules of Hooks in React. |
| **`eslint-plugin-react-refresh`**| `^0.5.4` | Validates fast-refresh compatibility. |
| **`@types/react`** | `^19.2.18`| Type definitions for React. |
| **`@types/react-dom`** | `^19.2.4` | Type definitions for React DOM. |

---

## ⚙️ 3. Backend (`/api`) Tech Stack & Packages

### 🌐 Server & Database
| Package | Version | Purpose |
| :--- | :---: | :--- |
| **`express`** | `^5.1.0` | Next-generation fast, minimalist web framework for Node.js. |
| **`mongoose`** | `^9.9.4` | Elegant MongoDB object modeling (ODM) with strict schema validation. |
| **`cors`** | `^2.8.6` | Middleware for enabling Cross-Origin Resource Sharing with domain whitelisting. |
| **`dotenv`** | `^17.2.4` | Loads environment variables from `.env` file into `process.env`. |
| **`nodemon`** | `^3.1.10` | Dev server file watcher that automatically restarts the Node server upon code changes. |

---

### 🔒 Security Implementations in Backend (`server.js`)
* **Sliding Window Rate Limiter**: In-memory rate limiting (200 requests/minute per client IP) to defend against DDoS and API abuse.
* **Security Headers**:
  * `X-Content-Type-Options: nosniff`
  * `X-Frame-Options: DENY`
  * `X-XSS-Protection: 1; mode=block`
  * `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  * `Referrer-Policy: strict-origin-when-cross-origin`
* **Safe Payload Limits**: `express.json({ limit: "10mb" })` protects against memory overflow attacks.
* **Graceful Process Shutdown**: Traps `SIGTERM` and `SIGINT` signals to close HTTP servers and MongoDB connections cleanly without data loss.

---

## 📡 4. REST API Endpoint Directory

| Route Endpoint | Methods | Description |
| :--- | :---: | :--- |
| **`/`** | `GET` | Server health, version, uptime, and status check. |
| **`/health`** | `GET` | Real-time database connection status and heap memory usage stats. |
| **`/hub`** | `GET, POST, PUT, DELETE` | Main bookmarks repository CRUD operations. |
| **`/hub/export`** | `GET` | Export all stored bookmarks in JSON, PDF, CSV, or DOC formats. |
| **`/hub/import`** | `POST` | Batch import bookmarks from JSON or CSV files. |
| **`/api/ai-tools`** | `GET, POST, PUT, DELETE` | Global AI Tools directory CRUD operations. |
| **`/api/editing`** | `GET, POST, PUT, DELETE` | Dedicated creative workspace and editing tools directory. |
| **`/users`** | `POST` | Authentication, login verification, and session token generation. |

---

## 💎 5. Advanced Frontend Features & UX Upgrades

1. **Spotlight Command Palette (`Ctrl + K` / `Cmd + K`)**:
   * Quick-launch modal for instant fuzzy search across all tools, bookmarks, and direct navigation actions.
2. **Global Toast Notification System**:
   * Non-intrusive floating glassmorphic alerts for link saving, duplicate warnings, and copy actions.
3. **Pulsing Skeleton Shimmer Loaders**:
   * Zero Cumulative Layout Shift (CLS) with shimmering placeholder cards during network fetches.
4. **Triple-Engine Screenshot Fallback Architecture**:
   * `thum.io` ➔ `microlink.io` ➔ `mshots` ➔ Curated Brand Presets (Figma, Framer, Lovable) ➔ Fallback Vector Monograms.
5. **Universal AI Sync**:
   * Saving any tool with category containing `"AI"` or `"AI Image & Video"` automatically registers it in both the links repository and the dedicated AI Tools directory.
6. **Built-in Document Generator**:
   * Custom binary stream generator that exports bookmarks directly into clean **PDFs**, **Excel spreadsheets**, **DOC tables**, or **JSON**.
