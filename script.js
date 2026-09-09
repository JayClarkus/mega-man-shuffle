// Robot Master roster for each mainline game. Portrait images are resolved by
// naming convention (see imagePathFor); games without art yet fall back to
// initials automatically until matching files are dropped into assets/.
const games = {
    1: {
        title: 'Mega Man 1',
        bosses: [
            { name: 'Cut Man' },
            { name: 'Guts Man' },
            { name: 'Ice Man' },
            { name: 'Bomb Man' },
            { name: 'Fire Man' },
            { name: 'Elec Man' }
        ]
    },
    2: {
        title: 'Mega Man 2',
        bosses: [
            { name: 'Metal Man' },
            { name: 'Air Man' },
            { name: 'Bubble Man' },
            { name: 'Quick Man' },
            { name: 'Crash Man' },
            { name: 'Flash Man' },
            { name: 'Heat Man' },
            { name: 'Wood Man' }
        ]
    },
    3: {
        title: 'Mega Man 3',
        bosses: [
            { name: 'Needle Man' },
            { name: 'Magnet Man' },
            { name: 'Gemini Man' },
            { name: 'Hard Man' },
            { name: 'Top Man' },
            { name: 'Snake Man' },
            { name: 'Spark Man' },
            { name: 'Shadow Man' }
        ]
    },
    4: {
        title: 'Mega Man 4',
        bosses: [
            { name: 'Bright Man' },
            { name: 'Toad Man' },
            { name: 'Drill Man' },
            { name: 'Pharaoh Man' },
            { name: 'Ring Man' },
            { name: 'Dust Man' },
            { name: 'Dive Man' },
            { name: 'Skull Man' }
        ]
    },
    5: {
        title: 'Mega Man 5',
        bosses: [
            { name: 'Gravity Man' },
            { name: 'Wave Man' },
            { name: 'Stone Man' },
            { name: 'Gyro Man' },
            { name: 'Star Man' },
            { name: 'Charge Man' },
            { name: 'Napalm Man' },
            { name: 'Crystal Man' }
        ]
    },
    6: {
        title: 'Mega Man 6',
        bosses: [
            { name: 'Blizzard Man' },
            { name: 'Centaur Man' },
            { name: 'Flame Man' },
            { name: 'Knight Man' },
            { name: 'Plant Man' },
            { name: 'Tomahawk Man' },
            { name: 'Wind Man' },
            { name: 'Yamato Man' }
        ]
    },
    7: {
        title: 'Mega Man 7',
        bosses: [
            { name: 'Freeze Man' },
            { name: 'Junk Man' },
            { name: 'Burst Man' },
            { name: 'Cloud Man' },
            { name: 'Spring Man' },
            { name: 'Slash Man' },
            { name: 'Shade Man' },
            { name: 'Turbo Man' }
        ]
    },
    8: {
        title: 'Mega Man 8',
        bosses: [
            { name: 'Frost Man' },
            { name: 'Tengu Man' },
            { name: 'Astro Man' },
            { name: 'Clown Man' },
            { name: 'Search Man' },
            { name: 'Sword Man' },
            { name: 'Aqua Man' },
            { name: 'Grenade Man' }
        ]
    },
    9: {
        title: 'Mega Man 9',
        bosses: [
            { name: 'Concrete Man' },
            { name: 'Tornado Man' },
            { name: 'Splash Woman' },
            { name: 'Plug Man' },
            { name: 'Jewel Man' },
            { name: 'Hornet Man' },
            { name: 'Magma Man' },
            { name: 'Galaxy Man' }
        ]
    },
    10: {
        title: 'Mega Man 10',
        bosses: [
            { name: 'Blade Man' },
            { name: 'Pump Man' },
            { name: 'Commando Man' },
            { name: 'Chill Man' },
            { name: 'Sheep Man' },
            { name: 'Strike Man' },
            { name: 'Nitro Man' },
            { name: 'Solar Man' }
        ]
    },
    11: {
        title: 'Mega Man 11',
        bosses: [
            { name: 'Block Man' },
            { name: 'Fuse Man' },
            { name: 'Blast Man' },
            { name: 'Acid Man' },
            { name: 'Tundra Man' },
            { name: 'Torch Man' },
            { name: 'Impact Man' },
            { name: 'Bounce Man' }
        ]
    }
};

let currentGameId = 2;
let bosses = games[currentGameId].bosses;

// Current order of boss names; lockedNames holds names locked in place
let order = bosses.map(b => b.name);
const lockedNames = new Set();

const grid = document.getElementById('boss-grid');
const shuffleBtn = document.getElementById('shuffle-btn');
const gameTitle = document.getElementById('game-title');
const menuBtn = document.getElementById('menu-btn');
const menuIcon = document.getElementById('menu-icon');
const menuOverlay = document.getElementById('menu-overlay');
const gameMenu = document.getElementById('game-menu');
const gameList = document.getElementById('game-list');
let bossByName = Object.fromEntries(bosses.map(b => [b.name, b]));

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

// Two-word Robot Master initials (e.g. "Cut Man" -> "CM") for missing art
function initialsFor(name) {
    return name.split(' ').map(word => word[0]).join('');
}

// Naming convention for portrait assets, e.g. "assets/MM1_-_Cut_Man_Portrait.png"
function imagePathFor(gameId, name) {
    return `assets/MM${gameId}_-_${name.replace(/ /g, '_')}_Portrait.png`;
}

function openMenu() {
    gameMenu.classList.add('open');
    menuOverlay.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    gameMenu.setAttribute('aria-hidden', 'false');
    menuIcon.src = 'assets/menu_open.png';
}

function closeMenu() {
    gameMenu.classList.remove('open');
    menuOverlay.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    gameMenu.setAttribute('aria-hidden', 'true');
    menuIcon.src = 'assets/menu.png';
}

function selectGame(gameId) {
    currentGameId = gameId;
    bosses = games[currentGameId].bosses;
    bossByName = Object.fromEntries(bosses.map(b => [b.name, b]));
    order = bosses.map(b => b.name);
    lockedNames.clear();
    gameTitle.textContent = games[currentGameId].title;
    renderMenu();
    closeMenu();
    render();
}

function renderMenu() {
    gameList.innerHTML = '';
    Object.keys(games).forEach(id => {
        const gameId = Number(id);
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'game-option' + (gameId === currentGameId ? ' active' : '');
        btn.textContent = games[gameId].title;
        btn.addEventListener('click', () => selectGame(gameId));
        li.appendChild(btn);
        gameList.appendChild(li);
    });
}

menuBtn.addEventListener('click', () => {
    if (gameMenu.classList.contains('open')) {
        closeMenu();
    } else {
        openMenu();
    }
});

menuOverlay.addEventListener('click', closeMenu);

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

        const portraitFrame = document.createElement('div');
        portraitFrame.className = 'portrait-frame';

        const img = document.createElement('img');
        img.src = imagePathFor(currentGameId, boss.name);
        img.alt = boss.name;
        img.draggable = false;
        if (currentGameId === 2 && boss.name === 'Quick Man') {
            img.className = 'quick-man-portrait';
        }
        img.addEventListener('error', () => {
            img.remove();
            portraitFrame.classList.add('no-image');
            const initials = document.createElement('span');
            initials.className = 'portrait-initials';
            initials.textContent = initialsFor(boss.name);
            portraitFrame.appendChild(initials);
        }, { once: true });
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
renderMenu();
render();
