# 🎓 Automated Lecture Development System

A sophisticated multi-agent system that automates the creation of comprehensive lecture packages through collaborative AI agents, each specializing in different aspects of educational content development.

## 📋 Overview

This system uses specialized AI agents working in coordinated phases to transform a simple lecture request into a complete teaching package including:
- Learning objectives aligned with Bloom's Taxonomy
- Concept maps and structured content
- Interactive activities and assessments
- Slide specifications
- Instructor guides and timing checklists

## 🏗️ System Architecture

The system operates in 5 distinct phases:

### Phase 1: INTAKE (Orchestrator Agent)
- Conducts structured interview with instructor
- Captures requirements, constraints, and preferences
- Generates comprehensive lecture brief

### Phase 2: ARCHITECTURE (Curriculum Architect Agent)
- Drafts measurable learning objectives
- Creates concept maps showing knowledge relationships
- Proposes lecture structure with timing

### Phase 3: PARALLEL DEVELOPMENT
Two agents work simultaneously:
- **Content Developer Agent**: Builds segment content, examples, and transitions
- **Pedagogy Designer Agent**: Creates activities, assessments, and engagement strategies

### Phase 4: VISUAL DESIGN (Visual Designer Agent)
- Creates detailed slide specifications
- Designs visual elements and layouts
- Builds navigation and signposting system

### Phase 5: INTEGRATION (Integration Agent)
- Assembles complete lecture package
- Generates instructor guide
- Creates timing checklists and supporting documents

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd teaching-app
```

2. Install dependencies:
```bash
npm install
```

3. Configure your OpenAI API key:
```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

### Running the System

Start the application:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## 📖 Usage

When you run the system, you'll be guided through an interactive process:

1. **Initial Interview**: Answer questions about your lecture topic, duration, audience, and goals
2. **Architecture Review**: Review and approve learning objectives and structure
3. **Development Checkpoint**: Confirm content and activity alignment
4. **Visual Review**: Approve slide design specifications
5. **Final Approval**: Review complete package before export

## 📦 Output

The system generates a complete lecture package including:

- **lecture-package.json**: Complete structured data
- **instructor-guide.md**: Detailed teaching guide
- **slides.md**: Slide specifications
- **timing-checklist.csv**: Minute-by-minute runsheet

All files are saved to `output/lecture-[timestamp]/`

## 🔧 Configuration

Edit `.env` file to customize:

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4-turbo-preview  # Model to use
TEMPERATURE=0.7                    # Creativity level (0.0-1.0)
```

## 🏛️ Project Structure

```
teaching-app/
├── src/
│   ├── agents/              # Individual agent implementations
│   │   ├── base-agent.ts
│   │   ├── orchestrator-agent.ts
│   │   ├── curriculum-architect-agent.ts
│   │   ├── content-developer-agent.ts
│   │   ├── pedagogy-designer-agent.ts
│   │   ├── visual-designer-agent.ts
│   │   └── integration-agent.ts
│   ├── services/            # Core services
│   │   └── ai-service.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── workflow/            # Workflow coordination
│   │   └── coordinator.ts
│   └── index.ts             # Main application entry
├── output/                  # Generated lecture packages
├── .env.example             # Environment template
├── tsconfig.json            # TypeScript configuration
└── package.json
```

## 🎯 Features

- **Structured Intake Process**: Comprehensive requirement gathering
- **Bloom's Taxonomy Integration**: Learning objectives at appropriate cognitive levels
- **Parallel Processing**: Content and pedagogy developed simultaneously for efficiency
- **Quality Checkpoints**: Human review at critical stages
- **Flexible Output**: Multiple export formats for different use cases
- **Scalable Design**: Easily extendable with new agents or capabilities

## 🛡️ Best Practices

1. **Clear Requirements**: Provide detailed information during intake for best results
2. **Review Checkpoints**: Carefully review at each checkpoint to ensure quality
3. **Iterative Refinement**: Use feedback to improve subsequent generations
4. **Time Management**: Allow sufficient duration for comprehensive content

## 📝 License

ISC License

## 🤝 Contributing

Contributions are welcome! Areas for enhancement:
- Additional activity types and pedagogical strategies
- Support for different presentation formats
- Integration with slide creation tools
- Multi-language support
- Assessment generation improvements

## 🔮 Future Enhancements

- Direct PowerPoint/Google Slides generation
- Video lecture script creation
- Student handout generation
- Automatic quiz and homework creation
- LMS integration
- Real-time collaboration features