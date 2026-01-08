const API_URL = 'http://127.0.0.1:5000';

const ROLE_OPTIONS = [
    'Python Developer',
    'Web Developer',
    'Data Scientist',
    'DevOps Engineer',
    'Cybersecurity Analyst',
    'Mobile Developer',
    'Cloud Architect',
    'Product Manager',
    'UX Designer'
];

const STUDY_TOPICS = [
    {
        id: 'systems',
        title: 'Distributed Systems',
        summary: 'Design trade-offs, message guarantees, and observability rituals.',
        subhead: 'Ground yourself in CAP, PACELC, and resilient queue design.',
        resources: [
            { type: 'Docs', title: 'CAP & PACELC Primer', detail: 'Free · Why consistency vs availability still matters.' },
            { type: 'Video', title: 'Designing Resilient Queues', detail: '18 min walkthrough with mental models.' },
            { type: 'Guide', title: 'Incident Postmortem Playbook', detail: 'Calm, blameless review template.' }
        ]
    },
    {
        id: 'product',
        title: 'Product Discovery',
        summary: 'Customer interviews, prioritization frames, and story mapping.',
        subhead: 'Use JTBD prompts and 2x2 matrices to clarify the next tiny bet.',
        resources: [
            { type: 'Canvas', title: 'North Star Narrative', detail: 'Template for linking insights to bets.' },
            { type: 'Guide', title: 'JTBD Interview Kit', detail: 'Calm scripts to reduce bias.' },
            { type: 'Audio', title: 'Signals vs Noise Debrief', detail: '12-min reflection on synthesis.' }
        ]
    },
    {
        id: 'security',
        title: 'Secure Coding',
        summary: 'Threat modeling, secure defaults, and incident drills.',
        subhead: 'Pair high-signal checklists with red-team prompts.',
        resources: [
            { type: 'Checklist', title: 'Threat Modeling Canvas', detail: 'Map attack surfaces in under 20 min.' },
            { type: 'Docs', title: 'Secrets Hygiene', detail: 'Designing practical guardrails.' },
            { type: 'Lab', title: 'OWASP Replay', detail: 'Hands-on practice with fixes.' }
        ]
    },
    {
        id: 'ux',
        title: 'UX Frameworks',
        summary: 'Storyboard, usability flows, and calm critique prompts.',
        subhead: 'Anchor research insights into motion and microcopy decisions.',
        resources: [
            { type: 'Guide', title: 'Experience Flow Blocks', detail: 'Align delight with constraints.' },
            { type: 'Video', title: 'Narrative Wireframing', detail: '9-min demo with voiceover.' },
            { type: 'Template', title: 'Critique Grid', detail: 'Grounded prompts for team reviews.' }
        ]
    },
    {
        id: 'data',
        title: 'Data Pipelines',
        summary: 'Batch vs streaming, governance, and calm on-call notes.',
        subhead: 'Design a telemetry spine that scales without noise.',
        resources: [
            { type: 'Docs', title: 'Stream vs Batch Ledger', detail: 'Decision tree for hybrid stacks.' },
            { type: 'Guide', title: 'Data Contract Rituals', detail: 'Lightweight governance cadence.' },
            { type: 'Video', title: 'Orchestrating Resilience', detail: 'Hands-on Dagster and Airflow cues.' }
        ]
    }
];

const INSIGHT_SETS = {
    readiness: [
        { label: 'Confidence score', value: '82%', meta: 'Up 12% since last month' },
        { label: 'Interview decks', value: '6 complete', meta: 'Focusing on systems + leadership' },
        { label: 'Scenario versatility', value: 'High', meta: 'Balanced technical + narrative' }
    ],
    velocity: [
        { label: 'Roadmap cadence', value: 'Week 5 / 12', meta: '67% momentum kept' },
        { label: 'Learning streak', value: '9 days', meta: 'Avg 42 focused min' },
        { label: 'Feedback loops', value: 'Weekly', meta: 'PM + mentor syncs' }
    ],
    market: [
        { label: 'Top role match', value: 'Product AI Lead', meta: '23 aligned openings' },
        { label: 'Location fit', value: 'Hybrid or Remote', meta: 'Bay Area, Berlin, Singapore' },
        { label: 'Comp window', value: '$210k - $275k', meta: 'Based on level + scope' }
    ]
};

const PROMPT_CHIPS = [
    'Guide me step by step',
    'What should I learn next?',
    'Is this career right for me?',
    'Compare two roles',
    'Prep me for tomorrow'
];

const INITIAL_MESSAGES = [
    { role: 'assistant', text: 'Hey there! I can walk you through each milestone without the noise.' },
    { role: 'user', text: 'I feel torn between product leadership and applied AI.' },
    { role: 'assistant', text: "Let's compare daily work, growth pace, and the rituals that actually energize you." }
];

document.addEventListener('DOMContentLoaded', () => {
    const navTriggers = document.querySelectorAll('[data-nav]');
    const navButtons = document.querySelectorAll('nav [data-nav]');
    const screens = document.querySelectorAll('.screen');
    const themeToggle = document.getElementById('theme-toggle');
    const themeLabel = document.getElementById('theme-label');
    const themeSystemButton = document.getElementById('theme-system');
    const modal = document.getElementById('interview-modal');
    const modalTriggers = document.querySelectorAll('[data-modal="interview"]');
    const modalDismiss = document.querySelectorAll('[data-modal-dismiss]');
    const interviewForm = document.getElementById('interview-form');
    const roleSelect = document.getElementById('role-select');
    const questionsContainer = document.getElementById('questions-container');
    const questionsList = document.getElementById('questions-list');
    const interviewStatus = document.getElementById('interview-status');
    const roadmapForm = document.getElementById('roadmap-form');
    const goalSelect = document.getElementById('goal-select');
    const durationSelect = document.getElementById('duration-select');
    const roadmapOverview = document.getElementById('roadmap-overview');
    const roadmapMeta = document.getElementById('roadmap-meta');
    const roadmapResources = document.getElementById('roadmap-resources');
    const roadmapSelector = document.getElementById('roadmap-selector');
    const roadmapStepTitle = document.getElementById('roadmap-step-title');
    const roadmapStepSummary = document.getElementById('roadmap-step-summary');
    const roadmapStepList = document.getElementById('roadmap-step-list');
    const roadmapPrev = document.getElementById('roadmap-prev');
    const roadmapNext = document.getElementById('roadmap-next');
    const roadmapIndicator = document.getElementById('roadmap-indicator');
    const studyTabs = document.getElementById('study-tabs');
    const studyHeading = document.getElementById('study-heading');
    const studySubhead = document.getElementById('study-subhead');
    const studyContent = document.getElementById('study-content');
    const promptContainer = document.getElementById('prompt-chips');
    const chatWindow = document.getElementById('chat-window');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const insightTabs = document.getElementById('insight-tabs');
    const insightGrid = document.getElementById('insight-grid');
    const searchCta = document.getElementById('search-cta');

    const state = {
        activeScreen: 'home',
        roadmap: {
            steps: [],
            currentIndex: 0
        },
        studyTopic: null,
        insightTab: 'readiness',
        themePreference: localStorage.getItem('naviq-theme-preference') || 'system'
    };

    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)');

    populateSelect(roleSelect, ROLE_OPTIONS);
    populateSelect(goalSelect, ROLE_OPTIONS);
    bindNavigation();
    setupThemeToggle();
    initializeStudy();
    initializeAI();
    initializeInsights();
    initializeRoadmap();
    initializeInterview();
    attachModalEvents();
    setActiveScreen('home');

    function bindNavigation() {
        navTriggers.forEach((control) => {
            control.addEventListener('click', () => setActiveScreen(control.dataset.nav));
        });

        if (searchCta) {
            searchCta.addEventListener('click', () => setActiveScreen('roadmap'));
        }
    }

    function setActiveScreen(target) {
        if (!target) return;
        state.activeScreen = target;
        screens.forEach((screen) => {
            const isActive = screen.dataset.screen === target;
            screen.classList.toggle('active', isActive);
        });
        navButtons.forEach((control) => {
            const isActive = control.dataset.nav === target;
            control.classList.toggle('active', isActive);
            control.setAttribute('aria-current', isActive ? 'page' : 'false');
        });
    }

    function setupThemeToggle() {
        applyTheme();

        const order = ['system', 'light', 'dark'];

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentIndex = order.indexOf(state.themePreference);
                state.themePreference = order[(currentIndex + 1) % order.length];
                localStorage.setItem('naviq-theme-preference', state.themePreference);
                applyTheme();
            });
        }

        if (themeSystemButton) {
            themeSystemButton.addEventListener('click', () => {
                state.themePreference = 'system';
                localStorage.setItem('naviq-theme-preference', state.themePreference);
                applyTheme();
            });
        }

        const onSystemChange = () => {
            if (state.themePreference === 'system') {
                applyTheme();
            }
        };

        if (typeof systemPreference.addEventListener === 'function') {
            systemPreference.addEventListener('change', onSystemChange);
        } else if (typeof systemPreference.addListener === 'function') {
            systemPreference.addListener(onSystemChange);
        }
    }

    function applyTheme() {
        const mode = state.themePreference === 'system'
            ? (systemPreference.matches ? 'dark' : 'light')
            : state.themePreference;
        document.documentElement.setAttribute('data-theme', mode);
        if (themeLabel) {
            themeLabel.textContent = state.themePreference === 'system'
                ? 'Auto'
                : mode.charAt(0).toUpperCase() + mode.slice(1);
        }
    }

    function attachModalEvents() {
        modalTriggers.forEach((trigger) => {
            trigger.addEventListener('click', () => toggleModal(true));
        });

        modalDismiss.forEach((dismiss) => {
            dismiss.addEventListener('click', () => toggleModal(false));
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                toggleModal(false);
            }
        });
    }

    function toggleModal(open) {
        if (!modal) return;
        modal.classList.toggle('open', open);
        modal.setAttribute('aria-hidden', String(!open));
        if (open && roleSelect) {
            roleSelect.focus();
        }
    }

    function initializeInterview() {
        if (!interviewForm) return;
        interviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const role = roleSelect.value;
            if (!role) {
                interviewStatus.textContent = 'Please choose a role to continue.';
                return;
            }

            interviewStatus.textContent = 'Loading curated interview deck...';
            questionsContainer.classList.remove('hidden');

            try {
                const response = await fetch(`${API_URL}/interview?role=${encodeURIComponent(role)}`);
                if (!response.ok) {
                    throw new Error('Unable to load interview set');
                }
                const payload = await response.json();
                if (!Array.isArray(payload)) {
                    throw new Error(payload.error || 'Unexpected response');
                }
                renderQuestions(payload);
                interviewStatus.textContent = `Showing ${payload.length} questions for ${role}.`;
            } catch (error) {
                console.error(error);
                interviewStatus.textContent = 'Failed to load questions. Please try again.';
            }
        });
    }

    function renderQuestions(questions) {
        questionsList.innerHTML = '';
        if (!questions.length) {
            questionsList.innerHTML = '<li class="muted">No interview prompts available yet.</li>';
            return;
        }

        questions.forEach((question) => {
            const li = document.createElement('li');
            li.className = 'question-card';

            const header = document.createElement('header');
            const title = document.createElement('h4');
            title.textContent = question.question;
            header.appendChild(title);

            if (question.difficulty) {
                const badge = document.createElement('span');
                badge.className = `badge ${question.difficulty.toLowerCase()}`;
                badge.textContent = question.difficulty;
                header.appendChild(badge);
            }

            li.appendChild(header);

            if (question.focus) {
                const focus = document.createElement('p');
                focus.className = 'focus-label';
                focus.textContent = question.focus;
                li.appendChild(focus);
            }

            const answer = document.createElement('p');
            answer.textContent = question.answer;
            li.appendChild(answer);

            if (question.followUp) {
                const follow = document.createElement('p');
                follow.className = 'muted';
                follow.textContent = `Follow-up: ${question.followUp}`;
                li.appendChild(follow);
            }

            questionsList.appendChild(li);
        });
    }

    function initializeRoadmap() {
        if (!roadmapForm) return;
        roadmapForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const goal = goalSelect.value;
            const days = durationSelect.value;

            if (!goal) {
                roadmapOverview.textContent = 'Choose a goal to generate your roadmap.';
                return;
            }

            roadmapOverview.textContent = 'Creating a personalized weekly plan...';

            try {
                const response = await fetch(`${API_URL}/roadmap?goal=${encodeURIComponent(goal)}&days=${days}`);
                if (!response.ok) {
                    throw new Error('Unable to generate roadmap');
                }
                const payload = await response.json();
                if (!payload.weeks) {
                    throw new Error(payload.error || 'Unexpected response');
                }
                updateRoadmap(payload);
            } catch (error) {
                console.error(error);
                roadmapOverview.textContent = 'Could not create the roadmap. Please retry in a moment.';
            }
        });

        roadmapPrev.addEventListener('click', () => shiftRoadmapStep(-1));
        roadmapNext.addEventListener('click', () => shiftRoadmapStep(1));
    }

    function updateRoadmap(payload) {
        state.roadmap.steps = payload.weeks || [];
        state.roadmap.currentIndex = 0;

        roadmapOverview.textContent = payload.overview || 'This track is ready to explore.';
        roadmapMeta.innerHTML = '';
        roadmapResources.innerHTML = '';

        [payload.goal, `${payload.duration}-day focus`].forEach((label) => {
            if (!label) return;
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = label;
            roadmapMeta.appendChild(span);
        });

        (payload.resources || []).forEach((resource) => {
            const pill = document.createElement('span');
            pill.className = 'resource-pill';
            pill.textContent = resource;
            roadmapResources.appendChild(pill);
        });

        roadmapSelector.innerHTML = '';
        state.roadmap.steps.forEach((step, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'step-chip';
            button.textContent = String(index + 1).padStart(2, '0');
            button.addEventListener('click', () => setRoadmapStep(index));
            roadmapSelector.appendChild(button);
        });

        renderRoadmapStep();
    }

    function setRoadmapStep(index) {
        if (index < 0 || index >= state.roadmap.steps.length) return;
        state.roadmap.currentIndex = index;
        renderRoadmapStep();
    }

    function shiftRoadmapStep(delta) {
        setRoadmapStep(state.roadmap.currentIndex + delta);
    }

    function renderRoadmapStep() {
        const steps = state.roadmap.steps;
        const current = steps[state.roadmap.currentIndex];

        roadmapSelector.querySelectorAll('.step-chip').forEach((chip, index) => {
            chip.classList.toggle('active', index === state.roadmap.currentIndex);
        });

        if (!current) {
            roadmapStepTitle.textContent = 'Awaiting first plan';
            roadmapStepSummary.textContent = 'Generate a plan to see milestone calls-to-action.';
            roadmapStepList.innerHTML = '';
            roadmapPrev.disabled = true;
            roadmapNext.disabled = true;
            roadmapIndicator.textContent = 'Step 0 of 0';
            return;
        }

        roadmapStepTitle.textContent = `${String(state.roadmap.currentIndex + 1).padStart(2, '0')} · ${current.title}`;
        roadmapStepSummary.textContent = current.summary;
        roadmapStepList.innerHTML = '';

        current.focus.forEach((item) => {
            const li = document.createElement('li');
            const heading = document.createElement('strong');
            heading.textContent = item.title;
            li.appendChild(heading);

            if (item.details) {
                const detail = document.createElement('p');
                detail.className = 'muted';
                detail.textContent = item.details;
                li.appendChild(detail);
            }

            if (Array.isArray(item.outcomes) && item.outcomes.length) {
                const outcomes = document.createElement('p');
                outcomes.className = 'tiny';
                outcomes.textContent = `Outcomes: ${item.outcomes.join(' · ')}`;
                li.appendChild(outcomes);
            }

            if (Array.isArray(item.resources) && item.resources.length) {
                const resources = document.createElement('p');
                resources.className = 'tiny';
                resources.textContent = `Resources: ${item.resources.join(', ')}`;
                li.appendChild(resources);
            }

            roadmapStepList.appendChild(li);
        });

        roadmapPrev.disabled = state.roadmap.currentIndex === 0;
        roadmapNext.disabled = state.roadmap.currentIndex === steps.length - 1;
        roadmapIndicator.textContent = `Step ${state.roadmap.currentIndex + 1} of ${steps.length}`;
    }

    function initializeStudy() {
        if (!studyTabs) return;
        studyTabs.innerHTML = '';
        STUDY_TOPICS.forEach((topic, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'study-tab';
            button.textContent = topic.title;
            button.setAttribute('role', 'tab');
            button.setAttribute('aria-selected', index === 0);
            button.addEventListener('click', () => setStudyTopic(topic.id));
            studyTabs.appendChild(button);
        });

        setStudyTopic(STUDY_TOPICS[0].id);
    }

    function setStudyTopic(id) {
        state.studyTopic = id;
        const topic = STUDY_TOPICS.find((entry) => entry.id === id);
        if (!topic) return;

        studyTabs.querySelectorAll('.study-tab').forEach((tab) => {
            const isActive = tab.textContent === topic.title;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive);
        });

        studyHeading.textContent = topic.title;
        studySubhead.textContent = topic.subhead;
        studyContent.innerHTML = '';

        topic.resources.forEach((resource) => {
            const card = document.createElement('article');
            card.className = 'resource-card';

            const badge = document.createElement('p');
            badge.className = `badge ${resource.type === 'Video' ? 'coral' : ''}`.trim();
            badge.textContent = resource.type;
            card.appendChild(badge);

            const title = document.createElement('h3');
            title.textContent = resource.title;
            card.appendChild(title);

            const detail = document.createElement('p');
            detail.className = 'muted';
            detail.textContent = resource.detail;
            card.appendChild(detail);

            studyContent.appendChild(card);
        });
    }

    function initializeAI() {
        if (!promptContainer || !chatWindow || !chatForm || !chatInput) return;
        PROMPT_CHIPS.forEach((prompt) => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'prompt-chip';
            chip.textContent = prompt;
            chip.addEventListener('click', () => {
                chatInput.value = prompt;
                chatInput.focus();
            });
            promptContainer.appendChild(chip);
        });

        chatWindow.innerHTML = '';
        INITIAL_MESSAGES.forEach((message) => addMessage(message.role, message.text));

        chatForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const value = chatInput.value.trim();
            if (!value) return;
            addMessage('user', value);
            chatInput.value = '';
            setTimeout(() => addMessage('assistant', buildCoachResponse(value)), 500);
        });
    }

    function addMessage(role, text) {
        const bubble = document.createElement('div');
        bubble.className = `bubble ${role}`;
        bubble.textContent = text;
        chatWindow.appendChild(bubble);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function buildCoachResponse(input) {
        if (input.toLowerCase().includes('roadmap')) {
            return "Let's prioritize one learning block per day and bookend it with short reflections. Ready to choose a timeline?";
        }
        if (input.toLowerCase().includes('interview')) {
            return 'Pair behavioral loops with one systems story. I can surface a five-question deck the moment you open the studio.';
        }
        if (input.toLowerCase().includes('ai')) {
            return 'Blend PM rituals with AI craftsmanship: weekly research syntheses plus a demo cadence keeps you balanced.';
        }
        return "I hear you. Let's anchor your next tiny milestone, note the signals to watch, and check in again tomorrow.";
    }

    function initializeInsights() {
        if (!insightTabs || !insightGrid) return;
        insightTabs.innerHTML = '';
        Object.keys(INSIGHT_SETS).forEach((key, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'insight-tab';
            button.textContent = key.charAt(0).toUpperCase() + key.slice(1);
            button.dataset.key = key;
            button.addEventListener('click', () => setInsightTab(key));
            insightTabs.appendChild(button);
            if (index === 0) {
                setInsightTab(key);
            }
        });
    }

    function setInsightTab(key) {
        if (!insightTabs || !insightGrid) return;
        state.insightTab = key;
        insightTabs.querySelectorAll('.insight-tab').forEach((tab) => {
            const isActive = tab.dataset.key === key;
            tab.classList.toggle('active', isActive);
        });

        insightGrid.innerHTML = '';
        (INSIGHT_SETS[key] || []).forEach((stat, index) => {
            const card = document.createElement('article');
            card.className = 'stat-card';
            if (index === 1) {
                card.classList.add('dark');
            }

            const label = document.createElement('p');
            label.className = 'muted';
            label.textContent = stat.label;
            card.appendChild(label);

            const value = document.createElement('h3');
            value.textContent = stat.value;
            card.appendChild(value);

            const meta = document.createElement('p');
            meta.className = 'tiny';
            meta.textContent = stat.meta;
            card.appendChild(meta);

            insightGrid.appendChild(card);
        });
    }
});

function populateSelect(select, options) {
    if (!select) return;
    select.innerHTML = '';
    options.forEach((label) => {
        const option = document.createElement('option');
        option.value = label;
        option.textContent = label;
        select.appendChild(option);
    });
}
