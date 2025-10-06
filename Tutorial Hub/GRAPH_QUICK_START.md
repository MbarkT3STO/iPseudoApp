# 🚀 Learning Path Graph - Quick Start Guide

## What You'll See

When you open `learning-path.html`, you'll see:

```
┌─────────────────────────────────────────────────────┐
│  📚 Interactive Learning Path Graph                 │
│  "Visualize your learning journey..."               │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  ℹ️  How to Use This Graph                          │
│  • Click and drag to pan                            │
│  • Scroll to zoom                                   │
│  • Click nodes to navigate                          │
│  • Arrows show learning sequence                    │
└─────────────────────────────────────────────────────┘

┌────────┬────────┬────────┬────────────┐
│ [Hier] │ Force  │ Reset  │ Fit │ Play  │
└────────┴────────┴────────┴────────────┘

╔═══════════════════════════════════════════╗
║                                           ║
║         [1]  Intro to Pseudocode         ║
║              (Green Box)                  ║
║                  ↓                        ║
║         [2]  Getting Started             ║
║              (Green Box)                  ║
║                  ↓                        ║
║         [3]  Variables & Data            ║
║              (Blue Box)                   ║
║            ↙    ↓    ↘                   ║
║        [4]    [5]    [6]                 ║
║       I/O   Operators Comments            ║
║                  ↓                        ║
║            [7] Conditionals              ║
║              (Purple Box)                 ║
║                  ↓                        ║
║               ... etc                     ║
║                                           ║
╚═══════════════════════════════════════════╝

Legend:
🟢 Green = Completed    🟠 Orange = In Progress
🌱 Light Green = Beginner   🌿 Blue = Intermediate
🚀 Purple = Advanced
```

## How It Works

### 1. First Visit
- All lessons shown as colored boxes (by difficulty level)
- Arrows show which lessons depend on others
- Click any lesson to start learning

### 2. After Completing Lessons
- Completed lessons turn **green** 🟢
- Current lesson turns **orange** 🟠
- Future lessons remain **purple/blue/green** by level

### 3. Interactive Features

**Pan & Zoom:**
- Click and drag anywhere to move the graph
- Scroll wheel to zoom in/out
- Mobile: Pinch to zoom

**Navigate:**
- Click any lesson box → Opens that lesson immediately
- Hover to see lesson details in tooltip

**Layout Modes:**
- **Hierarchical** (default): Clean top-to-bottom flow
- **Force**: Organic physics-based layout

**Controls:**
- 🎯 **Reset Zoom**: Return to 100% zoom
- 📺 **Fit to Screen**: Auto-fit entire graph
- ▶️ **Toggle Physics**: Enable animated movement

## Example Learning Paths

### Path 1: Complete Beginner (Linear)
```
1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → ... → 20
```

### Path 2: Quick to Algorithms
```
1 → 2 → 3 → 5 → 8 → 12 → 16 (Sorting)
                          → 17 (Searching)
```

### Path 3: Function Focused
```
1 → 2 → 3 → 5 → 7 → 8 → 10 → 11 → 15 (Recursion)
```

## Tips for Best Use

1. **Start Here If:**
   - You're visual learner
   - You want to see the big picture
   - You're not sure which lesson to do next
   - You want to skip around strategically

2. **Use Hierarchical View For:**
   - Understanding progression
   - Seeing clear dependencies
   - New students

3. **Use Force View For:**
   - Exploring connections
   - Finding related topics
   - Advanced students

4. **Pro Tips:**
   - **Mobile**: Use two fingers to zoom smoothly
   - **Desktop**: Hold Shift while scrolling for horizontal pan
   - **Keyboard**: Arrow keys navigate when graph is focused
   - **Share**: Screenshot and share your progress with friends!

## Integration with Tutorial Hub

The graph integrates with your progress:
- ✅ Automatically syncs with lesson completion
- 📝 Updates in real-time
- 💾 Saved in browser (localStorage)
- 🔄 Persists across sessions

## Accessibility

- **High Contrast**: Clear color differences
- **Large Targets**: Easy to click on mobile
- **Tooltips**: Helpful hover information
- **Keyboard**: Navigate with Tab and Enter
- **Screen Readers**: ARIA labels on controls

## Troubleshooting

**Graph Not Loading?**
- Check internet connection (uses Vis.js CDN)
- Try refreshing the page
- Clear browser cache

**Can't Click Nodes?**
- Make sure you're not in the middle of dragging
- Try clicking center of the box
- On mobile, tap firmly

**Looks Messy?**
- Click "Fit to Screen" button
- Try switching layout mode
- Reset zoom to 100%

## File Locations

```
Tutorial Hub/
├── learning-path.html          ← Main graph page
├── js/
│   └── learning-path-graph.js  ← Graph logic
└── index.html                   ← Has link to graph
```

## Access Points

1. **Main Nav Menu**: "Learning Path" link
2. **Index Page**: Large purple card promoting the graph
3. **Direct URL**: `learning-path.html`

---

**Happy Learning! 🎓**

The graph is your visual companion on the journey from zero to pseudocode hero!

