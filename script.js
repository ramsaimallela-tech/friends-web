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
    }

    function triggerStrike() {
        // High-voltage feedback
        flash.style.animation = 'flash 0.1s ease-out 3';

        // Sudden vibration
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);

        // Reveal the butter smooth squad hub
        setTimeout(() => {
            squadHub.classList.add('active');
            document.body.style.overflow = 'auto'; // Re-enable scroll
        }, 300);
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

    // Close Interaction
    closeBtn.addEventListener('click', () => {
        squadHub.classList.remove('active');
        document.body.style.overflow = 'hidden';
        chargeLevel = 0;
        updateChargeVisuals();
    });

    // Hover sound/vibe (subtle)
    thunder.addEventListener('mouseenter', () => {
        thunder.style.filter = 'brightness(1.2)';
    });

    thunder.addEventListener('mouseleave', () => {
        thunder.style.filter = 'brightness(1)';
    });
});
