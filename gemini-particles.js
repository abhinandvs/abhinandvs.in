/**
 * Gemini Wave Particle System - Emerald & Sage Green DOT Edition
 * Features:
 * - 100% Circular Dot Particles (clean, refined stardust & wave constellation)
 * - Harmonious Forest Green, Emerald, Jade, Sage & Mint palette
 * - Fluid ultra-smooth, slow multi-harmonic wave ribbons
 * - Silky real-time mouse physics: Soft repulsion cushion, organic spring damping, and parallax tilt
 * - High-DPI retina display support & 60+ FPS optimized canvas rendering
 */

(function () {
    class GeminiParticleWave {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;

            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.ambientParticles = [];
            this.tracks = [];
            this.running = false;
            this.animationFrameId = null;

            // Viewport & Scale
            this.width = 0;
            this.height = 0;
            this.dpr = Math.min(window.devicePixelRatio || 1, 2);

            // Time & Motion - Ultra slow, peaceful & serene
            this.time = 0;
            this.timeStep = 0.0055; // Gently paced, very smooth

            // Mouse tracking with silky damped lerp
            this.mouse = {
                x: -9999,
                y: -9999,
                targetX: -9999,
                targetY: -9999,
                vx: 0,
                vy: 0,
                active: false,
                radius: 190,
                force: 26 // Soft, polite magnetic cushion
            };

            // Camera Parallax
            this.parallax = { x: 0, y: 0, targetX: 0, targetY: 0 };

            // Launch Transition state
            this.isLaunching = false;
            this.launchProgress = 0;

            // Ripples from clicks / interactions
            this.ripples = [];

            // Green Theme Palette (Forest Green, Emerald, Jade, Sage, Mint & Celadon)
            this.palette = [
                { r: 30,  g: 58,  b: 43  },  // Forest Primary #1e3a2b
                { r: 46,  g: 83,  b: 61  },  // Emerald Accent #2e533d
                { r: 38,  g: 122, b: 80  },  // Radiant Jade #267a50
                { r: 52,  g: 152, b: 102 },  // Leaf Green #349866
                { r: 76,  g: 175, b: 124 },  // Vibrant Sage #4caf7c
                { r: 110, g: 195, b: 150 },  // Soft Mint #6ec396
                { r: 152, g: 218, b: 184 }   // Pale Celadon #98dab8
            ];

            this.init();
        }

        init() {
            this.resize();
            this.setupTracks();
            this.createParticles();
            this.createAmbientParticles();
            this.bindEvents();
            this.start();
        }

        resize() {
            const rect = this.canvas.parentElement ? this.canvas.parentElement.getBoundingClientRect() : {
                width: window.innerWidth,
                height: window.innerHeight
            };

            this.width = rect.width || window.innerWidth;
            this.height = rect.height || window.innerHeight;

            this.canvas.width = Math.floor(this.width * this.dpr);
            this.canvas.height = Math.floor(this.height * this.dpr);
            this.ctx.scale(this.dpr, this.dpr);

            if (this.tracks.length > 0) {
                this.setupTracks();
                this.createParticles();
                this.createAmbientParticles();
            }
        }

        setupTracks() {
            // Multi-layered ribbons with slow, gentle, hypnotic wave speeds
            this.tracks = [
                {
                    depth: 0.55,
                    baseYRatio: 0.74,
                    amplitude: 48,
                    freq1: 0.0020,
                    freq2: 0.0044,
                    speed: 0.32,
                    phase: 0.2,
                    particleCount: 70,
                    colorIndex: 0,
                    alphaBase: 0.38,
                    radiusBase: 1.8
                },
                {
                    depth: 0.70,
                    baseYRatio: 0.70,
                    amplitude: 62,
                    freq1: 0.0024,
                    freq2: 0.0050,
                    speed: 0.42,
                    phase: 1.5,
                    particleCount: 88,
                    colorIndex: 1,
                    alphaBase: 0.55,
                    radiusBase: 2.2
                },
                {
                    depth: 0.85,
                    baseYRatio: 0.66,
                    amplitude: 78,
                    freq1: 0.0028,
                    freq2: 0.0058,
                    speed: 0.52,
                    phase: 3.0,
                    particleCount: 108,
                    colorIndex: 2,
                    alphaBase: 0.72,
                    radiusBase: 2.6
                },
                {
                    depth: 1.0,
                    baseYRatio: 0.62,
                    amplitude: 96,
                    freq1: 0.0032,
                    freq2: 0.0066,
                    speed: 0.62,
                    phase: 4.4,
                    particleCount: 122,
                    colorIndex: 4,
                    alphaBase: 0.88,
                    radiusBase: 3.1
                },
                {
                    depth: 1.15,
                    baseYRatio: 0.58,
                    amplitude: 110,
                    freq1: 0.0036,
                    freq2: 0.0074,
                    speed: 0.72,
                    phase: 5.7,
                    particleCount: 98,
                    colorIndex: 5,
                    alphaBase: 0.80,
                    radiusBase: 3.3
                }
            ];
        }

        createParticles() {
            this.particles = [];

            this.tracks.forEach((track, trackIdx) => {
                const count = Math.round(track.particleCount * (this.width / 1200));
                const total = Math.max(count, 50);

                for (let i = 0; i < total; i++) {
                    const u = i / (total - 1); // 0 to 1 across screen width
                    const jitterX = (Math.random() - 0.5) * (this.width / total * 0.8);

                    // Pure circular dots with organic radius variations
                    const radius = (track.radiusBase * (0.8 + Math.random() * 0.45));

                    const color = this.palette[(track.colorIndex + (Math.random() > 0.6 ? 1 : 0)) % this.palette.length];
                    const alpha = track.alphaBase * (0.7 + Math.random() * 0.3);

                    this.particles.push({
                        trackIdx: trackIdx,
                        track: track,
                        u: u,
                        jitterX: jitterX,
                        jitterY: (Math.random() - 0.5) * 16,
                        radius: radius,
                        color: color,
                        alpha: alpha,
                        
                        // Physics state
                        x: 0,
                        y: 0,
                        dispX: 0,
                        dispY: 0,
                        vx: 0,
                        vy: 0,
                        
                        // Very slow gentle micro-oscillation
                        microFreq: 0.35 + Math.random() * 0.45,
                        microAmp: 2.0 + Math.random() * 2.5,
                        microPhase: Math.random() * Math.PI * 2
                    });
                }
            });
        }

        createAmbientParticles() {
            this.ambientParticles = [];
            const count = Math.round(30 * (this.width / 1200));

            for (let i = 0; i < count; i++) {
                this.ambientParticles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    vx: (Math.random() - 0.5) * 0.12,
                    vy: -0.06 - Math.random() * 0.14,
                    radius: 1.2 + Math.random() * 1.8,
                    color: this.palette[Math.floor(Math.random() * this.palette.length)],
                    alpha: 0.18 + Math.random() * 0.35,
                    pulseSpeed: 0.4 + Math.random() * 0.6,
                    pulsePhase: Math.random() * Math.PI * 2
                });
            }
        }

        // Wave height calculation with multi-harmonic curves & crests on sides
        computeWavePoint(x, t, track) {
            const nx = x;
            
            // Side-crest lift: upward sweeps on left and right borders
            const centerDist = Math.abs((x / this.width) - 0.5) * 2; // 0 at center, 1 at edges
            const edgeArch = Math.pow(centerDist, 2.2) * 50;

            // Harmonic combination
            const wave1 = Math.sin(nx * track.freq1 + t * track.speed + track.phase) * track.amplitude;
            const wave2 = Math.cos(nx * track.freq2 - t * track.speed * 0.65 + track.phase * 0.5) * (track.amplitude * 0.38);
            const wave3 = Math.sin(nx * 0.0012 + t * 0.28) * 18;

            const baseY = this.height * track.baseYRatio;
            const y = baseY + wave1 + wave2 + wave3 - edgeArch;

            return y;
        }

        bindEvents() {
            const onMouseMove = (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.targetX = e.clientX - rect.left;
                this.mouse.targetY = e.clientY - rect.top;
                this.mouse.active = true;

                // Parallax target (-1 to 1) - subtle & calm
                this.parallax.targetX = ((e.clientX / window.innerWidth) - 0.5) * 24;
                this.parallax.targetY = ((e.clientY / window.innerHeight) - 0.5) * 15;
            };

            const onMouseLeave = () => {
                this.mouse.targetX = -9999;
                this.mouse.targetY = -9999;
                this.mouse.active = false;
                this.parallax.targetX = 0;
                this.parallax.targetY = 0;
            };

            const onClick = (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Add an interactive smooth wave ripple
                this.ripples.push({
                    x: x,
                    y: y,
                    radius: 5,
                    maxRadius: 260,
                    strength: 24,
                    speed: 4.5,
                    life: 1.0
                });
            };

            window.addEventListener('mousemove', onMouseMove, { passive: true });
            window.addEventListener('mouseout', onMouseLeave, { passive: true });
            window.addEventListener('click', onClick, { passive: true });

            // Touch support for mobile devices
            window.addEventListener('touchmove', (e) => {
                if (e.touches.length > 0) {
                    const rect = this.canvas.getBoundingClientRect();
                    this.mouse.targetX = e.touches[0].clientX - rect.left;
                    this.mouse.targetY = e.touches[0].clientY - rect.top;
                    this.mouse.active = true;
                }
            }, { passive: true });

            window.addEventListener('touchend', onMouseLeave, { passive: true });
            window.addEventListener('resize', () => this.resize(), { passive: true });
        }

        triggerLaunch() {
            this.isLaunching = true;
            this.launchProgress = 0;

            // Impart an energetic launch ripple from portal center
            this.ripples.push({
                x: this.width * 0.5,
                y: this.height * 0.55,
                radius: 10,
                maxRadius: Math.max(this.width, this.height) * 1.3,
                strength: 45,
                speed: 10,
                life: 1.0
            });
        }

        updatePhysics() {
            // Silky smooth mouse interpolation (gentle glide)
            if (this.mouse.active) {
                const dx = this.mouse.targetX - this.mouse.x;
                const dy = this.mouse.targetY - this.mouse.y;
                this.mouse.vx = dx * 0.11;
                this.mouse.vy = dy * 0.11;
                this.mouse.x += this.mouse.vx;
                this.mouse.y += this.mouse.vy;
            } else {
                this.mouse.x = -9999;
                this.mouse.y = -9999;
            }

            // Smooth parallax interpolation
            this.parallax.x += (this.parallax.targetX - this.parallax.x) * 0.035;
            this.parallax.y += (this.parallax.targetY - this.parallax.y) * 0.035;

            // Update interactive ripples
            for (let i = this.ripples.length - 1; i >= 0; i--) {
                const r = this.ripples[i];
                r.radius += r.speed;
                r.life = Math.max(0, 1 - (r.radius / r.maxRadius));
                if (r.life <= 0 || r.radius >= r.maxRadius) {
                    this.ripples.splice(i, 1);
                }
            }

            // Launch progress
            if (this.isLaunching) {
                this.launchProgress = Math.min(1, this.launchProgress + 0.02);
            }

            // Spring & damping physics: soft tension, high damping = ultra-smooth
            const spring = 0.045;
            const damping = 0.91;
            const mouseRadiusSq = this.mouse.radius * this.mouse.radius;

            // Update wave dot particles
            this.particles.forEach((p) => {
                // Base horizontal coordinate
                const baseX = p.u * this.width + p.jitterX;
                
                // Track wave position
                const waveY = this.computeWavePoint(baseX, this.time, p.track);
                
                // Parallax depth offset
                const depthOffsetX = this.parallax.x * (p.track.depth * 0.85);
                const depthOffsetY = this.parallax.y * (p.track.depth * 0.85);

                // Micro floating oscillation
                const microY = Math.sin(this.time * p.microFreq + p.microPhase) * p.microAmp;

                const targetBaseX = baseX + depthOffsetX;
                const targetBaseY = waveY + p.jitterY + depthOffsetY + microY;

                // Mouse interaction repulsion & lift (cushioned & organic)
                if (this.mouse.active) {
                    const currentX = targetBaseX + p.dispX;
                    const currentY = targetBaseY + p.dispY;

                    const mdx = currentX - this.mouse.x;
                    const mdy = currentY - this.mouse.y;
                    const distSq = mdx * mdx + mdy * mdy;

                    if (distSq < mouseRadiusSq && distSq > 0.001) {
                        const dist = Math.sqrt(distSq);
                        const normDist = 1 - (dist / this.mouse.radius);
                        // Quadratic falloff gives an organic cushion feel
                        const forceMag = Math.pow(normDist, 2.0) * this.mouse.force * p.track.depth;
                        
                        // Push outward and slightly upward
                        const dirX = mdx / dist;
                        const dirY = (mdy / dist) - 0.25;
                        
                        p.vx += dirX * forceMag;
                        p.vy += dirY * forceMag;

                        // Mouse motion wake
                        p.vx += this.mouse.vx * normDist * 0.18;
                        p.vy += this.mouse.vy * normDist * 0.18;
                    }
                }

                // Interactive Ripples
                for (let r of this.ripples) {
                    const currentX = targetBaseX + p.dispX;
                    const currentY = targetBaseY + p.dispY;
                    const rdx = currentX - r.x;
                    const rdy = currentY - r.y;
                    const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
                    const ringDist = Math.abs(rdist - r.radius);

                    if (ringDist < 40) {
                        const ringFactor = (1 - ringDist / 40) * r.life;
                        const push = ringFactor * r.strength * 0.35;
                        if (rdist > 0.1) {
                            p.vx += (rdx / rdist) * push;
                            p.vy += (rdy / rdist) * push;
                        }
                    }
                }

                // Spring physics towards resting equilibrium
                const forceX = -p.dispX * spring;
                const forceY = -p.dispY * spring;

                p.vx = (p.vx + forceX) * damping;
                p.vy = (p.vy + forceY) * damping;

                p.dispX += p.vx;
                p.dispY += p.vy;

                // Final particle coordinates
                p.x = targetBaseX + p.dispX;
                p.y = targetBaseY + p.dispY;
            });

            // Update ambient stardust particles
            this.ambientParticles.forEach((ap) => {
                ap.x += ap.vx;
                ap.y += ap.vy;

                if (ap.y < -10) {
                    ap.y = this.height + 10;
                    ap.x = Math.random() * this.width;
                }
                if (ap.x < -10) ap.x = this.width + 10;
                if (ap.x > this.width + 10) ap.x = -10;

                // Gentle drift toward/away from cursor
                if (this.mouse.active) {
                    const dx = ap.x - this.mouse.x;
                    const dy = ap.y - this.mouse.y;
                    const distSq = dx * dx + dy * dy;
                    if (distSq < 150 * 150 && distSq > 1) {
                        const dist = Math.sqrt(distSq);
                        const push = (1 - dist / 150) * 0.8;
                        ap.x += (dx / dist) * push;
                        ap.y += (dy / dist) * push;
                    }
                }
            });
        }

        render() {
            this.ctx.clearRect(0, 0, this.width, this.height);

            // 1. Render ambient floating stardust dots
            for (let i = 0; i < this.ambientParticles.length; i++) {
                const ap = this.ambientParticles[i];
                const pulse = Math.sin(this.time * ap.pulseSpeed + ap.pulsePhase) * 0.2;
                const alpha = Math.max(0.05, Math.min(1, ap.alpha + pulse));

                this.ctx.fillStyle = `rgba(${ap.color.r}, ${ap.color.g}, ${ap.color.b}, ${alpha})`;
                this.ctx.beginPath();
                this.ctx.arc(ap.x, ap.y, ap.radius, 0, Math.PI * 2);
                this.ctx.fill();
            }

            // 2. Render wave dot particles in Forest & Sage Green
            const len = this.particles.length;
            for (let i = 0; i < len; i++) {
                const p = this.particles[i];

                // Screen cull check
                if (p.x < -20 || p.x > this.width + 20 || p.y < -20 || p.y > this.height + 20) {
                    continue;
                }

                const c = p.color;
                const alpha = p.alpha;

                // Circular Dot Particle
                this.ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fill();

                // Mint/Sage specular center highlight on prominent front dots
                if (alpha > 0.65 && p.track.depth >= 0.85) {
                    this.ctx.fillStyle = `rgba(235, 252, 242, ${alpha * 0.65})`;
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.radius * 0.45, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }

        loop() {
            if (!this.running) return;

            // Only compute when page or portal is visible
            const isEntryActive = document.body.classList.contains('entry-active');
            if (isEntryActive || !document.hidden) {
                this.time += this.timeStep;
                this.updatePhysics();
                this.render();
            }

            this.animationFrameId = requestAnimationFrame(() => this.loop());
        }

        start() {
            if (this.running) return;
            this.running = true;
            this.loop();
        }

        stop() {
            this.running = false;
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
        }
    }

    // Expose instance globally for portal lifecycle hooks
    window.GeminiParticleWave = GeminiParticleWave;

    document.addEventListener('DOMContentLoaded', () => {
        const particleSystem = new GeminiParticleWave('portal-particles');
        window.geminiParticles = particleSystem;

        // Hook into Professional Launch button
        const btnProfessional = document.getElementById('btn-professional');
        if (btnProfessional && particleSystem) {
            btnProfessional.addEventListener('click', () => {
                particleSystem.triggerLaunch();
            });
        }

        // Hook into switch-to-portal button
        const switchBtn = document.getElementById('switch-to-portal');
        if (switchBtn && particleSystem) {
            switchBtn.addEventListener('click', () => {
                particleSystem.start();
            });
        }
    });
})();
