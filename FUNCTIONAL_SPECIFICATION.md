# 🎲 Ludex - Functional Specification for Designer

## Overview

This document outlines **what the UI needs to do**, not how it should look. You have complete creative freedom to design the interface as you see fit, as long as all functionalities are preserved.

**Deliverable**: HTML/CSS files (static) that implement all the functional requirements below.

---

## Product Description

**Ludex** is an AI-powered board game rulebook companion. Users upload PDF rulebooks, and the app uses AI to extract, organize, and make rules accessible through an interactive interface with an AI chat assistant.

**Tagline**: "Turn PDFs into Play"

---

## Core Functionalities

### 1. Authentication
- **Requirement**: Users must sign in with Google OAuth before accessing the app
- **Unauthenticated State**: Show welcome screen with sign-in button
- **Authenticated State**: Show full application interface
- **Implementation Note**: Authentication is handled by NextAuth.js - you'll need to include a sign-in button that triggers the OAuth flow

### 2. PDF Upload
- **Requirement**: Users can upload PDF rulebook files
- **Functionality**:
  - File input that accepts `.pdf` files only
  - Upload button/action
  - Show upload progress/status
  - Display error messages if upload fails
- **After Upload**: Redirect to game detail page (or show success message)

### 3. Game Library
- **Requirement**: Display all user's uploaded games in a grid/list view
- **Each Game Card Must Show**:
  - Game title
  - Game image (if available) or placeholder
  - Status badge (processing/completed/error)
  - Date created (optional)
- **Functionality**:
  - Click on game card → navigate to game detail page
  - Auto-refresh every 5 seconds to show status updates
  - Empty state when no games exist
- **Status Types**:
  - **Processing**: Game is being analyzed by AI
  - **Completed**: Game is ready to view
  - **Error**: Processing failed

### 4. Game Detail Page
- **Requirement**: Show detailed information about a specific game
- **Must Include**:
  - Game title (large, prominent)
  - Game image (if available) or placeholder
  - Status badge
  - Link to download original PDF
  - Button to generate image (if image doesn't exist)
- **Tabbed Interface** (4 tabs):
  - **Rules Tab**: Display organized sections from rulebook
  - **Strategy Tab**: Display AI-extracted strategy tips
  - **Quick Start Tab**: Display setup, first turn, and key rules
  - **Chat Tab**: AI chat interface for asking questions
- **Status Alerts**:
  - Show processing message if status is "processing"
  - Show error message if status is "error"
  - Hide content tabs if not completed

### 5. Rules Tab Content
- **Requirement**: Display organized rulebook sections
- **Data Structure**: Array of sections, each with:
  - `title` (string)
  - `content` (string, may contain line breaks)
  - `order` (number, optional)
- **Display**: List or cards showing each section with title and content

### 6. Strategy Tab Content
- **Requirement**: Display AI-extracted strategy tips
- **Data Structure**: Array of tips, each with:
  - `tip` (string)
  - `category` (string)
- **Display**: Show tips grouped by category or as individual items

### 7. Quick Start Tab Content
- **Requirement**: Display quick-start guide
- **Data Structure**: Object with:
  - `setup` (string)
  - `firstTurn` (string)
  - `keyRules` (array of strings)
- **Display**: Three sections (Setup, First Turn, Key Rules)

### 8. Chat Interface
- **Requirement**: AI-powered chat assistant for asking game rule questions
- **Functionality**:
  - Text input field
  - Send button
  - Message display area showing conversation history
  - User messages (right-aligned or distinct style)
  - AI assistant messages (left-aligned or distinct style)
  - Loading indicator when AI is thinking
  - Empty state message when no conversation exists
- **Behavior**:
  - Send message → show user message immediately
  - Show loading state
  - Display AI response when received
  - Auto-scroll to latest message
  - Maintain conversation history

### 9. Navigation
- **Requirement**: Users can navigate between pages
- **Routes**:
  - `/` - Home/Library page
  - `/game/[id]` - Game detail page
- **Navigation Elements**:
  - Back button on game detail page (to return to library)
  - Logo/branding (clickable to go home, optional)

### 10. Loading States
- **Requirement**: Show loading indicators during async operations
- **Scenarios**:
  - Initial page load
  - Fetching games list
  - Uploading PDF
  - Processing game
  - Sending chat message
  - Generating image

### 11. Error States
- **Requirement**: Display error messages clearly
- **Scenarios**:
  - Upload failure
  - Processing error
  - API errors
  - Network errors

### 12. Empty States
- **Requirement**: Friendly messages when no content exists
- **Scenarios**:
  - No games uploaded yet
  - No chat messages yet
  - No content in a tab

---

## Data Structures

### Game Object
```javascript
{
  gameId: string,
  title: string,
  status: "processing" | "completed" | "error",
  ogImageUrl: string | null,
  pdfUrl: string | null,
  createdAt: string (ISO date),
  sections: Array<{
    title: string,
    content: string,
    order: number
  }>,
  strategyTips: Array<{
    tip: string,
    category: string
  }>,
  quickStart: {
    setup: string,
    firstTurn: string,
    keyRules: Array<string>
  },
  errorMessage: string | null
}
```

### Chat Message Object
```javascript
{
  role: "user" | "assistant",
  content: string,
  timestamp: string (ISO date)
}
```

---

## API Endpoints (For Reference)

The designer doesn't need to implement these, but should know what data is available:

- `GET /api/games` - Returns array of user's games
- `GET /api/games/[id]` - Returns single game object
- `POST /api/upload` - Uploads PDF, returns `{ gameId: string }`
- `POST /api/chat` - Sends chat message, returns `{ messages: Array, conversationId: string }`
- `POST /api/image` - Generates game image, returns `{ imageUrl: string }`

---

## User Flows

### Flow 1: New User
1. Land on homepage → See welcome screen
2. Click "Sign in with Google" → Authenticate
3. Redirected to library (empty state)
4. Upload PDF → See upload progress
5. Redirected to game detail page (processing state)
6. Wait for processing → Status updates automatically
7. View completed game → See all tabs with content

### Flow 2: Returning User
1. Land on homepage → Auto-authenticated (if session exists)
2. See library with game cards
3. Click game card → View game detail
4. Navigate between tabs → See different content
5. Use chat → Ask questions, get answers
6. Click back → Return to library

### Flow 3: Upload New Game
1. From library → Click upload area
2. Select PDF file → Click upload
3. See upload progress → Redirect to game detail
4. See processing status → Wait for completion
5. View completed game

---

## Technical Constraints

### Framework
- **Current**: Next.js 14 with React
- **Your Deliverable**: Static HTML/CSS files
- **Note**: The HTML will be integrated into React components, so use semantic HTML and avoid framework-specific code

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive (iOS Safari, Chrome Mobile)

### Performance
- Optimize images
- Minimize CSS file size
- Use efficient selectors

### Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly

---

## Design Freedom

**You have complete creative freedom to:**
- Choose color schemes
- Design layout and structure
- Create visual style and aesthetics
- Design icons and graphics
- Create animations and transitions
- Organize information hierarchy
- Design components and patterns

**As long as:**
- All functionalities listed above are preserved
- The UI is responsive (mobile, tablet, desktop)
- The interface is accessible
- The code is clean and maintainable

---

## Required Deliverables

### 1. HTML Files
- `index.html` - Home/Library page
- `game-detail.html` - Game detail page (with all tabs)
- `components.html` (optional) - Reusable component examples

### 2. CSS Files
- `styles.css` - Main stylesheet
- Or organized CSS files (your preference)

### 3. Assets
- Images, icons, fonts (if custom)
- Image placeholders for games
- Logo/branding elements

### 4. Documentation
- Brief notes on:
  - Color palette used
  - Typography choices
  - Component structure
  - Any special considerations

---

## Example HTML Structure (Reference Only)

You can structure it however you want, but here's a basic reference:

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <!-- Logo, Auth Button -->
  </header>
  <main>
    <!-- Upload Section -->
    <section class="upload-section">
      <!-- File input, upload button -->
    </section>
    
    <!-- Games Grid -->
    <section class="games-grid">
      <!-- Game Cards -->
      <div class="game-card">
        <!-- Image, Title, Status -->
      </div>
    </section>
  </main>
</body>
</html>
```

```html
<!-- game-detail.html -->
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <!-- Back button, Auth button -->
  </header>
  <main>
    <!-- Game Header -->
    <section class="game-header">
      <!-- Image, Title, Status, PDF link -->
    </section>
    
    <!-- Tabs -->
    <nav class="tabs">
      <!-- Rules, Strategy, Quick Start, Chat -->
    </nav>
    
    <!-- Tab Content -->
    <section class="tab-content">
      <!-- Rules content, Strategy content, etc. -->
    </section>
    
    <!-- Chat Interface -->
    <section class="chat-interface">
      <!-- Messages, Input, Send button -->
    </section>
  </main>
</body>
</html>
```

---

## Questions?

If you need clarification on any functionality or have questions about the requirements, please ask before starting the design.

---

## Checklist for Designer

Before submitting, ensure:

- [ ] All pages are included (home, game detail)
- [ ] All functionalities are implemented
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Loading states are designed
- [ ] Error states are designed
- [ ] Empty states are designed
- [ ] All status types are styled (processing, completed, error)
- [ ] Chat interface is functional
- [ ] Tab navigation works
- [ ] Forms are styled (upload, chat input)
- [ ] Buttons and interactive elements are styled
- [ ] Code is clean and commented
- [ ] Assets are included
- [ ] Documentation is provided

---

**Good luck with the design! We're excited to see your creative vision!** 🎨✨

