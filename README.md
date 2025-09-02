# PAM AI Rule Engine

Partner Agreement Management with AI-Powered Rule Creation Interface

## Overview

PAM AI Rule Engine is a Next.js application that demonstrates intelligent contract management and rule creation through AI-assisted natural language processing and visual token-based editing.

## Features

### Contract Management
- PDF contract upload and processing
- Contract metadata extraction and tracking
- Contract summary panel with AI-generated analysis
- Local file storage with automatic cleanup

### AI Rule Extraction
- OpenAI GPT-4o-mini integration for rule extraction
- Automatic detection of Exhibit D and revenue sharing tables
- Conversion of natural language to tokenized logic
- Structured rule output with categorization

### Visual Rule Editor
- Token-based rule editing interface
- Color-coded tokens (variables, operators, values, keywords)
- IF-THEN logic representation
- Real-time rule modification and validation

### AI Chat Interface
- Conversational interface for rule modifications
- Natural language rule creation
- Pattern recognition for different rule types

## Technology Stack

- Next.js 15 with App Router
- React 19 with TypeScript
- Tailwind CSS 4
- Radix UI components
- OpenAI API integration
- PDF parsing with pdf-parse

## Quick Start

### Prerequisites
- Node.js 18.17+
- pnpm or npm
- OpenAI API key

### Installation

```bash
git clone <repository-url>
cd PAM-AI-Rule-Engine
pnpm install
```

### Environment Setup

Create `.env.local` file:
```
OPENAI_API_KEY=your_openai_api_key_here
```

**Note**: The `contract-rules` and `temp-contracts` directories will be created automatically when you first upload a contract.

### Development

```bash
pnpm dev
```

Navigate to http://localhost:3000

## Project Structure

```
app/
├── api/contracts/analyze/route.ts    # PDF analysis endpoint
├── api/contracts/[id]/rules/route.ts # Rule retrieval endpoint
├── globals.css
├── layout.tsx
└── page.tsx                          # Main application

components/
├── ai-rule-builder.tsx               # Natural language rule parsing
├── contract-summary-panel.tsx        # Contract analysis display
├── token-rule-editor.tsx             # Visual rule editor
├── standalone-chat.tsx               # AI chat interface
└── ui/                               # Shadcn/ui components

lib/
├── config.ts                         # Configuration management
├── file-utils.ts                     # File operations
└── openai-service.ts                 # OpenAI API integration

contract-rules/                       # Generated rule storage
temp-contracts/                       # Temporary PDF storage
```

## API Endpoints

### POST /api/contracts/analyze
- Uploads and analyzes PDF contracts
- Extracts revenue sharing rules using OpenAI
- Returns structured token-based rules

### GET /api/contracts/[id]/rules
- Retrieves saved rules for a contract
- Returns both original and edited versions

## Usage Flow

1. Upload PDF contract via file interface
2. System extracts text and sends to OpenAI for analysis
3. AI returns structured token-based rules
4. Rules displayed in editable token interface
5. User can modify rules using visual editor
6. Changes saved locally for persistence

## Current Status

### Completed
- Complete UI/UX flow for contract management
- Visual rule creation and editing interfaces
- OpenAI integration for rule extraction
- PDF processing and text extraction
- Local file storage and persistence
- Responsive design with theme support

### In Progress
- Rule validation and error handling improvements
- Enhanced AI prompt engineering
- Performance optimization for large PDFs

## TODOs

### High Priority
- Add user authentication and authorization
- Implement database storage instead of file system
- Add rule versioning and history tracking
- Create rule templates and presets
- Add bulk contract processing

### Medium Priority
- Implement rule testing and validation
- Add export functionality (JSON, CSV, Excel)
- Create rule comparison and diff tools
- Add contract template management
- Implement rule approval workflows

### Low Priority
- Add multi-language support
- Create mobile app version
- Implement real-time collaboration
- Add advanced analytics and reporting
- Create API documentation

## Development

### Code Style
- TypeScript strict mode
- ESLint with Next.js configuration
- Tailwind CSS utility-first approach
- Modular component architecture

### Scripts
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## License

MIT License
