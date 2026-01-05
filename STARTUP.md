# 🚀 Quick Start Guide - Lecture Development System

## Prerequisites
- Node.js (v16 or higher)
- OpenAI API key

## Setup Instructions

### 1. Configure Environment Variables

#### Backend Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=your_api_key_here
```

#### Frontend Configuration (optional)
```bash
# Navigate to client directory
cd client

# Copy the example environment file
cp .env.example .env

# Default values should work for local development
cd ..
```

### 2. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Start the Application

You have several options to run the application:

#### Option A: Run Full Stack (Recommended)
```bash
# This starts both backend and frontend
npm run dev:full
```

#### Option B: Run Services Separately

Terminal 1 - Backend Server:
```bash
npm run server:dev
```

Terminal 2 - Frontend:
```bash
npm run client
```

#### Option C: Run CLI Only (No Web Interface)
```bash
npm start
```

## 📍 Access Points

Once running, you can access:

- **Frontend Web Interface**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🎓 Using the Application

### Web Interface (http://localhost:3000)

1. **Dashboard**: View system overview and features
2. **Create Lecture**: Start the 5-phase workflow
   - Phase 1: Fill out the intake form
   - Phase 2: Review architecture (auto-generated)
   - Phase 3: Watch parallel development
   - Phase 4: See visual design creation
   - Phase 5: Download your complete package

### CLI Interface

Run `npm start` and follow the interactive prompts.

## 📦 Output

Generated lecture packages are saved to:
- `output/lecture-[timestamp]/`

Each package includes:
- `lecture-package.json` - Complete structured data
- `instructor-guide.md` - Teaching guide
- `slides.md` - Slide specifications
- `timing-checklist.csv` - Minute-by-minute schedule
- `preview.html` - Visual preview

## 🛠️ Development Commands

```bash
# Build TypeScript
npm run build

# Run backend server only
npm run server

# Run frontend only
npm run client

# Clean build artifacts
npm run clean
```

## 🔧 Troubleshooting

### Port Already in Use
If port 3000 or 5000 is already in use:
- Backend: Set `PORT=5001` in .env
- Frontend: The React app will prompt for a different port

### OpenAI API Errors
- Verify your API key is correct in .env
- Check your OpenAI account has credits
- Ensure you're using a valid model (gpt-4-turbo-preview)

### Connection Issues
- Ensure both backend and frontend are running
- Check firewall settings
- Verify CORS settings if accessing from different domain

## 📊 System Architecture

```
Frontend (React) :3000
    ↓ HTTP/WebSocket
Backend (Express) :5000
    ↓ API Calls
OpenAI API (GPT-4)
```

## 🎯 Quick Test

1. Start the full stack: `npm run dev:full`
2. Navigate to http://localhost:3000
3. Click "Create Lecture"
4. Fill out the intake form with test data:
   - Title: "Introduction to AI"
   - Topic: "Artificial Intelligence Basics"
   - Duration: 50 minutes
   - Level: Beginner
   - Prerequisites: Basic computer knowledge
   - Goals: Understand AI concepts, Know applications
5. Submit and watch the multi-agent system work!

## 💡 Tips

- The system uses WebSockets for real-time updates
- Each phase has checkpoints for quality control
- You can download packages in ZIP or JSON format
- The CLI version works without the web interface
- All agents run with GPT-4 for best quality

## 📚 Documentation

For detailed documentation, see:
- [README.md](README.md) - Full system documentation
- [API Routes](src/server/routes/) - Backend API documentation
- [Components](client/src/components/) - Frontend component docs

## 🆘 Support

If you encounter issues:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure environment variables are set
4. Check the [README.md](README.md) for detailed information

---

**Ready to create amazing lectures!** 🎓✨