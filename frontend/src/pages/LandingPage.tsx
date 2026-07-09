import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { BookOpen, Zap, Award, Users, ArrowRight, Brain, TrendingUp, Shield, Star, Play } from 'lucide-react';
import './LandingPage.css';

const features = [
  { icon: <Brain size={26} />, title: 'AI-Powered Learning', desc: 'Personalized paths built by your own AI assistant that adapts to your pace.', color: '#8b5cf6' },
  { icon: <TrendingUp size={26} />, title: 'Track Your Progress', desc: 'Visual dashboards with streak tracking and completion analytics.', color: '#06b6d4' },
  { icon: <Award size={26} />, title: 'Earn Certifications', desc: 'Pass final quizzes to unlock course certificates and prove your expertise.', color: '#10b981' },
  { icon: <Shield size={26} />, title: 'Structured Curriculum', desc: 'Expert-curated courses in AI, Machine Learning, Data Science, and Dev.', color: '#f59e0b' },
  { icon: <Zap size={26} />, title: 'Micro-Lessons', desc: 'Bite-sized video lessons with full documentation — learn at your own pace.', color: '#ef4444' },
  { icon: <Users size={26} />, title: 'Community Driven', desc: 'Join hundreds of learners on shared journeys, competing on streaks.', color: '#8b5cf6' },
];

const stats = [
  { value: '50+', label: 'Expert Courses', color: 'from-blue-500 to-indigo-500' },
  { value: '10K+', label: 'Learners Guided', color: 'from-purple-500 to-pink-500' },
  { value: '95%', label: 'Completion Rate', color: 'from-emerald-500 to-teal-500' },
  { value: '4.9★', label: 'Avg. Rating', color: 'from-amber-500 to-orange-500' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'ML Engineer @ Google', avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=8b5cf6&color=fff', text: 'BrainPath transformed how I learn. The AI assistant is like having a personal tutor at 3am.', stars: 5 },
  { name: 'James Rivera', role: 'Full Stack Dev', avatar: 'https://ui-avatars.com/api/?name=James+Rivera&background=06b6d4&color=fff', text: 'Streak tracking kept me accountable. Finished 3 courses in a month — never done that before!', stars: 5 },
  { name: 'Priya Patel', role: 'Data Scientist', avatar: 'https://ui-avatars.com/api/?name=Priya+Patel&background=10b981&color=fff', text: 'The quiz system is brilliant. It actually tests deep understanding, not just memorization.', stars: 5 },
];

const sectionsList = [
  { id: 'hero', title: 'Start' },
  { id: 'stats', title: 'Impact' },
  { id: 'features', title: 'Features' },
  { id: 'testimonials', title: 'Stories' }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTweenRef = useRef<any>(null);
  const mmRef = useRef<any>(null);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    // Enable scroll and remove body perspective for GSAP pinning
    document.body.classList.add('landing-page-active');

    // Run layout calculations after a small delay to let DOM size correctly
    const timer = setTimeout(() => {
      const gsap = (window as any).gsap;
      const ScrollTrigger = (window as any).ScrollTrigger;

      if (!gsap || !ScrollTrigger) {
        console.warn("GSAP or ScrollTrigger not loaded via CDN. Falling back to static styles.");
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();
      mmRef.current = mm;

      // Desktop Media Query (width >= 1024px)
      mm.add("(min-width: 1024px)", () => {
        const wrapper = wrapperRef.current;
        const container = containerRef.current;
        if (!wrapper || !container) return;

        const sections = gsap.utils.toArray(".horizontal-section");
        
        // Translate the container directly for smoother horizontal scroll
        const pin = gsap.to(container, {
          x: () => -(container.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            pin: true,
            scrub: 0.5,
            invalidateOnRefresh: true,
            snap: {
              snapTo: 1 / (sections.length - 1),
              duration: { min: 0.2, max: 0.5 },
              delay: 0.3,
              ease: "power2.out"
            },
            // Scroll length proportional to container scroll width minus viewport width
            end: () => `+=${container.scrollWidth - window.innerWidth}`,
            onUpdate: (self: any) => {
              setActiveSection(Math.round(self.progress * (sections.length - 1)));
            }
          }
        });

        scrollTweenRef.current = pin;

        // Parallax on Huge Outline Text
        gsap.to(".huge-text", {
          x: -250,
          scrollTrigger: {
            trigger: wrapper,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5
          }
        });
      });

      // Mobile/Tablet Media Query (width < 1024px)
      mm.add("(max-width: 1023px)", () => {
        const handleScroll = () => {
          const scrollPos = window.scrollY + window.innerHeight / 3;
          const elements = document.querySelectorAll(".horizontal-section");
          elements.forEach((el: any, idx) => {
            if (scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
              setActiveSection(idx);
            }
          });
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
      });
    }, 150);

    return () => {
      document.body.classList.remove('landing-page-active');
      clearTimeout(timer);
      if (mmRef.current) {
        mmRef.current.revert();
      }
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 50);
    };
  }, []);

  const scrollToSection = (idx: number) => {
    if (window.innerWidth >= 1024 && scrollTweenRef.current && scrollTweenRef.current.scrollTrigger) {
      const trigger = scrollTweenRef.current.scrollTrigger;
      const start = trigger.start;
      const end = trigger.end;
      const distance = end - start;
      const targetScroll = start + (idx / (sectionsList.length - 1)) * distance;
      
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    } else {
      // Mobile vertical scroll
      const elements = document.querySelectorAll(".horizontal-section");
      const target = elements[idx] as HTMLElement;
      if (target) {
        window.scrollTo({
          top: target.offsetTop,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <div className="landing-root">
      {/* Background decoration */}
      <div className="landing-bg-orb orb-1" />
      <div className="landing-bg-orb orb-2" />
      <div className="landing-bg-orb orb-3" />
      <div className="landing-grid" />

      {/* Top Floating Actions Bar */}
      <div className="landing-top-actions">
        <button className="landing-action-link" onClick={() => navigate('/login')}>Sign In</button>
        <button className="landing-action-cta" onClick={() => navigate('/register')}>Get Started Free</button>
      </div>

      {/* Left Sidebar Nav */}
      <nav className="landing-sidebar">
        <div className="sidebar-brand">BRAINPATH</div>
        <div className="sidebar-dots">
          {sectionsList.map((sec, idx) => (
            <button
              key={sec.id}
              className={`sidebar-dot ${activeSection === idx ? 'active' : ''}`}
              onClick={() => scrollToSection(idx)}
              aria-label={`Go to section ${sec.title}`}
            >
              <span className="dot-tooltip">{sec.title}</span>
            </button>
          ))}
        </div>
        {/* Dynamic Scrolling Heading */}
        <div className="sidebar-scroll-cue dynamic-cue" key={activeSection}>
          <span className="cue-number">{String(activeSection + 1).padStart(2, '0')}</span>
          <span className="cue-divider">//</span>
          <span className="cue-text">{sectionsList[activeSection].title.toUpperCase()}</span>
        </div>
      </nav>

      {/* Horizontal Scroll Wrapper */}
      <div className="horizontal-scroll-wrapper" ref={wrapperRef}>
        {/* Horizontal Slides Container */}
        <div className="horizontal-container" id="main-scroll" ref={containerRef}>
        
        {/* SLIDE 1: HERO */}
        <section className="horizontal-section" id="hero-slide">
          <h1 className="huge-text absolute select-none">LEARN</h1>
          
          <div className="slide-content hero-content-wrapper">
            <div className="hero-text-side">
              <div className="landing-badge">
                <Zap size={14} className="landing-badge-icon" />
                AI-Powered Learning Platform
              </div>
              <h1 className="hero-main-title">
                Master New Skills <br />
                <span className="hero-gradient-text">At Warp Speed</span>
              </h1>
              <p className="hero-description">
                Your personal AI tutor, structured courses, streak tracking, and certifications — all in one immersive learning universe.
              </p>
              <div className="hero-actions-row">
                <button className="hero-btn-primary" onClick={() => navigate('/register')}>
                  Start Learning Free <ArrowRight size={18} />
                </button>
                <button className="hero-btn-secondary" onClick={() => navigate('/login')}>
                  <Play size={16} fill="currentColor" /> See a Demo
                </button>
              </div>
            </div>

            {/* Dashboard Mockup centerpiece */}
            <div className="hero-mockup-side">
              <div className="mockup-card-container">
                <div className="mockup-header">
                  <div className="mockup-avatar">🧠</div>
                  <div>
                    <div className="mockup-name">Your Dashboard</div>
                    <div className="mockup-sub">Learning in progress</div>
                  </div>
                  <div className="mockup-streak">🔥 21 day streak</div>
                </div>
                
                <div className="mockup-progress-list">
                  <div className="mockup-progress-item">
                    <div className="mockup-prog-name">Machine Learning</div>
                    <div className="mockup-prog-track">
                      <div className="mockup-prog-fill purple" style={{ width: '72%' }} />
                    </div>
                    <div className="mockup-prog-val">72%</div>
                  </div>
                  
                  <div className="mockup-progress-item">
                    <div className="mockup-prog-name">AI Fundamentals</div>
                    <div className="mockup-prog-track">
                      <div className="mockup-prog-fill green" style={{ width: '100%' }} />
                    </div>
                    <div className="mockup-prog-val">✓</div>
                  </div>
                  
                  <div className="mockup-progress-item">
                    <div className="mockup-prog-name">Web Development</div>
                    <div className="mockup-prog-track">
                      <div className="mockup-prog-fill amber" style={{ width: '38%' }} />
                    </div>
                    <div className="mockup-prog-val">38%</div>
                  </div>
                </div>

                <div className="mockup-footer-chip">
                  <span className="mockup-pulse-dot" />
                  AI Assistant ready — Ask me anything
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 2: STATS */}
        <section className="horizontal-section bg-zinc-950/40" id="stats-slide">
          <h1 className="huge-text absolute select-none">IMPACT</h1>
          
          <div className="slide-content stats-content-wrapper">
            <div className="stats-heading-side">
              <h2 className="stats-main-heading">
                Breaking <br />
                <span className="text-highlight">Boundaries.</span>
              </h2>
              <p className="stats-sub-text">
                We bridge the gap between structure and intelligence. Our platform ensures that every dedicated learner achieves mastery on their own schedule.
              </p>
            </div>

            <div className="stats-grid-side">
              {stats.map((s, idx) => (
                <div key={idx} className="glass-stat-card">
                  <span className={`stat-val-gradient bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
                    {s.value}
                  </span>
                  <span className="stat-label-text">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SLIDE 3: FEATURES */}
        <section className="horizontal-section" id="features-slide">
          <h1 className="huge-text absolute select-none">FEATURES</h1>
          
          <div className="slide-content features-content-wrapper">
            <div className="features-section-header">
              <div className="landing-badge">
                <BookOpen size={12} /> Everything You Need
              </div>
              <h2 className="features-title">Built for Serious Learners</h2>
            </div>

            <div className="features-grid">
              {features.map((f, i) => (
                <div key={i} className="glass-feature-card">
                  <div className="feature-icon-wrapper" style={{ background: `${f.color}15`, color: f.color }}>
                    {f.icon}
                  </div>
                  <h3 className="feature-card-title">{f.title}</h3>
                  <p className="feature-card-desc">{f.desc}</p>
                  <div className="feature-accent-line" style={{ background: `linear-gradient(90deg, ${f.color}, transparent)` }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SLIDE 4: STORIES & CTA */}
        <section className="horizontal-section bg-zinc-950/40" id="stories-slide">
          <h1 className="huge-text absolute select-none">FUTURE</h1>
          
          <div className="slide-content stories-content-wrapper">
            <div className="stories-section-header">
              <div className="landing-badge">
                <Star size={12} fill="#f59e0b" color="#f59e0b" /> Learner Stories
              </div>
              <h2 className="stories-title">Loved By Thousands</h2>
            </div>

            {/* Testimonials Grid */}
            <div className="testimonials-grid">
              {testimonials.map((t, idx) => (
                <div key={idx} className="glass-testimonial-card">
                  <div className="stars-row">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <p className="testimonial-quote">"{t.text}"</p>
                  <div className="testimonial-author">
                    <img src={t.avatar} alt={t.name} className="author-avatar" />
                    <div>
                      <div className="author-name">{t.name}</div>
                      <div className="author-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Call to Action and Footer in the final scroll pane */}
            <div className="final-cta-footer-band">
              <div className="cta-band-content">
                <h3 className="cta-band-title">Ready to Level Up?</h3>
                <p className="cta-band-sub">Join thousands of learners transforming their careers with BrainPath.</p>
                <div className="cta-buttons-row">
                  <button className="cta-btn-primary" onClick={() => navigate('/register')}>
                    Create Free Account <ArrowRight size={18} />
                  </button>
                  <button className="cta-btn-secondary" onClick={() => navigate('/login')}>
                    Sign In
                  </button>
                </div>
              </div>
              
              <footer className="landing-footer-sub">
                <div className="footer-brand-logo">
                  <span>🧠</span>
                  <span>BrainPath</span>
                </div>
                <p className="footer-copy-text">© 2026 BrainPath. Empowering minds, one lesson at a time.</p>
              </footer>
            </div>

          </div>
        </section>

      </div>
    </div>
  </div>
  );
}

