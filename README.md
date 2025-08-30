# 🤖 PAM AI Rule Engine

> **Frontend Prototype** - Partner Agreement Management with AI-Powered Rule Creation Interface

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.9-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## 🚀 Overview

The **PAM AI Rule Engine** is a frontend prototype for a Partner Agreement Management system that demonstrates an intelligent interface for contract administration and rule creation. This prototype showcases a modern, intuitive user experience for managing business contracts and creating complex rules through both AI-assisted natural language processing and visual token-based editing.

### ✨ Current Features (Frontend Only)

- 📋 **Contract Upload & Management** - File upload interface with contract metadata tracking
- 🤖 **AI Rule Builder Prototype** - Natural language rule parsing with structured output
- 🎯 **Visual Token Rule Editor** - Interactive token-based rule creation and editing
- 💬 **AI Chat Interface** - Conversational interface for rule modifications
- 📊 **Contract Summary Panel** - AI-generated contract analysis display
- 🌙 **Modern UI/UX** - Responsive design with dark/light theme support

## 🎯 Problem Statement

Managing complex business contracts with dynamic rules can be overwhelming. Traditional approaches require:
- Technical expertise to write business logic
- Time-consuming rule creation processes
- Difficult maintenance and updates
- Risk of human error in rule definition

**This prototype demonstrates solutions by:**
- Showcasing natural language rule creation interfaces
- Providing visual rule editing tools
- Displaying structured rule output and validation
- Maintaining intuitive contract management workflows

## 🏗️ Frontend Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   File Upload   │    │   Contract      │    │   AI Rule       │
│   Interface     │───▶│   Management    │───▶│   Builder UI    │
│                 │    │   Dashboard     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Local State   │    │   Token Rule    │    │   Summary       │
│   Management    │    │   Editor        │    │   Panel         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Technology Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://reactjs.org/)** - Latest React with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework

### UI Components
- **[Radix UI](https://www.radix-ui.com/)** - Accessible, unstyled components
- **[Lucide React](https://lucide.dev/)** - Beautiful, customizable icons
- **[React Hook Form](https://react-hook-form.com/)** - Performant forms
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

### Development Tools
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager
- **[ESLint](https://eslint.org/)** - Code linting and formatting
- **[PostCSS](https://postcss.org/)** - CSS processing

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.17 or later
- **pnpm** (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/pam-ai-rule-engine.git
   cd pam-ai-rule-engine
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Package Management
pnpm install      # Install dependencies
pnpm update       # Update dependencies
```

## 📖 Current Functionality

### Contract Management Flow

1. **Upload Contract Files**
   - Use the file upload interface on the home page
   - Supports PDF, DOC, and DOCX files
   - Automatically generates contract metadata from filename

2. **Contract Dashboard**
   - View all uploaded contracts in a grid layout
   - Each contract shows: number, partner name, product, upload date
   - Two main actions per contract: "Rules" and "Summary"

3. **Contract Summary Panel**
   - Click "Summary" to view AI-generated contract analysis
   - Shows contract overview, key points, and mock financial terms
   - Displays processing status and last updated timestamp

### Rule Creation & Editing

1. **AI Rule Builder (Demo)**
   - Natural language parsing for rule creation
   - Example: "Create a revenue sharing rule with 25% rate and 85% traffic quality"
   - Generates structured rule output with categorization
   - Supports multiple rule types: revenue, quality, performance, compliance

2. **Token Rule Editor**
   - Visual token-based rule editing interface
   - Color-coded tokens: variables (blue), operators (green), values (purple), keywords (orange)
   - Interactive editing with dropdowns for operators
   - Copy, delete, and modify existing rules

3. **AI Chat Interface**
   - Conversational interface for rule modifications
   - Currently shows mock responses for demonstration
   - Integrated within the rule editor as a side panel

## 🎨 Component Details

### 🤖 AI Rule Builder (`ai-rule-builder.tsx`)

Mock natural language processing that demonstrates rule creation:

```typescript
// Example Input: "Create a revenue sharing rule with 25% rate and 85% traffic quality"
// Generated Output Structure:
{
  name: "Revenue Share Rule",
  category: "revenue", 
  priority: "medium",
  fields: [
    { name: "Revenue Share Rate", type: "percentage", value: "25", validation: { min: 0, max: 50 } },
    { name: "Traffic Quality", type: "percentage", value: "85", validation: { min: 0, max: 100 } }
  ]
}
```

**Pattern Recognition:**
- Revenue/commission keywords → "revenue" category
- Quality/traffic keywords → "quality" category  
- Performance/metric keywords → "performance" category
- Compliance/legal keywords → "compliance" category

### 🎯 Token Rule Editor (`token-rule-editor.tsx`)

Interactive visual editor with pre-loaded sample rules:

**Default Rules:**
- Revenue Share Rate: `Revshare_rate = 60%`
- Cost of Sales: `cost_of_sales = 75%`  
- Traffic Quality Bonus: `if traffic_quality > 70% then bonus = 1000 usd`

**Token Types:**
- **Variables** (blue): `Revshare_rate`, `traffic_quality`, `bonus`
- **Operators** (green): `=`, `>`, `<`, `>=`, `<=`, `!=`
- **Values** (purple): `60%`, `1000 USD`, `true`
- **Keywords** (orange): `if`, `then`, `else`

### 📊 Contract Management (`page.tsx`)

Frontend-only contract simulation:

- **File Upload**: Accepts PDF/DOC/DOCX files
- **Mock Data Generation**: Creates contract metadata from filenames
- **State Management**: Local React state for contract storage
- **Navigation**: Three-page flow (Home → Contracts → Rules)

### 📋 Contract Summary Panel (`contract-summary-panel.tsx`)

Displays mock AI-generated contract analysis:
- Contract overview and metadata
- Mock financial terms and timeline
- Simulated processing status
- Sample risk and opportunity assessments

## 🔧 Current Configuration

### Environment Variables

Currently no environment variables are required. The prototype runs entirely in the browser with:

- **Local State Management**: All data stored in React state
- **Mock AI Responses**: Simulated rule parsing and chat responses  
- **Static Asset Serving**: Next.js handles all static files
- **Client-Side Routing**: App Router for navigation between pages

### Customization

#### Theme Configuration

Modify `tailwind.config.js` for custom styling:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          // ... custom color palette
        }
      }
    }
  }
}
```

#### Component Customization

All UI components are built with Radix UI primitives and can be customized in `components/ui/`.

## 📁 Project Structure

```
pam-ai-rule-engine/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles and Tailwind imports
│   ├── layout.tsx               # Root layout with theme provider
│   ├── loading.tsx              # Loading component
│   └── page.tsx                 # Main application (Contract management flow)
├── components/                   # React components
│   ├── ui/                     # Shadcn/ui component library (35+ components)
│   ├── ai-rule-builder.tsx     # Natural language rule parsing UI
│   ├── contract-details.tsx    # Contract information display
│   ├── contract-form.tsx       # Contract creation/editing form
│   ├── contract-summary-panel.tsx # AI contract analysis panel
│   ├── rule-details.tsx        # Rule information display
│   ├── rule-form.tsx          # Rule creation form
│   ├── standalone-chat.tsx     # Standalone chat interface
│   ├── theme-provider.tsx      # Dark/light theme management
│   └── token-rule-editor.tsx   # Visual token-based rule editor
├── hooks/                       # Custom React hooks
│   ├── use-mobile.ts           # Mobile device detection
│   └── use-toast.ts            # Toast notification hook
├── lib/                        # Utility functions
│   └── utils.ts               # Tailwind CSS class utilities
├── documentation/              # Sample files and references
│   ├── excel files/           # Revenue data examples
│   └── sample contracts/      # Contract document examples
├── public/                     # Static assets
│   └── placeholder-*.{png,svg,jpg} # UI placeholder images
└── styles/                     # Additional styles
    └── globals.css            # Additional global styles
```

## 🤝 Development

### Code Style

- **TypeScript**: Strict mode enabled with full type coverage
- **ESLint**: Next.js recommended configuration  
- **Tailwind CSS**: Utility-first styling approach
- **Component Architecture**: Modular, reusable component design

### Current Status

This is a **frontend prototype** demonstrating:
- ✅ Complete UI/UX flow for contract management
- ✅ Visual rule creation and editing interfaces  
- ✅ Mock AI interactions and responses
- ✅ Responsive design with theme support
- ❌ No backend integration
- ❌ No real AI/LLM connectivity  
- ❌ No persistent data storage
- ❌ No authentication system

## 📦 Deployment (Frontend Only)

### Vercel (Recommended)

```bash
# Simple deployment for frontend prototype
1. Push to GitHub repository
2. Connect repository to Vercel
3. Deploy automatically (no environment variables needed)
```

### Local Development

```bash
# Build for production
pnpm build

# Start production server  
pnpm start

# Or run development server
pnpm dev
```

## 📝 Mock Data & Examples

The prototype includes sample data for demonstration:

### Contract Examples
- Auto-generated contract numbers (CTR-2024-001, CTR-2024-002, etc.)
- Partner names extracted from uploaded filenames
- Mock contract statuses (Active, Draft, Pending, Expired)

### Rule Examples  
- **Revenue Share**: `Revshare_rate = 60%`
- **Cost of Sales**: `cost_of_sales = 75%` 
- **Traffic Quality Bonus**: `if traffic_quality > 70% then bonus = 1000 usd`

### AI Response Patterns
- Revenue/commission keywords → Revenue category rules
- Quality/traffic keywords → Quality category rules
- Performance/metric keywords → Performance category rules
- Compliance/legal keywords → Compliance category rules

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Radix UI** - For accessible component primitives
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For beautiful, customizable icons

---

<div align="center">

**Frontend Prototype - PAM AI Rule Engine**

*Demonstrating modern contract management and AI-powered rule creation interfaces*

</div>
