# 🎲 Ludex - Design Brief

> **Note**: This document provides design inspiration and guidelines. However, **you have complete creative freedom** to redesign the UI as you see fit, as long as all functionalities are preserved. See `FUNCTIONAL_SPECIFICATION.md` for functional requirements.

## Product Overview

### What is Ludex?

**Ludex** (from Latin "ludus" meaning game) is an AI-powered board game rulebook companion that transforms PDF rulebooks into interactive, searchable, and chat-enabled game guides. Users upload board game rulebook PDFs, and Ludex uses AI to extract, organize, and make the rules accessible through an intelligent interface.

### Tagline
**"Turn PDFs into Play"** - Transform your rulebook collection into an interactive gaming companion.

---

## Unique Selling Points (USPs)

1. **AI-Powered Organization**
   - Automatically extracts and organizes rulebook content into digestible sections
   - Identifies strategy tips and key rules without manual reading
   - Creates quick-start guides for faster game setup

2. **Interactive Rule Assistant**
   - Chat with an AI assistant that understands your specific game's rules
   - Get instant answers to rule questions mid-game
   - Context-aware responses based on the uploaded rulebook

3. **Personal Game Library**
   - Build your own digital collection of board game rules
   - Access all your games from one place
   - No more searching through PDF folders

4. **Smart Processing**
   - Upload once, process automatically
   - Real-time status updates during processing
   - Organized content ready in minutes

5. **Game-First Design**
   - Built specifically for board game enthusiasts
   - Understands gaming terminology and structure
   - Designed for quick reference during gameplay

---

## Technical Architecture

### Tech Stack
- **Frontend**: Next.js 14 (React 18), Tailwind CSS
- **Backend**: Next.js API Routes (Serverless)
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: Google Sheets (user data, games, conversations)
- **Storage**: Vercel Blob Storage (PDFs, images)
- **AI**: OpenAI GPT-4 / Google Gemini (rulebook processing & chat)
- **Deployment**: Vercel

### Key Features & Pages

1. **Home/Library Page** (`/`)
   - Authentication gate (Google OAuth)
   - Upload form for PDF rulebooks
   - Grid view of user's game collection
   - Game cards with status indicators (processing/completed/error)
   - Real-time polling for status updates

2. **Game Detail Page** (`/game/[id]`)
   - Game header with title, image, status badge
   - Tabbed interface:
     - **Rules**: Organized sections from rulebook
     - **Strategy**: AI-extracted tips by category
     - **Quick Start**: Setup, first turn, key rules
     - **Chat**: AI assistant interface
   - PDF download link
   - Image generation button

3. **API Endpoints**
   - `/api/upload` - PDF upload to Vercel Blob
   - `/api/process` - AI processing of PDF text
   - `/api/games` - CRUD operations for games
   - `/api/chat` - AI chat with conversation history
   - `/api/image` - Game image generation

### Current Design State
- **Color Scheme**: Basic gray/indigo (Tailwind defaults)
- **Style**: Minimal, functional, no thematic elements
- **Components**: Standard Tailwind components, no custom styling
- **Typography**: Default system fonts
- **Icons**: Emoji-based (🎲)

---

## Design Brief: Fantasy & Board Games Theme

### Design Philosophy

Transform Ludex from a functional tool into a **magical gaming grimoire** that feels like opening a beautifully illustrated rulebook from a fantasy board game. The design should evoke:

- **Mystery & Discovery**: Like uncovering ancient game secrets
- **Adventure & Exploration**: Navigating through game worlds
- **Craftsmanship**: The tactile feel of premium board game components
- **Wisdom & Knowledge**: A library of gaming expertise
- **Social Connection**: The joy of playing games together

### Visual Identity

#### Color Palette

**Primary Colors** (Fantasy/Medieval Theme):
- **Deep Purple** (`#6B46C1` / `indigo-700`): Magic, mystery, premium feel
- **Rich Gold** (`#D97706` / `amber-600`): Treasure, achievement, highlights
- **Forest Green** (`#059669` / `emerald-600`): Nature, adventure, growth
- **Crimson Red** (`#DC2626` / `red-600`): Energy, action, important alerts

**Secondary Colors**:
- **Parchment/Cream** (`#FEF3C7` / `amber-50`): Background, paper texture
- **Charcoal** (`#1F2937` / `gray-800`): Text, depth
- **Slate** (`#475569` / `slate-600`): Secondary text
- **Ivory** (`#FFFBEB` / `amber-50`): Card backgrounds

**Accent Colors**:
- **Amber Glow** (`#F59E0B` / `amber-500`): Interactive elements, CTAs
- **Emerald Shine** (`#10B981` / `emerald-500`): Success states, completed games
- **Sapphire** (`#3B82F6` / `blue-500`): Links, information

#### Typography

**Primary Font** (Headers, Branding):
- **Font Family**: `'Cinzel'`, `'Playfair Display'`, or `'Bodoni Moda'` (serif, elegant, fantasy feel)
- **Usage**: Main headings, game titles, navigation
- **Weights**: 400 (regular), 600 (semibold), 700 (bold)

**Secondary Font** (Body, UI):
- **Font Family**: `'Inter'`, `'Poppins'`, or `'Work Sans'` (sans-serif, modern, readable)
- **Usage**: Body text, UI elements, chat messages
- **Weights**: 400 (regular), 500 (medium), 600 (semibold)

**Monospace Font** (Code, Technical):
- **Font Family**: `'JetBrains Mono'` or `'Fira Code'`
- **Usage**: Code snippets, technical information

#### Typography Scale
- **H1**: 3rem (48px) - Page titles
- **H2**: 2.25rem (36px) - Section headers
- **H3**: 1.875rem (30px) - Subsection headers
- **H4**: 1.5rem (24px) - Card titles
- **Body Large**: 1.125rem (18px) - Important body text
- **Body**: 1rem (16px) - Standard text
- **Body Small**: 0.875rem (14px) - Secondary text, captions
- **UI Small**: 0.75rem (12px) - Labels, badges

---

## Design Specifications

### 1. Logo & Branding

**Logo Concept**:
- Combine a **dice** (🎲) with a **book/grimoire** icon
- Optional: Add a **magical sparkle** or **crown** element
- Style: Line art or filled, elegant, fantasy-inspired
- Color: Deep purple with gold accents

**Logo Variations**:
- **Full Logo**: Icon + "Ludex" wordmark
- **Icon Only**: For favicon, app icons
- **Wordmark Only**: For horizontal layouts
- **Dark Mode**: Inverted colors for dark backgrounds

**Favicon**:
- Simplified dice/book icon
- 32x32px minimum
- Works in monochrome

---

### 2. Home/Library Page Design

#### Header
- **Background**: Deep purple gradient (`#6B46C1` to `#7C3AED`)
- **Logo**: Left side, white/gold
- **Auth Button**: Right side, gold button with hover glow effect
- **Height**: 80px (desktop), 64px (mobile)
- **Shadow**: Subtle bottom shadow for depth

#### Hero Section (Unauthenticated State)
- **Background**: Parchment texture overlay on deep purple gradient
- **Centered Card**: 
  - White/cream background with subtle paper texture
  - Border: 2px gold border with decorative corners
  - Shadow: Soft, elevated shadow
  - Padding: 48px (desktop), 32px (mobile)
- **Title**: "Welcome to Ludex" - Large serif font, deep purple
- **Subtitle**: "Turn PDFs into Play" - Medium sans-serif, slate gray
- **CTA Button**: Gold gradient button with hover animation
- **Decorative Elements**: Subtle dice icons, magical sparkles

#### Upload Section (Authenticated)
- **Card Style**: 
  - Parchment background with paper texture
  - Gold border (1px) with rounded corners (12px)
  - Soft shadow
  - Padding: 32px
- **Title**: "Upload New Game" - H2, serif font
- **Upload Area**:
  - Drag-and-drop zone with dashed gold border
  - Icon: Large dice or book icon
  - Text: "Drop your rulebook PDF here" or "Choose file"
  - Hover: Gold glow effect
- **Upload Button**: Gold gradient, rounded, with icon
- **Status Messages**: Color-coded (green success, yellow warning, red error)

#### Game Library Grid
- **Layout**: Responsive grid (3 columns desktop, 2 tablet, 1 mobile)
- **Card Design**:
  - **Background**: White/cream with subtle texture
  - **Border**: 1px gold border, rounded (12px)
  - **Shadow**: Soft, hover: elevated shadow
  - **Image**: 
    - Top section, 200px height
    - Rounded top corners
    - Fallback: Fantasy-themed placeholder (dice, cards, or game pieces)
  - **Content Area**:
    - Title: H4, serif font, deep purple
    - Status Badge: Pill-shaped, color-coded
      - Processing: Amber/yellow with spinner animation
      - Completed: Emerald green with checkmark
      - Error: Crimson red with alert icon
    - Date: Small text, slate gray
  - **Hover Effect**: 
    - Slight scale (1.02x)
    - Gold border glow
    - Shadow intensifies
- **Empty State**:
  - Large dice icon (gray)
  - Message: "No games yet. Upload your first rulebook!"
  - CTA button to upload

---

### 3. Game Detail Page Design

#### Header Navigation
- **Back Button**: 
  - Left side, arrow icon + "Back to Library"
  - Gold color, hover underline
- **Auth Button**: Right side (same as home)

#### Game Header Card
- **Layout**: Horizontal flex, image left, content right
- **Background**: Parchment with texture, gold border
- **Game Image**:
  - 128x128px (desktop), 96x96px (mobile)
  - Rounded corners (12px)
  - Gold border (2px)
  - Fallback: Fantasy dice icon with game title overlay
- **Title**: H1, serif font, deep purple
- **Status Badge**: Same as library cards
- **Generate Image Button**: Gold button with magic wand icon
- **PDF Download Link**: Gold underline, hover effect

#### Status Alerts
- **Processing**: 
  - Background: Amber/yellow gradient
  - Border: Gold
  - Icon: Spinning dice or hourglass
  - Text: "Processing your rulebook... This may take a few minutes."
- **Error**:
  - Background: Light red
  - Border: Crimson
  - Icon: Alert triangle
  - Text: Error message

#### Tab Navigation
- **Style**: Underline tabs (like current)
- **Active Tab**: 
  - Deep purple text
  - Gold underline (3px)
  - Bold weight
- **Inactive Tabs**: 
  - Slate gray text
  - Hover: Light purple, subtle underline
- **Icons**: Add icons to each tab
  - Rules: 📜 Scroll icon
  - Strategy: ⚔️ Sword/chess piece
  - Quick Start: ⚡ Lightning bolt
  - Chat: 💬 Speech bubble

#### Content Sections

**Rules Tab**:
- **Section Cards**:
  - Each section in its own card
  - Parchment background
  - Gold left border (4px) for emphasis
  - Section title: H3, serif, deep purple
  - Content: Body text, slate gray, well-spaced
  - Spacing: 24px between sections

**Strategy Tab**:
- **Tip Cards**:
  - Horizontal cards with left border accent
  - Category badge: Small pill, gold background
  - Tip text: Body, readable
  - Icon: Small icon per category (shield, sword, crown, etc.)

**Quick Start Tab**:
- **Sections**: Setup, First Turn, Key Rules
- **Setup/First Turn**: Paragraph text in cards
- **Key Rules**: 
  - Bulleted list
  - Each item in a small card
  - Checkmark or dice icon per rule
  - Gold accent color

**Chat Tab**:
- **Chat Container**: 
  - Full height (600px)
  - Parchment background
  - Gold border
  - Rounded corners
- **Message Bubbles**:
  - **User**: 
    - Right-aligned
    - Deep purple background
    - White text
    - Rounded corners (12px top-left, 4px others)
  - **Assistant**: 
    - Left-aligned
    - Cream/white background
    - Slate gray text
    - Gold left border accent
    - Rounded corners (4px top-left, 12px others)
- **Input Area**:
  - Bottom-fixed
  - Gold border top
  - Input field: Rounded, gold focus ring
  - Send button: Gold gradient, rounded
- **Empty State**: 
  - Centered message
  - Dice icon
  - "Ask me anything about this game's rules!"

---

### 4. Component Design Specifications

#### Buttons

**Primary Button** (CTAs, main actions):
- **Background**: Gold gradient (`#F59E0B` to `#D97706`)
- **Text**: White, semibold
- **Padding**: 12px 24px
- **Border Radius**: 8px
- **Shadow**: Soft gold glow
- **Hover**: 
  - Slight scale (1.02x)
  - Brighter gradient
  - Stronger glow
- **Active**: Slight scale down (0.98x)

**Secondary Button** (Less important actions):
- **Background**: Transparent
- **Border**: 2px gold
- **Text**: Deep purple
- **Hover**: Gold background fill

**Tertiary Button** (Text links):
- **Text**: Gold, underline on hover
- **No background**

#### Form Elements

**Input Fields**:
- **Background**: White/cream
- **Border**: 1px slate gray
- **Border Radius**: 8px
- **Padding**: 12px 16px
- **Focus**: 
  - Gold border (2px)
  - Gold glow shadow
- **Placeholder**: Slate gray, italic

**File Upload**:
- **Drag Zone**: 
  - Dashed gold border (2px)
  - Parchment background
  - Large dice/book icon
  - Hover: Solid border, gold glow
- **File Input**: Styled button overlay

#### Badges & Status Indicators

**Status Badges**:
- **Shape**: Pill (rounded-full)
- **Padding**: 6px 12px
- **Font**: Small, semibold
- **Colors**:
  - Processing: Amber background, amber-800 text
  - Completed: Emerald background, emerald-800 text
  - Error: Red background, red-800 text

**Category Badges** (Strategy tips):
- **Shape**: Small pill
- **Background**: Gold with transparency
- **Text**: Deep purple, small

#### Cards

**Standard Card**:
- **Background**: White/cream with subtle texture
- **Border**: 1px gold
- **Border Radius**: 12px
- **Shadow**: Soft, subtle
- **Padding**: 24px
- **Hover**: Elevated shadow, gold glow

**Game Card** (Library):
- Same as standard, but:
- **Image Section**: Top, full width
- **Content Padding**: 16px
- **Hover**: Scale + glow

---

### 5. Responsive Design

#### Breakpoints
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md-lg)
- **Desktop**: > 1024px (xl)

#### Mobile Adaptations
- **Header**: Reduced height, smaller logo
- **Grid**: Single column
- **Game Header**: Stacked (image top, content below)
- **Tabs**: Scrollable horizontal tabs
- **Chat**: Full height, optimized for mobile keyboards
- **Buttons**: Full width on mobile, auto on desktop

---

### 6. Animations & Interactions

#### Micro-interactions
- **Button Hover**: Smooth scale + glow
- **Card Hover**: Elevation + glow
- **Loading States**: 
  - Spinner: Rotating dice icon
  - Skeleton: Shimmer effect on cards
- **Status Updates**: Fade-in animation
- **Tab Switch**: Smooth underline slide
- **Chat Messages**: Slide-in from side

#### Page Transitions
- **Route Changes**: Fade transition (200ms)
- **Modal/Overlay**: Fade + scale (300ms)

#### Loading States
- **Processing Game**: 
  - Animated dice spinner
  - Pulsing gold glow
  - Progress text updates
- **Upload**: Progress bar with gold fill

---

### 7. Dark Mode (Optional)

**Dark Mode Palette**:
- **Background**: Deep charcoal (`#0F172A`)
- **Cards**: Dark slate (`#1E293B`)
- **Text**: Light gray (`#F1F5F9`)
- **Accents**: Gold remains (works on dark)
- **Borders**: Gold with reduced opacity

---

### 8. Accessibility Requirements

- **Color Contrast**: WCAG AA minimum (4.5:1 for text)
- **Focus States**: Clear gold outline on all interactive elements
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels
- **Font Sizes**: Minimum 16px for body text
- **Touch Targets**: Minimum 44x44px for mobile

---

### 9. Icon System

**Icon Style**: 
- **Line Icons**: 2px stroke weight
- **Filled Icons**: For important actions
- **Style**: Fantasy/gaming themed
- **Library**: Heroicons or custom fantasy icon set

**Key Icons Needed**:
- 🎲 Dice (logo, game icon)
- 📜 Scroll (rules)
- ⚔️ Sword (strategy)
- ⚡ Lightning (quick start)
- 💬 Chat bubble
- 📤 Upload
- 🔍 Search (future)
- ⭐ Star (favorites, future)
- 🏆 Trophy (achievements, future)
- ✨ Sparkle (magic, AI processing)

---

### 10. Imagery & Graphics

#### Game Image Placeholders
- **Style**: Fantasy illustration
- **Themes**: 
  - Medieval dice and cards
  - Magical scrolls
  - Game pieces (pawns, tokens)
  - Fantasy landscapes
- **Colors**: Deep purple, gold accents
- **Style**: Hand-drawn or illustrated, not photorealistic

#### Background Patterns
- **Subtle Textures**: 
  - Parchment paper texture
  - Subtle grid pattern (like game board)
  - Magical sparkle overlay (very subtle)
- **Gradients**: 
  - Deep purple to darker purple
  - Gold accents in corners

#### Decorative Elements
- **Corner Accents**: Decorative corners on cards (optional)
- **Divider Lines**: Ornamental dividers between sections
- **Borders**: Decorative borders on important cards

---

## Design Deliverables Checklist

### Phase 1: Brand Identity
- [ ] Logo design (full, icon, wordmark)
- [ ] Color palette specification
- [ ] Typography system
- [ ] Icon set (or selection from library)
- [ ] Favicon design

### Phase 2: Component Library
- [ ] Button styles (primary, secondary, tertiary)
- [ ] Form elements (inputs, file upload, selects)
- [ ] Card components (standard, game card, section card)
- [ ] Badge/status indicators
- [ ] Navigation components (tabs, header)
- [ ] Chat interface components

### Phase 3: Page Designs
- [ ] Home/Library page (authenticated & unauthenticated)
- [ ] Game detail page (all tabs)
- [ ] Loading states
- [ ] Error states
- [ ] Empty states

### Phase 4: Responsive Designs
- [ ] Mobile layouts (all pages)
- [ ] Tablet layouts
- [ ] Desktop layouts

### Phase 5: Interactive Prototypes
- [ ] Hover states
- [ ] Click interactions
- [ ] Animations
- [ ] Transitions

### Phase 6: Design System Documentation
- [ ] Style guide
- [ ] Component specifications
- [ ] Usage guidelines
- [ ] Code implementation notes

---

## Implementation Notes

### CSS Framework
- **Base**: Tailwind CSS (already in use)
- **Custom Styles**: Add custom CSS for:
  - Parchment textures
  - Gold gradients
  - Custom fonts
  - Decorative elements

### Font Loading
- Use Google Fonts or self-hosted fonts
- Preload critical fonts
- Fallback to system fonts

### Image Optimization
- Use Next.js Image component
- Optimize all game images
- Provide multiple sizes for responsive images
- Use WebP format where possible

### Performance Considerations
- Lazy load images below fold
- Optimize animations (use CSS transforms)
- Minimize custom font weights
- Use CSS variables for theming

---

## Inspiration & References

### Visual Inspiration
- **Board Game Rulebooks**: Premium board games (Gloomhaven, Scythe, Wingspan)
- **Fantasy Books**: D&D manuals, fantasy game guides
- **Medieval Aesthetics**: Illuminated manuscripts, heraldry
- **Modern Gaming UI**: BoardGameGeek, Tabletopia, Board Game Arena

### Design References
- **Color Schemes**: Deep purples, golds (premium feel)
- **Typography**: Serif headers (elegance), sans-serif body (readability)
- **Layouts**: Card-based, grid systems
- **Interactions**: Smooth, delightful micro-interactions

---

## Success Metrics

### Design Goals
- **Visual Appeal**: Users find the design engaging and premium
- **Usability**: Intuitive navigation, clear hierarchy
- **Brand Recognition**: Distinctive fantasy/gaming identity
- **Accessibility**: WCAG AA compliance
- **Performance**: Fast load times, smooth animations

---

## Next Steps

1. **Designer Review**: Review this brief and ask clarifying questions
2. **Mood Board**: Create mood board with fantasy/gaming aesthetics
3. **Style Exploration**: Explore 2-3 visual directions
4. **Component Design**: Design key components first
5. **Page Mockups**: Create full page designs
6. **Prototype**: Interactive prototype for testing
7. **Handoff**: Design specs and assets for development

---

## Contact & Questions

For any questions about the product, technical constraints, or design direction, please refer to:
- **Product Documentation**: `README.md`, `IMPLEMENTATION_COMPLETE.md`
- **Codebase**: `/app`, `/components`, `/lib` directories
- **Current Design**: Basic Tailwind implementation (to be replaced)

---

**Design Brief Version**: 1.0  
**Last Updated**: December 2024  
**Project**: Ludex - Board Game Rulebook Companion

