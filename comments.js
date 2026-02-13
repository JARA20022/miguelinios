// ====================================
// COMMENTS PAGE FUNCTIONALITY
// ====================================

// Check if we're on the comments page
if (window.location.pathname.includes('comentarios.html')) {
    
    let currentNickname = localStorage.getItem('userNickname') || '';
    
    // ====================================
    // NICKNAME MODAL
    // ====================================
    const nicknameModal = document.getElementById('nicknameModal');
    const nicknameForm = document.getElementById('nicknameForm');
    const nicknameInput = document.getElementById('nicknameInput');
    const displayNickname = document.getElementById('displayNickname');
    const userInitial = document.getElementById('userInitial');
    const changeNicknameBtn = document.getElementById('changeNicknameBtn');
    const commentsSection = document.getElementById('commentsSection');
    
    // Show modal if no nickname is set
    function checkNickname() {
        if (!currentNickname) {
            nicknameModal.style.display = 'flex';
            commentsSection.style.display = 'none';
        } else {
            nicknameModal.style.display = 'none';
            commentsSection.style.display = 'block';
            updateUserDisplay();
        }
    }
    
    // Handle nickname form submission
    nicknameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nickname = nicknameInput.value.trim();
        
        if (nickname.length >= 3) {
            currentNickname = nickname;
            localStorage.setItem('userNickname', nickname);
            nicknameModal.style.display = 'none';
            commentsSection.style.display = 'block';
            updateUserDisplay();
            
            // Add entrance animation
            commentsSection.style.animation = 'bounceIn 0.8s ease-out';
        } else {
            alert('El nickname debe tener al menos 3 caracteres');
        }
    });
    
    // Change nickname button
    if (changeNicknameBtn) {
        changeNicknameBtn.addEventListener('click', () => {
            currentNickname = '';
            localStorage.removeItem('userNickname');
            nicknameInput.value = '';
            checkNickname();
        });
    }
    
    // Update user display
    function updateUserDisplay() {
        if (displayNickname && userInitial) {
            displayNickname.textContent = currentNickname;
            userInitial.textContent = currentNickname.charAt(0).toUpperCase();
        }
    }
    
    // ====================================
    // COMMENT FORM
    // ====================================
    const commentForm = document.getElementById('commentForm');
    const commentText = document.getElementById('commentText');
    const charCount = document.getElementById('charCount');
    const commentsList = document.getElementById('commentsList');
    const commentsCount = document.getElementById('commentsCount');
    
    // Character counter
    if (commentText && charCount) {
        commentText.addEventListener('input', () => {
            const count = commentText.value.length;
            charCount.textContent = count;
            
            if (count > 450) {
                charCount.style.color = 'var(--warning)';
            } else {
                charCount.style.color = 'var(--gray)';
            }
        });
    }
    
    // Load comments from localStorage
    function loadComments() {
        const savedComments = localStorage.getItem('comments');
        return savedComments ? JSON.parse(savedComments) : [];
    }
    
    // Save comments to localStorage
    function saveComments(comments) {
        localStorage.setItem('comments', JSON.stringify(comments));
        updateCommentsCount();
    }
    
    // Update comments count
    function updateCommentsCount() {
        const comments = loadComments();
        const totalComments = comments.length + 3; // +3 for the example comments
        if (commentsCount) {
            commentsCount.textContent = `(${totalComments})`;
        }
    }
    
    // Create comment element
    function createCommentElement(comment) {
        const commentItem = document.createElement('div');
        commentItem.classList.add('comment-item');
        commentItem.setAttribute('data-scroll', '');
        
        const initial = comment.nickname.charAt(0).toUpperCase();
        const colors = [
            'linear-gradient(135deg, #ff00ff, #7000ff)',
            'linear-gradient(135deg, #00f0ff, #0080ff)',
            'linear-gradient(135deg, #ffaa00, #ff6600)',
            'linear-gradient(135deg, #00ff88, #00ccaa)',
            'linear-gradient(135deg, #ff4444, #ff0066)'
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        commentItem.innerHTML = `
            <div class="comment-avatar" style="background: ${randomColor}">
                <span>${initial}</span>
            </div>
            <div class="comment-content">
                <div class="comment-header">
                    <span class="comment-author">${comment.nickname}</span>
                    <span class="comment-date">${comment.date}</span>
                </div>
                <p class="comment-text">${comment.text}</p>
                <div class="comment-actions">
                    <button class="comment-action like-btn" data-id="${comment.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                        </svg>
                        <span class="like-count">${comment.likes || 0}</span>
                    </button>
                </div>
            </div>
        `;
        
        return commentItem;
    }
    
    // Get relative time
    function getRelativeTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `Hace ${days} día${days > 1 ? 's' : ''}`;
        if (hours > 0) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
        if (minutes > 0) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
        return 'Justo ahora';
    }
    
    // Display comments
    function displayComments() {
        const comments = loadComments();
        
        // Find the insertion point (after example comments)
        const firstExampleComment = commentsList.querySelector('.comment-item');
        
        comments.reverse().forEach(comment => {
            const commentElement = createCommentElement(comment);
            
            if (firstExampleComment) {
                commentsList.insertBefore(commentElement, firstExampleComment);
            } else {
                commentsList.appendChild(commentElement);
            }
            
            // Trigger animation
            setTimeout(() => {
                commentElement.classList.add('visible');
            }, 100);
        });
        
        // Add like button functionality
        addLikeListeners();
    }
    
    // Add like button listeners
    function addLikeListeners() {
        const likeButtons = document.querySelectorAll('.like-btn');
        likeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const commentId = this.getAttribute('data-id');
                if (!commentId) return; // Skip example comments
                
                const comments = loadComments();
                const comment = comments.find(c => c.id === commentId);
                
                if (comment) {
                    const likedComments = JSON.parse(localStorage.getItem('likedComments') || '[]');
                    
                    if (!likedComments.includes(commentId)) {
                        comment.likes = (comment.likes || 0) + 1;
                        likedComments.push(commentId);
                        localStorage.setItem('likedComments', JSON.stringify(likedComments));
                        saveComments(comments);
                        
                        // Update UI
                        const likeCount = this.querySelector('.like-count');
                        likeCount.textContent = comment.likes;
                        this.style.color = 'var(--primary)';
                        
                        // Animation
                        this.style.transform = 'scale(1.2)';
                        setTimeout(() => {
                            this.style.transform = 'scale(1)';
                        }, 200);
                    }
                }
            });
            
            // Check if already liked
            const commentId = btn.getAttribute('data-id');
            if (commentId) {
                const likedComments = JSON.parse(localStorage.getItem('likedComments') || '[]');
                if (likedComments.includes(commentId)) {
                    btn.style.color = 'var(--primary)';
                }
            }
        });
    }
    
    // Handle comment submission
    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const text = commentText.value.trim();
            
            if (text.length < 10) {
                alert('El comentario debe tener al menos 10 caracteres');
                return;
            }
            
            const comment = {
                id: Date.now().toString(),
                nickname: currentNickname,
                text: text,
                date: getRelativeTime(Date.now()),
                timestamp: Date.now(),
                likes: 0
            };
            
            const comments = loadComments();
            comments.push(comment);
            saveComments(comments);
            
            // Add to UI
            const commentElement = createCommentElement(comment);
            const firstComment = commentsList.querySelector('.comment-item');
            
            if (firstComment) {
                commentsList.insertBefore(commentElement, firstComment);
            } else {
                commentsList.appendChild(commentElement);
            }
            
            // Trigger animation
            setTimeout(() => {
                commentElement.classList.add('visible');
            }, 100);
            
            // Add like listener
            addLikeListeners();
            
            // Reset form
            commentText.value = '';
            charCount.textContent = '0';
            
            // Success message
            showSuccessMessage();
        });
    }
    
    // Show success message
    function showSuccessMessage() {
        const message = document.createElement('div');
        message.style.position = 'fixed';
        message.style.top = '100px';
        message.style.right = '20px';
        message.style.padding = '1rem 2rem';
        message.style.background = 'var(--gradient-primary)';
        message.style.color = 'var(--dark)';
        message.style.borderRadius = '10px';
        message.style.fontFamily = 'var(--font-primary)';
        message.style.fontWeight = 'bold';
        message.style.zIndex = '10000';
        message.style.animation = 'bounceIn 0.5s ease-out';
        message.textContent = '✓ Comentario publicado!';
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'bounceOut 0.5s ease-out';
            setTimeout(() => {
                message.remove();
            }, 500);
        }, 3000);
    }
    
    // Add bounce out animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounceOut {
            0% {
                opacity: 1;
                transform: scale(1);
            }
            100% {
                opacity: 0;
                transform: scale(0.3) translateY(-50px);
            }
        }
    `;
    document.head.appendChild(style);
    
    // ====================================
    // INITIALIZE
    // ====================================
    checkNickname();
    displayComments();
    updateCommentsCount();
    
    // Update relative times every minute
    setInterval(() => {
        const comments = loadComments();
        comments.forEach(comment => {
            comment.date = getRelativeTime(comment.timestamp);
        });
        saveComments(comments);
        
        // Update UI
        document.querySelectorAll('.comment-date').forEach((dateElement, index) => {
            if (index >= 3) { // Skip example comments
                const commentIndex = index - 3;
                if (comments[commentIndex]) {
                    dateElement.textContent = comments[commentIndex].date;
                }
            }
        });
    }, 60000); // Every minute
}
