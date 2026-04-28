/**
 * Bellari Business College — Socket.io Client Wrapper
 * Handles real-time notifications and live updates
 */

(function() {
    // Load Socket.io script dynamically if not already loaded
    if (typeof io === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.socket.io/4.7.2/socket.io.min.js';
        script.onload = initSocket;
        document.head.appendChild(script);
    } else {
        initSocket();
    }

    function initSocket() {
        const socket = io('http://localhost:5000');
        const user = JSON.parse(localStorage.getItem('user'));

        if (user && user._id) {
            socket.emit('join', user._id);
        }

        // Listen for private notifications
        socket.on('newNotification', (data) => {
            showToast(data.title, data.message, data.type);
            // Optionally update notification count in UI
            const badge = document.getElementById('notificationCount');
            if (badge) {
                const count = parseInt(badge.textContent || '0');
                badge.textContent = count + 1;
                badge.classList.remove('hidden');
            }
        });

        // Listen for broadcasts
        socket.on('broadcastNotification', (data) => {
            showToast(data.title, data.message, 'announcement');
        });

        console.log('📡 Real-time engine initialized');
    }

    function showToast(title, message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer') || createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `glass-card border-l-4 p-4 mb-3 transform translate-x-full transition-all duration-500 opacity-0 max-w-sm pointer-events-auto`;
        
        const colors = {
            info: 'border-l-blue-500',
            success: 'border-l-green-500',
            warning: 'border-l-yellow-500',
            error: 'border-l-red-500',
            announcement: 'border-l-gold'
        };

        toast.classList.add(colors[type] || colors.info);
        
        toast.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="mt-1">
                    <i class="fas ${getIcon(type)} text-lg ${getTextColor(type)}"></i>
                </div>
                <div>
                    <h4 class="text-sm font-bold text-white">${title}</h4>
                    <p class="text-xs text-gray-400 mt-1">${message}</p>
                </div>
                <button class="ml-auto text-gray-500 hover:text-white">&times;</button>
            </div>
        `;

        toastContainer.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
        }, 100);

        // Auto remove
        setTimeout(() => {
            toast.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => toast.remove(), 500);
        }, 5000);

        toast.querySelector('button').onclick = () => {
            toast.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => toast.remove(), 500);
        };
    }

    function createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'fixed bottom-8 right-8 z-[1000] pointer-events-none flex flex-col items-end';
        document.body.appendChild(container);
        return container;
    }

    function getIcon(type) {
        switch(type) {
            case 'success': return 'fa-check-circle';
            case 'warning': return 'fa-exclamation-triangle';
            case 'error': return 'fa-times-circle';
            case 'announcement': return 'fa-bullhorn';
            default: return 'fa-info-circle';
        }
    }

    function getTextColor(type) {
        switch(type) {
            case 'success': return 'text-green-400';
            case 'warning': return 'text-yellow-400';
            case 'error': return 'text-red-400';
            case 'announcement': return 'text-gold';
            default: return 'text-blue-400';
        }
    }
})();
