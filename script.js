document.addEventListener('DOMContentLoaded', () => {
    const thunder = document.getElementById('thunder-gateway');
    const squadHub = document.getElementById('squad-view');
    const closeBtn = document.getElementById('close-btn');

    let isCharging = false;
    let chargeLevel = 0;
    let chargeInterval;

    // Audio Elements
    const sfxCharge = document.getElementById('sfx-charge');
    const sfxStrike = document.getElementById('sfx-strike');

    // Create flash overlay
    const flash = document.createElement('div');
    flash.className = 'flash-effect';
    document.body.appendChild(flash);

    function startCharge() {
        isCharging = true;
        sfxCharge.currentTime = 0;
        sfxCharge.volume = 0.1;
        sfxCharge.play().catch(e => console.log("Audio play blocked: ", e));

        chargeInterval = setInterval(() => {
            if (chargeLevel < 100) {
                chargeLevel += 2;
                updateChargeVisuals();
            } else {
                triggerStrike();
                stopCharge();
            }
        }, 20);
    }

    function stopCharge() {
        isCharging = false;
        clearInterval(chargeInterval);

        // Stop charging sound
        sfxCharge.pause();
        sfxCharge.currentTime = 0;

        if (chargeLevel < 100) {
            chargeLevel = 0;
            updateChargeVisuals();
        }
    }

    function updateChargeVisuals() {
        const scale = 1 + (chargeLevel / 100) * 0.5;
        const glow = chargeLevel;
        thunder.style.transform = `scale(${scale})`;
        thunder.querySelector('.thunder-bolt').style.filter = `drop-shadow(0 0 ${glow}px #fefe00) brightness(${1 + chargeLevel / 100})`;

        // Sound intensity
        sfxCharge.volume = Math.min(0.1 + (chargeLevel / 100) * 0.9, 1.0);
        sfxCharge.playbackRate = 1 + (chargeLevel / 100) * 0.5;

        // Intensity Shake
        document.body.classList.remove('shake-level-1', 'shake-level-2', 'shake-level-3');
        if (chargeLevel > 20 && chargeLevel < 50) document.body.classList.add('shake-level-1');
        if (chargeLevel >= 50 && chargeLevel < 80) document.body.classList.add('shake-level-2');
        if (chargeLevel >= 80) document.body.classList.add('shake-level-3');

        // Spawn Lightning
        if (Math.random() > 0.95 - (chargeLevel / 200)) {
            createLightning();
        }
    }

    function createLightning() {
        const container = document.getElementById('lightning-container');
        if (!container) return;

        const l = document.createElement('div');
        l.className = 'lightning-bolt-p';

        const isHorizontal = Math.random() > 0.5;
        if (isHorizontal) {
            l.style.width = Math.random() * 300 + 'px';
            l.style.height = '2px';
        } else {
            l.style.width = '2px';
            l.style.height = Math.random() * 300 + 'px';
        }

        l.style.left = Math.random() * 100 + '%';
        l.style.top = Math.random() * 100 + '%';
        l.style.transform = `rotate(${Math.random() * 360}deg)`;
        l.style.animation = 'lightning-flicker 0.2s linear forwards';

        container.appendChild(l);
        setTimeout(() => l.remove(), 200);
    }

    function triggerStrike() {
        // Stop all shaking
        document.body.classList.remove('shake-level-1', 'shake-level-2', 'shake-level-3');

        // Ultimate Feedback
        flash.style.animation = 'flash 0.15s ease-out 5';
        document.getElementById('app').classList.add('strike-zoomed');

        // Play strike sound
        sfxStrike.currentTime = 0;
        sfxStrike.play().catch(e => console.log("Audio play blocked: ", e));

        if (navigator.vibrate) navigator.vibrate([100, 50, 200, 50, 300]);

        // Reveal
        setTimeout(() => {
            squadHub.classList.add('active');
            document.body.style.overflow = 'auto';
            document.getElementById('app').classList.remove('strike-zoomed');
        }, 400);
    }

    // Interaction Listeners (Desktop & Mobile)
    thunder.addEventListener('mousedown', startCharge);
    thunder.addEventListener('mouseup', stopCharge);
    thunder.addEventListener('mouseleave', stopCharge);

    thunder.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startCharge();
    });
    thunder.addEventListener('touchend', stopCharge);

    const detailModal = document.getElementById('detail-modal');
    const closeDetail = document.getElementById('close-detail');
    const friendCards = document.querySelectorAll('.friend-card');

    // Open Detail Modal
    friendCards.forEach(card => {
        card.addEventListener('click', () => {
            const data = card.dataset;

            document.getElementById('detail-name').innerText = data.name;

            // Link Helpers
            const setLink = (id, value, prefix = '') => {
                const el = document.getElementById(id);
                if (value && value !== '#') {
                    el.href = (value.startsWith('http') || value.startsWith('mailto')) ? value : prefix + value;
                    el.style.display = 'inline-block';
                } else {
                    el.style.display = 'none';
                }
            };

            setLink('link-email', data.email, 'mailto:');
            setLink('link-github', data.github, 'https://github.com/');
            setLink('link-insta', data.insta, 'https://www.instagram.com/');
            setLink('link-linkedin', data.linkedin, 'https://www.linkedin.com/in/');
            setLink('link-x', data.x, 'https://x.com/');
            setLink('link-portfolio', data.portfolio);

            // Handle Photo vs Icon
            const detailImg = document.getElementById('detail-img');
            const detailPfp = document.getElementById('detail-pfp');

            if (data.img && data.img !== "" && !data.img.includes('images/')) {
                // If user provides a real path (I'll assume any path not starting with 'images/' or being a valid image is the condition for now, 
                // but actually I'll just check if the image successfully loads or if the path is provided)
                detailImg.src = data.img;
                detailImg.style.display = "block";
                detailPfp.style.display = "none";
            } else if (data.img && data.img !== "") {
                // Try to load the image, fallback to icon on error
                detailImg.src = data.img;
                detailImg.onload = () => {
                    detailImg.style.display = "block";
                    detailPfp.style.display = "none";
                };
                detailImg.onerror = () => {
                    detailImg.style.display = "none";
                    detailPfp.style.display = "flex";
                };
            } else {
                detailImg.style.display = "none";
                detailPfp.style.display = "flex";
            }

            // Update PFP Icon based on card
            const cardIcon = card.querySelector('.pfp-container i').className;
            detailPfp.innerHTML = `<i class="${cardIcon}"></i>`;

            detailModal.classList.add('active');
        });
    });

    closeDetail.addEventListener('click', () => {
        detailModal.classList.remove('active');
    });

    // Close on background click
    detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal) {
            detailModal.classList.remove('active');
        }
    });

    // Hover effect
    thunder.addEventListener('mouseenter', () => {
        thunder.style.filter = 'brightness(1.2)';
    });

    thunder.addEventListener('mouseleave', () => {
        thunder.style.filter = 'brightness(1)';
    });
});
