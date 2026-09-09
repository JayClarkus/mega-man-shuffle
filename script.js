const bosses = [
    { name: 'Metal Man',  image: 'assets/MM2_-_Metal_Man_Portrait.png' },
    { name: 'Air Man',    image: 'assets/MM2_-_Air_Man_Portrait.png' },
    { name: 'Bubble Man', image: 'assets/MM2_-_Bubble_Man_Portrait.png' },
    { name: 'Quick Man',  image: 'assets/MM2_-_Quick_Man_Portrait.png' },
    { name: 'Crash Man',  image: 'assets/MM2_-_Crash_Man_Portrait.png' },
    { name: 'Flash Man',  image: 'assets/MM2_-_Flash_Man_Portrait.png' },
    { name: 'Heat Man',   image: 'assets/MM2_-_Heat_Man_Portrait.png' },
    { name: 'Wood Man',   image: 'assets/MM2_-_Wood_Man_Portrait.png' }
];

// Current order of boss names; lockedNames holds names locked in place
let order = bosses.map(b => b.name);
const lockedNames = new Set();

const grid = document.getElementById('boss-grid');
const shuffleBtn = document.getElementById('shuffle-btn');
const bossByName = Object.fromEntries(bosses.map(b => [b.name, b]));

// Fisher-Yates shuffle — returns a new shuffled array
function shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

// Shuffle only unlocked bosses; locked bosses stay in their positions
function shuffleUnlocked() {
    const unlockedNames = order.filter(name => !lockedNames.has(name));
    const shuffled = shuffle(unlockedNames);
    let next = 0;
    order = order.map(name => lockedNames.has(name) ? name : shuffled[next++]);
}

function render() {
    grid.innerHTML = '';

    order.forEach((name, index) => {
        const boss = bossByName[name];
        const isLocked = lockedNames.has(name);

        const card = document.createElement('div');
        card.className = 'boss-card' + (isLocked ? ' locked' : '');
        card.draggable = !isLocked;
        card.dataset.index = index;
        card.dataset.name = name;

        const img = document.createElement('img');
        img.src = boss.image;
        img.alt = boss.name;
        img.draggable = false;
        if (boss.name === 'Quick Man') {
            img.className = 'quick-man-portrait';
        }

        const portraitFrame = document.createElement('div');
        portraitFrame.className = 'portrait-frame';
        portraitFrame.appendChild(img);

        const orderBadge = document.createElement('span');
        orderBadge.className = 'order';
        orderBadge.textContent = index + 1;

        const nameEl = document.createElement('span');
        nameEl.className = 'name';
        nameEl.textContent = boss.name;

        const lockBtn = document.createElement('button');
        lockBtn.type = 'button';
        lockBtn.className = 'lock-btn';
        lockBtn.textContent = isLocked ? '🔒' : '🔓';
        lockBtn.title = isLocked ? 'Unlock' : 'Lock';
        lockBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (lockedNames.has(name)) {
                lockedNames.delete(name);
            } else {
                lockedNames.add(name);
            }
            render();
        });

        // Drag & drop: drop onto another card to swap the two positions
        card.addEventListener('dragstart', (e) => {
            if (lockedNames.has(name)) {
                e.preventDefault();
                return;
            }
            e.dataTransfer.setData('text/plain', index.toString());
            e.dataTransfer.effectAllowed = 'move';
        });

        card.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            card.classList.add('drop-target');
        });

        card.addEventListener('dragleave', () => {
            card.classList.remove('drop-target');
        });

        card.addEventListener('drop', (e) => {
            e.preventDefault();
            card.classList.remove('drop-target');
            const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
            const toIndex = index;
            if (Number.isNaN(fromIndex) || fromIndex === toIndex) return;
            if (lockedNames.has(order[toIndex])) return;

            [order[fromIndex], order[toIndex]] = [order[toIndex], order[fromIndex]];
            render();
        });

        card.appendChild(portraitFrame);
        card.appendChild(orderBadge);
        card.appendChild(nameEl);
        card.appendChild(lockBtn);
        grid.appendChild(card);
    });
}

shuffleBtn.addEventListener('click', () => {
    shuffleUnlocked();
    render();
});

// Initial render in the classic order
render();
