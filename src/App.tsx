import { useState, useEffect, useRef, FormEvent } from 'react';

// ============ TYPES ============
interface Profile {
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  skills: string[];
  profilePic?: string;
}

interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  desc: string;
  tags: string[];
}

interface Education {
  id: number;
  degree: string;
  school: string;
  period: string;
}

interface Project {
  id: number;
  title: string;
  desc: string;
  tech: string[];
  github: string;
  live: string;
  image?: string;
}

interface Certificate {
  id: number;
  name: string;
  issuer: string;
  date: string;
  icon: string;
}

interface GalleryItem {
  id: number;
  url: string;
  caption: string;
}

interface Research {
  id: number;
  title: string;
  abstract: string;
  type: string;
  year: string;
  url: string;
}

interface Social {
  id: number;
  name: string;
  url: string;
}

interface AppData {
  profile: Profile;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certificates: Certificate[];
  gallery: GalleryItem[];
  research: Research[];
  social: Social[];
  password: string;
}

// ============ DEFAULT DATA ============
const DEFAULT_DATA: AppData = {
  profile: {
    name: "Atahar Hossain",
    title: "Cybersecurity & System Admin",
    subtitle: "Specialized in Network Security & Infrastructure Optimization",
    bio: "Strategic CTO & Co-founder of a technical training institute and CSE Graduate with a focus on high-level Information Management and Cybersecurity. Proven leadership in designing technical curriculums, managing organizational data assets, and implementing secure system infrastructures. Expert in data integrity and capacity building, with a unique ability to bridge the gap between complex technology and field-level operations.",
    location: "Chattogram, Bangladesh (Open to Relocate)",
    email: "atahar8080@gmail.com",
    phone: "+8801610840910",
    skills: ["Strategic IT Planning", "Database Architecture", "Data Governance", "Advanced MS Excel", "Python Automation", "Cybersecurity Strategy", "Data Privacy (DPISP)", "Linux Server Admin", "Virtualization", "Disaster Recovery", "Team Leadership", "Curriculum Dev", "Technical Documentation", "Network Engineering"],
    profilePic: ""
  },
  experience: [
    { id: 1, title: "Co-founder & CTO", company: "Hacknfix", period: "Jan 2025 – Present", desc: "Architected secure server infrastructures and database systems. Managed institutional data assets ensuring 100% accuracy. Led delivery of 100+ hours of advanced training in System Admin and Cybersecurity.", tags: ["Proxmox", "Server Infrastructure", "Data Protection", "Cybersecurity"] },
    { id: 2, title: "Lead Technical Trainer", company: "Hacknfix", period: "Jan 2024 – Present", desc: "Designed and delivered 100+ hours of training on Linux Server Management, Virtualization, and Network Engineering. Conducted hands-on labs for Mikrotik and Cisco router configuration.", tags: ["Linux", "VMware", "Proxmox", "Mikrotik", "Cisco", "VLAN"] },
    { id: 3, title: "Cybersecurity Intern", company: "Brain Machine", period: "May 2025 – Nov 2025", desc: "Implemented data privacy protocols and conducted security audits. Performed deep data analysis on system logs to identify unauthorized access patterns. Developed social engineering defense documentation.", tags: ["Security Audits", "Vulnerability Management", "Log Analysis", "Social Engineering"] }
  ],
  education: [
    { id: 1, degree: "BSc in Computer Science & Engineering", school: "University of Science and Technology Chittagong (USTC)", period: "Jan 2022 – Jan 2025" },
    { id: 2, degree: "Higher Secondary Certificate (Science)", school: "Chattogram Biggan College", period: "2020" },
    { id: 3, degree: "Secondary School Certificate (Science)", school: "Ispahani Adarsha High School", period: "2017" }
  ],
  projects: [],
  certificates: [
    { id: 1, name: "Google Cybersecurity Professional Certificate", issuer: "Google / Coursera", date: "2024", icon: "🛡️" },
    { id: 2, name: "Android Bug Bounty Hunting", issuer: "EC-Council", date: "2024", icon: "🐛" }
  ],
  gallery: [],
  research: [],
  social: [
    { id: 1, name: "LinkedIn", url: "https://www.linkedin.com/in/atahar-hossain-/" },
  ],
  password: "Atahar@2025"
};

export default function App() {
  const [data, setData] = useState<AppData>(() => {
    const stored = localStorage.getItem('atahar_portfolio_data');
    return stored ? JSON.parse(stored) : DEFAULT_DATA;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Form states for admin
  const [editExpId, setEditExpId] = useState<number | null>(null);
  const [editEduId, setEditEduId] = useState<number | null>(null);
  const [editProjId, setEditProjId] = useState<number | null>(null);
  const [editCertId, setEditCertId] = useState<number | null>(null);
  const [editGalId, setEditGalId] = useState<number | null>(null);
  const [editResId, setEditResId] = useState<number | null>(null);
  const [editSocId, setEditSocId] = useState<number | null>(null);

  // Refs for cursor
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const trailPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    localStorage.setItem('atahar_portfolio_data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    const animTrail = () => {
      trailPos.current.x += (mousePos.current.x - trailPos.current.x) * 0.18;
      trailPos.current.y += (mousePos.current.y - trailPos.current.y) * 0.18;
      if (trailRef.current) {
        trailRef.current.style.left = `${trailPos.current.x}px`;
        trailRef.current.style.top = `${trailPos.current.y}px`;
      }
      requestAnimationFrame(animTrail);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const trailAnim = requestAnimationFrame(animTrail);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(trailAnim);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => observer.observe(el));

    return () => reveals.forEach(el => observer.unobserve(el));
  }, [data]);

  const toast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLogin = () => {
    if (loginPass === data.password) {
      setIsAdmin(true);
      setShowLogin(false);
      setShowAdmin(true);
      setLoginPass('');
      setLoginError(false);
    } else {
      setLoginError(true);
      setLoginPass('');
    }
  };

  const saveProfile = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
    
    const update = (picUrl?: string) => {
      const updatedProfile: Profile = {
        name: formData.get('name') as string,
        title: formData.get('title') as string,
        subtitle: formData.get('subtitle') as string,
        bio: formData.get('bio') as string,
        location: formData.get('location') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        skills: (formData.get('skills') as string).split(',').map(s => s.trim()).filter(Boolean),
        profilePic: picUrl !== undefined ? picUrl : data.profile.profilePic
      };
      setData(prev => ({ ...prev, profile: updatedProfile }));
      toast('Profile saved!');
    };

    if (fileInput && fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        update(event.target?.result as string);
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      update();
    }
  };

  const saveExp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = editExpId || Date.now();
    const item: Experience = {
      id,
      title: formData.get('title') as string,
      company: formData.get('company') as string,
      period: formData.get('period') as string,
      desc: formData.get('desc') as string,
      tags: (formData.get('tags') as string).split(',').map(s => s.trim()).filter(Boolean)
    };
    setData(prev => {
      const experience = [...prev.experience];
      const idx = experience.findIndex(x => x.id === id);
      if (idx > -1) experience[idx] = item;
      else experience.unshift(item);
      return { ...prev, experience };
    });
    setEditExpId(null);
    e.currentTarget.reset();
    toast('Experience saved!');
  };

  const saveEdu = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = editEduId || Date.now();
    const item: Education = {
      id,
      degree: formData.get('degree') as string,
      school: formData.get('school') as string,
      period: formData.get('period') as string
    };
    setData(prev => {
      const education = [...prev.education];
      const idx = education.findIndex(x => x.id === id);
      if (idx > -1) education[idx] = item;
      else education.unshift(item);
      return { ...prev, education };
    });
    setEditEduId(null);
    e.currentTarget.reset();
    toast('Education saved!');
  };

  const saveProject = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
    const id = editProjId || Date.now();
    
    const update = (picUrl?: string) => {
      const item: Project = {
        id,
        title: formData.get('title') as string,
        desc: formData.get('desc') as string,
        tech: (formData.get('tech') as string).split(',').map(s => s.trim()).filter(Boolean),
        github: formData.get('github') as string,
        live: formData.get('live') as string,
        image: picUrl || data.projects.find(x => x.id === id)?.image
      };
      setData(prev => {
        const projects = [...prev.projects];
        const idx = projects.findIndex(x => x.id === id);
        if (idx > -1) projects[idx] = item;
        else projects.unshift(item);
        return { ...prev, projects };
      });
      setEditProjId(null);
      e.currentTarget.reset();
      toast(editProjId ? 'Project updated!' : 'Project added!');
    };

    if (fileInput && fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        update(event.target?.result as string);
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      update();
    }
  };

  const saveCert = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = editCertId || Date.now();
    const item: Certificate = {
      id,
      name: formData.get('name') as string,
      issuer: formData.get('issuer') as string,
      date: formData.get('date') as string,
      icon: (formData.get('icon') as string) || '🏆'
    };
    setData(prev => {
      const certificates = [...prev.certificates];
      const idx = certificates.findIndex(x => x.id === id);
      if (idx > -1) certificates[idx] = item;
      else certificates.unshift(item);
      return { ...prev, certificates };
    });
    setEditCertId(null);
    e.currentTarget.reset();
    toast('Certificate saved!');
  };

  const saveGallery = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
    const id = editGalId || Date.now();
    const caption = formData.get('caption') as string;
    const urlFromInput = formData.get('url') as string;

    const update = (picUrl?: string) => {
      const item: GalleryItem = {
        id,
        url: picUrl || urlFromInput,
        caption
      };
      setData(prev => {
        const gallery = [...prev.gallery];
        const idx = gallery.findIndex(x => x.id === id);
        if (idx > -1) gallery[idx] = item;
        else gallery.unshift(item);
        return { ...prev, gallery };
      });
      setEditGalId(null);
      e.currentTarget.reset();
      toast(editGalId ? 'Image updated!' : 'Image added!');
    };

    if (fileInput && fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        update(event.target?.result as string);
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      update();
    }
  };

  const saveResearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = editResId || Date.now();
    const item: Research = {
      id,
      title: formData.get('title') as string,
      abstract: formData.get('abstract') as string,
      type: formData.get('type') as string,
      year: formData.get('year') as string,
      url: formData.get('url') as string
    };
    setData(prev => {
      const research = [...prev.research];
      const idx = research.findIndex(x => x.id === id);
      if (idx > -1) research[idx] = item;
      else research.unshift(item);
      return { ...prev, research };
    });
    setEditResId(null);
    e.currentTarget.reset();
    toast('Research saved!');
  };

  const saveSocial = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = editSocId || Date.now();
    const item: Social = {
      id,
      name: formData.get('name') as string,
      url: formData.get('url') as string
    };
    setData(prev => {
      const social = [...prev.social];
      const idx = social.findIndex(x => x.id === id);
      if (idx > -1) social[idx] = item;
      else social.unshift(item);
      return { ...prev, social };
    });
    setEditSocId(null);
    e.currentTarget.reset();
    toast('Social link saved!');
  };

  const deleteItem = (key: keyof AppData, id: number) => {
    setData(prev => ({
      ...prev,
      [key]: (prev[key] as any[]).filter((item: any) => item.id !== id)
    }));
    toast('Deleted.');
  };

  const sendMessage = () => {
    const name = (document.getElementById('cf-name') as HTMLInputElement).value;
    const email = (document.getElementById('cf-email') as HTMLInputElement).value;
    const msg = (document.getElementById('cf-message') as HTMLTextAreaElement).value;
    if (!name || !email || !msg) { toast('Please fill in all fields.'); return; }
    const mailtoLink = `mailto:${data.profile.email}?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent('From: ' + name + '\nEmail: ' + email + '\n\n' + msg)}`;
    window.location.href = mailtoLink;
    toast('Opening email client...');
  };

  return (
    <div className="min-h-screen">
      <div id="cursor" ref={cursorRef}></div>
      <div id="cursor-trail" ref={trailRef}></div>
      <div className="scanline"></div>

      {/* LOGIN OVERLAY */}
      {showLogin && (
        <div id="login-overlay" style={{ display: 'flex' }}>
          <div className="login-box">
            <div className="login-title">Admin Access</div>
            <div className="login-sub">// Restricted zone — authorized personnel only</div>
            <div className="admin-form-group">
              <label className="admin-label">Password</label>
              <input
                type="password"
                className="admin-input"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter password"
              />
            </div>
            <button className="admin-btn" onClick={handleLogin}>Authenticate</button>
            {loginError && <div className="login-error" style={{ display: 'block' }}>Access denied. Invalid credentials.</div>}
            <button className="admin-close mt-4 w-full" onClick={() => setShowLogin(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* ADMIN OVERLAY */}
      {showAdmin && (
        <div id="admin-overlay" className="active">
          <div className="admin-inner">
            <div className="admin-header">
              <div className="admin-title">// Admin Dashboard</div>
              <button className="admin-close" onClick={() => setShowAdmin(false)}>✕ Close</button>
            </div>
            <div className="admin-tabs">
              {['profile', 'projects', 'certs', 'gallery', 'research', 'social'].map(tab => (
                <button
                  key={tab}
                  className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="admin-panel active">
                <form onSubmit={saveProfile} className="admin-section">
                  <div className="admin-section-title">Personal Information</div>
                  <div className="admin-grid-2">
                    <div className="admin-form-group">
                      <label className="admin-label">Full Name</label>
                      <input className="admin-input" name="name" defaultValue={data.profile.name} />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Title / Role</label>
                      <input className="admin-input" name="title" defaultValue={data.profile.title} />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Subtitle</label>
                    <input className="admin-input" name="subtitle" defaultValue={data.profile.subtitle} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Bio / Summary</label>
                    <textarea className="admin-textarea" name="bio" defaultValue={data.profile.bio}></textarea>
                  </div>
                  <div className="admin-grid-2">
                    <div className="admin-form-group">
                      <label className="admin-label">Location</label>
                      <input className="admin-input" name="location" defaultValue={data.profile.location} />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Email</label>
                      <input className="admin-input" name="email" defaultValue={data.profile.email} />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Phone</label>
                    <input className="admin-input" name="phone" defaultValue={data.profile.phone} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Profile Picture</label>
                    <div className="flex items-center gap-4 mb-2">
                      {data.profile.profilePic ? (
                        <div className="flex flex-col gap-2">
                          <img src={data.profile.profilePic} alt="Preview" className="w-16 h-16 object-cover rounded border border-accent" />
                          <button 
                            type="button" 
                            className="text-[10px] text-red-500 hover:underline"
                            onClick={() => {
                              setData(prev => ({ ...prev, profile: { ...prev.profile, profilePic: "" } }));
                              toast('Profile picture cleared!');
                            }}
                          >
                            Clear Picture
                          </button>
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-bg3 rounded border border-dashed border-accent/30 flex items-center justify-center text-[10px] text-accent/50">No Image</div>
                      )}
                      <input type="file" accept="image/*" className="admin-input" style={{ padding: '8px' }} />
                    </div>
                    <div className="text-[10px] text-accent/50">// Upload a new photo to change your profile picture</div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Skills (comma-separated)</label>
                    <textarea className="admin-textarea" name="skills" style={{ minHeight: '80px' }} defaultValue={data.profile.skills.join(', ')}></textarea>
                  </div>
                  <button type="submit" className="admin-btn">Save Profile</button>
                </form>

                <div className="admin-section">
                  <div className="admin-section-title">Experience</div>
                  <div className="admin-list">
                    {data.experience.map(exp => (
                      <div key={exp.id} className="admin-list-item">
                        <div className="admin-list-item-info">{exp.title} at {exp.company}</div>
                        <div className="admin-list-item-actions">
                          <button className="admin-btn admin-btn-sm" onClick={() => setEditExpId(exp.id)}>Edit</button>
                          <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => deleteItem('experience', exp.id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={saveExp}>
                    <div className="admin-section-title" style={{ fontSize: '0.85rem', marginTop: '10px' }}>
                      {editExpId ? 'Edit Experience' : 'Add Experience'}
                    </div>
                    <div className="admin-grid-2">
                      <div className="admin-form-group">
                        <label className="admin-label">Job Title</label>
                        <input className="admin-input" name="title" defaultValue={data.experience.find(x => x.id === editExpId)?.title || ''} />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-label">Company</label>
                        <input className="admin-input" name="company" defaultValue={data.experience.find(x => x.id === editExpId)?.company || ''} />
                      </div>
                    </div>
                    <div className="admin-grid-2">
                      <div className="admin-form-group">
                        <label className="admin-label">Period</label>
                        <input className="admin-input" name="period" defaultValue={data.experience.find(x => x.id === editExpId)?.period || ''} />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-label">Tags (comma-separated)</label>
                        <input className="admin-input" name="tags" defaultValue={data.experience.find(x => x.id === editExpId)?.tags.join(', ') || ''} />
                      </div>
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Description</label>
                      <textarea className="admin-textarea" name="desc" defaultValue={data.experience.find(x => x.id === editExpId)?.desc || ''}></textarea>
                    </div>
                    <button type="submit" className="admin-btn">{editExpId ? 'Update' : 'Add'} Experience</button>
                    {editExpId && <button type="button" className="admin-btn ml-2" onClick={() => setEditExpId(null)}>Cancel</button>}
                  </form>
                </div>

                <div className="admin-section">
                  <div className="admin-section-title">Education</div>
                  <div className="admin-list">
                    {data.education.map(edu => (
                      <div key={edu.id} className="admin-list-item">
                        <div className="admin-list-item-info">{edu.degree} - {edu.school}</div>
                        <div className="admin-list-item-actions">
                          <button className="admin-btn admin-btn-sm" onClick={() => setEditEduId(edu.id)}>Edit</button>
                          <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => deleteItem('education', edu.id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={saveEdu}>
                    <div className="admin-section-title" style={{ fontSize: '0.85rem', marginTop: '10px' }}>
                      {editEduId ? 'Edit Education' : 'Add Education'}
                    </div>
                    <div className="admin-grid-2">
                      <div className="admin-form-group">
                        <label className="admin-label">Degree</label>
                        <input className="admin-input" name="degree" defaultValue={data.education.find(x => x.id === editEduId)?.degree || ''} />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-label">Institution</label>
                        <input className="admin-input" name="school" defaultValue={data.education.find(x => x.id === editEduId)?.school || ''} />
                      </div>
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Period</label>
                      <input className="admin-input" name="period" defaultValue={data.education.find(x => x.id === editEduId)?.period || ''} />
                    </div>
                    <button type="submit" className="admin-btn">{editEduId ? 'Update' : 'Add'} Education</button>
                    {editEduId && <button type="button" className="admin-btn ml-2" onClick={() => setEditEduId(null)}>Cancel</button>}
                  </form>
                </div>
              </div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === 'projects' && (
              <div className="admin-panel active">
                <div className="admin-list">
                  {data.projects.map(proj => (
                    <div key={proj.id} className="admin-list-item">
                      <div className="admin-list-item-info">{proj.title}</div>
                      <div className="admin-list-item-actions">
                        <button className="admin-btn admin-btn-sm" onClick={() => setEditProjId(proj.id)}>Edit</button>
                        <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => deleteItem('projects', proj.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={saveProject}>
                  <div className="admin-section-title">{editProjId ? 'Edit Project' : 'Add Project'}</div>
                  <div className="admin-form-group">
                    <label className="admin-label">Project Title</label>
                    <input className="admin-input" name="title" defaultValue={data.projects.find(x => x.id === editProjId)?.title || ''} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Description</label>
                    <textarea className="admin-textarea" name="desc" defaultValue={data.projects.find(x => x.id === editProjId)?.desc || ''}></textarea>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Tech Stack (comma-separated)</label>
                    <input className="admin-input" name="tech" defaultValue={data.projects.find(x => x.id === editProjId)?.tech.join(', ') || ''} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Project Image</label>
                    <div className="flex items-center gap-4 mb-2">
                      {data.projects.find(x => x.id === editProjId)?.image ? (
                        <div className="flex flex-col gap-2">
                          <img src={data.projects.find(x => x.id === editProjId)?.image} alt="Preview" className="w-16 h-16 object-cover rounded border border-accent" />
                          <button 
                            type="button" 
                            className="text-[10px] text-red-500 hover:underline"
                            onClick={() => {
                              setData(prev => ({
                                ...prev,
                                projects: prev.projects.map(p => p.id === editProjId ? { ...p, image: "" } : p)
                              }));
                              toast('Project image cleared!');
                            }}
                          >
                            Clear Image
                          </button>
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-bg3 rounded border border-dashed border-accent/30 flex items-center justify-center text-[10px] text-accent/50">No Image</div>
                      )}
                      <input type="file" accept="image/*" className="admin-input" style={{ padding: '8px' }} />
                    </div>
                  </div>
                  <div className="admin-grid-2">
                    <div className="admin-form-group">
                      <label className="admin-label">GitHub URL</label>
                      <input className="admin-input" name="github" defaultValue={data.projects.find(x => x.id === editProjId)?.github || ''} />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Live URL</label>
                      <input className="admin-input" name="live" defaultValue={data.projects.find(x => x.id === editProjId)?.live || ''} />
                    </div>
                  </div>
                  <button type="submit" className="admin-btn">{editProjId ? 'Update' : 'Add'} Project</button>
                  {editProjId && <button type="button" className="admin-btn ml-2" onClick={() => setEditProjId(null)}>Cancel</button>}
                </form>
              </div>
            )}

            {/* CERTS TAB */}
            {activeTab === 'certs' && (
              <div className="admin-panel active">
                <div className="admin-list">
                  {data.certificates.map(cert => (
                    <div key={cert.id} className="admin-list-item">
                      <div className="admin-list-item-info">{cert.name}</div>
                      <div className="admin-list-item-actions">
                        <button className="admin-btn admin-btn-sm" onClick={() => setEditCertId(cert.id)}>Edit</button>
                        <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => deleteItem('certificates', cert.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={saveCert}>
                  <div className="admin-section-title">{editCertId ? 'Edit Certificate' : 'Add Certificate'}</div>
                  <div className="admin-form-group">
                    <label className="admin-label">Certificate Name</label>
                    <input className="admin-input" name="name" defaultValue={data.certificates.find(x => x.id === editCertId)?.name || ''} />
                  </div>
                  <div className="admin-grid-2">
                    <div className="admin-form-group">
                      <label className="admin-label">Issuing Organization</label>
                      <input className="admin-input" name="issuer" defaultValue={data.certificates.find(x => x.id === editCertId)?.issuer || ''} />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Date / Year</label>
                      <input className="admin-input" name="date" defaultValue={data.certificates.find(x => x.id === editCertId)?.date || ''} />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Emoji Icon</label>
                    <input className="admin-input" name="icon" defaultValue={data.certificates.find(x => x.id === editCertId)?.icon || ''} placeholder="🛡️" />
                  </div>
                  <button type="submit" className="admin-btn">{editCertId ? 'Update' : 'Add'} Certificate</button>
                  {editCertId && <button type="button" className="admin-btn ml-2" onClick={() => setEditCertId(null)}>Cancel</button>}
                </form>
              </div>
            )}

            {/* GALLERY TAB */}
            {activeTab === 'gallery' && (
              <div className="admin-panel active">
                <div className="admin-list">
                  {data.gallery.map(gal => (
                    <div key={gal.id} className="admin-list-item">
                      <div className="admin-list-item-info">{gal.caption}</div>
                      <div className="admin-list-item-actions">
                        <button className="admin-btn admin-btn-sm" onClick={() => setEditGalId(gal.id)}>Edit</button>
                        <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => deleteItem('gallery', gal.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={saveGallery}>
                  <div className="admin-section-title">{editGalId ? 'Edit Image' : 'Add Image'}</div>
                  <div className="admin-form-group">
                    <label className="admin-label">Image URL</label>
                    <input className="admin-input" name="url" defaultValue={data.gallery.find(x => x.id === editGalId)?.url || ''} placeholder="https://example.com/image.jpg" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Or Upload from Computer</label>
                    <input type="file" accept="image/*" className="admin-input" style={{ padding: '8px' }} />
                    <div className="text-[10px] text-accent/50 mt-1">// Uploading a file will override the URL above</div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Caption</label>
                    <input className="admin-input" name="caption" defaultValue={data.gallery.find(x => x.id === editGalId)?.caption || ''} required />
                  </div>
                  <button type="submit" className="admin-btn">{editGalId ? 'Update' : 'Add'} Image</button>
                  {editGalId && <button type="button" className="admin-btn ml-2" onClick={() => setEditGalId(null)}>Cancel</button>}
                </form>
              </div>
            )}

            {/* RESEARCH TAB */}
            {activeTab === 'research' && (
              <div className="admin-panel active">
                <div className="admin-list">
                  {data.research.map(res => (
                    <div key={res.id} className="admin-list-item">
                      <div className="admin-list-item-info">{res.title}</div>
                      <div className="admin-list-item-actions">
                        <button className="admin-btn admin-btn-sm" onClick={() => setEditResId(res.id)}>Edit</button>
                        <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => deleteItem('research', res.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={saveResearch}>
                  <div className="admin-section-title">{editResId ? 'Edit Research' : 'Add Research'}</div>
                  <div className="admin-form-group">
                    <label className="admin-label">Title</label>
                    <input className="admin-input" name="title" defaultValue={data.research.find(x => x.id === editResId)?.title || ''} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Abstract / Summary</label>
                    <textarea className="admin-textarea" name="abstract" defaultValue={data.research.find(x => x.id === editResId)?.abstract || ''}></textarea>
                  </div>
                  <div className="admin-grid-2">
                    <div className="admin-form-group">
                      <label className="admin-label">Type</label>
                      <select className="admin-select" name="type" defaultValue={data.research.find(x => x.id === editResId)?.type || 'Research Paper'}>
                        <option>Research Paper</option>
                        <option>Article</option>
                        <option>Blog Post</option>
                        <option>Case Study</option>
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Year</label>
                      <input className="admin-input" name="year" defaultValue={data.research.find(x => x.id === editResId)?.year || ''} />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">URL / DOI</label>
                    <input className="admin-input" name="url" defaultValue={data.research.find(x => x.id === editResId)?.url || ''} />
                  </div>
                  <button type="submit" className="admin-btn">{editResId ? 'Update' : 'Add'} Research</button>
                  {editResId && <button type="button" className="admin-btn ml-2" onClick={() => setEditResId(null)}>Cancel</button>}
                </form>
              </div>
            )}

            {/* SOCIAL TAB */}
            {activeTab === 'social' && (
              <div className="admin-panel active">
                <div className="admin-list">
                  {data.social.map(soc => (
                    <div key={soc.id} className="admin-list-item">
                      <div className="admin-list-item-info">{soc.name}</div>
                      <div className="admin-list-item-actions">
                        <button className="admin-btn admin-btn-sm" onClick={() => setEditSocId(soc.id)}>Edit</button>
                        <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => deleteItem('social', soc.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={saveSocial}>
                  <div className="admin-section-title">{editSocId ? 'Edit Social Link' : 'Add Social Link'}</div>
                  <div className="admin-grid-2">
                    <div className="admin-form-group">
                      <label className="admin-label">Platform Name</label>
                      <input className="admin-input" name="name" defaultValue={data.social.find(x => x.id === editSocId)?.name || ''} />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">URL</label>
                      <input className="admin-input" name="url" defaultValue={data.social.find(x => x.id === editSocId)?.url || ''} />
                    </div>
                  </div>
                  <button type="submit" className="admin-btn">{editSocId ? 'Update' : 'Add'} Link</button>
                  {editSocId && <button type="button" className="admin-btn ml-2" onClick={() => setEditSocId(null)}>Cancel</button>}
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MAIN SITE */}
      <nav>
        <div className="nav-logo">AH_</div>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#experience">Experience</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#certifications">Certifications</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <button className="nav-admin-btn" onClick={() => isAdmin ? setShowAdmin(true) : setShowLogin(true)}>
          // {isAdmin ? 'Dashboard' : 'Admin'}
        </button>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="hero-inner">
          <div className="hero-tag">CSE Graduate · Cybersecurity · System Admin</div>
          <h1 className="hero-name">
            {data.profile.name.split(' ')[0]}<br />
            <span>{data.profile.name.split(' ').slice(1).join(' ')}</span>
          </h1>
          <div className="hero-title">{data.profile.subtitle}</div>
          <p className="hero-desc">{data.profile.bio.substring(0, 200)}...</p>
          <div className="hero-actions">
            <a href="#contact" className="btn-primary">Get In Touch</a>
            <a href="#projects" className="btn-outline">View Work</a>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-item"><div className="stat-num">100+</div><div className="stat-label">Training Hours</div></div>
          <div className="stat-item"><div className="stat-num">3+</div><div className="stat-label">Years Experience</div></div>
          <div className="stat-item"><div className="stat-num">2</div><div className="stat-label">Certifications</div></div>
        </div>
        <div className="hero-line"><span>Scroll to explore</span></div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="section-header reveal">
          <span className="section-num">// 01</span>
          <h2 className="section-title">About Me</h2>
          <div className="section-line"></div>
        </div>
        <div className="about-grid">
          <div className="about-img-wrap reveal">
            <div className="about-img-frame">
              <img
                src={data.profile.profilePic || "Atahar.png"}
                alt={data.profile.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!data.profile.profilePic) {
                    // Try a placeholder if Atahar.png fails
                    if (target.src.includes("Atahar.png")) {
                      target.src = "https://picsum.photos/seed/atahar/800/1000";
                    } else {
                      target.style.display = 'none';
                      if (target.parentElement) {
                        target.parentElement.style.background = 'var(--bg3)';
                        target.parentElement.style.minHeight = '400px';
                      }
                    }
                  }
                }}
              />
              <div className="about-img-accent"></div>
              <div className="about-img-accent2"></div>
            </div>
          </div>
          <div className="about-content reveal">
            <p className="about-bio">{data.profile.bio}</p>
            <div className="skills-grid">
              {data.profile.skills.map((skill, i) => (
                <div key={i} className="skill-tag">{skill}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience">
        <div className="section-header reveal">
          <span className="section-num">// 02</span>
          <h2 className="section-title">Experience</h2>
          <div className="section-line"></div>
        </div>
        <div className="exp-container">
          {data.experience.map(exp => (
            <div key={exp.id} className="exp-item reveal">
              <div>
                <div className="exp-period">{exp.period}</div>
                <div className="exp-company">{exp.company}</div>
              </div>
              <div>
                <div className="exp-title">{exp.title}</div>
                <div className="exp-desc">{exp.desc}</div>
                <div className="exp-tags">
                  {exp.tags.map((tag, i) => (
                    <span key={i} className="exp-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <div className="section-header reveal">
          <span className="section-num">// 03</span>
          <h2 className="section-title">Projects</h2>
          <div className="section-line"></div>
        </div>
        <div className="projects-grid">
          {data.projects.length === 0 ? (
            <div style={{ color: 'var(--text3)', fontSize: '0.82rem', letterSpacing: '0.1em', border: '1px dashed var(--border)', padding: '40px', textAlign: 'center', gridColumn: '1/-1' }}>
              // No projects added yet. Login as admin to add your work.
            </div>
          ) : (
            data.projects.map((proj, i) => (
              <div key={proj.id} className="project-card reveal">
                {proj.image && (
                  <div className="project-image">
                    <img src={proj.image} alt={proj.title} referrerPolicy="no-referrer" />
                  </div>
                )}
                <div className="project-num">0{i + 1}</div>
                <div className="project-title">{proj.title}</div>
                <div className="project-desc">{proj.desc}</div>
                <div className="project-tech">
                  {proj.tech.map((t, j) => <span key={j}>{t}</span>)}
                </div>
                <div className="project-links">
                  {proj.github && <a href={proj.github} target="_blank" className="project-link">→ GitHub</a>}
                  {proj.live && <a href={proj.live} target="_blank" className="project-link">→ Live</a>}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section id="certifications">
        <div className="section-header reveal">
          <span className="section-num">// 04</span>
          <h2 className="section-title">Certifications</h2>
          <div className="section-line"></div>
        </div>
        <div className="certs-grid">
          {data.certificates.map(cert => (
            <div key={cert.id} className="cert-card reveal">
              <div className="cert-icon">{cert.icon}</div>
              <div className="cert-name">{cert.name}</div>
              <div className="cert-issuer">{cert.issuer}</div>
              <div className="cert-date">{cert.date}</div>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery">
        <div className="section-header reveal">
          <span className="section-num">// 05</span>
          <h2 className="section-title">Gallery</h2>
          <div className="section-line"></div>
        </div>
        <div className="gallery-grid">
          {data.gallery.length === 0 ? (
            <div className="gallery-placeholder" style={{ aspectRatio: '4/3', gridColumn: '1/-1' }}>
              // Gallery empty — add images from admin panel
            </div>
          ) : (
            data.gallery.map(gal => (
              <div key={gal.id} className="gallery-item reveal">
                <img src={gal.url} alt={gal.caption} loading="lazy" referrerPolicy="no-referrer" />
                <div className="gallery-item-overlay">
                  <span style={{ fontSize: '0.8rem', letterSpacing: '0.1em', color: 'var(--text)' }}>{gal.caption}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* RESEARCH */}
      <section id="research">
        <div className="section-header reveal">
          <span className="section-num">// 06</span>
          <h2 className="section-title">Research & Writing</h2>
          <div className="section-line"></div>
        </div>
        <div className="research-list">
          {data.research.length === 0 ? (
            <div style={{ color: 'var(--text3)', fontSize: '0.82rem', textAlign: 'center', padding: '40px' }}>
              // No research or writing added yet.
            </div>
          ) : (
            data.research.map(res => (
              <div key={res.id} className="research-item reveal">
                <div className="research-type">{res.type}</div>
                <div className="research-title">
                  {res.url ? <a href={res.url} target="_blank" style={{ color: 'inherit', textDecoration: 'none' }}>{res.title}</a> : res.title}
                </div>
                <div className="research-abstract">{res.abstract}</div>
                <div className="research-meta">
                  <span>{res.year}</span>
                  {res.url && <span><a href={res.url} target="_blank" style={{ color: 'var(--accent)' }}>View →</a></span>}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education">
        <div className="section-header reveal">
          <span className="section-num">// 07</span>
          <h2 className="section-title">Education</h2>
          <div className="section-line"></div>
        </div>
        <div className="edu-timeline">
          {data.education.map(edu => (
            <div key={edu.id} className="edu-item reveal">
              <div className="edu-dot"></div>
              <div className="edu-period">{edu.period}</div>
              <div className="edu-degree">{edu.degree}</div>
              <div className="edu-school">{edu.school}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="section-header reveal">
          <span className="section-num">// 08</span>
          <h2 className="section-title">Contact</h2>
          <div className="section-line"></div>
        </div>
        <div className="contact-grid">
          <div className="contact-info reveal">
            <p className="contact-intro">Available for opportunities, collaborations, and consulting. Let's build something secure and extraordinary together.</p>
            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <div className="contact-detail">
                <div className="contact-label">Email</div>
                <div className="contact-value">{data.profile.email}</div>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📱</div>
              <div className="contact-detail">
                <div className="contact-label">Phone</div>
                <div className="contact-value">{data.profile.phone}</div>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div className="contact-detail">
                <div className="contact-label">Location</div>
                <div className="contact-value">{data.profile.location}</div>
              </div>
            </div>
            <div className="social-links">
              {data.social.map(soc => (
                <a key={soc.id} href={soc.url} target="_blank" className="social-link">{soc.name}</a>
              ))}
            </div>
          </div>
          <div className="contact-form reveal">
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input type="text" className="form-input" id="cf-name" placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" id="cf-email" placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea className="form-textarea" id="cf-message" placeholder="Tell me about your project..."></textarea>
            </div>
            <button className="btn-primary" onClick={sendMessage}>Send Message</button>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-copy">© 2025 {data.profile.name}. All rights reserved.</div>
        <div className="footer-note">Built with precision & passion.</div>
      </footer>

      <div id="toast" className={showToast ? 'show' : ''}>{toastMsg}</div>
    </div>
  );
}
