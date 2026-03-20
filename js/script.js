function initApp() {
    const root = document.getElementById('root');
    
    // Simulate network delay or just show loader for a moment
    setTimeout(() => {
        fetch('component/content.html')
            .then(response => response.text())
            .then(html => {
                root.innerHTML = html;
                createParticles();
                
                // Tunggu sejenak agar DOM benar-benar siap
                setTimeout(() => {
                    const music = document.getElementById('bgMusic');
                    const icon = document.getElementById('musicIcon');
                    if (music && icon) {
                        music.play().then(() => {
                            icon.classList.remove('fa-volume-xmark');
                            icon.classList.add('fa-music', 'animate-pulse');
                        }).catch(err => {
                            console.log("Browser memblokir autoplay. Menunggu interaksi pertama dari user.");
                            // Tampilkan toast agar user mengerti
                            if (typeof showToast === 'function') {
                                showToast('Tap layar untuk memutar musik', 'fa-music');
                            }
                            
                            // Putar saat user pertama kali tap atau klik dimanapun di layar
                            document.body.addEventListener('click', function playOnInteract(e) {
                                // Abaikan jika ini diklik di tombol musiknya langsung
                                if (e.target.closest('#musicToggleBtn')) {
                                    document.body.removeEventListener('click', playOnInteract);
                                    return; 
                                }
                                music.play().then(() => {
                                    icon.classList.remove('fa-volume-xmark');
                                    icon.classList.add('fa-music', 'animate-pulse');
                                }).catch(e => console.error("Audio error:", e));
                                document.body.removeEventListener('click', playOnInteract);
                            }, { once: true });
                        });
                    }
                }, 100);
            })
            .catch(err => {
                console.error('Error fetching content:', err);
                root.innerHTML = '<p class="text-white text-center mt-10">Gagal memuat konten.</p>';
            });
    }, 0); // Ubah ke 0 agar langsung load
}

window.openModal = function() {
    const modal = document.getElementById('qrisModal');
    const modalContent = document.getElementById('modalContent');
    if (!modal) return;
    
    modal.classList.remove('hidden');
    // Trigger reflow
    void modal.offsetWidth;
    
    modalContent.classList.remove('scale-90', 'opacity-0');
    modalContent.classList.add('scale-100', 'opacity-100');
}

window.closeModal = function() {
    const modal = document.getElementById('qrisModal');
    const modalContent = document.getElementById('modalContent');
    if (!modal) return;
    
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-90', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300); // Wait for transition
}

window.copyRekening = function() {
    const rekElem = document.getElementById('rekNumber');
    if (!rekElem) return;
    const rek = rekElem.innerText;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(rek).then(() => {
            showToast();
        }).catch(err => {
            fallbackCopyTextToClipboard(rek);
        });
    } else {
        fallbackCopyTextToClipboard(rek);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showToast();
    } catch (err) {
        console.error('Oops, unable to copy');
    }
    document.body.removeChild(textArea);
}

window.showToast = function(msg = 'Nomor rekening berhasil disalin!', iconClass = 'fa-circle-check') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    const toastIcon = document.getElementById('toastIcon');
    if (!toast) return;
    
    if (toastMsg) toastMsg.innerText = msg;
    if (toastIcon) toastIcon.className = `fa-solid ${iconClass} text-gold-400`;
    
    toast.classList.remove('translate-y-20', 'opacity-0');
    
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

window.toggleMusic = function() {
    const music = document.getElementById('bgMusic');
    const icon = document.getElementById('musicIcon');
    
    if (!music || !icon) return;

    if (music.paused) {
        music.play().then(() => {
            icon.classList.remove('fa-volume-xmark');
            icon.classList.add('fa-music', 'animate-pulse');
            showToast('Musik diputar', 'fa-music');
        }).catch(err => {
            console.error("Autoplay prevented:", err);
            showToast('Gagal memutar musik', 'fa-circle-exclamation');
        });
    } else {
        music.pause();
        icon.classList.remove('fa-music', 'animate-pulse');
        icon.classList.add('fa-volume-xmark');
        showToast('Musik dijeda', 'fa-volume-xmark');
    }
}

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Randomize properties
        const size = Math.random() * 4 + 2; // 2px to 6px
        const posX = Math.random() * 100; // 0% to 100%
        const duration = Math.random() * 10 + 10; // 10s to 20s
        const delay = Math.random() * 10; // 0s to 10s

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}vw`;
        particle.style.bottom = `-10px`;
        
        // Animation using Web Animations API
        particle.animate([
            { transform: 'translateY(0) scale(1)', opacity: Math.random() * 0.5 + 0.2 },
            { transform: `translateY(-100vh) scale(${Math.random() + 1})`, opacity: 0 }
        ], {
            duration: duration * 1000,
            delay: delay * 1000,
            iterations: Infinity,
            easing: 'linear'
        });

        particlesContainer.appendChild(particle);
    }
}

// Start app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);
