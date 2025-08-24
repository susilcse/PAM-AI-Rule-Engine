# 🤖 PAM AI Rule Engine

> **Intelligent Contract Administration Assistant** - Transform natural language into powerful business rules

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.9-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## 🚀 Overview

The **PAM AI Rule Engine** is a cutting-edge web application that revolutionizes contract management by combining the power of artificial intelligence with intuitive rule creation. Transform complex business requirements into structured, executable rules using nothing but natural language.

### ✨ Key Features

- 🤖 **AI-Powered Rule Generation** - Describe rules in plain English
- 📋 **Contract Management** - Comprehensive contract lifecycle management
- 🎯 **Visual Rule Editor** - Token-based rule creation with drag-and-drop simplicity
- 🔍 **Smart Search & Filtering** - Find contracts and rules instantly
- 📊 **Real-time Validation** - Built-in business logic validation
- 🌙 **Dark/Light Themes** - Beautiful, accessible interface

## 🎯 What Problem Does It Solve?

Managing complex business contracts with dynamic rules can be overwhelming. Traditional approaches require:
- Technical expertise to write business logic
- Time-consuming rule creation processes
- Difficult maintenance and updates
- Risk of human error in rule definition

**PAM AI Rule Engine** eliminates these challenges by:
- Enabling natural language rule creation
- Providing instant rule validation
- Offering visual rule editing tools
- Maintaining rule consistency across contracts

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Natural       │    │   AI Rule       │    │   Token-Based   │
│   Language      │───▶│   Builder       │───▶│   Rule Editor   │
│   Input         │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Contract      │    │   Rule          │    │   Validation    │
│   Management    │    │   Management    │    │   Engine        │
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

## 📖 Usage Guide

### Creating Rules with AI

1. **Navigate to the Chat tab**
2. **Describe your rule in natural language**
   ```
   "Create a revenue sharing rule with 25% rate and 85% traffic quality threshold"
   ```
3. **Review the AI-generated rule**
4. **Select the target contract**
5. **Customize fields if needed**
6. **Create the rule**

### Managing Contracts

1. **Go to the Contracts tab**
2. **Click "New Contract" to create**
3. **Fill in contract details:**
   - Contract Number
   - Partner Name
   - Product/Service
   - Market/Region
   - Start/End Dates
   - Custom Fields
4. **Save and associate rules**

### Editing Rules

1. **Access the Rules tab**
2. **Use the Token Rule Editor for complex logic**
3. **Modify tokens (variables, operators, values)**
4. **Preview rule execution**
5. **Save changes**

## 🎨 Features in Detail

### 🤖 AI Rule Builder

The AI Rule Builder understands natural language and converts it into structured business rules:

```typescript
// Input: "Create a revenue sharing rule with 25% rate and 85% traffic quality"
// Output: Structured rule with validation
{
  name: "Revenue Share Rule",
  category: "revenue",
  fields: [
    { name: "Revenue Share Rate", type: "percentage", value: "25", validation: { min: 0, max: 50 } },
    { name: "Traffic Quality", type: "percentage", value: "85", validation: { min: 0, max: 100 } }
  ]
}
```

### 🎯 Token Rule Editor

Visual editor for complex business logic using tokens:

- **Variables**: `Revshare_rate`, `traffic_quality`, `bonus`
- **Operators**: `=`, `>`, `<`, `>=`, `<=`, `!=`
- **Values**: `60%`, `1000 USD`, `true`
- **Keywords**: `if`, `then`, `else`

### 📊 Contract Management

Comprehensive contract lifecycle management:

- **Status Tracking**: Active, Draft, Pending, Expired
- **Custom Fields**: Flexible metadata storage
- **Rule Association**: Link rules to specific contracts
- **Search & Filter**: Find contracts quickly

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Application
NEXT_PUBLIC_APP_NAME=PAM AI Rule Engine
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AI Configuration (future)
NEXT_PUBLIC_AI_ENDPOINT=https://api.openai.com/v1
NEXT_PUBLIC_AI_MODEL=gpt-4

# Database (future)
DATABASE_URL=postgresql://user:password@localhost:5432/pam_rule_engine
```

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
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main application
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── ai-rule-builder.tsx
│   ├── contract-form.tsx
│   ├── rule-form.tsx
│   └── token-rule-editor.tsx
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
└── styles/               # Additional styles
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   pnpm lint
   pnpm test
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e
```

## 📦 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Configure environment variables**
3. **Deploy automatically on push**

### Docker

```bash
# Build the image
docker build -t pam-ai-rule-engine .

# Run the container
docker run -p 3000:3000 pam-ai-rule-engine
```

### Manual Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 🔮 Roadmap

### Phase 1: Core Features ✅
- [x] AI-powered rule generation
- [x] Contract management
- [x] Token-based rule editor
- [x] Basic validation

### Phase 2: Advanced Features 🚧
- [ ] Database integration
- [ ] User authentication
- [ ] Rule templates
- [ ] Advanced AI models

### Phase 3: Enterprise Features 📋
- [ ] Multi-tenant support
- [ ] API integration
- [ ] Advanced analytics
- [ ] Workflow automation

### Phase 4: AI Enhancement 🤖
- [ ] Machine learning rule optimization
- [ ] Predictive rule suggestions
- [ ] Natural language rule testing
- [ ] Automated rule validation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Radix UI** - For accessible component primitives
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For beautiful, customizable icons

## 📞 Support

- **Documentation**: [docs.pam-rule-engine.com](https://docs.pam-rule-engine.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/pam-ai-rule-engine/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/pam-ai-rule-engine/discussions)
- **Email**: support@pam-rule-engine.com

---

<div align="center">

**Made with ❤️ by the PAM AI Rule Engine Team**

[![GitHub stars](https://img.shields.io/github/stars/your-username/pam-ai-rule-engine?style=social)](https://github.com/your-username/pam-ai-rule-engine)
[![GitHub forks](https://img.shields.io/github/forks/your-username/pam-ai-rule-engine?style=social)](https://github.com/your-username/pam-ai-rule-engine)
[![GitHub issues](https://img.shields.io/github/issues/your-username/pam-ai-rule-engine)](https://github.com/your-username/pam-ai-rule-engine/issues)

</div>
