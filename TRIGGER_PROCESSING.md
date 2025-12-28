# 🔧 How to Trigger Processing Manually

## Get Your Game IDs

Run this in your browser console to see all your games and their IDs:

```javascript
// Get all games
fetch('/api/games')
  .then(r => r.json())
  .then(data => {
    console.log('Your games:');
    data.games.forEach(game => {
      console.log(`- ${game.title}: ${game.gameId} (status: ${game.status})`);
    });
    return data.games;
  })
  .then(games => {
    // Store games in window for easy access
    window.myGames = games;
    console.log('\nGames stored in window.myGames');
    console.log('To process a game, use: processGame(window.myGames[0].gameId)');
  });
```

## Process a Specific Game

After running the above, you can process any game:

```javascript
// Process the first game
processGame(window.myGames[0].gameId);

// Or process by title
const game = window.myGames.find(g => g.title.includes('catan'));
if (game) processGame(game.gameId);
```

## Or Use This All-in-One Script

```javascript
// Get games and process all "processing" ones
fetch('/api/games')
  .then(r => r.json())
  .then(data => {
    const processing = data.games.filter(g => g.status === 'processing');
    console.log(`Found ${processing.length} games stuck in processing`);
    
    processing.forEach(game => {
      console.log(`Processing: ${game.title} (${game.gameId})`);
      fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: game.gameId })
      })
      .then(r => r.json())
      .then(result => {
        console.log(`Result for ${game.title}:`, result);
      })
      .catch(err => {
        console.error(`Error processing ${game.title}:`, err);
      });
    });
  });
```

## Check Game Details

To see full game details including the gameId:

```javascript
fetch('/api/games')
  .then(r => r.json())
  .then(data => {
    console.table(data.games.map(g => ({
      title: g.title,
      gameId: g.gameId,
      status: g.status,
      createdAt: g.createdAt
    })));
  });
```

