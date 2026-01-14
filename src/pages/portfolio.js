import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, Linkedin, Github, ExternalLink, Code, Briefcase, Award, GraduationCap, ChevronRight, Menu, X, Sparkles, Rocket, Users, Zap, Terminal, Layers, TrendingUp, Star, ArrowUpRight, Circle, Send } from 'lucide-react';

const Portfolio = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  const [selectedProject, setSelectedProject] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ['home', 'about', 'experience', 'projects', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const projects = [
    {
      name: "Faiz ul Mawaid",
      tech: ["Laravel", "SCSS", "HTML5"],
      url: "https://erp.faizulmawaid.lk",
      desc: "Enterprise ERP system supporting global meal distribution operations for the Dawoodi Bohra community.",
      gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
      icon: "🍽️"
    },
    {
      name: "Fakhri Fabrics",
      tech: ["Laravel", "SCSS", "HTML5"],
      url: "https://fakhrifabrics.com/",
      desc: "Premium men's fabric and tailoring platform focused on quality craftsmanship and seamless UX.",
      gradient: "from-blue-600 via-cyan-600 to-teal-600",
      icon: "👔"
    },
    {
      name: "Oreo x Monopoly",
      tech: ["React", "Next.js", "SCSS"],
      url: "https://oreopakistan.com/",
      desc: "High-engagement marketing campaign enabling users to scan products and participate in promotional draws.",
      gradient: "from-orange-600 via-red-600 to-pink-600",
      icon: "🎮"
    },
    {
      name: "Afridi Trading",
      tech: ["Laravel", "React", "Next.js"],
      url: "https://www.afriditrading.com/",
      desc: "End-to-end automobile trading platform with customer registration, agent workflows, and deal management.",
      gradient: "from-emerald-600 via-green-600 to-teal-600",
      icon: "🚗"
    },
    {
      name: "SBT Japan",
      tech: ["PHP", "jQuery", "SCSS"],
      url: "https://www.sbtjapan.com/",
      desc: "One of the world's leading automobile trading platforms.",
      gradient: "from-indigo-600 via-purple-600 to-pink-600",
      icon: "🏎️"
    },
    {
      name: "MST Japan",
      tech: ["React", "Next.js", "SCSS"],
      url: "https://www.mstjapan.com/",
      desc: "Automobile export platform backed by Shah International Trading Group.",
      gradient: "from-pink-600 via-rose-600 to-red-600",
      icon: "🌏"
    }
  ];

  const experiences = [
    {
      title: "Full Stack Developer",
      company: "Idea2Solution",
      period: "Feb 2024 – Present",
      icon: Rocket,
      color: "from-violet-500 to-purple-500",
      highlights: [
        "Design secure, scalable web solutions using Laravel and modern frameworks",
        "Optimize front-end performance through code splitting and state management",
        "Lead technical planning and solution design discussions"
      ]
    },
    {
      title: "Team Lead – Front End",
      company: "HUL Hub",
      period: "Nov 2022 – Jan 2024",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      highlights: [
        "Managed front-end engineering team across multiple projects",
        "Defined coding standards and best practices",
        "Mentored developers through code reviews and technical guidance"
      ]
    },
    {
      title: "Senior UI/UX Developer",
      company: "SBT Japan",
      period: "Dec 2019 – Oct 2022",
      icon: Zap,
      color: "from-pink-500 to-rose-500",
      highlights: [
        "Engineered high-traffic web interfaces for global automobile platform",
        "Developed robust HTML-to-PDF solutions for automated documentation",
        "Delivered responsive email templates for marketing and transactions"
      ]
    }
  ];

  const skills = [
    { name: "React.js", level: 95, icon: "⚛️" },
    { name: "Next.js", level: 90, icon: "▲" },
    { name: "JavaScript", level: 95, icon: "JS" },
    { name: "Laravel", level: 80, icon: "🔧" },
    { name: "HTML/CSS", level: 98, icon: "🎨" },
    { name: "Vue.js", level: 85, icon: "💚" }
  ];

  const stats = [
    { label: "Years Experience", value: "6.5+", icon: TrendingUp },
    { label: "Projects Delivered", value: "15+", icon: Briefcase },
    { label: "Happy Clients", value: "10+", icon: Star },
    { label: "Code Commits", value: "5000+", icon: Terminal }
  ];

  return (
    <div className="bg-black text-white min-h-screen relative overflow-hidden">
      
      {/* Custom Cursor */}
      <div 
        className="fixed w-4 h-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full pointer-events-none z-50 mix-blend-difference transition-all duration-100"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)',
          opacity: cursorVariant === 'hover' ? 0.5 : 1,
          scale: cursorVariant === 'hover' ? 2 : 1
        }}
      ></div>

      {/* Animated Grid Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-violet-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-fuchsia-500/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-1/4 left-1/3 w-1/2 h-1/2 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed w-full z-40 transition-all duration-500 ${scrolled ? 'bg-black/50 backdrop-blur-2xl border-b border-white/10' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold relative group">
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                MA.
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-400 to-fuchsia-400 group-hover:w-full transition-all duration-300"></div>
            </div>
            
            <div className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-xl rounded-full px-2 py-2 border border-white/10">
              {['home', 'about', 'experience', 'projects', 'contact'].map(section => (
                <a
                  key={section}
                  href={`#${section}`}
                  className={`capitalize px-6 py-2 rounded-full transition-all duration-300 ${
                    activeSection === section 
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/50' 
                      : 'hover:bg-white/10'
                  }`}
                >
                  {section}
                </a>
              ))}
            </div>

            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="md:hidden relative w-10 h-10 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 flex items-center justify-center"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-500 overflow-hidden ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-black/95 backdrop-blur-2xl border-t border-white/10">
            <div className="px-6 py-6 space-y-2">
              {['home', 'about', 'experience', 'projects', 'contact'].map(section => (
                <a
                  key={section}
                  href={`#${section}`}
                  onClick={() => setMenuOpen(false)}
                  className={`block capitalize px-6 py-3 rounded-xl transition-all ${
                    activeSection === section 
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600' 
                      : 'hover:bg-white/5'
                  }`}
                >
                  {section}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative pt-20" ref={heroRef}>
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-block">
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl rounded-full px-6 py-3 border border-white/10">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-white/60">Available for work</span>
                </div>
              </div>

              <div>
                <h1 className="text-7xl lg:text-8xl font-black mb-4 leading-none">
                  <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                    Muhammad
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                    Amin Husaini
                  </span>
                </h1>
                <div className="flex flex-wrap gap-3 text-lg text-white/60 mb-6">
                  <span className="px-4 py-2 bg-white/5 rounded-full border border-white/10">Senior UI/UX Engineer</span>
                  <span className="px-4 py-2 bg-white/5 rounded-full border border-white/10">Team Lead</span>
                  <span className="px-4 py-2 bg-white/5 rounded-full border border-white/10">Full-Stack Dev</span>
                </div>
              </div>

              <p className="text-xl text-white/60 leading-relaxed max-w-xl">
                Architecting enterprise-grade digital experiences with cutting-edge technologies. Transforming complex challenges into elegant solutions for 6.5+ years.
              </p>

              <div className="flex gap-4 flex-wrap">
                <a 
                  href="#projects" 
                  className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-semibold overflow-hidden shadow-lg shadow-violet-500/50 hover:shadow-violet-500/80 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    View Projects
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </a>
                <a 
                  href="#contact" 
                  className="px-8 py-4 bg-white/5 backdrop-blur-xl rounded-2xl font-semibold border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  Get In Touch
                </a>
              </div>

              <div className="flex gap-4 pt-4">
                {[
                  { icon: Mail, href: "mailto:aminasghar5@gmail.com" },
                  { icon: Linkedin, href: "https://linkedin.com/in/amin-hussaini" },
                  { icon: Github, href: "https://github.com/AminHussaini" }
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 flex items-center justify-center hover:bg-gradient-to-r hover:from-violet-600 hover:to-fuchsia-600 hover:border-transparent transition-all duration-300 hover:scale-110"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div className={`grid grid-cols-2 gap-4 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {stats.map((stat, idx) => (
                <div 
                  key={idx}
                  className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-violet-500/50 transition-all duration-500 hover:scale-105"
                  style={{animationDelay: `${idx * 100}ms`}}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <stat.icon className="w-8 h-8 text-violet-400 mb-4 group-hover:scale-110 transition-transform" />
                  <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="text-sm uppercase tracking-widest text-violet-400 font-semibold">About Me</span>
            </div>
            <h2 className="text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                Crafting Digital Excellence
              </span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              <p className="text-xl text-white/80 leading-relaxed">
                I'm a <span className="text-violet-400 font-semibold">passionate developer</span> who transforms complex business requirements into intuitive digital experiences. With expertise in modern JavaScript frameworks and a strong foundation in Laravel, I bridge the gap between design and functionality.
              </p>
              <p className="text-xl text-white/80 leading-relaxed">
                My approach combines <span className="text-fuchsia-400 font-semibold">aesthetic excellence</span> with technical robustness, consistently delivering high-impact solutions that serve thousands of users globally.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative bg-black/50 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                    <Briefcase className="w-10 h-10 text-violet-400 mb-4" />
                    <div className="text-5xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-2">
                      6.5+
                    </div>
                    <div className="text-white/60">Years Experience</div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative bg-black/50 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                    <Star className="w-10 h-10 text-cyan-400 mb-4" />
                    <div className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                      15+
                    </div>
                    <div className="text-white/60">Projects Delivered</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {skills.map((skill, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{skill.icon}</span>
                      <span className="text-lg font-semibold text-white group-hover:text-violet-400 transition-colors">
                        {skill.name}
                      </span>
                    </div>
                    <span className="text-violet-400 font-mono font-bold">{skill.level}%</span>
                  </div>
                  <div className="relative h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${skill.level}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="text-sm uppercase tracking-widest text-violet-400 font-semibold">Career Journey</span>
            </div>
            <h2 className="text-6xl font-black">
              <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                Professional Experience
              </span>
            </h2>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-600 via-fuchsia-600 to-cyan-600 hidden lg:block"></div>

            <div className="space-y-12">
              {experiences.map((exp, idx) => (
                <div 
                  key={idx}
                  className="group relative lg:pl-24"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-0 top-8 hidden lg:block">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center rotate-45 group-hover:rotate-90 transition-transform duration-500">
                        <exp.icon className="w-8 h-8 -rotate-45 group-hover:-rotate-90 transition-transform duration-500" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl blur-xl opacity-50"></div>
                    </div>
                  </div>

                  <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/10 hover:border-violet-500/50 transition-all duration-500 group-hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
                        <div>
                          <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                            {exp.title}
                          </h3>
                          <p className={`text-xl font-semibold bg-gradient-to-r ${exp.color} bg-clip-text text-transparent`}>
                            {exp.company}
                          </p>
                        </div>
                        <span className="px-5 py-2 bg-white/5 backdrop-blur-xl rounded-full text-sm border border-white/10 font-mono">
                          {exp.period}
                        </span>
                      </div>
                      
                      <ul className="space-y-3">
                        {exp.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-start gap-4 text-white/70 text-lg">
                            <div className="w-2 h-2 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="group-hover:text-white/90 transition-colors">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="text-sm uppercase tracking-widest text-violet-400 font-semibold">Portfolio</span>
            </div>
            <h2 className="text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                Featured Projects
              </span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Explore my latest work across enterprise solutions, e-commerce platforms, and marketing campaigns
            </p>
          </div>

          {/* Featured Project Showcase */}
          <div className="mb-16">
            <div className="relative group bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 hover:border-violet-500/50 transition-all duration-500">
              <div className={`absolute inset-0 bg-gradient-to-br ${projects[selectedProject].gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
              
              <div className="relative z-10 p-12 lg:p-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <div className="text-7xl mb-6">{projects[selectedProject].icon}</div>
                    <h3 className="text-5xl font-black bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                      {projects[selectedProject].name}
                    </h3>
                    <p className="text-xl text-white/70 leading-relaxed">
                      {projects[selectedProject].desc}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {projects[selectedProject].tech.map((tech, i) => (
                        <span key={i} className="px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full text-sm border border-white/10">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <a
                      href={projects[selectedProject].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-semibold hover:scale-105 transition-transform duration-300 shadow-lg shadow-violet-500/50"
                    >
                      View Live Project
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {projects.map((project, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedProject(idx)}
                        className={`aspect-square rounded-2xl p-6 flex items-center justify-center text-4xl transition-all duration-300 border-2 ${
                          selectedProject === idx
                            ? 'bg-white/10 border-violet-500 scale-110'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {project.icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* All Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <div
                key={idx}
                className="group relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 hover:border-violet-500/50 transition-all duration-500 hover:scale-105"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                
                <div className="relative z-10 p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-5xl">{project.icon}</div>
                    <a 
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center hover:bg-gradient-to-r hover:from-violet-600 hover:to-fuchsia-600 transition-all duration-300"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                  
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    {project.name}
                  </h3>
                  
                  <p className="text-white/60 text-sm leading-relaxed">{project.desc}</p>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tech.map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-xs border border-white/10">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
      </section>
    </div>
    
  )
};
export default Portfolio;