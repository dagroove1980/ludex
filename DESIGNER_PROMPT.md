# 🎨 Ludex - Complete Design Brief & Functional Specification

## 🎯 Design Starting Point

### ⭐ PRIMARY DESIGN REFERENCE - STITCH DESIGN FILES

**You have been provided with complete Stitch design files in the `stitch_welcome_game_library/` folder. Use these as your foundation:**

#### Available Design Files:

1. **`welcome_&_game_library/code.html`**
   - Welcome screen (unauthenticated state)
   - Game library with uploaded games
   - Upload form
   - Use this for the Home/Library page (`index.html`)

2. **`game_detail_&_chat/code.html`**
   - Game detail page with tabs
   - Chat interface
   - Use this for the Game Detail page (`game-detail.html`)

3. **`game_library_empty_state/code.html`**
   - Empty state when no games exist
   - Integrate into the library page

4. **`chat_empty_state/code.html`**
   - Empty chat state
   - Integrate into the chat tab

5. **`rules_tab_content/code.html`**
   - Rules tab content design
   - Use for the Rules tab content

6. **`strategy_tab_content/code.html`**
   - Strategy tab content design
   - Use for the Strategy tab content

7. **`quick_start_tab_content/code.html`**
   - Quick Start tab content design
   - Use for the Quick Start tab content

### How to Use These Files

1. **Review All Files**: Open each HTML file in a browser to see the designs
2. **Extract Design System**: Note the color palette, typography, and component patterns
3. **Combine & Adapt**: Merge the designs into two main files:
   - `index.html` - Combine welcome + game library + empty state
   - `game-detail.html` - Combine game detail + all tab contents + chat
4. **Ensure Completeness**: Make sure all functional requirements below are met
5. **Maintain Consistency**: Keep the design system consistent across all pages

### Design System from Stitch Files

Based on the provided files, the design uses:

- **Primary Color**: `#7f13ec` (purple)
- **Background**: Light `#f7f6f8` / Dark `#191022`
- **Typography**: Inter font family
- **Icons**: Material Symbols Outlined
- **Framework**: Tailwind CSS
- **Theme**: Dark mode support (`dark` class)
- **Style**: Modern, clean, gaming-focused aesthetic

### What to Do

- ✅ Use the provided HTML files as your starting point
- ✅ Extract and consolidate the CSS/styles
- ✅ Combine related designs into single pages
- ✅ Ensure all functional requirements are met
- ✅ Maintain the design system consistency
- ✅ Keep responsive design (the files include mobile/desktop layouts)

**Note**: Google Stitch is an AI-powered design tool ([reference](https://techcrunch.com/2025/05/20/google-launches-stitch-an-ai-powered-tool-to-help-design-apps/)) that can generate UI designs and export front-end code. Use the project as your foundation and adapt it to our needs.

---

## Overview

**Ludex** is an AI-powered board game rulebook companion. Users upload PDF rulebooks, and the app uses AI to extract, organize, and make rules accessible through an interactive interface with an AI chat assistant.

**Tagline**: "Turn PDFs into Play"

**Your Task**: Design and build static HTML/CSS files that implement all functionalities listed below. Use the Google Stitch project above as your design foundation, adapting it to match all functional requirements.

**Deliverable**: Static HTML/CSS files (no JavaScript required - functionality will be handled by React integration)

---

## 🎯 Your Creative Freedom

**You can:**
- ✅ Choose any color scheme, palette, or visual style
- ✅ Design any layout structure and organization
- ✅ Create any aesthetic (modern, fantasy, minimalist, etc.)
- ✅ Use any design system or component library approach
- ✅ Add animations, transitions, and micro-interactions
- ✅ Organize information hierarchy however you want
- ✅ Design icons, graphics, and visual elements
- ✅ Create any branding/logo concepts

**You must:**
- ⚠️ Preserve ALL functionalities listed below
- ⚠️ Ensure responsive design (mobile, tablet, desktop)
- ⚠️ Maintain accessibility (semantic HTML, ARIA where needed)
- ⚠️ Use clean, maintainable code

---

## 📋 Functional Requirements

### 1. Authentication

**Requirement**: Users must sign in with Google OAuth before accessing the app.

**UI Needs**:
- **Unauthenticated State**: Show welcome screen with sign-in button
- **Authenticated State**: Show full application interface
- **Sign-in Button**: Must be present and functional (triggers OAuth flow)

**Design Freedom**: Style the welcome screen and sign-in button however you want.

---

### 2. PDF Upload

**Requirement**: Users can upload PDF rulebook files.

**UI Needs**:
- File input that accepts `.pdf` files only
- Upload button/action trigger
- Visual feedback for upload progress/status
- Error message display if upload fails
- After successful upload: redirect indication or success message

**Design Freedom**: Design the upload area however you want (drag-and-drop zone, button, form, etc.).

---

### 3. Game Library (Home Page)

**Requirement**: Display all user's uploaded games in a grid/list view.

**UI Needs**:
- **Game Cards** - Each must show:
  - Game title
  - Game image (if available) or placeholder
  - Status badge with one of three states:
    - **Processing**: Game is being analyzed by AI
    - **Completed**: Game is ready to view
    - **Error**: Processing failed
  - Date created (optional but recommended)
- **Clickable Cards**: Clicking a game card navigates to game detail page
- **Auto-refresh**: Visual indication that status updates automatically (every 5 seconds)
- **Empty State**: Friendly message when no games exist, with call-to-action to upload

**Design Freedom**: Design cards, grid layout, empty state however you want.

---

### 4. Game Detail Page

**Requirement**: Show detailed information about a specific game.

**UI Needs**:
- **Game Header Section**:
  - Game title (large, prominent)
  - Game image (if available) or placeholder
  - Status badge (processing/completed/error)
  - Link/button to download original PDF
  - Button to generate image (if image doesn't exist)
- **Tabbed Interface** (4 tabs):
  - **Rules Tab**: Display organized sections from rulebook
  - **Strategy Tab**: Display AI-extracted strategy tips
  - **Quick Start Tab**: Display setup, first turn, and key rules
  - **Chat Tab**: AI chat interface for asking questions
- **Status Alerts**:
  - Show processing message if status is "processing"
  - Show error message if status is "error"
  - Hide content tabs if game is not completed

**Design Freedom**: Design header, tabs, content layout however you want.

---

### 5. Rules Tab Content

**Requirement**: Display organized rulebook sections.

**Data Structure**: Array of sections, each with:
- `title` (string)
- `content` (string, may contain line breaks)
- `order` (number, optional)

**UI Needs**: Display sections with titles and content in an organized way.

**Design Freedom**: Cards, list, accordion, etc. - your choice.

---

### 6. Strategy Tab Content

**Requirement**: Display AI-extracted strategy tips.

**Data Structure**: Array of tips, each with:
- `tip` (string)
- `category` (string)

**UI Needs**: Show tips, optionally grouped by category.

**Design Freedom**: Cards, list, grouped sections, etc. - your choice.

---

### 7. Quick Start Tab Content

**Requirement**: Display quick-start guide.

**Data Structure**: Object with:
- `setup` (string)
- `firstTurn` (string)
- `keyRules` (array of strings)

**UI Needs**: Display three sections: Setup, First Turn, Key Rules.

**Design Freedom**: Organize however you want.

---

### 8. Chat Interface

**Requirement**: AI-powered chat assistant for asking game rule questions.

**UI Needs**:
- Text input field
- Send button
- Message display area showing conversation history
- **User Messages**: Distinct style (right-aligned or visually distinct)
- **AI Assistant Messages**: Distinct style (left-aligned or visually distinct)
- Loading indicator when AI is thinking
- Empty state message when no conversation exists
- Auto-scroll to latest message (visual indication)

**Design Freedom**: Design chat bubbles, input area, layout however you want.

---

### 9. Navigation

**Requirement**: Users can navigate between pages.

**Routes**:
- `/` - Home/Library page
- `/game/[id]` - Game detail page

**UI Needs**:
- Back button on game detail page (to return to library)
- Logo/branding (clickable to go home, optional)

**Design Freedom**: Design navigation elements however you want.

---

### 10. Loading States

**Requirement**: Show loading indicators during async operations.

**Scenarios**:
- Initial page load
- Fetching games list
- Uploading PDF
- Processing game
- Sending chat message
- Generating image

**Design Freedom**: Spinners, skeletons, progress bars, etc. - your choice.

---

### 11. Error States

**Requirement**: Display error messages clearly.

**Scenarios**:
- Upload failure
- Processing error
- API errors
- Network errors

**Design Freedom**: Style error messages however you want.

---

### 12. Empty States

**Requirement**: Friendly messages when no content exists.

**Scenarios**:
- No games uploaded yet
- No chat messages yet
- No content in a tab

**Design Freedom**: Design empty states however you want.

---

## 📊 Data Structures (For Reference)

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

## 🔄 User Flows

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

## 💻 Technical Constraints

### Framework Integration
- **Current**: Next.js 14 with React
- **Your Deliverable**: Static HTML/CSS files
- **Integration**: HTML will be integrated into React components
- **Requirement**: Use semantic HTML, avoid framework-specific code

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive (iOS Safari, Chrome Mobile)

### Performance
- Optimize images
- Minimize CSS file size
- Use efficient CSS selectors

### Accessibility
- Semantic HTML (header, nav, main, section, article, etc.)
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly
- WCAG AA compliance recommended

### CSS Approach
- Any approach is fine (vanilla CSS, organized files, etc.)
- No JavaScript required (functionality handled by React)
- Use CSS variables for theming (recommended for easy customization)

---

## 📦 Required Deliverables

### 1. HTML Files

**Primary Files** (consolidate from Stitch designs):
- `index.html` - Home/Library page
  - Combine: `welcome_&_game_library/code.html` + `game_library_empty_state/code.html`
  - Include: Welcome screen, upload form, game grid, empty state
  
- `game-detail.html` - Game detail page
  - Combine: `game_detail_&_chat/code.html` + `rules_tab_content/code.html` + `strategy_tab_content/code.html` + `quick_start_tab_content/code.html` + `chat_empty_state/code.html`
  - Include: Game header, tabs, all tab contents, chat interface

**Note**: The Stitch files are separate components - consolidate them into these two main pages.

### 2. CSS Files

**Options**:
- Extract inline styles from Stitch HTML files into `styles.css`
- Or keep Tailwind CDN approach (as in Stitch files)
- Include all custom styles (scrollbars, animations, etc.)
- Ensure responsive styles are included

**From Stitch Files, Extract**:
- Tailwind config (colors, fonts, border radius)
- Custom scrollbar styles
- Animation keyframes
- Any custom CSS

### 3. Assets

**From Stitch Files**:
- Material Icons (via Google Fonts CDN - already included)
- Inter font (via Google Fonts CDN - already included)
- Image placeholders (use the same approach as Stitch files)

**Additional**:
- Logo/branding elements (if you create custom ones)
- Any decorative elements

### 4. Documentation

- Brief notes on:
  - How you consolidated the Stitch files
  - Any modifications made
  - Component structure
  - Special considerations
  - File organization

---

## 📐 Working with Stitch Files

**📖 See `STITCH_FILES_GUIDE.md` for detailed mapping and consolidation instructions.**

### File Structure

The Stitch files are organized by component/page state. Your task is to consolidate them:

```
stitch_welcome_game_library/
├── welcome_&_game_library/code.html      → Use for index.html
├── game_library_empty_state/code.html    → Integrate into index.html
├── game_detail_&_chat/code.html          → Use for game-detail.html
├── rules_tab_content/code.html           → Integrate into game-detail.html
├── strategy_tab_content/code.html        → Integrate into game-detail.html
├── quick_start_tab_content/code.html      → Integrate into game-detail.html
└── chat_empty_state/code.html            → Integrate into game-detail.html
```

### Consolidation Strategy

1. **For `index.html`**:
   - Start with `welcome_&_game_library/code.html`
   - Add empty state section from `game_library_empty_state/code.html`
   - Ensure both authenticated and unauthenticated states are included

2. **For `game-detail.html`**:
   - Start with `game_detail_&_chat/code.html`
   - Add tab content from:
     - `rules_tab_content/code.html` → Rules tab
     - `strategy_tab_content/code.html` → Strategy tab
     - `quick_start_tab_content/code.html` → Quick Start tab
   - Add chat empty state from `chat_empty_state/code.html`

### Design System Extraction

All Stitch files use consistent:
- **Tailwind Config**: Extract and consolidate into one config
- **Color Palette**: `primary: #7f13ec`, backgrounds, surfaces
- **Typography**: Inter font family
- **Icons**: Material Symbols Outlined
- **Dark Mode**: `dark` class support

### Example HTML Structure (Reference)

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ludex - Board Game Companion</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <!-- Logo, Auth Button -->
  </header>
  
  <main>
    <!-- Welcome Section (if not authenticated) -->
    <section class="welcome-section">
      <!-- Sign-in button -->
    </section>
    
    <!-- Upload Section (if authenticated) -->
    <section class="upload-section">
      <!-- File input, upload button -->
    </section>
    
    <!-- Games Grid (if authenticated) -->
    <section class="games-grid">
      <!-- Game Cards -->
      <article class="game-card">
        <!-- Image, Title, Status Badge, Date -->
      </article>
    </section>
    
    <!-- Empty State (if no games) -->
    <section class="empty-state">
      <!-- Message, CTA -->
    </section>
  </main>
</body>
</html>
```

```html
<!-- game-detail.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Game Title - Ludex</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <!-- Back button, Auth button -->
  </header>
  
  <main>
    <!-- Game Header -->
    <section class="game-header">
      <!-- Image, Title, Status, PDF link, Generate image button -->
    </section>
    
    <!-- Status Alerts -->
    <section class="status-alert processing">
      <!-- Processing message -->
    </section>
    
    <section class="status-alert error">
      <!-- Error message -->
    </section>
    
    <!-- Tabs Navigation -->
    <nav class="tabs">
      <button class="tab active">Rules</button>
      <button class="tab">Strategy</button>
      <button class="tab">Quick Start</button>
      <button class="tab">Chat</button>
    </nav>
    
    <!-- Tab Content -->
    <section class="tab-content">
      <!-- Rules Tab -->
      <div class="tab-panel active" data-tab="rules">
        <!-- Sections -->
        <article class="section">
          <h3>Section Title</h3>
          <p>Section content...</p>
        </article>
      </div>
      
      <!-- Strategy Tab -->
      <div class="tab-panel" data-tab="strategy">
        <!-- Strategy Tips -->
        <article class="strategy-tip">
          <span class="category">Category</span>
          <p>Tip content...</p>
        </article>
      </div>
      
      <!-- Quick Start Tab -->
      <div class="tab-panel" data-tab="quickstart">
        <section class="quickstart-section">
          <h3>Setup</h3>
          <p>Setup content...</p>
        </section>
        <section class="quickstart-section">
          <h3>First Turn</h3>
          <p>First turn content...</p>
        </section>
        <section class="quickstart-section">
          <h3>Key Rules</h3>
          <ul>
            <li>Rule 1</li>
            <li>Rule 2</li>
          </ul>
        </section>
      </div>
      
      <!-- Chat Tab -->
      <div class="tab-panel" data-tab="chat">
        <div class="chat-interface">
          <div class="chat-messages">
            <div class="message user">
              <p>User message</p>
            </div>
            <div class="message assistant">
              <p>AI response</p>
            </div>
          </div>
          <form class="chat-input">
            <input type="text" placeholder="Ask a question...">
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </section>
  </main>
</body>
</html>
```

---

## ✅ Pre-Submission Checklist

Before submitting, ensure:

- [ ] All pages are included (home, game detail)
- [ ] All functionalities are implemented
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Loading states are designed
- [ ] Error states are designed
- [ ] Empty states are designed
- [ ] All status types are styled (processing, completed, error)
- [ ] Chat interface is functional (visually)
- [ ] Tab navigation is styled
- [ ] Forms are styled (upload, chat input)
- [ ] Buttons and interactive elements are styled
- [ ] Code is clean and commented
- [ ] Assets are included
- [ ] Documentation is provided
- [ ] Semantic HTML is used
- [ ] Accessibility considerations are met

---

## 🎨 Design Reference

**Primary Design Source**: Use the Google Stitch project as your main design reference:
**https://stitch.withgoogle.com/projects/3887451076520624692**

The Stitch project should guide:
- Color palette and visual style
- Typography choices
- Component design patterns
- Layout structure
- Overall aesthetic

**Additional Inspiration** (if needed):
- **Theme**: Fantasy/board games aesthetic (like premium board game rulebooks)
- **Colors**: Deep purples, golds, rich colors
- **Typography**: Mix of elegant serif headers and readable sans-serif body
- **Style**: Premium, crafted feel

**Important**: Adapt the Stitch design to ensure all functional requirements below are met.

---

## 📝 Notes

### Working with Provided Stitch Files

**File Locations**: All Stitch design files are in `/stitch_welcome_game_library/` folder

**Key Steps**:
1. **Open each HTML file** in a browser to preview the designs
2. **Extract common elements**:
   - Tailwind config (colors, fonts, etc.)
   - Custom CSS (scrollbars, animations)
   - Component patterns
3. **Consolidate into two main files**:
   - `index.html` - Home/Library (combine welcome + library + empty state)
   - `game-detail.html` - Game detail (combine detail + all tabs + chat)
4. **Ensure all states are included**:
   - Authenticated/unauthenticated
   - Empty states
   - Loading states
   - Error states
5. **Maintain design consistency** across all pages

### Design System from Stitch Files

**Colors** (from Tailwind config in files):
- Primary: `#7f13ec`
- Background Light: `#f7f6f8`
- Background Dark: `#191022`
- Surface Dark: `#231b2e` / `#241a30`

**Typography**:
- Font: Inter (Google Fonts)
- Weights: 400, 500, 600, 700, 800, 900

**Icons**:
- Material Symbols Outlined (Google Fonts)

**Framework**:
- Tailwind CSS (via CDN in files)
- Dark mode via `dark` class on `<html>`

### Integration Notes

- The HTML will be integrated into React, so keep it semantic and clean
- Use CSS classes that make sense (they'll be used in React components)
- Consider using CSS variables for colors/theming (makes customization easier)
- Test your design at different screen sizes
- Ensure all interactive elements are clearly identifiable
- Make sure text is readable and has good contrast
- If Stitch exports React/Next.js code, convert it to static HTML/CSS for this deliverable

---

## ❓ Questions?

If you need clarification on:
- **Functionality**: Refer back to the Functional Requirements section above
- **Technical constraints**: See Technical Constraints section
- **Deliverables**: See Required Deliverables section

---

**Ready to design? Let your creativity flow and create something amazing!** 🎨✨

We're excited to see your vision for Ludex!

