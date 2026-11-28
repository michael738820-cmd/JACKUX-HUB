window.JACKUX_DATA = {
  gameFolders: [
    {
      id: "blox-fruits",
      name: "Blox Fruits",
      description: "Blox Fruits script collection.",
      icon: "🍎"
    }
  ],

  categories: [
    {
      id: "overall-hub",
      name: "Overall Hub",
      description: "General Blox Fruits hub scripts.",
      icon: "📦",
      gameId: "blox-fruits"
    }
  ],

  scripts: [
    {
      id: "quantum-onyx",
      name: "Quantum Onyx",
      category: "overall-hub",
      description: "Quantum Onyx hub script for Blox Fruits.",
      type: "Hub",
      location: "Blox Fruits / Overall Hub",
      code: `loadstring(game:HttpGet("https://raw.githubusercontent.com/flazhy/QuantumOnyx/refs/heads/main/QuantumOnyx.lua"))()`
    }
  ]
};
