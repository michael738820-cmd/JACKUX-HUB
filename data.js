
window.JACKUX_DATA = {
  categories: [
    {
      id: "beginner",
      name: "Beginner Scripts",
      description: "Simple scripts for learning Roblox Studio and Luau.",
      icon: "🌱"
    },
    {
      id: "ui",
      name: "UI Scripts",
      description: "User interfaces, buttons and GUI examples.",
      icon: "🎨"
    },
    {
      id: "gameplay",
      name: "Gameplay Scripts",
      description: "Gameplay mechanics for your own Roblox games.",
      icon: "🎮"
    },
    {
      id: "utilities",
      name: "Utility Scripts",
      description: "Useful tools and helper scripts.",
      icon: "🛠️"
    }
  ],

  scripts: [
    {
      id: "leaderstats",
      name: "Basic Leaderstats",
      category: "beginner",
      description: "Creates a Coins value on the player leaderboard.",
      type: "Script",
      location: "ServerScriptService",
      code: `game.Players.PlayerAdded:Connect(function(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local coins = Instance.new("IntValue")
    coins.Name = "Coins"
    coins.Value = 0
    coins.Parent = leaderstats
end)`
    },

    {
      id: "coin-part",
      name: "Touch Coin Part",
      category: "gameplay",
      description: "Gives a player 10 Coins when they touch a part.",
      type: "Script",
      location: "Inside a Part",
      code: `local part = script.Parent

part.Touched:Connect(function(hit)
    local character = hit.Parent
    local player = game.Players:GetPlayerFromCharacter(character)

    if player then
        local leaderstats = player:FindFirstChild("leaderstats")
        local coins = leaderstats and leaderstats:FindFirstChild("Coins")

        if coins then
            coins.Value += 10
        end
    end
end)`
    },

    {
      id: "speed-boost",
      name: "Speed Boost",
      category: "gameplay",
      description: "Increases a player's walking speed when they touch a part.",
      type: "Script",
      location: "Inside a Part",
      code: `local part = script.Parent

part.Touched:Connect(function(hit)
    local character = hit.Parent
    local humanoid = character:FindFirstChildOfClass("Humanoid")

    if humanoid then
        humanoid.WalkSpeed = 32
    end
end)`
    },

    {
      id: "hello-gui",
      name: "Hello GUI",
      category: "ui",
      description: "Creates a simple screen GUI with a greeting.",
      type: "LocalScript",
      location: "StarterPlayerScripts",
      code: `local player = game.Players.LocalPlayer

local screenGui = Instance.new("ScreenGui")
screenGui.Name = "HelloGUI"
screenGui.Parent = player:WaitForChild("PlayerGui")

local label = Instance.new("TextLabel")
label.Size = UDim2.new(0, 300, 0, 60)
label.Position = UDim2.new(0.5, -150, 0.1, 0)
label.BackgroundColor3 = Color3.fromRGB(25, 25, 25)
label.TextColor3 = Color3.fromRGB(255, 255, 255)
label.TextScaled = true
label.Text = "Welcome to my game!"
label.Parent = screenGui`
    },

    {
      id: "jump-power",
      name: "Jump Power Changer",
      category: "utilities",
      description: "Sets a player's jump power when their character spawns.",
      type: "Script",
      location: "ServerScriptService",
      code: `game.Players.PlayerAdded:Connect(function(player)
    player.CharacterAdded:Connect(function(character)
        local humanoid = character:WaitForChild("Humanoid")
        humanoid.UseJumpPower = true
        humanoid.JumpPower = 70
    end)
end)`
    }
  ]
};
