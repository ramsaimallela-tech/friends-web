document.addEventListener('DOMContentLoaded', () => {
    const thunder = document.getElementById('thunder-gateway');
    const squadHub = document.getElementById('squad-view');
    const closeBtn = document.getElementById('close-btn');

    let isCharging = false;
    let chargeLevel = 0;
    let chargeInterval;

    // Create flash overlay
    const flash = document.createElement('div');
    flash.className = 'flash-effect';
    document.body.appendChild(flash);

    function startCharge() {
        isCharging = true;
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
            document.getElementById('link-email').href = `mailto:${data.email}`;
            document.getElementById('link-github').href = data.github;
            document.getElementById('link-insta').href = data.insta;
            document.getElementById('link-linkedin').href = data.linkedin;

            // Update PFP Icon based on card
            const cardIcon = card.querySelector('.pfp-container i').className;
            document.getElementById('detail-pfp').innerHTML = `<i class="${cardIcon}"></i>`;

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
