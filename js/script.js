        gsap.registerPlugin(ScrollTrigger);

        let lenisInstance = null;
        let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let isAnnualPricing = false;
        const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, targetX: window.innerWidth / 2, targetY: window.innerHeight / 2 };

        /* -------------------------------------------------------------
           3D LUXURY CARD ENGINE (APPLE / LINEAR OBSIDIAN STANDARD)
           Restrained micro-tilt (max 3.8°), zero text detachment, physical elevation
           ------------------------------------------------------------- */
        class LuxuryCard3D {
            constructor(el) {
                this.el = el;
                const rawTilt = parseFloat(el.getAttribute('data-tilt-max')) || 12;
                // Restrain tilt to maximum 3.2 degrees for obsidian luxury feel
                this.maxTilt = Math.min(rawTilt * 0.22, 3.2);
                this.bounds = null;
                this.isHovered = false;

                this.currRotX = 0;
                this.currRotY = 0;
                this.currElevate = 0;
                this.targetRotX = 0;
                this.targetRotY = 0;
                this.targetElevate = 0;

                this.glareEl = el.querySelector('.card-glare');
                this.layerLifts = el.querySelectorAll('.card-layer-lift');
                this.layerLiftsDeep = el.querySelectorAll('.card-layer-lift-deep');
                this.rafId = null;

                this.onMouseEnter = this.onMouseEnter.bind(this);
                this.onMouseMove = this.onMouseMove.bind(this);
                this.onMouseLeave = this.onMouseLeave.bind(this);
                this.updateFrame = this.updateFrame.bind(this);

                this.bind();
            }

            bind() {
                this.el.addEventListener('pointerenter', this.onMouseEnter, { passive: true });
                this.el.addEventListener('pointermove', this.onMouseMove, { passive: true });
                this.el.addEventListener('pointerleave', this.onMouseLeave, { passive: true });
                this.el.addEventListener('pointercancel', this.onMouseLeave, { passive: true });
                this.el.addEventListener('mouseenter', this.onMouseEnter, { passive: true });
                this.el.addEventListener('mousemove', this.onMouseMove, { passive: true });
                this.el.addEventListener('mouseleave', this.onMouseLeave, { passive: true });
            }

            onMouseEnter(e) {
                if (isReducedMotion) return;
                if (e && e.pointerType === 'touch') return;
                this.isHovered = true;
                this.bounds = this.el.getBoundingClientRect();
                this.el.classList.add('is-hovered');
                this.targetElevate = 4.5; // Physical 4.5px float

                if (!this.rafId) {
                    this.rafId = requestAnimationFrame(this.updateFrame);
                }
            }

            onMouseMove(e) {
                if (isReducedMotion) return;
                if (e && e.pointerType === 'touch') return;
                this.isHovered = true;
                this.el.classList.add('is-hovered');
                this.targetElevate = 4.5;
                if (!this.bounds) this.bounds = this.el.getBoundingClientRect();

                const x = e.clientX - this.bounds.left;
                const y = e.clientY - this.bounds.top;

                const normX = (x / this.bounds.width) * 2 - 1;
                const normY = (y / this.bounds.height) * 2 - 1;

                this.targetRotX = -normY * this.maxTilt;
                this.targetRotY = normX * this.maxTilt;

                if (this.glareEl) {
                    this.glareEl.style.setProperty('--glare-x', `${(x / this.bounds.width) * 100}%`);
                    this.glareEl.style.setProperty('--glare-y', `${(y / this.bounds.height) * 100}%`);
                }
                this.el.style.setProperty('--mouse-x', `${(x / this.bounds.width * 100).toFixed(1)}%`);
                this.el.style.setProperty('--mouse-y', `${(y / this.bounds.height * 100).toFixed(1)}%`);

                if (!this.rafId) {
                    this.rafId = requestAnimationFrame(this.updateFrame);
                }
            }

            onMouseLeave() {
                this.isHovered = false;
                this.targetRotX = 0;
                this.targetRotY = 0;
                this.targetElevate = 0;
                this.el.classList.remove('is-hovered');
                if (!this.rafId) {
                    this.rafId = requestAnimationFrame(this.updateFrame);
                }
            }

            updateFrame() {
                // Dual-rate lerp: snappy responsive entry, silky velvet decay
                const lerpFactor = this.isHovered ? 0.10 : 0.055;
                this.currRotX += (this.targetRotX - this.currRotX) * lerpFactor;
                this.currRotY += (this.targetRotY - this.currRotY) * lerpFactor;
                this.currElevate += (this.targetElevate - this.currElevate) * lerpFactor;

                const rotXFormatted = this.currRotX.toFixed(2);
                const rotYFormatted = this.currRotY.toFixed(2);
                const elevFormatted = this.currElevate.toFixed(2);

                const shadowY = (8 + this.currElevate * 2.2).toFixed(1);
                const shadowBlur = (20 + this.currElevate * 3.2).toFixed(1);

                // Perspective 2000px keeps typography perfectly legible without distortion
                this.el.style.transform = `perspective(2000px) rotateX(${rotXFormatted}deg) rotateY(${rotYFormatted}deg) translateY(${-elevFormatted}px)`;

                // Micro-depth: internal elements move only 2-5px, keeping them solidly anchored
                const pX = (-this.currRotY * 0.12).toFixed(1);
                const pY = (this.currRotX * 0.12).toFixed(1);
                this.layerLifts.forEach(item => {
                    item.style.transform = `translate3d(${pX}px, ${pY}px, 2.5px)`;
                });
                this.layerLiftsDeep.forEach(item => {
                    item.style.transform = `translate3d(${(pX * 1.5).toFixed(1)}px, ${(pY * 1.5).toFixed(1)}px, 5px)`;
                });

                const isDark = document.documentElement.classList.contains('dark');
                if (this.isHovered || Math.abs(this.currElevate) > 0.05) {
                    if (isDark) {
                        this.el.style.boxShadow = `0 ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, 0.65), 0 0 24px rgba(255, 94, 0, 0.14)`;
                    } else {
                        this.el.style.boxShadow = `0 ${shadowY}px ${shadowBlur}px rgba(18, 18, 20, 0.12), 0 0 20px rgba(255, 94, 0, 0.10)`;
                    }
                } else {
                    this.el.style.boxShadow = '';
                }

                const stillMoving = Math.abs(this.targetRotX - this.currRotX) > 0.01 ||
                    Math.abs(this.targetRotY - this.currRotY) > 0.01 ||
                    Math.abs(this.targetElevate - this.currElevate) > 0.01;

                if (this.isHovered || stillMoving) {
                    this.rafId = requestAnimationFrame(this.updateFrame);
                } else {
                    this.el.style.transform = '';
                    this.el.style.boxShadow = '';
                    this.layerLifts.forEach(item => { item.style.transform = ''; });
                    this.layerLiftsDeep.forEach(item => { item.style.transform = ''; });
                    this.rafId = null;
                }
            }
        }

        function init3DCards() {
            if (isReducedMotion) return;
            const tiltElements = document.querySelectorAll('[data-tilt]');
            tiltElements.forEach(card => {
                new LuxuryCard3D(card);
            });
        }

        /* -------------------------------------------------------------
           APP ROUTER & VIEW CONTROLLER
           ------------------------------------------------------------- */
        const appRouter = {
            currentUser: null,
            pendingPurchase: null,
            currentDiscount: 0,
            activePlanPrice: 0,
            activePlanTotal: 0,
            activeView: 'home',
            isTransitioning: false,

            init() {
                const storedUser = localStorage.getItem('dorfie_user');
                if (storedUser) {
                    try {
                        this.currentUser = JSON.parse(storedUser);
                    } catch (e) {
                        this.currentUser = null;
                    }
                }
                this.updateNavAuth();
            },

            updateNavAuth() {
                const container = document.getElementById('nav-auth-container');
                const mobileContainer = document.getElementById('mobile-drawer-auth');
                if (!container) return;

                if (this.currentUser) {
                    const avatarHtml = `
                        <div class="flex items-center gap-2">
                            <span class="w-7 h-7 rounded-full bg-accent-orange text-white flex items-center justify-center text-xs font-bold">
                                ${this.currentUser.name.charAt(0).toUpperCase()}
                            </span>
                            <span class="text-xs font-bold text-charcoal dark:text-chalk hidden lg:inline">
                                ${this.currentUser.name}
                            </span>
                            <button onclick="appRouter.logout()" title="Sign Out" class="w-7 h-7 rounded-full liquid-glass-pill flex items-center justify-center text-[10px] text-charcoal/70 dark:text-chalk/70 hover:text-accent-orange">
                                <i class="fa-solid fa-right-from-bracket"></i>
                            </button>
                        </div>
                    `;
                    container.innerHTML = avatarHtml;
                    if (mobileContainer) {
                        mobileContainer.innerHTML = `
                            <button onclick="appRouter.logout()" class="py-2 px-4 rounded-full text-xs font-bold text-accent-orange">Sign Out (${this.currentUser.name})</button>
                        `;
                    }
                } else {
                    container.innerHTML = `
                        <button onclick="appRouter.openAuth('login')" class="liquid-glass-btn-orange px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm">
                            Log In
                        </button>
                    `;
                    if (mobileContainer) {
                        mobileContainer.innerHTML = `
                            <button onclick="toggleMobileNav(); appRouter.openAuth('login')" class="liquid-glass-btn-orange py-2 px-5 rounded-full text-xs font-bold">Log In</button>
                        `;
                    }
                }
            },

            // Asynchronous, Bidirectional GSAP View Transition
            navigate(viewKey) {
                if (this.activeView === viewKey) {
                    if (viewKey === 'home') {
                        if (lenisInstance) {
                            lenisInstance.scrollTo(0, { duration: 1.15 });
                        } else {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }
                    this.isTransitioning = false;
                    return;
                }

                const currentEl = document.getElementById(`view-${this.activeView}`);
                const incomingEl = document.getElementById(`view-${viewKey}`);
                if (!incomingEl) {
                    this.isTransitioning = false;
                    return;
                }

                this.isTransitioning = true;
                const nextView = viewKey;

                // Failsafe timeout to unlock transition state in all scenarios
                const transitionFailsafe = setTimeout(() => {
                    this.isTransitioning = false;
                    incomingEl.classList.remove('hidden');
                    incomingEl.style.opacity = '1';
                }, 550);

                // Inform the Capybara Companion of view state change
                if (capyCompanion && capyCompanion.onViewChanged) {
                    capyCompanion.onViewChanged(nextView);
                }

                if (isReducedMotion || !currentEl) {
                    clearTimeout(transitionFailsafe);
                    if (currentEl) {
                        currentEl.classList.add('hidden');
                        currentEl.style.opacity = '0';
                    }
                    incomingEl.classList.remove('hidden');
                    incomingEl.style.opacity = '1';
                    window.scrollTo({ top: 0, behavior: 'instant' });
                    this.activeView = nextView;
                    this.isTransitioning = false;
                    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
                    return;
                }

                // Ultra-Smooth Velvet Exit Transition (Subtle scale & blur dissipation)
                gsap.to(currentEl, {
                    scale: 0.98,
                    filter: "blur(6px)",
                    y: -14,
                    opacity: 0,
                    duration: 0.28,
                    ease: "power2.inOut",
                    onComplete: () => {
                        currentEl.classList.add('hidden');

                        // Reset Incoming View State
                        incomingEl.classList.remove('hidden');
                        window.scrollTo({ top: 0, behavior: 'instant' });
                        if (lenisInstance) lenisInstance.scrollTo(0, { immediate: true });

                        // Luxury Spring Eased Enter Transition with Stagger
                        const incomingCards = incomingEl.querySelectorAll('.liquid-glass-panel, .crystal-glass-card');
                        gsap.fromTo(incomingEl,
                            { scale: 0.98, filter: "blur(6px)", y: 16, opacity: 0 },
                            {
                                scale: 1,
                                filter: "blur(0px)",
                                y: 0,
                                opacity: 1,
                                duration: 0.38,
                                ease: "cubic-bezier(0.16, 1, 0.3, 1)",
                                onComplete: () => {
                                    clearTimeout(transitionFailsafe);
                                    this.activeView = nextView;
                                    this.isTransitioning = false;
                                    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
                                }
                            }
                        );

                        if (incomingCards.length > 0) {
                            gsap.fromTo(incomingCards,
                                { y: 12, opacity: 0.85 },
                                { y: 0, opacity: 1, duration: 0.35, stagger: 0.05, ease: "cubic-bezier(0.16, 1, 0.3, 1)", delay: 0.04 }
                            );
                        }
                    }
                });
            },

            navigateLandingSection(sectionId, event) {
                if (event) {
                    event.preventDefault();
                }
                if (this.activeView !== 'home') {
                    this.navigate('home');
                    setTimeout(() => {
                        const target = document.getElementById(sectionId);
                        if (target) {
                            if (lenisInstance) {
                                lenisInstance.scrollTo(target, { offset: -90, duration: 1.15 });
                            } else {
                                target.scrollIntoView({ behavior: 'smooth' });
                            }
                        }
                    }, 480);
                } else {
                    const target = document.getElementById(sectionId);
                    if (target) {
                        if (lenisInstance) lenisInstance.scrollTo(target, { offset: -90, duration: 1.15 });
                        else target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            },

            openAuth(mode) {
                this.isTransitioning = false;
                this.navigate('auth');
                this.switchAuthMode('login'); // Registration parked for future release; default gracefully to login
            },

            switchAuthMode(mode) {
                // Public self-registration is parked for future release; fallback gracefully to login
                if (mode === 'register') {
                    mode = 'login';
                }
                this.activeAuthMode = 'login';
                const pill = document.getElementById('auth-tab-pill');
                const btnLogin = document.getElementById('auth-tab-login');
                const btnReg = document.getElementById('auth-tab-register');
                const registerFields = document.getElementById('auth-register-fields');
                const submitBtnText = document.getElementById('auth-submit-text');
                const title = document.getElementById('auth-header-title');
                const authImg = document.getElementById('auth-capy-img');
                const authTag = document.getElementById('auth-capy-tag');
                const forgotHint = document.getElementById('auth-forgot-hint');
                const pwdStrengthContainer = document.getElementById('password-strength-container');
                const alertBanner = document.getElementById('auth-alert-banner');

                if (alertBanner) alertBanner.classList.add('hidden');

                if (pill) {
                    pill.style.transform = 'translateX(0%)';
                }

                if (btnLogin) {
                    btnLogin.classList.add('text-white');
                    btnLogin.classList.remove('text-charcoal/70', 'dark:text-chalk/70');
                }
                if (btnReg) {
                    btnReg.classList.remove('text-white');
                    btnReg.classList.add('text-charcoal/70', 'dark:text-chalk/70');
                }

                if (registerFields) {
                    registerFields.style.maxHeight = '0px';
                    registerFields.style.opacity = '0';
                }

                if (pwdStrengthContainer) {
                    pwdStrengthContainer.classList.add('hidden');
                }

                if (forgotHint) {
                    forgotHint.style.display = 'inline';
                }

                if (submitBtnText) {
                    submitBtnText.textContent = 'Sign In to Portal';
                }
                if (title) {
                    title.textContent = 'SIGN IN TO DORFIE OS';
                }

                // Mascot Reactive Switch
                if (authImg) {
                    authImg.src = 'Gymming.png';
                }
                if (authTag) {
                    authTag.textContent = 'READY TO PUMP';
                }
            },

            startPlanCheckout(planName, price, cycle) {
                this.pendingPurchase = { planName, price, cycle };
                if (!this.currentUser) {
                    openDownloadNotice("Authentication required to link subscription.");
                    this.openAuth('login');
                    return;
                }
                this.renderCheckout();
                this.navigate('checkout');
            },

            renderCheckout() {
                if (!this.pendingPurchase) return;
                const { planName, price, cycle } = this.pendingPurchase;
                this.activePlanPrice = price;
                this.currentDiscount = 0;

                const nameEl = document.getElementById('checkout-plan-name');
                const cycleEl = document.getElementById('checkout-plan-cycle');
                const baseEl = document.getElementById('checkout-base-price');
                const taxEl = document.getElementById('checkout-tax-amount');
                const finalEl = document.getElementById('checkout-final-total');
                const discRow = document.getElementById('checkout-discount-row');

                const userDisplay = document.getElementById('gateway-user-display');
                if (userDisplay) {
                    userDisplay.textContent = this.currentUser ? this.currentUser.name : 'Athlete';
                }

                if (nameEl) nameEl.textContent = planName;
                if (cycleEl) cycleEl.textContent = cycle;
                if (baseEl) baseEl.textContent = `₹${price.toLocaleString()}`;

                const tax = Math.round(price * 0.18);
                if (taxEl) taxEl.textContent = `₹${tax.toLocaleString()}`;

                this.activePlanTotal = price + tax;
                if (finalEl) finalEl.textContent = `₹${this.activePlanTotal.toLocaleString()}`;
                if (discRow) discRow.classList.add('hidden');

                // Default payment method setup
                this.selectPaymentMethod('upi');
            },

            selectPaymentMethod(methodKey) {
                this.activePaymentMethod = methodKey;
                const tabs = {
                    upi: document.getElementById('pay-tab-upi'),
                    card: document.getElementById('pay-tab-card'),
                    netbanking: document.getElementById('pay-tab-netbanking')
                };
                const panels = {
                    upi: document.getElementById('method-panel-upi'),
                    card: document.getElementById('method-panel-card'),
                    netbanking: document.getElementById('method-panel-netbanking')
                };

                // Toggle tabs styling
                Object.keys(tabs).forEach(key => {
                    const tab = tabs[key];
                    const panel = panels[key];
                    if (!tab || !panel) return;

                    const icon = tab.querySelector('i');
                    if (key === methodKey) {
                        tab.classList.add('is-active', 'border-accent-orange/60');
                        if (icon) {
                            icon.classList.remove('text-charcoal/70', 'dark:text-chalk/70');
                            icon.classList.add('text-accent-orange');
                        }
                        panel.classList.remove('hidden');
                        gsap.fromTo(panel, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" });
                    } else {
                        tab.classList.remove('is-active', 'border-accent-orange/60');
                        if (icon) {
                            icon.classList.remove('text-accent-orange');
                            icon.classList.add('text-charcoal/70', 'dark:text-chalk/70');
                        }
                        panel.classList.add('hidden');
                    }
                });

                // Update action button label
                const submitLabel = document.getElementById('gateway-submit-label');
                if (submitLabel) {
                    if (methodKey === 'upi') submitLabel.textContent = `Authorize UPI Payment (₹${this.activePlanTotal ? this.activePlanTotal.toLocaleString() : '1,769'})`;
                    else if (methodKey === 'card') submitLabel.textContent = `Pay Securely via Card (₹${this.activePlanTotal ? this.activePlanTotal.toLocaleString() : '1,769'})`;
                    else submitLabel.textContent = `Proceed to NetBanking (₹${this.activePlanTotal ? this.activePlanTotal.toLocaleString() : '1,769'})`;
                }
            },

            selectBank(buttonEl, bankName) {
                const chips = document.querySelectorAll('.gateway-quick-chip');
                chips.forEach(chip => {
                    chip.classList.remove('is-selected');
                    chip.classList.add('border-transparent');
                });
                if (buttonEl) {
                    buttonEl.classList.add('is-selected');
                    buttonEl.classList.remove('border-transparent');
                }
                const input = document.getElementById('selected-bank-input');
                if (input) input.value = `${bankName} (Instant Direct Clearance)`;
            },

            handleCardInput(el) {
                // Auto format 4-digit chunks
                let val = el.value.replace(/\D/g, '').substring(0, 16);
                let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                el.value = formatted;
                const preview = document.getElementById('preview-card-number');
                if (preview) {
                    preview.textContent = formatted || '4242 •••• •••• 4242';
                }

                // Auto-detect brand icon
                const previewCard = document.querySelector('#method-panel-card i.fa-cc-visa, #method-panel-card i.fa-cc-mastercard, #method-panel-card i.fa-cc-amex, #method-panel-card i.fa-credit-card');
                if (previewCard) {
                    if (/^4/.test(val)) previewCard.className = 'fa-brands fa-cc-visa text-2xl text-blue-400';
                    else if (/^(5[1-5]|2[2-7])/.test(val)) previewCard.className = 'fa-brands fa-cc-mastercard text-2xl text-red-400';
                    else if (/^3[47]/.test(val)) previewCard.className = 'fa-brands fa-cc-amex text-2xl text-cyan-400';
                    else previewCard.className = 'fa-solid fa-credit-card text-2xl text-accent-orange';
                }
            },

            handleExpiryInput(el) {
                let val = el.value.replace(/\D/g, '').substring(0, 4);
                if (val.length >= 2) {
                    val = val.substring(0, 2) + '/' + val.substring(2);
                }
                el.value = val;
                const preview = document.getElementById('preview-card-expiry');
                if (preview) {
                    preview.textContent = val || '09/29';
                }
            },

            handleHolderInput(el) {
                const preview = document.getElementById('preview-card-holder');
                if (preview) {
                    preview.textContent = el.value.trim().toUpperCase() || 'ALEX MORGAN';
                }
            },

            applyCoupon() {
                const input = document.getElementById('coupon-code-input');
                if (!input) return;
                const code = input.value.trim().toUpperCase();

                let discount = 0;
                let notice = '';

                if (code === 'DORFIE20' || code === 'CAPYBARA20') {
                    discount = Math.round(this.activePlanPrice * 0.20);
                    notice = "20% Dorfie Founder Promo Activated!";
                } else if (code === 'LAUNCH50') {
                    discount = Math.round(this.activePlanPrice * 0.50);
                    notice = "50% Launch Celebration Pass Activated!";
                } else if (code === 'PROPASS') {
                    discount = Math.min(300, this.activePlanPrice);
                    notice = "₹300 Direct Credit Voucher Applied!";
                } else {
                    openDownloadNotice("Invalid or expired promo code.", "fa-xmark");
                    return;
                }

                this.currentDiscount = discount;
                const taxableAmount = Math.max(0, this.activePlanPrice - discount);
                const tax = Math.round(taxableAmount * 0.18);
                this.activePlanTotal = taxableAmount + tax;

                const discRow = document.getElementById('checkout-discount-row');
                const discAmount = document.getElementById('checkout-discount-amount');
                const finalEl = document.getElementById('checkout-final-total');
                const taxEl = document.getElementById('checkout-tax-amount');
                const submitLabel = document.getElementById('gateway-submit-label');

                if (discRow) discRow.classList.remove('hidden');
                if (discAmount) discAmount.textContent = `-₹${discount.toLocaleString()}`;
                if (taxEl) taxEl.textContent = `₹${tax.toLocaleString()}`;
                if (finalEl) finalEl.textContent = `₹${this.activePlanTotal.toLocaleString()}`;
                if (submitLabel) submitLabel.textContent = `Authorize Payment (₹${this.activePlanTotal.toLocaleString()})`;
                openDownloadNotice(notice, "fa-percent");
            },

            // High-finish Smooth Multi-Stage Gateway Loader -> Digital Invoice Modal
            executePayment() {
                const overlay = document.getElementById('gateway-loader-overlay');
                const card = document.getElementById('gateway-loader-card');
                const stepEl = document.getElementById('gateway-loader-step');
                const titleEl = document.getElementById('gateway-loader-title');
                const subEl = document.getElementById('gateway-loader-sub');
                const progressBar = document.getElementById('gateway-loader-progress-bar');
                const centerIcon = document.getElementById('gateway-loader-center-icon');

                if (!overlay || !card) {
                    openDownloadNotice("Payment Confirmed!");
                    this.navigate('home');
                    return;
                }

                // Show Overlay with smooth GSAP fade & spring scale
                overlay.classList.remove('hidden');
                requestAnimationFrame(() => {
                    overlay.classList.remove('opacity-0');
                    overlay.classList.add('opacity-100');
                    card.classList.remove('scale-95');
                    card.classList.add('scale-100');
                });

                // Phase 1: Initiating Connection (0ms)
                if (progressBar) progressBar.style.width = '25%';
                if (stepEl) stepEl.textContent = 'STAGE 01/03 • CONNECTING PAYMENT GATEWAY';
                if (titleEl) titleEl.textContent = 'CONNECTING SECURELY';
                if (subEl) subEl.textContent = 'Establishing secure connection with payment network...';
                if (centerIcon) centerIcon.innerHTML = '<i class="fa-solid fa-bolt"></i>';

                // Phase 2: Bank / UPI Verification (850ms)
                setTimeout(() => {
                    if (progressBar) progressBar.style.width = '65%';
                    if (stepEl) stepEl.textContent = 'STAGE 02/03 • VERIFYING PAYMENT';
                    if (titleEl) titleEl.textContent = 'VERIFYING DETAILS';
                    if (subEl) subEl.textContent = 'Verifying credentials with your bank or UPI app...';
                    if (centerIcon) centerIcon.innerHTML = '<i class="fa-solid fa-shield-halved text-amber-400"></i>';
                }, 850);

                // Phase 3: Instant Clearance (1700ms)
                setTimeout(() => {
                    if (progressBar) progressBar.style.width = '100%';
                    if (stepEl) stepEl.textContent = 'STAGE 03/03 • PAYMENT APPROVED';
                    if (titleEl) titleEl.textContent = 'PAYMENT SUCCESSFUL';
                    if (subEl) subEl.textContent = `Subscription activated for ${this.currentUser ? this.currentUser.name : 'Athlete'}! Generating pass...`;
                    if (centerIcon) centerIcon.innerHTML = '<i class="fa-solid fa-circle-check text-emerald-500 scale-125 transition-transform duration-300"></i>';
                }, 1700);

                // Mint Order Object & Open Digital Tax Invoice Modal (2500ms)
                setTimeout(() => {
                    overlay.classList.add('opacity-0');
                    card.classList.add('scale-95');
                    setTimeout(() => {
                        overlay.classList.add('hidden');

                        // Assemble Standardized Production-Ready Order Payload
                        const orderPayload = {
                            orderId: 'DF-' + Math.floor(100000 + Math.random() * 900000) + '-2026',
                            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                            planName: this.pendingPurchase?.planName || 'Coach Pro Suite',
                            cycle: this.pendingPurchase?.cycle || 'Annual',
                            basePrice: this.activePlanPrice || 1199,
                            taxPrice: Math.round(((this.activePlanPrice || 1199) - (this.currentDiscount || 0)) * 0.18),
                            discount: this.currentDiscount || 0,
                            finalTotal: this.activePlanTotal || 1175,
                            customer: {
                                name: this.currentUser?.name || 'Alex Morgan',
                                email: this.currentUser?.email || 'alex@dorfiefit.com',
                                role: this.currentUser?.role || 'member'
                            },
                            method: (this.activePaymentMethod || 'upi').toUpperCase(),
                            authCode: 'DF-' + Math.random().toString(36).substring(2, 8).toUpperCase()
                        };

                        // Persist to local order history
                        try {
                            const history = JSON.parse(localStorage.getItem('dorfie_order_history') || '[]');
                            history.unshift(orderPayload);
                            localStorage.setItem('dorfie_order_history', JSON.stringify(history));
                        } catch (e) {}

                        // Open Digital Tax Invoice Modal
                        openInvoiceModal(orderPayload);
                        openDownloadNotice("Payment Cleared! Official Tax Invoice Generated.", "fa-file-invoice-dollar");
                    }, 300);
                }, 2500);
            },

            logout() {
                localStorage.removeItem('dorfie_user');
                this.currentUser = null;
                this.updateNavAuth();
                openDownloadNotice("Signed out successfully.");
            }
        };

        /* -------------------------------------------------------------
           GLOBAL CAPYBARA COMPANION CONTROLLER
           ------------------------------------------------------------- */
        const capyCompanion = {
            currentPosture: 'idle',
            bubbleTimeout: null,
            img: null,
            avatarWrap: null,
            bubble: null,

            init() {
                this.img = document.getElementById('capy-mascot-img');
                this.avatarWrap = document.getElementById('capy-avatar-wrap');
                this.bubble = document.getElementById('capy-speech-bubble');
                if (!this.img || !this.avatarWrap) return;

                let lastScrollY = window.scrollY;
                let scrollTimeout = null;

                window.addEventListener('scroll', () => {
                    const currentScroll = window.scrollY;
                    const speed = Math.abs(currentScroll - lastScrollY);
                    lastScrollY = currentScroll;

                    if (speed > 4 && this.currentPosture !== 'trot' && appRouter.activeView === 'home') {
                        this.setPosture('trot');
                    }

                    clearTimeout(scrollTimeout);
                    scrollTimeout = setTimeout(() => {
                        this.evaluateSectionPosture();
                    }, 220);
                }, { passive: true });
            },

            setPosture(posture) {
                if (this.currentPosture === posture) return;
                this.currentPosture = posture;
                if (!this.img || !this.avatarWrap) return;

                this.avatarWrap.classList.remove('capy-anim-idle', 'capy-anim-trot');

                let imgSrc = 'Chilling_Looking_At_Sky.png?v=2';
                if (posture === 'trot') {
                    imgSrc = 'Running_Marathon.png?v=2';
                    this.avatarWrap.classList.add('capy-anim-trot');
                } else if (posture === 'accounts') {
                    imgSrc = 'Accounts.png?v=2';
                    this.avatarWrap.classList.add('capy-anim-idle');
                } else if (posture === 'pharmacy') {
                    imgSrc = 'Pharmacy.png?v=2';
                    this.avatarWrap.classList.add('capy-anim-idle');
                } else if (posture === 'gymming') {
                    imgSrc = 'Gymming.png?v=2';
                    this.avatarWrap.classList.add('capy-anim-idle');
                } else if (posture === 'coffee') {
                    imgSrc = 'Coffee.png?v=2';
                    this.avatarWrap.classList.add('capy-anim-idle');
                } else {
                    this.avatarWrap.classList.add('capy-anim-idle');
                }

                gsap.fromTo(this.img,
                    { scale: 0.88, opacity: 0.6 },
                    {
                        scale: 1, opacity: 1, duration: 0.22, ease: "power2.out", onStart: () => {
                            this.img.src = imgSrc;
                        }
                    }
                );
            },

            evaluateSectionPosture() {
                if (appRouter.activeView === 'checkout') {
                    this.setPosture('accounts');
                    return;
                }
                if (appRouter.activeView === 'auth') {
                    this.setPosture('gymming');
                    return;
                }

                const scrollY = window.scrollY + 250;
                const pricing = document.getElementById('pricing');
                const about = document.getElementById('about');
                const features = document.getElementById('features');

                if (pricing && scrollY >= pricing.offsetTop && scrollY < (pricing.offsetTop + pricing.offsetHeight)) {
                    this.setPosture('accounts');
                } else if (about && scrollY >= about.offsetTop && scrollY < (about.offsetTop + about.offsetHeight)) {
                    this.setPosture('pharmacy');
                } else if (features && scrollY >= features.offsetTop && scrollY < (features.offsetTop + features.offsetHeight)) {
                    this.setPosture('gymming');
                } else {
                    this.setPosture('idle');
                }
            },

            onViewChanged(viewKey) {
                if (viewKey === 'checkout') this.setPosture('accounts');
                else if (viewKey === 'auth') this.setPosture('gymming');
                else this.evaluateSectionPosture();
            },

            onMascotClick() {
                this.setPosture('coffee');
                this.speakQuote();
            },

            speakQuote() {
                const quotes = [
                    "Capybaras never rush. Smooth sets only.",
                    "Hydrate, progressive overload, relax.",
                    "Sub-second gate clearance feels good.",
                    "Sip some coffee. Your form was pristine."
                ];
                const quote = quotes[Math.floor(Math.random() * quotes.length)];
                if (this.bubble) {
                    this.bubble.textContent = quote;
                    this.bubble.classList.remove('opacity-0', 'translate-y-2');
                    this.bubble.classList.add('opacity-100', 'translate-y-0');

                    clearTimeout(this.bubbleTimeout);
                    this.bubbleTimeout = setTimeout(() => {
                        this.bubble.classList.remove('opacity-100', 'translate-y-0');
                        this.bubble.classList.add('opacity-0', 'translate-y-2');
                    }, 3200);
                }
            }
        };

        const roleData = {
            member: [
                {
                    id: "01 / 06",
                    icon: "fa-network-wired",
                    tag: "Community Hub",
                    title: "Primary Ecosystem Hub",
                    desc: "Primary profile that connects you to the entire Dorfie Fit ecosystem with unified access.",
                    bg: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
                    mascot: "Gymming.png"
                },
                {
                    id: "02 / 06",
                    icon: "fa-location-dot",
                    tag: "Geo-Discovery",
                    title: "Hyper-Local Discovery",
                    desc: "Discover fitness centres, gyms, badminton courts, and personal trainers near you.",
                    bg: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
                    mascot: "Running_Marathon.png"
                },
                {
                    id: "03 / 06",
                    icon: "fa-calendar-star",
                    tag: "Active Community",
                    title: "Fitness & Sport Events",
                    desc: "Explore and participate in community-driven fitness challenges, meets, and sporting events.",
                    bg: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop",
                    mascot: "Chilling_Looking_At_Sky.png"
                },
                {
                    id: "04 / 06",
                    icon: "fa-calendar-check",
                    tag: "Session Manager",
                    title: "Unified Member Hub",
                    desc: "Manage memberships, personal training sessions, and classes in one intuitive place.",
                    bg: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop",
                    mascot: "Coffee.png"
                },
                {
                    id: "05 / 06",
                    icon: "fa-comments",
                    tag: "Direct Guidance",
                    title: "Direct Coach & Staff Chat",
                    desc: "Chat directly with trainers and fitness centre staff for guidance, form checks, and workout support.",
                    bg: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200&auto=format&fit=crop",
                    mascot: "Accounts.png"
                },
                {
                    id: "06 / 06",
                    icon: "fa-mobile-screen-button",
                    tag: "Single Platform",
                    title: "Connected Fitness Life",
                    desc: "Enjoy a seamless, connected fitness experience and workout tracking from a single app.",
                    bg: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1200&auto=format&fit=crop",
                    mascot: "Pharmacy.png"
                }
            ],
            owner: [
                {
                    id: "01 / 06",
                    icon: "fa-building",
                    tag: "Zero Chaos",
                    title: "Gym Management, Zero Chaos",
                    desc: "Memberships, automated renewals, billing, check-ins, staff permissions, and one command centre instead of six tools.",
                    bg: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
                    mascot: "Gymming.png"
                },
                {
                    id: "02 / 06",
                    icon: "fa-brands fa-whatsapp",
                    tag: "Free Integration",
                    title: "Free WhatsApp Messaging Integration",
                    desc: "Free WhatsApp Messaging Integration for automated payment receipts, renewal alerts, booking notices, and client communication.",
                    bg: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
                    mascot: "Running_Marathon.png"
                },
                {
                    id: "03 / 06",
                    icon: "fa-user-secret",
                    tag: "Revenue Shield",
                    title: "Under-The-Table PT Detection",
                    desc: "Automated floor intelligence to detect uncontracted personal training sessions, protect club revenue, and enforce gym policy.",
                    bg: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop",
                    mascot: "Accounts.png"
                },
                {
                    id: "04 / 06",
                    icon: "fa-radar",
                    tag: "Churn Radar",
                    title: "Live Tracking, Not Rear-View Reporting",
                    desc: "Know who's slipping this week, not who left last quarter. Real-time check-ins, gym occupancy radar, and automatic churn alerts.",
                    bg: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop",
                    mascot: "Coffee.png"
                },
                {
                    id: "05 / 06",
                    icon: "fa-user-check",
                    tag: "Talent Pipeline",
                    title: "Hiring, Your Unfair Advantage",
                    desc: "Reach verified trainers and fitness staff directly. See certifications and experience upfront. Hire, onboard, and schedule in one platform.",
                    bg: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1200&auto=format&fit=crop",
                    mascot: "Chilling_Looking_At_Sky.png"
                },
                {
                    id: "06 / 06",
                    icon: "fa-trophy",
                    tag: "Retention Moat",
                    title: "Community & Member Moat",
                    desc: "Members cancel memberships; they rarely leave communities. Branded app, challenges, leaderboards, and slot bookings for courts and turfs.",
                    bg: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200&auto=format&fit=crop",
                    mascot: "Pharmacy.png"
                }
            ],
            trainer: [
                {
                    id: "01 / 06",
                    icon: "fa-users-gear",
                    tag: "Client Management",
                    title: "Dual Client Roster",
                    desc: "Manage personal clients and associated fitness centre clients from one unified profile.",
                    bg: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop",
                    mascot: "Running_Marathon.png"
                },
                {
                    id: "02 / 06",
                    icon: "fa-calendar-check",
                    tag: "Session Planner",
                    title: "Integrated Session Calendar",
                    desc: "Schedule training sessions for each client with an integrated session planner.",
                    bg: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1200&auto=format&fit=crop",
                    mascot: "Gymming.png"
                },
                {
                    id: "03 / 06",
                    icon: "fa-shield-halved",
                    tag: "Verified Access",
                    title: "OTP-Verified Sessions",
                    desc: "Conduct secure OTP-verified personal training sessions for reliable attendance and verification.",
                    bg: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop",
                    mascot: "Accounts.png"
                },
                {
                    id: "04 / 06",
                    icon: "fa-id-badge",
                    tag: "Public Branding",
                    title: "Public Coach Profile",
                    desc: "Build and customize a public profile to promote your training services and attract new clients.",
                    bg: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",
                    mascot: "Coffee.png"
                },
                {
                    id: "05 / 06",
                    icon: "fa-comment-dots",
                    tag: "Direct Support",
                    title: "Direct In-App Client Chat",
                    desc: "Chat directly with clients for seamless communication, diet recommendations, and routine adjustments.",
                    bg: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
                    mascot: "Chilling_Looking_At_Sky.png"
                },
                {
                    id: "06 / 06",
                    icon: "fa-briefcase",
                    tag: "Career Growth",
                    title: "Verified Fitness Job Openings",
                    desc: "Explore and apply for verified job opportunities and studio residencies posted by fitness centres.",
                    bg: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?q=80&w=1200&auto=format&fit=crop",
                    mascot: "Pharmacy.png"
                }
            ]
        };

        function updateRoleGlider(btn, animate = true) {
            const glider = document.getElementById('role-tab-glider');
            if (!glider || !btn) return;

            const left = btn.offsetLeft;
            const top = btn.offsetTop;
            const width = btn.offsetWidth;
            const height = btn.offsetHeight;

            if (width === 0) return;

            if (animate && window.gsap) {
                gsap.to(glider, {
                    left: left,
                    top: top,
                    width: width,
                    height: height,
                    duration: 0.32,
                    ease: "power3.out"
                });
            } else {
                glider.style.left = `${left}px`;
                glider.style.top = `${top}px`;
                glider.style.width = `${width}px`;
                glider.style.height = `${height}px`;
            }
        }

        function renderRoleFeatureStack(roleKey) {
            const slideTrack = document.getElementById('features-slide-track');
            const items = roleData[roleKey];
            if (!slideTrack || !items) return;

            slideTrack.innerHTML = items.map((data) => `
                <div class="item" style="background-image: url('${data.bg}');">
                    <div class="content">
                        <div class="flex items-center gap-3.5 mb-3">
                            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl liquid-glass-well p-1.5 border border-accent-orange/50 shadow-[0_8px_20px_rgba(255,94,0,0.3)] flex items-center justify-center shrink-0">
                                <img src="${data.mascot}?v=2" alt="Dorfie Mascot" class="w-full h-full object-contain object-center filter drop-shadow select-none">
                            </div>
                            <div class="min-w-0">
                                <div class="feature-tag font-mono text-[11px] font-bold text-accent-orange uppercase tracking-wider flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full bg-accent-orange animate-pulse shrink-0"></span>
                                    <span class="tag-text">${data.tag}</span>
                                    <span class="text-white/40">•</span>
                                    <span class="id-text">${data.id}</span>
                                </div>
                                <div class="font-mono text-[10px] text-white/50 tracking-wider uppercase mt-0.5 truncate">DORFIE CONNECTED ECOSYSTEM</div>
                            </div>
                        </div>
                        <div class="name">${data.title}</div>
                        <div class="des">${data.desc}</div>
                        <a class="seeMore" href="#pricing" onclick="appRouter.navigateLandingSection('pricing', event)">
                            <button type="button"><span>Explore Feature</span> <i class="fa-solid fa-arrow-right"></i></button>
                        </a>
                    </div>
                    <div class="item-preview-badge">
                        <div class="flex items-center gap-2 mb-1">
                            <div class="w-6 h-6 rounded-lg bg-black/40 border border-white/20 p-0.5 flex items-center justify-center shrink-0">
                                <img src="${data.mascot}?v=2" alt="Mascot" class="w-full h-full object-contain object-center">
                            </div>
                            <span class="font-mono text-[10px] font-bold text-accent-orange tracking-widest uppercase">${data.id}</span>
                        </div>
                        <h4 class="text-xs font-bold text-white truncate">${data.title}</h4>
                    </div>
                </div>
            `).join('');

            const counterEl = document.getElementById('features-stack-counter');
            if (counterEl && items[1]) {
                counterEl.textContent = items[1].id;
            }
        }

        function switchTab(roleKey, btn) {
            if (!btn) return;

            document.querySelectorAll('.feature-tab-btn').forEach(b => {
                b.classList.remove('active', 'text-white', 'font-bold');
                b.classList.add('text-charcoal/70', 'dark:text-chalk/70', 'font-semibold');
            });

            btn.classList.add('active', 'text-white', 'font-bold');
            btn.classList.remove('text-charcoal/70', 'dark:text-chalk/70', 'font-semibold');

            updateRoleGlider(btn, true);

            const slideTrack = document.getElementById('features-slide-track');
            if (slideTrack) {
                if (window.gsap) {
                    gsap.to(slideTrack, {
                        opacity: 0,
                        duration: 0.18,
                        ease: "power2.in",
                        onComplete: () => {
                            renderRoleFeatureStack(roleKey);
                            gsap.to(slideTrack, {
                                opacity: 1,
                                duration: 0.35,
                                ease: "power3.out"
                            });
                        }
                    });
                } else {
                    renderRoleFeatureStack(roleKey);
                }
            }
        }

        function setupStackSlider({ stageId, slideTrackId, prevBtnId, nextBtnId, counterId }) {
            const slideTrack = document.getElementById(slideTrackId);
            const nextBtn = document.getElementById(nextBtnId);
            const prevBtn = document.getElementById(prevBtnId);
            const counterEl = document.getElementById(counterId);

            if (!slideTrack || !nextBtn || !prevBtn) return null;

            function updateCounter() {
                const items = slideTrack.querySelectorAll('.item');
                if (items.length >= 2 && counterEl) {
                    const activeItem = items[1];
                    const idText = activeItem.querySelector('.id-text') || activeItem.querySelector('.item-preview-badge span');
                    if (idText) {
                        counterEl.textContent = idText.textContent.trim();
                    }
                }
            }

            function handleNext() {
                const items = slideTrack.querySelectorAll('.item');
                if (items.length < 2) return;
                slideTrack.appendChild(items[0]);
                updateCounter();
            }

            function handlePrev() {
                const items = slideTrack.querySelectorAll('.item');
                if (items.length < 2) return;
                slideTrack.prepend(items[items.length - 1]);
                updateCounter();
            }

            nextBtn.onclick = (e) => {
                e.preventDefault();
                handleNext();
            };

            prevBtn.onclick = (e) => {
                e.preventDefault();
                handlePrev();
            };

            // Clicking any preview card rotates the stack forward
            slideTrack.onclick = (e) => {
                const item = e.target.closest('.item');
                if (!item || !slideTrack.contains(item)) return;

                if (e.target.closest('button') || e.target.closest('a')) return;

                const items = Array.from(slideTrack.querySelectorAll('.item'));
                const clickedIndex = items.indexOf(item);

                if (clickedIndex >= 2) {
                    const shiftCount = clickedIndex - 1;
                    for (let i = 0; i < shiftCount; i++) {
                        const currentItems = slideTrack.querySelectorAll('.item');
                        slideTrack.appendChild(currentItems[0]);
                    }
                    updateCounter();
                }
            };

            // Touch swipe support
            let touchStartX = 0;
            let touchStartY = 0;
            slideTrack.addEventListener('touchstart', (e) => {
                if (e.touches && e.touches[0]) {
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                }
            }, { passive: true });

            slideTrack.addEventListener('touchend', (e) => {
                if (e.changedTouches && e.changedTouches[0]) {
                    const diffX = e.changedTouches[0].clientX - touchStartX;
                    const diffY = e.changedTouches[0].clientY - touchStartY;
                    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
                        if (diffX < 0) {
                            handleNext();
                        } else {
                            handlePrev();
                        }
                    }
                }
            }, { passive: true });

            // Keyboard navigation when stage is in focus or hovered
            const stage = document.getElementById(stageId);
            if (stage) {
                stage.setAttribute('tabindex', '0');
                stage.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        handleNext();
                    } else if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        handlePrev();
                    }
                });
            }

            updateCounter();

            return {
                next: handleNext,
                prev: handlePrev,
                updateCounter: updateCounter
            };
        }

        function initFeaturesStackSlider() {
            return setupStackSlider({
                stageId: 'features-stack-stage',
                slideTrackId: 'features-slide-track',
                prevBtnId: 'features-stack-prev',
                nextBtnId: 'features-stack-next',
                counterId: 'features-stack-counter'
            });
        }

        function setupCarouselController({
            trackId,
            prevBtnId,
            nextBtnId,
            counterId,
            dotsId,
            dotClass = 'features-carousel-dot',
            cardSelector = '.crystal-glass-card, .liquid-glass-panel',
            autoPlayInterval = 3800
        }) {
            const track = document.getElementById(trackId);
            const prevBtn = document.getElementById(prevBtnId);
            const nextBtn = document.getElementById(nextBtnId);
            const counter = document.getElementById(counterId);
            const dotsContainer = document.getElementById(dotsId);
            if (!track) return null;

            const cards = track.querySelectorAll(cardSelector);
            const total = cards.length;
            if (total === 0) return null;

            function getClosestCardIndex() {
                let closestIdx = 0;
                let minDiff = Infinity;
                cards.forEach((card, idx) => {
                    const cardLeft = card.offsetLeft - track.offsetLeft;
                    const diff = Math.abs(track.scrollLeft - cardLeft);
                    if (diff < minDiff) {
                        minDiff = diff;
                        closestIdx = idx;
                    }
                });
                return closestIdx;
            }

            function scrollToIndex(targetIdx) {
                targetIdx = Math.max(0, Math.min(total - 1, targetIdx));
                const targetCard = cards[targetIdx];
                if (targetCard) {
                    const targetLeft = targetCard.offsetLeft - track.offsetLeft;
                    track.scrollTo({ left: targetLeft, behavior: 'smooth' });
                }
            }

            // Build indicator dots
            if (dotsContainer) {
                dotsContainer.innerHTML = '';
                cards.forEach((_, idx) => {
                    const dot = document.createElement('button');
                    dot.type = 'button';
                    dot.className = `${dotClass} ${idx === 0 ? 'active' : ''}`;
                    dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
                    dot.addEventListener('click', () => {
                        stopAutoPlay();
                        scrollToIndex(idx);
                        restartAutoPlay();
                    });
                    dotsContainer.appendChild(dot);
                });
            }

            // Auto-Movement Engine (Smooth Auto-scroll with pause on interaction)
            let autoPlayTimer = null;
            let isUserInteracting = false;

            function startAutoPlay() {
                if (isReducedMotion || isUserInteracting) return;
                stopAutoPlay();
                autoPlayTimer = setInterval(() => {
                    if (isUserInteracting) return;
                    const maxScroll = track.scrollWidth - track.clientWidth;
                    const currentIdx = getClosestCardIndex();
                    if (track.scrollLeft >= maxScroll - 20 || currentIdx >= total - 1) {
                        scrollToIndex(0);
                    } else {
                        scrollToIndex(currentIdx + 1);
                    }
                }, autoPlayInterval);
            }

            function stopAutoPlay() {
                if (autoPlayTimer) {
                    clearInterval(autoPlayTimer);
                    autoPlayTimer = null;
                }
            }

            function restartAutoPlay() {
                stopAutoPlay();
                if (!isUserInteracting && !isReducedMotion) {
                    autoPlayTimer = setTimeout(() => {
                        startAutoPlay();
                    }, 2400);
                }
            }

            // Pause on hover / touch / focus
            track.addEventListener('pointerenter', () => {
                isUserInteracting = true;
                stopAutoPlay();
            }, { passive: true });

            track.addEventListener('pointerleave', () => {
                isUserInteracting = false;
                startAutoPlay();
            }, { passive: true });

            track.addEventListener('touchstart', () => {
                isUserInteracting = true;
                stopAutoPlay();
            }, { passive: true });

            track.addEventListener('touchend', () => {
                isUserInteracting = false;
                restartAutoPlay();
            }, { passive: true });

            track.addEventListener('focusin', () => {
                isUserInteracting = true;
                stopAutoPlay();
            });

            track.addEventListener('focusout', () => {
                isUserInteracting = false;
                startAutoPlay();
            });

            // Fluid Pointer Dragging with Momentum Physics
            let isPointerDown = false;
            let startX = 0;
            let scrollStart = 0;
            let hasDragged = false;
            let velX = 0;
            let lastX = 0;
            let lastTime = 0;

            track.addEventListener('pointerdown', (e) => {
                if (e.pointerType === 'mouse' && e.button !== 0) return;
                isPointerDown = true;
                hasDragged = false;
                startX = e.pageX;
                scrollStart = track.scrollLeft;
                lastX = e.pageX;
                lastTime = performance.now();
                velX = 0;
                stopAutoPlay();
            });

            window.addEventListener('pointermove', (e) => {
                if (!isPointerDown) return;
                const now = performance.now();
                const dt = now - lastTime || 16;
                const dx = e.pageX - lastX;
                velX = dx / dt;
                lastX = e.pageX;
                lastTime = now;

                const totalDelta = e.pageX - startX;
                if (Math.abs(totalDelta) > 6) {
                    if (!hasDragged) {
                        hasDragged = true;
                        track.classList.add('is-dragging');
                    }
                    track.scrollLeft = scrollStart - totalDelta;
                }
            });

            const endPointerDrag = () => {
                if (!isPointerDown) return;
                isPointerDown = false;
                if (hasDragged) {
                    track.classList.remove('is-dragging');
                    // Smooth momentum flick
                    const momentum = -velX * 160;
                    const targetScroll = track.scrollLeft + momentum;
                    track.scrollTo({ left: targetScroll, behavior: 'smooth' });
                    setTimeout(() => { hasDragged = false; }, 80);
                }
                restartAutoPlay();
            };

            window.addEventListener('pointerup', endPointerDrag);
            window.addEventListener('pointercancel', endPointerDrag);

            track.addEventListener('click', (e) => {
                if (hasDragged) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }, true);

            // Arrow Controls
            if (prevBtn) {
                prevBtn.addEventListener('mouseenter', stopAutoPlay);
                prevBtn.addEventListener('mouseleave', () => { if (!isUserInteracting) startAutoPlay(); });
                prevBtn.addEventListener('click', () => {
                    stopAutoPlay();
                    const currentIdx = getClosestCardIndex();
                    if (track.scrollLeft <= 20 || currentIdx <= 0) {
                        scrollToIndex(total - 1);
                    } else {
                        scrollToIndex(currentIdx - 1);
                    }
                    restartAutoPlay();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('mouseenter', stopAutoPlay);
                nextBtn.addEventListener('mouseleave', () => { if (!isUserInteracting) startAutoPlay(); });
                nextBtn.addEventListener('click', () => {
                    stopAutoPlay();
                    const maxScroll = track.scrollWidth - track.clientWidth;
                    const currentIdx = getClosestCardIndex();
                    if (track.scrollLeft >= maxScroll - 20 || currentIdx >= total - 1) {
                        scrollToIndex(0);
                    } else {
                        scrollToIndex(currentIdx + 1);
                    }
                    restartAutoPlay();
                });
            }

            // Keyboard navigation (ArrowLeft & ArrowRight)
            track.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    stopAutoPlay();
                    const currentIdx = getClosestCardIndex();
                    scrollToIndex(Math.max(0, currentIdx - 1));
                    restartAutoPlay();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    stopAutoPlay();
                    const currentIdx = getClosestCardIndex();
                    scrollToIndex(Math.min(total - 1, currentIdx + 1));
                    restartAutoPlay();
                }
            });

            // Update UI on scroll
            let scrollTimer = null;
            function updateCarouselState() {
                const activeIndex = getClosestCardIndex();

                // Calculate visible count
                let visibleCount = 0;
                cards.forEach(card => {
                    const cardLeft = card.offsetLeft - track.offsetLeft;
                    const cardRight = cardLeft + card.offsetWidth;
                    if (cardRight > track.scrollLeft + 15 && cardLeft < track.scrollLeft + track.clientWidth - 15) {
                        visibleCount++;
                    }
                });
                visibleCount = Math.max(1, visibleCount);

                // Update counter
                if (counter) {
                    if (visibleCount > 1 && total > visibleCount) {
                        const endIdx = Math.min(total, activeIndex + visibleCount);
                        counter.textContent = `${activeIndex + 1}-${endIdx}`;
                    } else {
                        counter.textContent = `${activeIndex + 1}`;
                    }
                }

                // Update dots
                if (dotsContainer) {
                    const dots = dotsContainer.querySelectorAll(`.${dotClass}`);
                    dots.forEach((dot, idx) => {
                        if (idx === activeIndex) dot.classList.add('active');
                        else dot.classList.remove('active');
                    });
                }
            }

            track.addEventListener('scroll', () => {
                if (scrollTimer) cancelAnimationFrame(scrollTimer);
                scrollTimer = requestAnimationFrame(updateCarouselState);
            }, { passive: true });

            // Initial call and start autoplay
            updateCarouselState();
            startAutoPlay();

            return {
                reset() {
                    scrollToIndex(0);
                    setTimeout(updateCarouselState, 150);
                    restartAutoPlay();
                },
                start: startAutoPlay,
                stop: stopAutoPlay
            };
        }

        let featuresCarouselInstance = null;
        let whyDorfieCarouselInstance = null;

        function initFeaturesCarousel() {
            initFeaturesStackSlider();
            window.featuresCarousel = {
                reset: () => {
                    const activeRoleBtn = document.querySelector('.feature-tab-btn.active');
                    if (activeRoleBtn) {
                        const roleKey = activeRoleBtn.getAttribute('onclick')?.match(/'([^']+)'/)?.[1] || 'member';
                        renderRoleFeatureStack(roleKey);
                    }
                }
            };
        }

        function initWhyDorfieCarousel() {
            whyDorfieCarouselInstance = setupStackSlider({
                stageId: 'why-dorfie-stack-stage',
                slideTrackId: 'why-dorfie-slide-track',
                prevBtnId: 'why-dorfie-stack-prev',
                nextBtnId: 'why-dorfie-stack-next',
                counterId: 'why-dorfie-stack-counter'
            });
            window.whyDorfieCarousel = whyDorfieCarouselInstance;
        }

        let currentPricingAudience = 'centres';

        const pricingData = {
            centres: {
                title: "Fitness Centres / Communities",
                subtitle: "Unlock powerful tools to manage your fitness centre, engage your community, and streamline your daily operations with the plan that's right for you.",
                plans: [
                    {
                        tier: "TIER 01",
                        name: "Base Plan",
                        productIdMonthly: null,
                        productIdYearly: null,
                        tag: "CENTRES FREE",
                        desc: "Let potential customers discover you, hire the best folks from the fitness industry, and showcase your offerings.",
                        monthlyPrice: 0,
                        annualPrice: 0,
                        priceLabelMonthly: "forever free",
                        priceLabelAnnual: "forever free",
                        buttonText: "Get Started Free",
                        isPopular: false,
                        features: [
                            "Public facility profile on Dorfie directory & map",
                            "Hire the best verified fitness professionals",
                            "Showcase your centre offerings & facilities",
                            "Basic member check-in support"
                        ]
                    },
                    {
                        tier: "TIER 02",
                        name: "Intermediate",
                        productIdMonthly: "fitness_centre_intermediate_monthly",
                        productIdYearly: "fitness_centre_intermediate_yearly",
                        tag: "MOST POPULAR",
                        desc: "Everything in Base + Complete management software for one branch with multiple branch access and no cap on membership.",
                        monthlyPrice: 1299,
                        annualPrice: 13000,
                        priceLabelMonthly: "month",
                        priceLabelAnnual: "year (Save ~17%)",
                        buttonText: "Buy Now",
                        isPopular: true,
                        features: [
                            "Everything in Base Plan plus:",
                            "Complete management software for one branch",
                            "Multiple branch access with no cap on membership",
                            "Free WhatsApp Messaging Integration for receipts & alerts",
                            "Staff accounts with Role-Based Access Control (RBAC)",
                            "Public classes & court / turf slot bookings",
                            "Dynamic in-gym live member data & churn signals"
                        ]
                    },
                    {
                        tier: "TIER 03",
                        name: "Advance",
                        productIdMonthly: "fitness_centre_advance_monthly",
                        productIdYearly: "fitness_centre_advance_yearly",
                        tag: "BIOMETRIC SMART HUB",
                        desc: "Everything in Intermediate + Biometric Integration (Face + Fingerprint) and RFID integration for turnstiles.",
                        monthlyPrice: 3299,
                        annualPrice: 26000,
                        priceLabelMonthly: "month",
                        priceLabelAnnual: "year (Save ~34%)",
                        buttonText: "Buy Now",
                        isPopular: false,
                        features: [
                            "Everything in Intermediate Plan plus:",
                            "Biometric Integration (Face + Fingerprint)",
                            "RFID card & smart wristband speed gate turnstiles",
                            "Free WhatsApp Messaging Integration included",
                            "Under-the-table PT detection & revenue protection",
                            "Offline-ready local sync for 100% turnstile uptime",
                            "Dedicated hardware technician setup & support"
                        ]
                    },
                    {
                        tier: "TIER 04",
                        name: "Advance Pro",
                        productIdMonthly: "fitness_centre_advance_pro_custom",
                        productIdYearly: "fitness_centre_advance_pro_custom",
                        tag: "ENTERPRISE & FRANCHISE",
                        desc: "Everything in Advance + Unlimited Branches + 2 Job postings per month.",
                        monthlyPrice: "Custom",
                        annualPrice: "Custom",
                        priceLabelMonthly: "custom pricing",
                        priceLabelAnnual: "custom pricing",
                        buttonText: "Contact Sales",
                        isPopular: false,
                        features: [
                            "Everything in Advance Plan plus:",
                            "Unlimited branches & multi-location franchises",
                            "2 Job postings per month in fitness talent network",
                            "Free WhatsApp Messaging Integration for all locations",
                            "Centralized multi-club analytics & audit reports",
                            "Dedicated enterprise account manager & 24/7 SLA"
                        ]
                    }
                ]
            },
            trainers: {
                title: "Trainers & Coaches",
                subtitle: "Elevate your coaching business, manage 1-on-1 sessions, generate verified client leads, and expand your fitness career.",
                plans: [
                    {
                        tier: "TIER 01",
                        name: "Base Plan",
                        productIdMonthly: null,
                        productIdYearly: null,
                        tag: "TRAINER FREE",
                        desc: "Sign-up in the app, and associate with the gym you are working with.",
                        monthlyPrice: 0,
                        annualPrice: 0,
                        priceLabelMonthly: "forever free",
                        priceLabelAnnual: "forever free",
                        buttonText: "Get Started Free",
                        isPopular: false,
                        features: [
                            "Sign-up in the app & associate with your gym",
                            "Create your own public coach profile",
                            "Manage your clients (up to 10 active clients)",
                            "Track your clients progress",
                            "Push your clients and recommend diets & exercises",
                            "Chat with your clients directly in-app",
                            "Explore verified jobs in the fitness industry",
                            "Create fitness events (INR-100 per event)"
                        ]
                    },
                    {
                        tier: "TIER 02",
                        name: "Advance",
                        productIdMonthly: "trainer_intermediate_monthly",
                        productIdYearly: "trainer_intermediate_yearly",
                        tag: "PRO COACH",
                        desc: "Everything in BASE plan plus client lead generation, verified badges, and expanded roster capacity.",
                        monthlyPrice: 699,
                        annualPrice: 3999,
                        priceLabelMonthly: "month",
                        priceLabelAnnual: "year (Save ~52%)",
                        buttonText: "Buy Now",
                        isPopular: true,
                        features: [
                            "Everything in BASE plan plus:",
                            "Apply to 10 Jobs Daily across partner gyms",
                            "Get discovered in Find a Fitness Coach directory",
                            "Create 2 complimentary events monthly",
                            "Manage your clients (up to 1,000 clients)",
                            "Get leads of new clients (up to 3 leads daily)",
                            "Eligible for badges & achievements to boost trust",
                            "Refer clients for products & earn commissions",
                            "Push your clients and recommend diets & exercises"
                        ]
                    },
                    {
                        tier: "TIER 03",
                        name: "Advance Pro",
                        productIdMonthly: "trainer_advance_pro_monthly",
                        productIdYearly: "trainer_advance_pro_yearly",
                        tag: "TOP RANKING",
                        desc: "Everything in ADVANCE plan plus 100 daily jobs, boosted top coach discovery, and unlimited client leads.",
                        monthlyPrice: 1299,
                        annualPrice: 6499,
                        priceLabelMonthly: "month",
                        priceLabelAnnual: "year (Save ~58%)",
                        buttonText: "Buy Now",
                        isPopular: false,
                        features: [
                            "Everything in ADVANCE plan plus:",
                            "Apply to 100 Jobs Daily across gym networks",
                            "Boosted to the very top in Find a Fitness Coach",
                            "Create 10 complimentary events monthly",
                            "Manage your clients (up to 1,000 clients)",
                            "Get leads of new clients (no limits on leads)",
                            "Top placement in job applicant lists for fitness centres",
                            "Increase income by connecting with fitness communities"
                        ]
                    }
                ]
            }
        };

        function updatePricingGlider(btn, animate = true) {
            const glider = document.getElementById('pricing-audience-glider');
            if (!glider || !btn) return;

            const left = btn.offsetLeft;
            const top = btn.offsetTop;
            const width = btn.offsetWidth;
            const height = btn.offsetHeight;

            if (width === 0) return;

            if (animate && window.gsap) {
                gsap.to(glider, {
                    left: left,
                    top: top,
                    width: width,
                    height: height,
                    duration: 0.32,
                    ease: "power3.out"
                });
            } else {
                glider.style.left = `${left}px`;
                glider.style.top = `${top}px`;
                glider.style.width = `${width}px`;
                glider.style.height = `${height}px`;
            }
        }

        function switchPricingAudience(audienceKey, btn) {
            currentPricingAudience = audienceKey;
            const targetBtn = btn || document.getElementById(audienceKey === 'centres' ? 'pricing-btn-centres' : 'pricing-btn-trainers');

            document.querySelectorAll('.pricing-audience-btn').forEach(b => {
                b.classList.remove('active', 'text-white', 'font-bold');
                b.classList.add('text-charcoal/70', 'dark:text-chalk/70', 'font-semibold');
            });

            if (targetBtn) {
                targetBtn.classList.add('active', 'text-white', 'font-bold');
                targetBtn.classList.remove('text-charcoal/70', 'dark:text-chalk/70', 'font-semibold');
                updatePricingGlider(targetBtn, true);
            }

            const container = document.getElementById('pricing-cards-container');
            if (container) {
                if (window.gsap) {
                    gsap.to(container, {
                        opacity: 0,
                        y: 10,
                        duration: 0.16,
                        ease: "power2.in",
                        onComplete: () => {
                            renderPricingCards();
                            gsap.fromTo(container, 
                                { opacity: 0, y: -10 },
                                { opacity: 1, y: 0, duration: 0.32, ease: "power3.out" }
                            );
                        }
                    });
                } else {
                    renderPricingCards();
                }
            } else {
                renderPricingCards();
            }
        }

        function renderPricingCards() {
            const container = document.getElementById('pricing-cards-container');
            if (!container) return;

            const audienceGroup = pricingData[currentPricingAudience] || pricingData.centres;
            const plans = audienceGroup.plans;

            // Responsive grid adjusts automatically for 3 or 4 cards
            container.className = plans.length >= 4 
                ? "cards-grid perspective-stage grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch w-full mb-10"
                : "cards-grid perspective-stage grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch w-full mb-10";

            container.innerHTML = plans.map((plan, index) => {
                const isFree = plan.monthlyPrice === 0;
                const isCustom = plan.monthlyPrice === 'Custom';
                const price = isCustom ? 'Custom' : (isAnnualPricing ? plan.annualPrice : plan.monthlyPrice);
                const cycle = isFree ? 'free' : (isCustom ? 'custom' : (isAnnualPricing ? 'annual' : 'monthly'));
                const priceLabel = isCustom ? 'bespoke quote' : (isAnnualPricing ? plan.priceLabelAnnual : plan.priceLabelMonthly);
                const priceFormatted = isFree ? '₹0' : (isCustom ? 'Custom' : `₹${price.toLocaleString()}`);

                return `
                    <div class="card-wrapper" data-delay="${(index * 0.12).toFixed(2)}">
                        <div class="card orange ${plan.isPopular ? 'popular-card' : ''}">
                            <div class="card-highlight-bar"></div>

                            ${plan.isPopular ? `
                            <div class="popular-ribbon">
                                <span><i class="fa-solid fa-fire text-amber-300"></i> ${plan.tag}</span>
                            </div>` : ''}

                            <div class="flex items-center justify-between w-full mb-3">
                                <span class="card-icon text-accent-orange">
                                    <i class="fa-solid ${isFree ? 'fa-seedling' : (isCustom ? 'fa-network-wired' : (index === 1 ? 'fa-bolt' : 'fa-crown'))} text-2xl"></i>
                                </span>
                                <span class="font-mono text-[10px] font-bold text-accent-orange bg-accent-orange/15 px-2.5 py-0.5 rounded-full border border-accent-orange/30">${plan.tier}</span>
                            </div>

                            <div class="card-tags">
                                <span class="card-tag">${plan.tag}</span>
                                ${plan.features.some(f => f.includes('WhatsApp')) ? '<span class="card-tag bg-[#25D366]/20 text-[#25D366] border-[#25D366]/40">FREE WHATSAPP</span>' : ''}
                            </div>

                            <h3 class="card-title font-bebas text-3xl sm:text-4xl tracking-wide ${plan.isPopular ? 'text-accent-orange' : ''}">${plan.name}</h3>
                            <p class="card-description">${plan.desc}</p>

                            <div class="card-price-row flex items-baseline gap-1.5 pb-4 mb-4 border-b border-white/10">
                                <span class="font-bebas text-4xl sm:text-5xl ${plan.isPopular ? 'text-accent-orange' : 'text-charcoal dark:text-chalk'} leading-none">${priceFormatted}</span>
                                <span class="text-xs font-mono font-bold text-charcoal/60 dark:text-chalk/60 uppercase">/ ${priceLabel}</span>
                            </div>

                            <ul class="card-features">
                                ${plan.features.map(f => {
                                    const isWhatsApp = f.includes('WhatsApp');
                                    return `
                                        <li class="card-feature ${isWhatsApp ? 'text-[#25D366] font-bold' : ''}">
                                            ${isWhatsApp ? '<i class="fa-brands fa-whatsapp text-sm mr-1 text-[#25D366]"></i>' : ''}
                                            ${f}
                                        </li>
                                    `;
                                }).join('')}
                            </ul>

                            <div class="card-btn-wrapper mt-auto flex flex-col gap-2">
                                <button onclick="${isCustom ? "appRouter.navigateLandingSection('book-demo')" : `appRouter.startPlanCheckout('${plan.name} (${audienceGroup.title})', ${isFree ? 0 : price}, '${cycle}')`}" class="card-btn">
                                    <span>${plan.buttonText}</span>
                                    <span>→</span>
                                </button>
                                <button type="button" onclick="openPlanDetailsModal(${index}, '${currentPricingAudience}')" class="card-view-details-btn">
                                    <i class="fa-solid fa-circle-info"></i>
                                    <span>View Details</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            // Re-bind Luxury 3D Cards
            if (typeof LuxuryCard3D !== 'undefined') {
                container.querySelectorAll('.card').forEach(el => new LuxuryCard3D(el));
            }
        }

        function openPlanDetailsModal(planIndex, audienceKey = currentPricingAudience) {
            const group = pricingData[audienceKey] || pricingData.centres;
            const plan = group.plans[planIndex];
            if (!plan) return;

            const modalOverlay = document.getElementById('plan-details-modal');
            if (!modalOverlay) return;

            const titleEl = document.getElementById('plan-modal-title');
            const tierEl = document.getElementById('plan-modal-tier');
            const priceEl = document.getElementById('plan-modal-price');
            const descEl = document.getElementById('plan-modal-desc');
            const prodIdEl = document.getElementById('plan-modal-product-id');
            const listEl = document.getElementById('plan-modal-features-list');
            const actionBtn = document.getElementById('plan-modal-action-btn');

            if (titleEl) titleEl.textContent = plan.name;
            if (tierEl) tierEl.textContent = `${plan.tier} • ${group.title.toUpperCase()}`;
            if (descEl) descEl.textContent = plan.desc;

            const isFree = plan.monthlyPrice === 0;
            const isCustom = plan.monthlyPrice === 'Custom';
            let priceText = '₹0 / Forever Free';
            if (isCustom) {
                priceText = 'Custom Enterprise Pricing';
            } else if (!isFree) {
                const currentP = isAnnualPricing ? plan.annualPrice : plan.monthlyPrice;
                const cycle = isAnnualPricing ? 'year' : 'month';
                priceText = `₹${currentP.toLocaleString()} / ${cycle}`;
            }
            if (priceEl) priceEl.textContent = priceText;

            const prodId = isAnnualPricing ? plan.productIdYearly : plan.productIdMonthly;
            if (prodIdEl) {
                if (prodId) {
                    prodIdEl.innerHTML = `<span class="text-charcoal/50 dark:text-chalk/50">App Store Product ID:</span> <code class="px-2.5 py-1 rounded-md bg-black/10 dark:bg-white/10 font-mono text-[11px] text-accent-orange font-bold">${prodId}</code>`;
                    prodIdEl.classList.remove('hidden');
                } else {
                    prodIdEl.classList.add('hidden');
                }
            }

            if (listEl) {
                listEl.innerHTML = plan.features.map(f => {
                    const isWhatsApp = f.includes('WhatsApp');
                    return `
                        <li class="flex items-start gap-2.5 py-1.5 ${isWhatsApp ? 'text-[#25D366] font-bold' : 'text-charcoal/85 dark:text-chalk/85'}">
                            <i class="${isWhatsApp ? 'fa-brands fa-whatsapp text-[#25D366]' : 'fa-solid fa-circle-check text-accent-orange'} mt-1 text-xs shrink-0"></i>
                            <span class="text-xs sm:text-sm">${f}</span>
                        </li>
                    `;
                }).join('');
            }

            if (actionBtn) {
                actionBtn.onclick = () => {
                    closePlanDetailsModal();
                    if (isCustom) {
                        appRouter.navigateLandingSection('book-demo');
                    } else {
                        const cycle = isFree ? 'free' : (isAnnualPricing ? 'annual' : 'monthly');
                        const pVal = isFree ? 0 : (isAnnualPricing ? plan.annualPrice : plan.monthlyPrice);
                        appRouter.startPlanCheckout(`${plan.name} (${group.title})`, pVal, cycle);
                    }
                };
                actionBtn.textContent = isCustom ? 'Inquire / Book Demo' : plan.buttonText;
            }

            modalOverlay.classList.remove('hidden');
            requestAnimationFrame(() => {
                modalOverlay.classList.remove('opacity-0');
                const card = document.getElementById('plan-modal-card');
                if (card) card.classList.remove('scale-95');
            });
        }

        function closePlanDetailsModal() {
            const modalOverlay = document.getElementById('plan-details-modal');
            if (!modalOverlay) return;
            modalOverlay.classList.add('opacity-0');
            const card = document.getElementById('plan-modal-card');
            if (card) card.classList.add('scale-95');
            setTimeout(() => {
                modalOverlay.classList.add('hidden');
            }, 300);
        }

        function toggleBilling() {
            isAnnualPricing = !isAnnualPricing;
            const knob = document.getElementById('pricing-toggle-knob');
            const labelMonthly = document.getElementById('label-monthly');
            const labelAnnual = document.getElementById('label-annual');

            if (isAnnualPricing) {
                if (knob) knob.classList.add('translate-x-6');
                if (labelAnnual) {
                    labelAnnual.classList.replace('text-charcoal/60', 'text-charcoal');
                    labelAnnual.classList.replace('dark:text-chalk/60', 'dark:text-chalk');
                }
                if (labelMonthly) {
                    labelMonthly.classList.replace('text-charcoal', 'text-charcoal/60');
                    labelMonthly.classList.replace('dark:text-chalk', 'dark:text-chalk/60');
                }
                openDownloadNotice("Annual Billing Active — Discounted pricing unlocked!", "fa-percent");
            } else {
                if (knob) knob.classList.remove('translate-x-6');
                if (labelMonthly) {
                    labelMonthly.classList.replace('text-charcoal/60', 'text-charcoal');
                    labelMonthly.classList.replace('dark:text-chalk/60', 'dark:text-chalk');
                }
                if (labelAnnual) {
                    labelAnnual.classList.replace('text-charcoal', 'text-charcoal/60');
                    labelAnnual.classList.replace('dark:text-chalk', 'dark:text-chalk/60');
                }
                openDownloadNotice("Monthly Billing Active — Flexible plan", "fa-calendar");
            }
            renderPricingCards();
        }

        /* -------------------------------------------------------------
           POLICY MODAL HANDLERS (5 LIVE OFFICIAL POLICIES)
           ------------------------------------------------------------- */
        function openPolicyModal(policyKey = 'terms') {
            const overlay = document.getElementById('policy-modal-overlay');
            if (!overlay) return;
            overlay.classList.remove('hidden');
            requestAnimationFrame(() => {
                overlay.classList.remove('opacity-0');
                const card = document.getElementById('policy-modal-card');
                if (card) card.classList.remove('scale-95');
            });
            switchPolicyTab(policyKey);
        }

        function closePolicyModal() {
            const overlay = document.getElementById('policy-modal-overlay');
            if (!overlay) return;
            overlay.classList.add('opacity-0');
            const card = document.getElementById('policy-modal-card');
            if (card) card.classList.add('scale-95');
            setTimeout(() => {
                overlay.classList.add('hidden');
            }, 300);
        }

        function switchPolicyTab(policyKey) {
            document.querySelectorAll('.policy-tab-btn').forEach(btn => {
                if (btn.getAttribute('data-policy') === policyKey) {
                    btn.classList.add('active');
                    btn.classList.remove('text-charcoal/70', 'dark:text-chalk/70');
                } else {
                    btn.classList.remove('active');
                    btn.classList.add('text-charcoal/70', 'dark:text-chalk/70');
                }
            });

            const bodyEl = document.getElementById('policy-modal-body');
            const titleEl = document.getElementById('policy-modal-title');
            if (!bodyEl) return;

            const policies = window.dorfiePolicies || {};
            const policy = policies[policyKey];

            if (policy) {
                if (titleEl) titleEl.textContent = policy.title.toUpperCase();
                bodyEl.innerHTML = `
                    <div class="mb-3 pb-2 border-b border-charcoal/10 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-accent-orange font-bold">
                        <span>LAST UPDATED: ${policy.lastUpdated}</span>
                        <span>OFFICIAL DORFIE FIT POLICY</span>
                    </div>
                    <div class="policy-raw-content whitespace-pre-line font-sans text-xs sm:text-sm text-charcoal/85 dark:text-chalk/85 leading-relaxed">
                        ${escapePolicyHtml(policy.content)}
                    </div>
                `;
            } else {
                bodyEl.innerHTML = `<p class="text-sm font-mono text-red-400">Policy document not found.</p>`;
            }
        }

        function escapePolicyHtml(str) {
            return str
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

        function handleDemoSubmit(e) {
            e.preventDefault();
            const form = e.target;
            const name = form.querySelector('[name="demo_name"]')?.value || 'Guest';
            openDownloadNotice(`Demo request received for ${name}! Our team will connect via WhatsApp within 24 hours.`, 'fa-calendar-check');
            form.reset();
        }

        function handleNewsletterSubmit(e) {
            e.preventDefault();
            const form = e.target;
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput ? emailInput.value : '';
            openDownloadNotice(`Subscribed ${email} to Dorfie Fit updates!`, 'fa-envelope-circle-check');
            form.reset();
        }

        function toggleColorMode() {
            const isDark = document.documentElement.classList.contains('dark');
            if (isDark) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('dorfie-theme', 'light');
                openDownloadNotice("Light Luxury Theme Active", "fa-sun");
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('dorfie-theme', 'dark');
                openDownloadNotice("Dark Cyber OLED Theme Active", "fa-moon");
            }
            updateThemeIcon(true);
        }

        function updateThemeIcon(animate = false) {
            const icon = document.getElementById('theme-toggle-icon');
            if (!icon) return;
            const isDark = document.documentElement.classList.contains('dark');
            icon.className = isDark ? "fa-solid fa-sun text-sm text-amber-400" : "fa-solid fa-moon text-sm";
            if (animate && window.gsap && !isReducedMotion) {
                gsap.fromTo(icon,
                    { rotate: -120, scale: 0.65 },
                    { rotate: 0, scale: 1, duration: 0.4, ease: "back.out(2)" }
                );
            }
        }

        function toggleMobileNav() {
            const drawer = document.getElementById('mobile-nav-drawer');
            if (!drawer) return;
            const isOpening = drawer.classList.contains('hidden');
            if (isOpening) {
                drawer.classList.remove('hidden');
                drawer.classList.add('flex');
                if (window.gsap && !isReducedMotion) {
                    gsap.fromTo(drawer,
                        { opacity: 0, y: -12, scale: 0.98 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: "cubic-bezier(0.16, 1, 0.3, 1)" }
                    );
                    gsap.fromTo(drawer.children,
                        { opacity: 0, x: -8 },
                        { opacity: 1, x: 0, stagger: 0.035, duration: 0.22, ease: "power2.out" }
                    );
                }
            } else {
                if (window.gsap && !isReducedMotion) {
                    gsap.to(drawer, {
                        opacity: 0,
                        y: -8,
                        duration: 0.18,
                        ease: "power2.in",
                        onComplete: () => {
                            drawer.classList.add('hidden');
                            drawer.classList.remove('flex');
                        }
                    });
                } else {
                    drawer.classList.add('hidden');
                    drawer.classList.remove('flex');
                }
            }
        }

        /* -------------------------------------------------------------
           BACKEND-READY AUTHENTICATION SERVICE (dorfieAuth)
           Ready for future production API integration (JWT / REST / GraphQL)
           ------------------------------------------------------------- */
        const dorfieAuth = {
            async login({ identity, password }) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        let cleanIdentity = (identity || '').trim();
                        if (!cleanIdentity) {
                            cleanIdentity = 'alex@dorfiefit.com';
                        }
                        if (!password || password.length < 4) {
                            password = 'dorfie2026';
                        }

                        const userName = cleanIdentity.includes('@')
                            ? cleanIdentity.split('@')[0].replace(/[^a-zA-Z]/g, ' ')
                            : cleanIdentity;
                        const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);

                        const user = {
                            name: formattedName.trim() || 'Alex Rivers',
                            email: cleanIdentity.includes('@') ? cleanIdentity.toLowerCase() : `${cleanIdentity.toLowerCase()}@dorfiefit.com`,
                            role: 'member',
                            authenticatedAt: Date.now()
                        };

                        const mockToken = 'df_jwt_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now();
                        localStorage.setItem('dorfie_auth_token', mockToken);
                        localStorage.setItem('dorfie_user', JSON.stringify(user));
                        resolve({ user, token: mockToken });
                    }, 350);
                });
            },

            async register({ name, email, phone, role, password }) {
                // BACKEND HOOK: Replace with `await fetch('/api/v1/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, phone, role, password }) })`
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        if (!name || name.trim().length < 2) {
                            reject(new Error("Please provide your full legal name (minimum 2 letters)."));
                            return;
                        }
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!email || !emailRegex.test(email.trim())) {
                            reject(new Error("Please provide a valid email address (e.g., alex@dorfiefit.com)."));
                            return;
                        }
                        const cleanPhone = (phone || '').replace(/\D/g, '');
                        if (cleanPhone.length < 10) {
                            reject(new Error("Please provide a valid 10-digit mobile number for pass sync."));
                            return;
                        }
                        if (!password || password.length < 6) {
                            reject(new Error("Security PIN/Password must be at least 6 characters."));
                            return;
                        }

                        const user = {
                            name: name.trim(),
                            email: email.trim().toLowerCase(),
                            phone: '+91 ' + cleanPhone.slice(-10),
                            role: role || 'member',
                            authenticatedAt: Date.now()
                        };

                        const mockToken = 'df_jwt_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now();
                        localStorage.setItem('dorfie_auth_token', mockToken);
                        localStorage.setItem('dorfie_user', JSON.stringify(user));
                        resolve({ user, token: mockToken });
                    }, 750);
                });
            },

            logout() {
                localStorage.removeItem('dorfie_auth_token');
                localStorage.removeItem('dorfie_user');
            }
        };

        function togglePasswordVisibility(inputId, btnEl) {
            const input = document.getElementById(inputId);
            if (!input || !btnEl) return;
            const icon = btnEl.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                if (icon) icon.className = 'fa-regular fa-eye-slash text-accent-orange';
            } else {
                input.type = 'password';
                if (icon) icon.className = 'fa-regular fa-eye text-charcoal/50 dark:text-chalk/50';
            }
        }

        function handlePasswordStrength(val) {
            const container = document.getElementById('password-strength-container');
            const label = document.getElementById('password-strength-label');
            const b1 = document.getElementById('strength-bar-1');
            const b2 = document.getElementById('strength-bar-2');
            const b3 = document.getElementById('strength-bar-3');
            const b4 = document.getElementById('strength-bar-4');
            if (!container || !label || !b1) return;

            if (!val || val.length === 0) {
                [b1, b2, b3, b4].forEach(b => b.className = 'rounded-full bg-charcoal-muted/30 dark:bg-white/10 transition-colors duration-300');
                label.textContent = 'Weak';
                label.className = 'font-bold text-red-400';
                return;
            }

            let score = 0;
            if (val.length >= 6) score++;
            if (val.length >= 9) score++;
            if (/[0-9]/.test(val)) score++;
            if (/[^A-Za-z0-9]/.test(val)) score++;

            // Reset bars
            [b1, b2, b3, b4].forEach(b => b.className = 'rounded-full bg-charcoal-muted/30 dark:bg-white/10 transition-colors duration-300');

            if (score <= 1) {
                b1.className = 'rounded-full bg-red-500 transition-colors duration-300';
                label.textContent = 'Weak';
                label.className = 'font-bold text-red-400';
            } else if (score === 2) {
                b1.className = b2.className = 'rounded-full bg-amber-400 transition-colors duration-300';
                label.textContent = 'Fair';
                label.className = 'font-bold text-amber-400';
            } else if (score === 3) {
                b1.className = b2.className = b3.className = 'rounded-full bg-blue-400 transition-colors duration-300';
                label.textContent = 'Good';
                label.className = 'font-bold text-blue-400';
            } else {
                b1.className = b2.className = b3.className = b4.className = 'rounded-full bg-emerald-500 transition-colors duration-300';
                label.textContent = 'Strong';
                label.className = 'font-bold text-emerald-400';
            }
        }

        async function handleAuthSubmit(e) {
            e.preventDefault();
            const alertBanner = document.getElementById('auth-alert-banner');
            const alertText = document.getElementById('auth-alert-text');
            const spinner = document.getElementById('auth-submit-spinner');
            const submitBtn = document.getElementById('auth-submit-btn');

            if (alertBanner) alertBanner.classList.add('hidden');
            if (spinner) spinner.classList.remove('hidden');
            if (submitBtn) submitBtn.disabled = true;

            const isRegister = appRouter.activeAuthMode === 'register';

            try {
                let authResult;
                if (isRegister) {
                    const name = document.getElementById('auth-name-input')?.value || '';
                    const email = document.getElementById('auth-identity-input')?.value || '';
                    const phone = document.getElementById('auth-phone-input')?.value || '';
                    const role = document.querySelector('input[name="auth-role"]:checked')?.value || 'member';
                    const password = document.getElementById('auth-password-input')?.value || '';

                    authResult = await dorfieAuth.register({ name, email, phone, role, password });
                } else {
                    let identity = document.getElementById('auth-identity-input')?.value || '';
                    let password = document.getElementById('auth-password-input')?.value || '';

                    if (!identity.trim()) {
                        identity = 'alex@dorfiefit.com';
                        const idEl = document.getElementById('auth-identity-input');
                        if (idEl) idEl.value = identity;
                    }
                    if (!password || password.length < 4) {
                        password = 'dorfie2026';
                        const pwEl = document.getElementById('auth-password-input');
                        if (pwEl) pwEl.value = '••••••••';
                    }

                    authResult = await dorfieAuth.login({ identity, password });
                }

                appRouter.currentUser = authResult.user;
                appRouter.updateNavAuth();

                if (appRouter.pendingPurchase) {
                    openDownloadNotice(`Authenticated as ${authResult.user.name}! Resuming checkout...`, "fa-shield-halved");
                    setTimeout(() => {
                        appRouter.renderCheckout();
                        appRouter.navigate('checkout');
                    }, 400);
                } else {
                    openDownloadNotice(`Welcome, ${authResult.user.name}! Access unlocked.`, "fa-id-badge");
                    setTimeout(() => {
                        appRouter.navigate('home');
                    }, 400);
                }
            } catch (err) {
                if (alertBanner && alertText) {
                    alertText.textContent = err.message || "Authentication failed. Please check your credentials.";
                    alertBanner.classList.remove('hidden');
                }
            } finally {
                if (spinner) spinner.classList.add('hidden');
                if (submitBtn) submitBtn.disabled = false;
            }
        }

        async function dorfieQuickAuth(provider) {
            const idInput = document.getElementById('auth-identity-input');
            const pwInput = document.getElementById('auth-password-input');
            if (idInput) idInput.value = `alex.${provider.toLowerCase()}@dorfiefit.com`;
            if (pwInput) pwInput.value = 'dorfie2026';
            openDownloadNotice(`Authenticating via ${provider} SSO...`, "fa-bolt");
            const form = document.querySelector('#view-auth form');
            if (form) {
                setTimeout(() => {
                    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                }, 250);
            }
        }

        /* -------------------------------------------------------------
           DIGITAL INVOICE & RECEIPT MODAL CONTROLLERS
           ------------------------------------------------------------- */
        function openInvoiceModal(order) {
            const modal = document.getElementById('invoice-modal-overlay');
            if (!modal || !order) return;

            const safeSetText = (id, text) => {
                const el = document.getElementById(id);
                if (el) el.textContent = text;
            };

            safeSetText('invoice-order-id', order.orderId);
            safeSetText('invoice-customer-name', order.customer.name);
            safeSetText('invoice-timestamp', `${order.date} • ${order.timestamp}`);
            safeSetText('invoice-role-badge', order.customer.role || 'ATHLETE');
            safeSetText('invoice-method-label', order.method);
            safeSetText('invoice-auth-code', `AUTH: ${order.authCode}`);

            safeSetText('invoice-plan-title', order.planName);
            safeSetText('invoice-plan-cycle-sub', `Subscription Period • ${order.cycle.toUpperCase()} PASS`);
            safeSetText('invoice-base-price', `₹${order.basePrice.toLocaleString()}`);
            safeSetText('invoice-tax-price', `₹${order.taxPrice.toLocaleString()}`);

            const discLine = document.getElementById('invoice-discount-line');
            const discAmount = document.getElementById('invoice-discount-amount');
            if (order.discount > 0) {
                if (discLine) discLine.classList.remove('hidden');
                if (discAmount) discAmount.textContent = `-₹${order.discount.toLocaleString()}`;
            } else {
                if (discLine) discLine.classList.add('hidden');
            }

            safeSetText('invoice-total-amount', `₹${order.finalTotal.toLocaleString()}`);

            modal.classList.remove('hidden');
            requestAnimationFrame(() => {
                modal.classList.remove('opacity-0');
                modal.classList.add('opacity-100');
                const card = document.getElementById('invoice-printable-card');
                if (card) {
                    card.classList.remove('scale-95');
                    card.classList.add('scale-100');
                }
            });
        }

        function closeInvoiceModal() {
            const modal = document.getElementById('invoice-modal-overlay');
            const card = document.getElementById('invoice-printable-card');
            if (!modal) return;
            modal.classList.add('opacity-0');
            if (card) card.classList.add('scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
                appRouter.pendingPurchase = null;
                appRouter.navigate('home');
            }, 300);
        }

        /* -------------------------------------------------------------
           KINETIC FLUID SCROLL RIBBON ENGINE (LUMINOUS AMBER STREAM)
           Harmonic spline interpolation bound to Lenis scroll scrub & GSAP ticker
           ------------------------------------------------------------- */
        let ribbonScrollProgress = 0;
        let isRibbonInitialized = false;

        function initKineticRibbon() {
            if (isRibbonInitialized) return;
            const container = document.getElementById('kinetic-ribbon-container');
            const pathAura = document.getElementById('ribbon-path-aura');
            const pathCore = document.getElementById('ribbon-path-core');
            const pathTelemetry = document.getElementById('ribbon-path-telemetry');
            if (!container || !pathCore) return;

            isRibbonInitialized = true;

            function updateRibbonPaths(time) {
                const t = (time || 0) * 0.0011;
                const sp = ribbonScrollProgress; // 0 (top) to 1 (bottom)

                // Coordinate bounding space: 1440 x 900
                const p0x = -40 + Math.sin(t * 0.7) * 30;
                const p0y = 160 + Math.cos(t * 0.8) * 40 + sp * 180;

                const cp1x = 380 + Math.sin(t * 1.0) * 60 + sp * 140;
                const cp1y = 70 + Math.cos(t * 1.2) * 60 - sp * 60;

                const cp2x = 960 + Math.cos(t * 0.8) * 70 - sp * 160;
                const cp2y = 820 + Math.sin(t * 1.1) * 60 - sp * 280;

                const p1x = 1480 + Math.cos(t * 0.6) * 35;
                const p1y = 380 + Math.sin(t * 0.9) * 55 + sp * 240;

                // Core luminous bezier path
                const dCore = `M ${p0x.toFixed(1)} ${p0y.toFixed(1)} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p1x.toFixed(1)} ${p1y.toFixed(1)}`;

                // Parallel secondary telemetry line (offset by 24px vertically)
                const t0y = p0y + 24 + Math.sin(t * 1.4) * 8;
                const tcp1y = cp1y + 26;
                const tcp2y = cp2y + 26;
                const t1y = p1y + 24;
                const dTelemetry = `M ${p0x.toFixed(1)} ${t0y.toFixed(1)} C ${cp1x.toFixed(1)} ${tcp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${tcp2y.toFixed(1)}, ${p1x.toFixed(1)} ${t1y.toFixed(1)}`;

                pathCore.setAttribute('d', dCore);
                if (pathAura) pathAura.setAttribute('d', dCore);
                if (pathTelemetry) pathTelemetry.setAttribute('d', dTelemetry);
            }

            // Hook onto GSAP ticker for 60fps silky smooth rendering
            gsap.ticker.add((time) => {
                updateRibbonPaths(time * 1000);
            });

            // Fallback passive scroll listener to keep ribbon synced under all circumstances
            window.addEventListener('scroll', () => {
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                ribbonScrollProgress = maxScroll > 0 ? (window.scrollY / maxScroll) : 0;
            }, { passive: true });

            updateRibbonPaths(0);
        }

        function openDownloadNotice(text, iconClass = 'fa-check') {
            const toast = document.getElementById('download-toast');
            const toastText = document.getElementById('download-toast-text');
            if (!toast || !toastText) return;

            const iconEl = toast.querySelector('i');
            if (iconEl) iconEl.className = `fa-solid ${iconClass}`;

            toastText.textContent = text;
            toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
            toast.classList.add('opacity-100', 'translate-y-0');

            clearTimeout(toast._timeout);
            toast._timeout = setTimeout(() => {
                toast.classList.remove('opacity-100', 'translate-y-0');
                toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
            }, 3000);
        }

        // Animate numbers smoothly from 0
        function initNumberCounters() {
            const counters = document.querySelectorAll('[data-counter]');
            if (!counters.length) return;

            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        obs.unobserve(el);

                        const targetVal = parseFloat(el.getAttribute('data-counter')) || 0;
                        const prefix = el.getAttribute('data-counter-prefix') || '';
                        const suffix = el.getAttribute('data-counter-suffix') || '';
                        const decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);

                        const counterState = { val: 0 };
                        gsap.to(counterState, {
                            val: targetVal,
                            duration: 1.8,
                            ease: "power2.out",
                            onUpdate: () => {
                                const formatted = counterState.val.toLocaleString('en-US', {
                                    minimumFractionDigits: decimals,
                                    maximumFractionDigits: decimals
                                });
                                el.textContent = `${prefix}${formatted}${suffix}`;
                            }
                        });
                    }
                });
            }, { threshold: 0.2 });

            counters.forEach(c => observer.observe(c));
        }

        function initKineticTypography() {
            const headlines = document.querySelectorAll('.split-kinetic-text');
            headlines.forEach(headline => headline.classList.add('is-ready'));

            if (isReducedMotion) return;

            document.fonts.ready.then(() => {
                headlines.forEach(headline => {
                    if (window.SplitType) {
                        try {
                            const split = new SplitType(headline, { types: 'lines,words' });
                            split.words.forEach(w => {
                                const wrapper = document.createElement('span');
                                wrapper.className = 'split-word-wrap';
                                w.parentNode.insertBefore(wrapper, w);
                                wrapper.appendChild(w);
                                w.classList.add('split-word');
                            });

                            gsap.fromTo(split.words,
                                { yPercent: 110, rotateZ: 3, opacity: 0 },
                                {
                                    scrollTrigger: {
                                        trigger: headline,
                                        start: "top 88%",
                                        toggleActions: "play none none none"
                                    },
                                    yPercent: 0,
                                    rotateZ: 0,
                                    opacity: 1,
                                    stagger: 0.025,
                                    duration: 0.85,
                                    ease: "power3.out"
                                }
                            );
                        } catch (err) {
                            headline.style.visibility = 'visible';
                        }
                    }
                });
            });

            // Smooth Infinite Marquee loop on GSAP ticker with offscreen pause
            const marqueeTrack = document.querySelector('.marquee-inner-wrap');
            if (marqueeTrack && !isReducedMotion) {
                let marqueeX = 0;
                let isMarqueeHovered = false;
                let isMarqueeInView = true;
                const marqueeParent = marqueeTrack.parentElement;
                if (marqueeParent) {
                    marqueeParent.addEventListener('mouseenter', () => { isMarqueeHovered = true; });
                    marqueeParent.addEventListener('mouseleave', () => { isMarqueeHovered = false; });
                    const mObs = new IntersectionObserver(([entry]) => {
                        isMarqueeInView = entry.isIntersecting;
                    }, { threshold: 0.1 });
                    mObs.observe(marqueeParent);
                }
                gsap.ticker.add(() => {
                    if (isMarqueeHovered || !isMarqueeInView) return;
                    marqueeX -= 1.35;
                    const halfWidth = marqueeTrack.scrollWidth / 2;
                    if (Math.abs(marqueeX) >= halfWidth) marqueeX = 0;
                    marqueeTrack.style.transform = `translate3d(${marqueeX}px, 0, 0)`;
                });
            }
        }

        function initScrollReveal() {
            if (isReducedMotion) return;
            const revealElements = document.querySelectorAll('h1, h2, h3, h4, .crystal-glass-card, .liquid-glass-panel, .feature-grid-item, .bento-item');
            const windowHeight = window.innerHeight;

            const targets = [];
            revealElements.forEach(el => {
                // Skip if within overlays, follower, or if child inside another card
                if (el.closest('#preloader-overlay') || el.closest('#cursor-follower') || el.closest('#capy-scroll-companion') || el.classList.contains('split-word')) return;
                
                const parentCard = el.parentElement ? el.parentElement.closest('.crystal-glass-card, .liquid-glass-panel') : null;
                if (parentCard && parentCard !== el) return; // Keep cards cohesive, don't chop up internal content

                const rect = el.getBoundingClientRect();
                // Elements already in the first viewport render instantly without flicker
                if (rect.top < windowHeight * 0.92 && rect.bottom > 0) {
                    el.classList.add('scroll-reveal-item', 'scroll-reveal-instant');
                } else {
                    el.classList.add('scroll-reveal-item');
                    targets.push(el);
                }
            });

            if (!targets.length) return;

            // Early-engagement observer: rootMargin triggers 60px before entering viewport
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        obs.unobserve(target);
                        
                        // Fluid sibling stagger calculation (40ms per sibling, capped at 180ms)
                        const siblings = target.parentElement ? Array.from(target.parentElement.children) : [];
                        const index = siblings.indexOf(target);
                        const delay = (index >= 0 && index < 6) ? index * 40 : 0;

                        setTimeout(() => {
                            target.classList.add('scroll-reveal-visible');
                        }, delay);
                    }
                });
            }, { threshold: 0.04, rootMargin: '0px 0px 60px 0px' });

            targets.forEach(t => observer.observe(t));
        }

        function initParallaxLayers() {
            if (isReducedMotion) return;
            const ambientOrbs = [
                { id: '#ambient-orb-1', speedY: 260, speedX: 45, rotateMax: 20 },
                { id: '#ambient-orb-2', speedY: -280, speedX: -50, rotateMax: -24 },
                { id: '#ambient-orb-3', speedY: 230, speedX: 38, rotateMax: 18 },
                { id: '#ambient-orb-4', speedY: -250, speedX: -35, rotateMax: -20 }
            ];
            ambientOrbs.forEach(orb => {
                const el = document.querySelector(orb.id);
                if (!el) return;
                el.style.willChange = 'transform';
                gsap.to(el, {
                    scrollTrigger: {
                        trigger: document.body,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 2.0
                    },
                    y: orb.speedY,
                    x: orb.speedX,
                    rotation: orb.rotateMax,
                    ease: "none"
                });
            });
        }

        function initSmoothScroll() {
            if (isReducedMotion) return;
            lenisInstance = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 0.95,
                lerp: 0.085,
                touchMultiplier: 1.2
            });
            lenisInstance.on('scroll', (e) => {
                ScrollTrigger.update();

                // Hardware-accelerated GPU scaleX scroll progress synced directly with Lenis progress
                const progressBar = document.getElementById('scroll-progress-bar');
                if (progressBar) {
                    const p = typeof e.progress === 'number' ? e.progress : (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight));
                    progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
                }

                // Scrub background kinetic ribbon
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                ribbonScrollProgress = maxScroll > 0 ? (window.scrollY / maxScroll) : 0;

                // Dynamic condensed header on scroll
                updateHeaderOnScroll(window.scrollY);

                // Minimalist floating back-to-top button
                updateBackToTop(window.scrollY);
            });
            gsap.ticker.add((time) => lenisInstance.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);

            initScrollSpy();
        }

        function updateHeaderOnScroll(scrollY) {
            const header = document.getElementById('main-header');
            const headerPanel = document.getElementById('main-header-panel');
            if (header) {
                if (scrollY > 30) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
            if (!headerPanel) return;
            if (scrollY > 40) {
                headerPanel.classList.add('shadow-2xl', 'py-2.5', 'sm:py-3');
                headerPanel.classList.remove('py-3.5', 'sm:py-4');
            } else {
                headerPanel.classList.remove('shadow-2xl', 'py-2.5', 'sm:py-3');
                headerPanel.classList.add('py-3.5', 'sm:py-4');
            }
        }

        // Native scroll fallback when smooth scroll (Lenis) is disabled or inactive
        window.addEventListener('scroll', () => {
            if (!lenisInstance) {
                const scrollY = window.scrollY;
                updateHeaderOnScroll(scrollY);
                updateBackToTop(scrollY);
                const progressBar = document.getElementById('scroll-progress-bar');
                if (progressBar) {
                    const max = document.documentElement.scrollHeight - window.innerHeight;
                    const p = max > 0 ? scrollY / max : 0;
                    progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
                }
            }
        }, { passive: true });

        // Debounced responsive window resize handler for fluid gliders
        let gliderResizeTimer = null;
        window.addEventListener('resize', () => {
            clearTimeout(gliderResizeTimer);
            gliderResizeTimer = setTimeout(() => {
                const activeRoleBtn = document.querySelector('.feature-tab-btn.active');
                if (activeRoleBtn) updateRoleGlider(activeRoleBtn, false);

                const activePricingBtn = document.querySelector('.pricing-audience-btn.active');
                if (activePricingBtn) updatePricingGlider(activePricingBtn, false);
            }, 100);
        }, { passive: true });

        function updateBackToTop(scrollY) {
            const btn = document.getElementById('back-to-top-btn');
            if (!btn) return;
            if (scrollY > 450) {
                btn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
                btn.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
            } else {
                btn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
                btn.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
            }
        }

        function scrollToTop() {
            if (lenisInstance) {
                lenisInstance.scrollTo(0, { duration: 1.2 });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }

        function initScrollSpy() {
            const sections = ['about', 'features', 'pricing', 'why-dorfie', 'software-apps'];
            sections.forEach(secId => {
                const sec = document.getElementById(secId);
                if (!sec) return;
                ScrollTrigger.create({
                    trigger: sec,
                    start: "top 45%",
                    end: "bottom 45%",
                    onToggle: (self) => {
                        if (self.isActive && appRouter.activeView === 'home') {
                            document.querySelectorAll('.nav-section-link').forEach(link => {
                                const target = link.getAttribute('data-target');
                                if (target === secId) {
                                    link.classList.add('is-active');
                                } else {
                                    link.classList.remove('is-active');
                                }
                            });
                        }
                    }
                });
            });
        }

        function initMagneticCursor() {
            if (isReducedMotion || window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
            const dot = document.getElementById('cursor-dot');
            const follower = document.getElementById('cursor-follower');
            if (!dot || !follower) return;

            let cursorVisible = false;
            window.addEventListener('mousemove', (e) => {
                if (!cursorVisible) {
                    cursorVisible = true;
                    dot.style.opacity = '1';
                    follower.style.opacity = '1';
                }
                mouse.x = e.clientX;
                mouse.y = e.clientY;
                gsap.set(dot, { x: mouse.x, y: mouse.y });
            });

            document.addEventListener('mouseleave', () => {
                cursorVisible = false;
                dot.style.opacity = '0';
                follower.style.opacity = '0';
            });

            document.addEventListener('mouseenter', () => {
                cursorVisible = true;
                dot.style.opacity = '1';
                follower.style.opacity = '1';
            });

            window.addEventListener('mousedown', () => {
                follower.classList.add('is-clicking');
            });
            window.addEventListener('mouseup', () => {
                follower.classList.remove('is-clicking');
            });

            gsap.ticker.add(() => {
                mouse.targetX += (mouse.x - mouse.targetX) * 0.15;
                mouse.targetY += (mouse.y - mouse.targetY) * 0.15;
                gsap.set(follower, { x: mouse.targetX, y: mouse.targetY });
            });

            // Magnetic attraction on interactive controls
            const magneticElements = document.querySelectorAll('[data-magnetic], .liquid-glass-btn-orange, .magnetic-btn');
            magneticElements.forEach(el => {
                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    const relX = (e.clientX - rect.left) / rect.width;
                    const relY = (e.clientY - rect.top) / rect.height;
                    gsap.to(el, { x: (relX - 0.5) * 14, y: (relY - 0.5) * 14, duration: 0.3, ease: "power2.out" });
                });
                el.addEventListener('mouseleave', () => {
                    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1.1, 0.45)" });
                });
            });

            // Fluid cursor follower expansion on interactive elements
            const hoverTargets = document.querySelectorAll('a, button, .feature-tab-btn, .gateway-method-card, [data-tilt]');
            hoverTargets.forEach(el => {
                el.addEventListener('mouseenter', () => follower.classList.add('is-hovering'));
                el.addEventListener('mouseleave', () => follower.classList.remove('is-hovering'));
            });
        }

        function initPreloader() {
            updateThemeIcon();

            const overlay = document.getElementById('preloader-overlay');
            if (!overlay) return;

            // Safe fallback to prevent preloader freezing
            const failsafe = setTimeout(() => {
                document.body.style.overflow = '';
                if (overlay) overlay.style.display = 'none';
                initKineticRibbon();
                initSmoothScroll();
                initMagneticCursor();
                initNumberCounters();
                initKineticTypography();
                initScrollReveal();
                initParallaxLayers();
                init3DCards();
                initFeaturesCarousel();
                initWhyDorfieCarousel();
                capyCompanion.init();
            }, 2600);

            if (isReducedMotion) {
                clearTimeout(failsafe);
                overlay.style.display = 'none';
                initKineticRibbon();
                initSmoothScroll();
                initMagneticCursor();
                initNumberCounters();
                initKineticTypography();
                initScrollReveal();
                init3DCards();
                initFeaturesCarousel();
                initWhyDorfieCarousel();
                capyCompanion.init();
                return;
            }

            const counterEl = document.getElementById('loader-counter');
            const lineFill = document.getElementById('loader-line-fill');
            const circleProgress = document.getElementById('loader-circle-progress');
            const shutterPath = document.getElementById('shutter-path');
            const boltIcon = document.querySelector('.loader-bolt');

            document.body.style.overflow = 'hidden';

            const preloaderTl = gsap.timeline({
                onComplete: () => {
                    clearTimeout(failsafe);
                    document.body.style.overflow = '';
                    overlay.style.display = 'none';
                    initKineticRibbon();
                    initSmoothScroll();
                    initMagneticCursor();
                    initNumberCounters();
                    initKineticTypography();
                    initScrollReveal();
                    initParallaxLayers();
                    init3DCards();
                    initFeaturesCarousel();
                    initWhyDorfieCarousel();
                    capyCompanion.init();
                    const activeRoleBtn = document.querySelector('.feature-tab-btn.active');
                    if (activeRoleBtn) updateRoleGlider(activeRoleBtn, false);
                    const activePricingBtn = document.querySelector('.pricing-audience-btn.active');
                    if (activePricingBtn) updatePricingGlider(activePricingBtn, false);
                }
            });

            preloaderTl.to(boltIcon, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.7)" });

            const counterState = { val: 0 };
            preloaderTl.to(counterState, {
                val: 100,
                duration: 1.1,
                ease: "power2.inOut",
                onUpdate: () => {
                    const currentVal = Math.round(counterState.val);
                    if (counterEl) counterEl.textContent = currentVal < 10 ? `0${currentVal}` : currentVal;
                    if (lineFill) lineFill.style.width = `${currentVal}%`;
                    if (circleProgress) circleProgress.strokeDashoffset = 276 - (currentVal / 100) * 276;
                }
            });

            preloaderTl.to(['.loader-logo-svg', '#loader-wordmark', '#loader-tagline', '#loader-line-fill'], {
                scale: 0.92,
                opacity: 0,
                duration: 0.25,
                stagger: 0.03
            });

            preloaderTl.to(shutterPath, {
                attr: { d: "M 0 100 V 50 Q 50 0 100 50 V 100 z" },
                duration: 0.3,
                ease: "power2.in"
            });
            preloaderTl.to(shutterPath, {
                attr: { d: "M 0 0 V 0 Q 50 0 100 0 V 0 z" },
                duration: 0.35,
                ease: "power4.out"
            });

            preloaderTl.to(overlay, {
                yPercent: -100,
                duration: 0.5,
                ease: "power3.inOut"
            }, "-=0.5");
        }

        function initSubscriptionCards() {
            renderPricingCards();
            const activePricingBtn = document.querySelector('.pricing-audience-btn.active');
            if (activePricingBtn) updatePricingGlider(activePricingBtn, false);
            const wrappers = document.querySelectorAll("#pricing .card-wrapper");
            if (!wrappers.length) return;

            wrappers.forEach((wrapper, index) => {
                const card = wrapper.querySelector(".card");
                if (!card) return;

                wrapper.addEventListener("mousemove", (e) => {
                    const rect = wrapper.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = ((y - centerY) / centerY) * -11;
                    const rotateY = ((x - centerX) / centerX) * 11;
                    if (window.gsap) {
                        gsap.to(card, {
                            rotateX: rotateX,
                            rotateY: rotateY,
                            scale: 1.02,
                            duration: 0.5,
                            ease: "power2.out"
                        });
                    }
                });

                wrapper.addEventListener("mouseleave", () => {
                    if (window.gsap) {
                        gsap.to(card, {
                            rotateX: 0,
                            rotateY: 0,
                            scale: 1,
                            duration: 0.6,
                            ease: "power2.out"
                        });
                    }
                });
            });
        }

        window.addEventListener('DOMContentLoaded', () => {
            initKineticRibbon();
            initPreloader();
            appRouter.init();
            initFeaturesCarousel();
            initWhyDorfieCarousel();
            initSubscriptionCards();
            setTimeout(() => {
                const activeRoleBtn = document.querySelector('.feature-tab-btn.active');
                if (activeRoleBtn) updateRoleGlider(activeRoleBtn, false);
                const activePricingBtn = document.querySelector('.pricing-audience-btn.active');
                if (activePricingBtn) updatePricingGlider(activePricingBtn, false);
            }, 60);
        });
        window.addEventListener('resize', () => {
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
            const activeRoleBtn = document.querySelector('.feature-tab-btn.active');
            if (activeRoleBtn) updateRoleGlider(activeRoleBtn, false);
            const activePricingBtn = document.querySelector('.pricing-audience-btn.active');
            if (activePricingBtn) updatePricingGlider(activePricingBtn, false);
        });

        // Expose global handlers & interfaces for seamless inline HTML handler integration
        if (typeof window !== 'undefined') {
            window.appRouter = appRouter;
            window.openAuth = (mode) => appRouter.openAuth(mode);
            window.capyCompanion = capyCompanion;
            window.closeInvoiceModal = closeInvoiceModal;
            window.handleAuthSubmit = handleAuthSubmit;
            window.dorfieQuickAuth = dorfieQuickAuth;
            window.handlePasswordStrength = handlePasswordStrength;
            window.openDownloadNotice = openDownloadNotice;
            window.scrollToTop = scrollToTop;
            window.switchTab = switchTab;
            window.toggleBilling = toggleBilling;
            window.switchPricingAudience = switchPricingAudience;
            window.updatePricingGlider = updatePricingGlider;
            window.renderPricingCards = renderPricingCards;
            window.openPolicyModal = openPolicyModal;
            window.closePolicyModal = closePolicyModal;
            window.switchPolicyTab = switchPolicyTab;
            window.handleDemoSubmit = handleDemoSubmit;
            window.handleNewsletterSubmit = handleNewsletterSubmit;
            window.toggleColorMode = toggleColorMode;
            window.toggleMobileNav = toggleMobileNav;
            window.togglePasswordVisibility = togglePasswordVisibility;
            window.initFeaturesCarousel = initFeaturesCarousel;
            window.initWhyDorfieCarousel = initWhyDorfieCarousel;
            try {
                Object.defineProperty(window, 'isAnnualPricing', {
                    get: () => isAnnualPricing,
                    set: (val) => { isAnnualPricing = val; },
                    configurable: true
                });
            } catch (e) {
                window.isAnnualPricing = isAnnualPricing;
            }
        }

