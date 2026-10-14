document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    try {
        // ==========================================================================
        // 1. Lenis Smooth Scroll Configuration
        // ==========================================================================
        let lenis;
        if (typeof Lenis !== 'undefined' && !/Android|iPhone|iPad/i.test(navigator.userAgent)) {
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
                wheelMultiplier: 1,
                infinite: false
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }

        // ==========================================================================
        // 2. Custom Letter Drawing & Assembly Entrance Animation (GSAP)
        // ==========================================================================
        const getWrapper = (key) => document.querySelector(`.grid-layout [data-letter="${key}"]`);

        // Custom reveal handler for individual letter animations (Optimized for luxurious feel)
        const revealLetter = (letterWrap, playTimeline, offsetDelay) => {
            const type = letterWrap.getAttribute('data-letter');
            const target = letterWrap.querySelector('.letter') || letterWrap.querySelector('.svg-letter-wrapper') || letterWrap.querySelector('.split-letter');
            if (!target) return;

            if (type === 's' || type === 's2') {
                playTimeline.fromTo(target,
                    { opacity: 0, scale: 0.4, rotation: type === 's' ? -45 : 30 },
                    { opacity: 1, scale: 1, rotation: 0, duration: 0.68, ease: "back.out(1.5)" },
                    offsetDelay
                );
            } else if (type === 'e1' || type === 'e2') {
                const top = target.querySelector('.top-half');
                const bottom = target.querySelector('.bottom-half');
                const dir = type === 'e1' ? 1 : -1;

                // Animate two halves sliding and snapping together in center
                playTimeline.fromTo(top,
                    { x: -20 * dir, y: -10, opacity: 0 },
                    { x: 0, y: 0, opacity: 1, duration: 0.68, ease: "power3.out" },
                    offsetDelay
                );
                playTimeline.fromTo(bottom,
                    { x: 20 * dir, y: 10, opacity: 0 },
                    { x: 0, y: 0, opacity: 1, duration: 0.68, ease: "power3.out" },
                    offsetDelay ? "<" : undefined
                );
            } else if (type === 'f' || type === 'l1' || type === 'l2') {
                const paths = target.querySelectorAll('path');
                paths.forEach((path, pIdx) => {
                    const len = path.getTotalLength();
                    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
                    playTimeline.to(path, {
                        strokeDashoffset: 0,
                        duration: 0.88,
                        ease: "power2.inOut"
                    }, offsetDelay + (pIdx * 0.12));
                });
            } else if (type === 'e3') {
                playTimeline.fromTo(target,
                    { opacity: 0, scaleY: 0 },
                    { opacity: 1, scaleY: 1, duration: 0.6, ease: "power2.out" },
                    offsetDelay
                );
            } else if (type === 'e4') {
                playTimeline.fromTo(target,
                    { opacity: 0, scaleX: 0 },
                    { opacity: 1, scaleX: 1, duration: 0.6, ease: "power2.out" },
                    offsetDelay
                );
            } else if (type === 'o') {
                playTimeline.fromTo(target,
                    { opacity: 0, clipPath: "circle(0% at 50% 50%)" },
                    { opacity: 1, clipPath: "circle(75% at 50% 50%)", duration: 0.72, ease: "power2.out" },
                    offsetDelay
                );
            } else if (type === 'v') {
                playTimeline.fromTo(target,
                    { opacity: 0, y: -20, scale: 0.8 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.5)" },
                    offsetDelay
                );
            } else if (type === 'e5') {
                playTimeline.fromTo(target,
                    { opacity: 0, scale: 0.4, rotation: -30 },
                    { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.5)" },
                    offsetDelay
                );
            }
        };

        if (typeof gsap !== 'undefined') {
            const wrappers = document.querySelectorAll('.grid-layout .letter-item');
            const textItems = document.querySelectorAll('.grid-layout .text-item');
            const bubbles = document.querySelectorAll('.grid-layout .speech-bubble');

            gsap.set(textItems, { opacity: 0, y: 15 });
            gsap.set(bubbles, { opacity: 0, scale: 0 });
            gsap.set('.site-header', { opacity: 0, y: -15 });

            const seeKeys = ['s', 'e1', 'e2'];
            const feelKeys = ['f', 'e3', 'e4', 'l1'];
            const solveKeys = ['s2', 'o', 'l2', 'v', 'e5'];

            const entranceTimeline = gsap.timeline();

            // Row 1: SEE reveals sequentially
            seeKeys.forEach((key, idx) => {
                const wrap = getWrapper(key);
                if (wrap) revealLetter(wrap, entranceTimeline, idx === 0 ? 0.3 : ">-0.45");
            });

            // Row 2: FEEL reveals sequentially (continuing the waterfall flow)
            feelKeys.forEach((key, idx) => {
                const wrap = getWrapper(key);
                if (wrap) revealLetter(wrap, entranceTimeline, ">-0.45");
            });

            // Row 3: SOLVE reveals sequentially
            solveKeys.forEach((key, idx) => {
                const wrap = getWrapper(key);
                if (wrap) revealLetter(wrap, entranceTimeline, ">-0.45");
            });

            // 4. Header and description text modules fade in immediately after letters are constructed
            entranceTimeline
                .to('.site-header', { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, ">+0.1")
                .to(textItems, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" }, "-=0.3");

            // 5. Bubble 1: Sleek minimalist scale-pop from bottom-left tail tip (Origin: 25px bottom)
            entranceTimeline.fromTo('#aboutBubble',
                { opacity: 0, scale: 0.8, y: 10, transformOrigin: "25px bottom" },
                { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.2)" },
                ">+0.15"
            );

            // 6. Bubble 2: Sleek minimalist scale-pop from bottom-right tail tip (Origin: left bottom)
            entranceTimeline.fromTo('#portfolioBubble',
                { opacity: 0, scale: 0.8, y: 10, transformOrigin: "calc(100% - 25px) bottom" },
                { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.2)" },
                ">+0.15"
            )
                .add(() => {
                    // Speech bubble interactive scaling on hover (JS handled to prevent CSS conflicts)
                    const bubbles = document.querySelectorAll('.grid-layout .speech-bubble');
                    bubbles.forEach(bubble => {
                        bubble.addEventListener('mouseenter', () => {
                            gsap.to(bubble, { scale: 1.04, duration: 0.25, ease: "power2.out", overwrite: "auto" });
                        });
                        bubble.addEventListener('mouseleave', () => {
                            gsap.to(bubble, { scale: 1, duration: 0.35, ease: "power2.out", overwrite: "auto" });
                        });
                    });

                    // Start the erratic organic glitch schedule once everything is settled
                    setTimeout(triggerRandomGlitch, 1000);

                    // ---------------------------------------------------------------
                    // Letter Free-Drag: activate after entrance animation completes
                    // ---------------------------------------------------------------
                    const gridLayout = document.querySelector('.grid-layout');
                    const letterItems = document.querySelectorAll('.grid-layout .letter-item');

                    letterItems.forEach(item => {
                        let dragging = false;
                        let startMouseX = 0, startMouseY = 0;
                        let startLeft = 0, startTop = 0;

                        item.style.cursor = 'grab';

                        item.addEventListener('mousedown', (e) => {
                            e.preventDefault();
                            dragging = true;
                            item.classList.add('is-dragging');
                            item.style.cursor = 'grabbing';
                            item.style.zIndex = '200';

                            // Snapshot current pixel position from percentage/CSS
                            const rect = item.getBoundingClientRect();
                            const gridRect = gridLayout.getBoundingClientRect();

                            // Flush any GSAP transforms into absolute position so drag starts cleanly
                            const gsapX = gsap.getProperty(item, 'x') || 0;
                            const gsapY = gsap.getProperty(item, 'y') || 0;
                            gsap.set(item, { x: 0, y: 0, clearProps: 'transform' });

                            startLeft = rect.left - gridRect.left + gsapX;
                            startTop = rect.top - gridRect.top + gsapY;

                            item.style.left = startLeft + 'px';
                            item.style.top = startTop + 'px';

                            startMouseX = e.clientX;
                            startMouseY = e.clientY;

                            const onMove = (ev) => {
                                if (!dragging) return;
                                const dx = ev.clientX - startMouseX;
                                const dy = ev.clientY - startMouseY;

                                // Constrain inside grid bounds
                                const maxLeft = gridLayout.offsetWidth - item.offsetWidth;
                                const maxTop = gridLayout.offsetHeight - item.offsetHeight;
                                const newLeft = Math.max(0, Math.min(startLeft + dx, maxLeft));
                                const newTop = Math.max(0, Math.min(startTop + dy, maxTop));

                                item.style.left = newLeft + 'px';
                                item.style.top = newTop + 'px';
                            };

                            const onUp = () => {
                                dragging = false;
                                item.classList.remove('is-dragging');
                                item.style.cursor = 'grab';
                                item.style.zIndex = '';

                                // Tiny elastic bounce on drop
                                gsap.fromTo(item,
                                    { scale: 1.06 },
                                    { scale: 1, duration: 0.5, ease: 'elastic.out(1.1, 0.55)' }
                                );

                                window.removeEventListener('mousemove', onMove);
                                window.removeEventListener('mouseup', onUp);
                            };

                            window.addEventListener('mousemove', onMove);
                            window.addEventListener('mouseup', onUp);
                        });

                        // Touch support
                        item.addEventListener('touchstart', (e) => {
                            const touch = e.touches[0];
                            dragging = true;
                            item.classList.add('is-dragging');
                            item.style.zIndex = '200';

                            const rect = item.getBoundingClientRect();
                            const gridRect = gridLayout.getBoundingClientRect();
                            const gsapX = gsap.getProperty(item, 'x') || 0;
                            const gsapY = gsap.getProperty(item, 'y') || 0;
                            gsap.set(item, { x: 0, y: 0, clearProps: 'transform' });

                            startLeft = rect.left - gridRect.left + gsapX;
                            startTop = rect.top - gridRect.top + gsapY;
                            item.style.left = startLeft + 'px';
                            item.style.top = startTop + 'px';

                            startMouseX = touch.clientX;
                            startMouseY = touch.clientY;

                            const onTouchMove = (ev) => {
                                ev.preventDefault();
                                const t = ev.touches[0];
                                const dx = t.clientX - startMouseX;
                                const dy = t.clientY - startMouseY;
                                const maxLeft = gridLayout.offsetWidth - item.offsetWidth;
                                const maxTop = gridLayout.offsetHeight - item.offsetHeight;
                                item.style.left = Math.max(0, Math.min(startLeft + dx, maxLeft)) + 'px';
                                item.style.top = Math.max(0, Math.min(startTop + dy, maxTop)) + 'px';
                            };

                            const onTouchEnd = () => {
                                dragging = false;
                                item.classList.remove('is-dragging');
                                item.style.zIndex = '';
                                gsap.fromTo(item,
                                    { scale: 1.06 },
                                    { scale: 1, duration: 0.5, ease: 'elastic.out(1.1, 0.55)' }
                                );
                                item.removeEventListener('touchmove', onTouchMove);
                                item.removeEventListener('touchend', onTouchEnd);
                            };

                            item.addEventListener('touchmove', onTouchMove, { passive: false });
                            item.addEventListener('touchend', onTouchEnd);
                        }, { passive: true });
                    });
                });
        }

        // ==========================================================================
        // 2b. Erratic Letter Glitch / Spontaneous Interaction Loop (Legibility-Safe)
        // ==========================================================================
        const triggerRandomGlitch = () => {
            const isCoverActive = document.getElementById('coverView').classList.contains('active');
            if (!isCoverActive) {
                // Suspend loop if user toggles to workspace view
                setTimeout(triggerRandomGlitch, 1500);
                return;
            }

            const wrappers = document.querySelectorAll('.grid-layout .letter-item');
            const activeWrappers = Array.from(wrappers).filter(item => !item.classList.contains('is-hovered') && !item.classList.contains('is-dragging'));
            if (activeWrappers.length === 0) {
                setTimeout(triggerRandomGlitch, 800);
                return;
            }

            // Pick a random un-hovered letter to trigger a micro-interaction
            const randomItem = activeWrappers[Math.floor(Math.random() * activeWrappers.length)];
            const target = randomItem.querySelector('.letter') || randomItem.querySelector('.svg-letter-wrapper') || randomItem.querySelector('.split-letter');

            if (target) {
                const type = randomItem.getAttribute('data-letter');

                if (type === 'f' || type === 'l1' || type === 'l2') {
                    // Calligraphic Erase-and-Write loop (Erase in reverse, then redraw)
                    const paths = target.querySelectorAll('path');
                    const drawTimeline = gsap.timeline();

                    // 1. Sequential Erase (Reverse draw)
                    paths.forEach((path, pIdx) => {
                        const len = path.getTotalLength();
                        gsap.set(path, { strokeDasharray: len });
                        drawTimeline.to(path, {
                            strokeDashoffset: len,
                            duration: 0.4,
                            ease: "power2.in"
                        }, pIdx * 0.1);
                    });

                    // 2. Sequential Redraw (Forward draw)
                    paths.forEach((path, pIdx) => {
                        drawTimeline.to(path, {
                            strokeDashoffset: 0,
                            duration: 0.55,
                            ease: "power2.out"
                        }, pIdx === 0 ? ">+0.12" : ">-0.38");
                    });
                } else {
                    const animType = Math.floor(Math.random() * 4); // 4 custom interactive presets for sans-serifs

                    if (animType === 0) {
                        // Preset 1: Elastic Spin & Return
                        gsap.fromTo(target,
                            { rotation: 0 },
                            { rotation: Math.random() > 0.5 ? 360 : -360, duration: 0.95, ease: "elastic.out(1, 0.45)", clearProps: "rotation" }
                        );
                    } else if (animType === 1) {
                        // Preset 2: Squash & Stretch Bounce
                        const squashTimeline = gsap.timeline();
                        squashTimeline
                            .to(target, { scaleY: 0.62, scaleX: 1.25, duration: 0.15, ease: "power2.out" })
                            .to(target, { scaleY: 1.15, scaleX: 0.85, duration: 0.15, ease: "power2.inOut" })
                            .to(target, { scaleY: 1, scaleX: 1, duration: 0.5, ease: "elastic.out(1.2, 0.45)", clearProps: "scaleX,scaleY" });
                    } else if (animType === 2) {
                        // Preset 3: Split-letter drift (e1/e2) or Quick positional nudge (others)
                        if (type === 'e1' || type === 'e2') {
                            const top = target.querySelector('.top-half');
                            const bottom = target.querySelector('.bottom-half');
                            const splitTimeline = gsap.timeline();
                            splitTimeline
                                .to(top, { y: -8, duration: 0.15, ease: "power2.out" })
                                .to(bottom, { y: 8, duration: 0.15, ease: "power2.out" }, "<")
                                .to([top, bottom], { y: 0, duration: 0.45, ease: "elastic.out(1, 0.45)", clearProps: "y" });
                        } else {
                            const nudgeTimeline = gsap.timeline();
                            nudgeTimeline
                                .to(target, { x: 8, y: -4, duration: 0.15, ease: "power2.out" })
                                .to(target, { x: 0, y: 0, duration: 0.45, ease: "elastic.out(1.1, 0.4)", clearProps: "x,y" });
                        }
                    } else if (animType === 3) {
                        // Preset 4: Soft Scale Pop
                        gsap.fromTo(target,
                            { scale: 1 },
                            { scale: 1.2, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.inOut", clearProps: "scale" }
                        );
                    }
                }
            }

            // Schedule the next erratic action (random interval between 1.0s and 2.2s for higher activity)
            setTimeout(triggerRandomGlitch, 1000 + Math.random() * 1200);
        };

        // ==========================================================================
        // 3. View Switching: Cover View vs Workspace View
        // ==========================================================================
        const viewToggle = document.getElementById('viewToggle');
        const coverView = document.getElementById('coverView');
        const workspaceView = document.getElementById('workspaceView');

        if (viewToggle && coverView && workspaceView) {
            viewToggle.addEventListener('click', () => {
                const isCoverActive = coverView.classList.contains('active');
                const activeLabel = viewToggle.querySelector('.btn-label-active');
                const inactiveLabel = viewToggle.querySelector('.btn-label-inactive');

                if (isCoverActive) {
                    // Transition to Workspace View
                    coverView.classList.remove('active');
                    workspaceView.classList.add('active');

                    if (activeLabel && inactiveLabel) {
                        activeLabel.textContent = 'WORKSPACE';
                        inactiveLabel.textContent = 'COVER';
                    }

                    // Animate card entries in workspace
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo('.feed-filter-bar',
                            { opacity: 0, y: -20 },
                            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.1 }
                        );
                        gsap.fromTo('.feed-card',
                            { opacity: 0, scale: 0.95, y: 30 },
                            { opacity: 1, scale: 1, y: 0, duration: 0.7, stagger: 0.06, ease: "power3.out", delay: 0.2 }
                        );
                    }
                } else {
                    // Transition to Cover Editorial View
                    workspaceView.classList.remove('active');
                    coverView.classList.add('active');

                    if (activeLabel && inactiveLabel) {
                        activeLabel.textContent = 'COVER';
                        inactiveLabel.textContent = 'WORKSPACE';
                    }
                }
            });
        }

        // Logo & Portfolio button hooks
        const navLogo = document.getElementById('navLogo');
        if (navLogo) {
            navLogo.addEventListener('click', (e) => {
                e.preventDefault();
                if (coverView && !coverView.classList.contains('active') && viewToggle) {
                    viewToggle.click();
                }
            });
        }

        const navPortfolio = document.getElementById('navPortfolio');
        if (navPortfolio) {
            navPortfolio.addEventListener('click', () => {
                if (coverView && !coverView.classList.contains('active') && viewToggle) {
                    viewToggle.click();
                }
                if (coverView && coverView.classList.contains('active') && viewToggle) {
                    viewToggle.click();
                }
            });
        }

        const portfolioBubble = document.getElementById('portfolioBubble');
        if (portfolioBubble) {
            portfolioBubble.addEventListener('click', () => {
                if (viewToggle) viewToggle.click();
            });
        }

        // ==========================================================================
        // 4. Behance Project Feed Core Configuration
        // ==========================================================================
        // (Drag and physics components discarded for editorial grid feed standard)

        // ==========================================================================
        // 5. Letter Magnet Attraction Logic (Editorial Cover)
        // ==========================================================================
        const letterItems = document.querySelectorAll('.letter-item');

        letterItems.forEach(item => {
            const target = item.querySelector('.letter') || item.querySelector('.svg-letter-wrapper') || item.querySelector('.split-letter');
            if (!target) return;

            item.addEventListener('mousemove', (e) => {
                if (item.classList.contains('is-dragging')) return;
                item.classList.add('is-hovered');

                const rect = item.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const gapX = e.clientX - centerX;
                const gapY = e.clientY - centerY;

                const magneticStrength = 0.35;
                const pullX = gapX * magneticStrength;
                const pullY = gapY * magneticStrength;

                // Extremely fluid, damped tracking tween
                gsap.to(target, {
                    x: pullX,
                    y: pullY,
                    duration: 0.3,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            });

            item.addEventListener('mouseleave', () => {
                if (item.classList.contains('is-dragging')) return;
                item.classList.remove('is-hovered');

                // Tactile elastic spring back on mouse release
                gsap.to(target, {
                    x: 0,
                    y: 0,
                    duration: 0.65,
                    ease: "elastic.out(1.1, 0.6)",
                    overwrite: "auto"
                });
            });
        });

        // ==========================================================================
        // 6. Fullscreen Zoom Transitions & Folder Double-clicks
        // ==========================================================================
        // ==========================================================================
        // 6. Fullscreen Zoom Transitions & Folder Interactions
        // ==========================================================================
        const projectData = {
            'marimekko': {
                title: 'Marimekko Pattern',
                indicator: 'BRANDING',
                client: 'Personal Design Project',
                role: 'Rebranding / AI Video Production',
                year: '2025',
                period: '2025.12',
                tools: ['Ai', 'Ps'],
                heading: 'Weaving organic floral print forms into digital screens.',
                overview: '핀란드의 라이프스타일 브랜드 마리메꼬(Marimekko)의 독창적인 패턴 언어를 재해석하고 현대적인 감성으로 브랜드를 리브랜딩하는 디자인 프로젝트입니다. 생성형 AI 기술을 활용하여 브랜드 고유의 대담하고 예술적인 프린트 양식을 담아낸 브랜드 프로모션 영상을 기획 및 제작했습니다. 다양한 컬러 스터디와 디지털 스크린 시뮬레이션을 포함합니다.',
                media: [
                    { type: 'video', src: 'work/marimekko/진짜최종.mp4' },
                    { type: 'image', src: 'work/marimekko/2.jpg' }
                ]
            },
            'cafe-clover': {
                title: 'Cafe Clover Brand',
                indicator: 'BRANDING',
                client: 'Client Commission',
                role: 'Brand Identity & Graphic Design',
                year: '2025',
                period: '2025.07 - 2025.08',
                tools: ['Ai', 'Ps'],
                heading: 'Translating green leaf vectors into cafe layouts.',
                overview: 'Cafe Clover는 일상 속에서 ‘행복(세잎)’과 ‘행운(네잎)’을 함께 느낄 수 있는 공간을 지향하는 감성 카페 브랜드입니다. 클로버가 가진 긍정적 상징을 바탕으로, 둥근 형태의 클로버 쉐입을 활용해 브랜딩했습니다. 부드러운 곡선과 안정적인 볼륨감을 통해 따뜻하고 친근한 분위기를 표현했으며, 누구나 기억하기 쉬운 미니멀 아이덴티티로 완성했습니다.',
                media: [
                    { type: 'image', src: 'work/cafe clover/1.jpg' }
                ]
            },
            'neville-brody': {
                title: 'Neville Brody Archive',
                indicator: 'EDITORIAL',
                client: 'Art Direction Case Study',
                role: 'Editorial Design / Art Direction',
                year: '2025',
                period: '2025.09 - 2025.11',
                tools: ['Ai', 'Ps', 'Id'],
                heading: 'Deconstructing type weights and editorial rules.',
                overview: '네빌 브로디(Neville Brody)의 독창적인 디자인 철학, 예술 사조, 그리고 특유의 방법론을 심도 있게 분석하여 시각화하고 정리한 편집물 아카이브 프로젝트입니다. 사양은 170mm x 240mm 규격의 무선 제본 형태로 디자인 및 제안했습니다.',
                media: [
                    { type: 'image', src: 'work/artderector archive-neville brody/1.jpg' },
                    { type: 'image', src: 'work/artderector archive-neville brody/목업2.jpg' },
                    { type: 'image', src: 'work/artderector archive-neville brody/목업5.jpg' },
                    { type: 'image', src: 'work/artderector archive-neville brody/4.jpg' }
                ]
            },
            'sixth-stars': {
                title: 'Sixth Star: The Legacy of T1',
                indicator: 'EDITORIAL',
                client: 'EMG Esports Magazine / Personal Project',
                role: 'Editorial Design / Art Direction',
                year: '2026',
                period: '2026.04 - 2025.06',
                tools: ['Id', 'Ai', 'Ps'],
                heading: 'Documenting the eternal journey to the sixth star through typography and layout.',
                overview: '『Sixth Stars: The Legacy of T1』은 리그 오브 레전드 e스포츠 역사상 유일무이한 6회 월드 챔피언십 우승과 3연속 쓰리핏(Three-peat)이라는 대기록을 달성한 T1의 위대한 여정을 기록한 편집 아카이브 매거진입니다. 과거의 영광과 암흑기의 시련, 2022년 부활의 서막부터 2025년 결승전까지의 드라마틱한 서사를 강렬한 타이포그래피와 그리드 시스템, 티켓 및 굿즈 목업을 결합한 총 24페이지 분량의 편집 출판물로 기획·디자인했습니다.',
                media: [
                    { type: 'image', src: 'work/sixth stars-the lagacy of t1/mockup_01.jpg' },
                    { type: 'image', src: 'work/sixth stars-the lagacy of t1/mockup_02.jpg' },
                    { type: 'image', src: 'work/sixth stars-the lagacy of t1/sixth_stars_page_01.jpg' },
                    { type: 'image', src: 'work/sixth stars-the lagacy of t1/sixth_stars_page_02.jpg' },
                    { type: 'image', src: 'work/sixth stars-the lagacy of t1/sixth_stars_page_03.jpg' },
                    { type: 'image', src: 'work/sixth stars-the lagacy of t1/sixth_stars_page_04.jpg' },
                    { type: 'image', src: 'work/sixth stars-the lagacy of t1/sixth_stars_page_05.jpg' },
                    { type: 'image', src: 'work/sixth stars-the lagacy of t1/sixth_stars_page_06.jpg' },
                    { type: 'image', src: 'work/sixth stars-the lagacy of t1/sixth_stars_page_07.jpg' },
                    { type: 'image', src: 'work/sixth stars-the lagacy of t1/sixth_stars_page_08.jpg' },
                    { type: 'image', src: 'work/sixth stars-the lagacy of t1/sixth_stars_page_09.jpg' },
                    { type: 'image', src: 'work/sixth stars-the lagacy of t1/sixth_stars_page_10.jpg' },
                    { type: 'image', src: 'work/sixth stars-the lagacy of t1/sixth_stars_page_11.jpg' },
                    { type: 'image', src: 'work/sixth stars-the lagacy of t1/sixth_stars_page_12.jpg' },
                    { type: 'image', src: 'work/sixth stars-the lagacy of t1/sixth_stars_page_13.jpg' }
                ]
            },
            'chae-byeong-rok': {
                title: 'Chae Byeong Rok Archive',
                indicator: 'EDITORIAL',
                client: 'Korean Graphic Designers Exhibition',
                role: 'Editorial Design / Exhibition Leaflet',
                year: '2026',
                period: '2026.03',
                tools: ['Id', 'Ai', 'Ps'],
                heading: 'Exploring accumulation, layering, and traditional visual codes.',
                overview: '한국의 그래픽 디자이너 6인 기획전의 일환으로 제작된 채병록(CBR Graphic) 디자이너 아카이브 16면 리플릿 프로젝트입니다. 작은 시각 요소들이 축적되고 중첩되며 깊이를 만들어내는 채병록 특유의 그래픽 방법론(Accumulation, Layering, Korean Graphic, Beyond Poster, Graphic Process)을 구조화된 그리드와 대담한 타이포그래피로 재해석하여 관람객에게 디자이너의 철학을 전달할 수 있도록 기획·디자인했습니다.',
                media: [
                    { type: 'image', src: 'work/chae byeong rok designer achicve/chae_byeong_rok_page_01.jpg' },
                    { type: 'image', src: 'work/chae byeong rok designer achicve/chae_byeong_rok_page_02.jpg' },
                    { type: 'image', src: 'work/chae byeong rok designer achicve/chae_byeong_rok_page_03.jpg' },
                    { type: 'image', src: 'work/chae byeong rok designer achicve/chae_byeong_rok_page_04.jpg' },
                    { type: 'image', src: 'work/chae byeong rok designer achicve/chae_byeong_rok_page_05.jpg' },
                    { type: 'image', src: 'work/chae byeong rok designer achicve/chae_byeong_rok_page_06.jpg' },
                    { type: 'image', src: 'work/chae byeong rok designer achicve/chae_byeong_rok_page_07.jpg' },
                    { type: 'image', src: 'work/chae byeong rok designer achicve/chae_byeong_rok_page_08.jpg' },
                    { type: 'image', src: 'work/chae byeong rok designer achicve/chae_byeong_rok_page_09.jpg' }
                ]
            },
            '007-title': {
                title: '007 Title Sequence',
                indicator: 'MOTION',
                client: 'Motion Design Workshop',
                role: 'Motion Graphics / Art Direction',
                year: '2026',
                period: '2026.03 - 2026.04',
                tools: ['Ai', 'Ae'],
                heading: 'Translating classic espionage sequence dynamics into typography.',
                overview: '영화 007 시리즈의 상징적인 오프닝 시그니처 시퀀스를 독창적으로 재해석하여 제작한 모션 그래픽 영상 프로젝트입니다. 타이포그래피의 역동적인 전환 효과와 대담한 그래픽 레이아웃을 통해 007 특유의 긴장감, 클래식한 미감, 그리고 우아함을 감각적인 모션으로 조율했습니다.',
                media: [
                    { type: 'video', src: 'work/007 tltle sequence/중간 - 202421728_박하원.mp4' },
                    { type: 'image', src: 'work/007 tltle sequence/썸네일.jpg' },
                    { type: 'image', src: 'work/007 tltle sequence/스크린샷 2026-04-20 오후 9.47.34.jpg' },
                    { type: 'image', src: 'work/007 tltle sequence/스크린샷 2026-04-20 오후 9.47.58.jpg' },
                    { type: 'image', src: 'work/007 tltle sequence/스크린샷 2026-04-20 오후 9.48.15.jpg' },
                    { type: 'image', src: 'work/007 tltle sequence/스크린샷 2026-04-20 오후 9.48.28.jpg' },
                    { type: 'image', src: 'work/007 tltle sequence/스크린샷 2026-04-20 오후 9.48.57.jpg' },
                    { type: 'image', src: 'work/007 tltle sequence/스크린샷 2026-04-20 오후 9.49.13.jpg' },
                    { type: 'image', src: 'work/007 tltle sequence/스크린샷 2026-04-20 오후 9.49.22.jpg' },
                    { type: 'image', src: 'work/007 tltle sequence/스크린샷 2026-04-20 오후 9.49.34.jpg' },
                    { type: 'image', src: 'work/007 tltle sequence/스크린샷 2026-04-20 오후 9.49.48.jpg' },
                    { type: 'image', src: 'work/007 tltle sequence/스크린샷 2026-04-21 오전 12.23.31.jpg' },
                    { type: 'image', src: 'work/007 tltle sequence/스크린샷 2026-04-21 오전 12.30.04.jpg' }
                ]
            },

            'binjari': {
                title: 'BINJARI PROJECT',
                indicator: 'UI/UX',
                client: 'Semester Final Branding Project',
                role: 'UX/UI App & Web Design',
                year: '2026',
                period: '2026.03 - 2026.06',
                tools: ['Figma', 'Ai', 'Ps', 'Ae', 'Vs'],
                heading: 'Coordinating brand principles and motion showcase.',
                overview: '빈자리는 카공족이 지도 기반으로 카페를 탐색하고, 실시간으로 빈자리를 확인하여 예약까지 할 수 있는 서비스입니다. 사용자용 앱 디자인뿐만 아니라 점주들이 매장을 수월하게 관리할 수 있도록 사장님용 포스기(POS) 웹 화면까지 함께 설계했습니다.',
                media: [
                    { type: 'image', src: 'work/binjari/01.png' },
                    { type: 'video', src: 'work/binjari/기말 - 202421728_박하원 포폴용.mp4' }
                ]
            },
            'routenote': {
                title: 'RouteNote',
                indicator: 'UI/UX',
                client: 'RouteNote Study',
                role: 'UX/UI Design',
                year: '2025',
                period: '2025.03 - 2025.10',
                tools: ['Figma', 'Ai', 'Ps'],
                heading: 'Synthesizing dynamic color theory with geometric lines.',
                overview: 'RouteNote는 여행을 더 효율적으로 계획하고 더 깊이 기록할 수 있도록 설계한 AI 기반 맞춤형 여행 플래너 앱입니다. 사용자의 취향과 여행 패턴을 분석하여 일정과 동선을 자동 최적화하고, 상황에 따라 실시간 추천을 제공합니다. 여행 중 발견과 감정을 자연스럽게 기록하며, 개인화된 여행 경험을 완성하는 서비스입니다.',
                media: [
                    { type: 'image', src: 'work/routenote/1.png' },
                    { type: 'image', src: 'work/routenote/2.jpg' },
                    { type: 'image', src: 'work/routenote/3.jpg' },
                    { type: 'image', src: 'work/routenote/4.gif' },
                    { type: 'image', src: 'work/routenote/5.jpg' }
                ]
            },
            'star-academy': {
                title: 'Star.1 Academy',
                indicator: 'BRANDING',
                client: 'Star.1 Academy',
                role: 'Brand Design / Print Mockup',
                year: '2024',
                period: '2024.11 - 2024.12',
                tools: ['Ai', 'Ps'],
                heading: 'Branding institutions through sleek device mockups.',
                overview: 'STAR.1 Academy는 연기자를 꿈꾸는 학생들이 \'스타\'로 성장할 수 있도록 이끄는 연기학원입니다. 의뢰자의 요구사항은 모던하고 심플한 디자인, 스타의 상징성 반영, 짙은 녹색의 차분한 분위기, 그리고 STAR와 숫자 1의 명확한 구분이었습니다. 이 조건을 기반으로 학원의 전문성과 비전을 담은 로고 디자인을 진행했습니다.',
                media: [
                    { type: 'image', src: 'work/star.1 academy/Mockup.png' },
                    { type: 'image', src: 'work/star.1 academy/노트북.jpg' }
                ]
            }
        };

        // Dynamically add pages 02 to 64 of the Binjari planning book to its media array
        for (let i = 2; i <= 64; i++) {
            const pageNum = String(i).padStart(2, '0');
            projectData.binjari.media.push({
                type: 'image',
                src: `work/binjari/202421728 박하원_최종 기획_페이지_${pageNum}.jpg`
            });
        }

        // Connect clicks on project cards directly to open project detail
        const feedCards = document.querySelectorAll('.feed-card');
        const filterBtns = document.querySelectorAll('.filter-btn');

        feedCards.forEach(card => {
            card.addEventListener('click', () => {
                const projectKey = card.getAttribute('data-project');
                openProject(projectKey);
            });
        });

        // Add filter bar triggers with organic staggered animations
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('active')) return;

                // Adjust active classes
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterVal = btn.getAttribute('data-filter');
                const toHide = [];
                const toShow = [];

                feedCards.forEach(card => {
                    const categories = card.getAttribute('data-category').split(' ');
                    if (filterVal === 'all' || categories.includes(filterVal)) {
                        toShow.push(card);
                    } else {
                        toHide.push(card);
                    }
                });

                if (typeof gsap !== 'undefined') {
                    // 1. Find all currently visible cards
                    const visibleCards = Array.from(feedCards).filter(c => window.getComputedStyle(c).display !== 'none');

                    if (visibleCards.length > 0) {
                        // Fade out current grid view to avoid layout jump during transition
                        gsap.to(visibleCards, {
                            opacity: 0,
                            scale: 0.92,
                            y: 15,
                            duration: 0.22,
                            ease: "power2.out",
                            onComplete: () => {
                                // 2. Update layout: display state shifts cleanly while invisible
                                toHide.forEach(c => c.style.display = 'none');
                                toShow.forEach(c => {
                                    c.style.display = 'flex';
                                    c.style.opacity = '0';
                                });

                                // 3. Fade in new selection in their final computed positions
                                if (toShow.length > 0) {
                                    gsap.fromTo(toShow,
                                        { opacity: 0, scale: 0.92, y: 15 },
                                        {
                                            opacity: 1,
                                            scale: 1,
                                            y: 0,
                                            duration: 0.45,
                                            ease: "power3.out",
                                            stagger: 0.03,
                                            clearProps: "transform,opacity"
                                        }
                                    );
                                }
                            }
                        });
                    } else {
                        // Fallback if grid was empty
                        toHide.forEach(c => c.style.display = 'none');
                        toShow.forEach(c => {
                            c.style.display = 'flex';
                            c.style.opacity = '0';
                        });
                        if (toShow.length > 0) {
                            gsap.fromTo(toShow,
                                { opacity: 0, scale: 0.92, y: 15 },
                                {
                                    opacity: 1,
                                    scale: 1,
                                    y: 0,
                                    duration: 0.45,
                                    ease: "power3.out",
                                    stagger: 0.03,
                                    clearProps: "transform,opacity"
                                }
                            );
                        }
                    }
                } else {
                    // Instant browser fallback
                    toHide.forEach(c => c.style.display = 'none');
                    toShow.forEach(c => c.style.display = 'flex');
                }
            });
        });

        // Helper to construct dynamic media cards with filename tag captions
        function createMediaElement(asset, projectTitle, isHero) {
            const card = document.createElement('div');
            card.className = 'media-item-card';

            let el;
            if (asset.type === 'image') {
                el = document.createElement('img');
                el.src = asset.src;
                el.alt = projectTitle;
                el.className = 'proj-gallery-img';
                el.loading = 'lazy';
            } else if (asset.type === 'video') {
                el = document.createElement('video');
                el.src = asset.src;
                el.className = 'proj-gallery-video';
                el.controls = true;
                el.playsInline = true;
                el.preload = 'metadata';
            } else if (asset.type === 'pdf') {
                el = document.createElement('iframe');
                el.src = asset.src;
                el.className = 'proj-gallery-pdf';
                el.setAttribute('title', projectTitle + ' Document PDF');
            }

            card.appendChild(el);

            // Add fine typography caption metadata at the bottom
            const caption = document.createElement('span');
            caption.className = 'media-caption-tag';

            // Decoded file name for exhibition aesthetic
            const filename = asset.src.split('/').pop();
            const decodedFilename = decodeURIComponent(filename);
            caption.textContent = isHero ? `KEY VISUAL // ${decodedFilename}` : `EXHIBIT // ${decodedFilename}`;

            card.appendChild(caption);
            return card;
        }

        function openProject(projectKey) {
            const data = projectData[projectKey];
            if (!data) return;

            // Update indicator badge
            const indicatorEl = document.getElementById('projectIndicator');
            if (indicatorEl) indicatorEl.textContent = data.indicator;

            const scrollContainer = document.getElementById('projectScrollContainer');
            if (!scrollContainer) return;
            scrollContainer.scrollTop = 0;

            // 1. Get thumbnail (first media item)
            let thumbnailHtml = '';
            if (data.media && data.media.length > 0) {
                const firstAsset = data.media[0];
                if (firstAsset.type === 'image') {
                    thumbnailHtml = `<img src="${firstAsset.src}" alt="${data.title} Thumbnail" class="proj-gallery-img" style="width:100%; border: none;" loading="lazy">`;
                } else if (firstAsset.type === 'video') {
                    thumbnailHtml = `<video src="${firstAsset.src}" class="proj-gallery-video" style="width:100%;" controls playsinline preload="metadata"></video>`;
                } else if (firstAsset.type === 'pdf') {
                    thumbnailHtml = `<iframe src="${firstAsset.src}" class="proj-gallery-pdf" style="width:100%; height:85vh;" title="${data.title}"></iframe>`;
                }
            }

            // 2. Get remaining media items (starting from index 1)
            let mediaItemsHtml = '';
            if (data.media && data.media.length > 1) {
                for (let i = 1; i < data.media.length; i++) {
                    const asset = data.media[i];
                    let elHtml = '';
                    if (asset.type === 'image') {
                        elHtml = `<img src="${asset.src}" alt="${data.title}" class="proj-gallery-img" style="width:100%; display:block;" loading="lazy">`;
                    } else if (asset.type === 'video') {
                        elHtml = `<video src="${asset.src}" class="proj-gallery-video" style="width:100%;" controls playsinline preload="metadata"></video>`;
                    } else if (asset.type === 'pdf') {
                        elHtml = `<iframe src="${asset.src}" class="proj-gallery-pdf" style="width:100%; height:85vh;" title="${data.title}"></iframe>`;
                    }

                    mediaItemsHtml += `
                        <div class="media-item-card" style="width: 100%;">
                            ${elHtml}
                        </div>
                    `;
                }
            }

            const getToolIconHtml = (tool) => {
                if (tool === 'Ps') {
                    return `<span class="proj-meta-tool tool-ps" title="Adobe Photoshop">Ps</span>`;
                } else if (tool === 'Ai') {
                    return `<span class="proj-meta-tool tool-ai" title="Adobe Illustrator">Ai</span>`;
                } else if (tool === 'Ae') {
                    return `<span class="proj-meta-tool tool-ae" title="Adobe After Effects">Ae</span>`;
                } else if (tool === 'Pr') {
                    return `<span class="proj-meta-tool tool-pr" title="Adobe Premiere Pro">Pr</span>`;
                } else if (tool === 'Vs') {
                    return `<span class="proj-meta-tool tool-vs" title="Visual Studio Code">Vs</span>`;
                } else if (tool === 'Id') {
                    return `<span class="proj-meta-tool tool-id" title="Adobe InDesign">Id</span>`;
                } else if (tool === 'Figma') {
                    return `
                        <span class="proj-meta-tool tool-figma" title="Figma">
                            <svg viewBox="0 0 8 12" fill="none" style="width: 10px; height: 14px; display: inline-block; vertical-align: middle;">
                                <path d="M2 12C0.9 12 0 11.1 0 10C0 8.9 0.9 8 2 8H4V12H2ZM2 8C0.9 8 0 7.1 0 6C0 4.9 0.9 4 2 4H4V8H2ZM2 4C0.9 4 0 3.1 0 2C0 0.9 0.9 0 2 0C3.1 0 4 0.9 4 2V4H2ZM6 8C4.9 8 4 7.1 4 6C4 4.9 4.9 4 6 4C7.1 4 8 4.9 8 6C8 7.1 7.1 8 6 8ZM6 4C4.9 4 4 3.1 4 2C4 0.9 4.9 0 6 0C7.1 0 8 0.9 8 2C8 3.1 7.1 4 6 4Z" fill="currentColor"/>
                            </svg>
                        </span>
                    `;
                }
                return `<span class="proj-meta-tool" title="${tool}">${tool}</span>`;
            };

            const toolsHtml = data.tools ? data.tools.map(t => getToolIconHtml(t)).join('') : '';

            const html = `
            <!-- Top Header Area: Title & Description -->
            <section class="proj-section overview-section" style="min-height: auto !important; display: block !important; padding-top: 5.2rem; padding-bottom: 3rem;">
                <div style="max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.8rem;">
                    <h1 class="proj-title font-sans" style="font-size: clamp(2.2rem, 4.5vw, 3.2rem); font-weight: 900; line-height: 1.1; letter-spacing: -1.5px; margin: 0; text-transform: uppercase; color: #111;">
                        ${data.title}
                    </h1>
                    
                    <p style="font-size: 1.15rem; line-height: 1.65; color: #333; margin: 0; word-break: keep-all; font-weight: 500; max-width: 850px;">
                        ${data.overview}
                    </p>

                    <!-- Unified Project Meta Grid -->
                    <div class="proj-details-meta-grid">
                        <div class="proj-meta-item">
                            <span class="proj-meta-lbl">PERIOD</span>
                            <span class="proj-meta-val">${data.period || data.year}</span>
                        </div>
                        <div class="proj-meta-item">
                            <span class="proj-meta-lbl">ROLE</span>
                            <span class="proj-meta-val">${data.role || 'Visual Design'}</span>
                        </div>
                        <div class="proj-meta-item">
                            <span class="proj-meta-lbl">PROGRAMS</span>
                            <div class="proj-meta-tools-wrap">
                                ${toolsHtml}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Thumbnail directly below description with border-bottom divider -->
            <section class="proj-section media-section" style="padding-top: 0; padding-bottom: 3.5rem; border-bottom: 1px solid rgba(17, 17, 17, 0.12);">
                <div style="max-width: 1000px; margin: 0 auto; width: 100%;">
                    <div class="media-item-card" style="width: 100%;">
                        ${thumbnailHtml}
                    </div>
                </div>
            </section>

            <!-- Scrollable showcase (Remaining items stacked flush) -->
            ${mediaItemsHtml ? `
            <section class="proj-section media-section" style="padding-top: 4.5rem; padding-bottom: 6rem;">
                <div class="blog-media-list no-gap-gallery" style="max-width: 1000px; margin: 0 auto; width: 100%;">
                    ${mediaItemsHtml}
                </div>
            </section>
            ` : ''}
            `;

            scrollContainer.innerHTML = html;

            // Play the overlay opening animation
            const overlay = document.getElementById('projectOverlay');
            if (!overlay) return;

            document.body.classList.add('project-open');
            if (lenis) lenis.stop();

            if (typeof gsap !== 'undefined') {
                gsap.killTweensOf(overlay);
                gsap.set(overlay, { display: 'block', opacity: 0 });

                const tl = gsap.timeline();
                tl.to(overlay, {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power4.out",
                    onStart: () => {
                        overlay.style.pointerEvents = 'auto';
                    }
                })
                    .from(overlay.querySelectorAll('.proj-title'), {
                        opacity: 0,
                        y: 40,
                        duration: 0.6,
                        ease: "power3.out"
                    }, "-=0.45")
                    .from(overlay.querySelectorAll('.overview-section, .media-section'), {
                        opacity: 0,
                        y: 30,
                        duration: 0.5,
                        stagger: 0.1,
                        ease: "power3.out"
                    }, "-=0.3");
            } else {
                overlay.style.display = 'block';
                overlay.style.opacity = '1';
                overlay.style.pointerEvents = 'auto';
            }
        }

        // Close project overlay trigger
        const closeProjectBtn = document.getElementById('closeProjectBtn');
        if (closeProjectBtn) {
            closeProjectBtn.addEventListener('click', () => {
                const overlay = document.getElementById('projectOverlay');
                if (!overlay) return;

                document.body.classList.remove('project-open');
                if (lenis) lenis.start();

                // Stop any running media (prevents audio playing in the background!)
                const videos = overlay.querySelectorAll('video');
                videos.forEach(v => v.pause());

                if (typeof gsap !== 'undefined') {
                    gsap.killTweensOf(overlay);
                    gsap.to(overlay, {
                        opacity: 0,
                        duration: 0.45,
                        ease: "power2.out",
                        onComplete: () => {
                            overlay.style.display = 'none';
                            overlay.style.pointerEvents = 'none';
                        }
                    });
                } else {
                    overlay.style.display = 'none';
                    overlay.style.pointerEvents = 'none';
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('project-open')) {
                const closeBtn = document.getElementById('closeProjectBtn');
                if (closeBtn) closeBtn.click();
            }
        });

        // ==========================================================================
        // 7. Modals (About Me) Trigger
        // ==========================================================================
        const aboutBubble = document.getElementById('aboutBubble');
        const aboutModal = document.getElementById('aboutModal');
        const modalClose = document.getElementById('modalClose');

        if (aboutBubble && aboutModal && modalClose) {
            aboutBubble.addEventListener('click', () => {
                aboutModal.classList.add('active');
                document.body.classList.add('modal-open');
                if (lenis) lenis.stop();
            });

            const closeAboutModal = () => {
                aboutModal.classList.remove('active');
                document.body.classList.remove('modal-open');
                if (lenis) lenis.start();
            };

            modalClose.addEventListener('click', closeAboutModal);
            aboutModal.addEventListener('click', (e) => {
                if (e.target === aboutModal) {
                    closeAboutModal();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && aboutModal.classList.contains('active')) {
                    closeAboutModal();
                }
            });
        }

    } catch (err) {
        console.error("Initialization error in portfolio script:", err);
    }
});
