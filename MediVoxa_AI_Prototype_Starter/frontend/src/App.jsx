
import React, { useEffect, useState } from 'react';
import {
  Activity,
  Bell,
  Camera,
  HeartPulse,
  Home,
  MessageCircle,
  Pill,
  ShieldAlert,
  Stethoscope,
  Upload,
  UserRound,
  Video,
  Waves
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const navItems = [
  ['Home', Home],
  ['AI Assistant', MessageCircle],
  ['AI Avatar Video Call', Video],
  ['Skin Assistance', Camera],
  ['Medicine Assistance', Pill],
  ['Health Records', Activity],
  ['Reminders', Bell],
  ['Emergency Support', ShieldAlert]
];

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Request failed.');
  }

  return data;
}

function App() {
  const [page, setPage] = useState('Home');
  const [apiStatus, setApiStatus] = useState('checking');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInMobile, setLoggedInMobile] = useState('');

  useEffect(() => {
    request('/api/health')
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'));
  }, []);

  // Frontend demonstration only: this does not authenticate against SQLite.
  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLogin={(mobile) => {
          setLoggedInMobile(mobile);
          setIsLoggedIn(true);
        }}
      />
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <HeartPulse size={25} />
          </div>
          <div>
            <b>MediVoxa AI</b>
            <small>Healthcare companion</small>
          </div>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <nav>
          {navItems.map(([name, Icon]) => (
            <button
              key={name}
              className={`nav-item ${page === name ? 'active' : ''}`}
              onClick={() => setPage(name)}
            >
              <Icon size={18} />
              <span>{name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className={`status-dot ${apiStatus}`} />
          <span>Backend {apiStatus}</span>
          <p>
            For general information only. Not a medical diagnosis.
          </p>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <span className="eyebrow">YOUR PERSONAL HEALTH SPACE</span>
            <h1>{page}</h1>
          </div>

          <div className="profile">
            <div className="profile-icon">
              <UserRound size={20} />
            </div>
            <div>
              <b>{loggedInMobile || 'Patient'}</b>
              <small>Demo session</small>
            </div>
            <button
              type="button"
              className="small-btn"
              onClick={() => {
                setIsLoggedIn(false);
                setLoggedInMobile('');
                setPage('Home');
              }}
            >
              Log out
            </button>
          </div>
        </header>

        {page === 'Home' && <HomePage setPage={setPage} />}
        {page === 'AI Assistant' && <ChatPage />}
        {page === 'AI Avatar Video Call' && <AIAvatarPage />}
        {page === 'Skin Assistance' && <ImagePage kind="skin" />}
        {page === 'Medicine Assistance' && <ImagePage kind="medicine" />}
        {page === 'Health Records' && <HealthPage />}
        {page === 'Reminders' && <ReminderPage />}
        {page === 'Emergency Support' && <EmergencyPage />}

        <footer>
          MediVoxa AI · AI-powered healthcare support · Not a substitute
          for professional care
        </footer>
      </main>
    </div>
  );
}


function LoginScreen({ onLogin }) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  const fieldStyle = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '13px 14px',
    border: '1px solid #d5e1e5',
    borderRadius: 10,
    background: '#fbfdfe',
    color: '#18343d',
    fontSize: 14,
    outline: 'none'
  };
  const labelStyle = {
    display: 'block',
    margin: '14px 0 7px',
    color: '#263e46',
    fontSize: 14,
    fontWeight: 600
  };
  const primaryStyle = {
    width: '100%',
    marginTop: 20,
    padding: 14,
    border: 0,
    borderRadius: 10,
    background: '#087f8c',
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer'
  };

  function submit(e) {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (!otpStep) {
      setOtpStep(true);
      setNotice('Demo mode: SMS OTP delivery is not connected. Enter any 6 digits to preview the dashboard.');
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError('Enter a 6-digit OTP.');
      return;
    }

    onLogin(mobile);
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      boxSizing: 'border-box',
      background: 'linear-gradient(135deg, #e8f7ff, #f5faff, #e6f8f3)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <section style={{
        width: '100%',
        maxWidth: 430,
        padding: '34px 32px',
        boxSizing: 'border-box',
        borderRadius: 22,
        background: '#fff',
        boxShadow: '0 12px 45px rgba(18, 70, 100, 0.12)'
      }}>
        <div style={{
          width: 58,
          height: 58,
          margin: '0 auto 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 17,
          background: '#087f8c',
          color: '#fff',
          fontSize: 30
        }}>
          <HeartPulse size={31} />
        </div>
        <h1 style={{ margin: 0, textAlign: 'center', color: '#087f8c', fontSize: 28 }}>
          MediVoxa AI
        </h1>
        <p style={{ margin: '8px 0 30px', textAlign: 'center', color: '#687780', fontSize: 13 }}>
          Your personal AI healthcare assistant
        </p>

        <h2 style={{ margin: '0 0 8px', color: '#18343d', fontSize: 23 }}>
          {showRegister ? 'Patient Registration' : 'Welcome Back'}
        </h2>
        <p style={{ margin: '0 0 18px', color: '#687780', fontSize: 14, lineHeight: 1.5 }}>
          {showRegister
            ? 'Registration is not connected yet. Use the login form to preview the application.'
            : 'Sign in to access your healthcare dashboard.'}
        </p>

        <form onSubmit={submit}>
          <label htmlFor="medivoxa-mobile" style={labelStyle}>Mobile Number</label>
          <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
            <span style={{
              padding: '13px 11px',
              border: '1px solid #d5e1e5',
              borderRadius: 10,
              background: '#f4f9fa',
              color: '#18343d',
              fontSize: 14
            }}>+91</span>
            <input
              id="medivoxa-mobile"
              style={fieldStyle}
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="10-digit mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              required
            />
          </div>

          <label htmlFor="medivoxa-password" style={labelStyle}>Password</label>
          <input
            id="medivoxa-password"
            style={fieldStyle}
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password (minimum 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {otpStep && (
            <>
              <label htmlFor="medivoxa-otp" style={labelStyle}>6-Digit OTP</label>
              <input
                id="medivoxa-otp"
                style={fieldStyle}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Enter any 6 digits in demo mode"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
              />
            </>
          )}

          {notice && <p role="status" style={{ color: '#8a5b00', background: '#fff8e6', padding: 10, borderRadius: 8, fontSize: 12, lineHeight: 1.5 }}>{notice}</p>}
          {error && <p role="alert" style={{ color: '#b42318', fontSize: 13 }}>{error}</p>}

          <button type="submit" style={primaryStyle}>
            {otpStep ? 'Verify & Open Dashboard' : 'Continue'}
          </button>
        </form>

        <p style={{ margin: '22px 0 0', textAlign: 'center', color: '#687780', fontSize: 14 }}>
          {showRegister ? 'Already have an account?' : 'New patient?'}{' '}
          <button
            type="button"
            onClick={() => {
              setShowRegister(!showRegister);
              setOtpStep(false);
              setOtp('');
              setError('');
              setNotice('');
            }}
            style={{ padding: 0, border: 0, background: 'none', color: '#087f8c', fontWeight: 700, cursor: 'pointer' }}
          >
            {showRegister ? 'Back to login' : 'Create an account'}
          </button>
        </p>
        <p style={{ margin: '22px 0 0', textAlign: 'center', color: '#84939a', fontSize: 11, lineHeight: 1.5 }}>
          Demo interface only. Authentication, account registration, and real SMS OTP must be connected to the backend before real patient use.
        </p>
      </section>
    </div>
  );
}

function HomePage({ setPage }) {
  const cards = [
    {
      title: 'AI Health Assistant',
      desc: 'Ask general healthcare questions.',
      icon: MessageCircle,
      page: 'AI Assistant',
      tag: 'AI CHAT'
    },
    {
      title: 'AI Avatar Video Call',
      desc: 'Ask Dr. Meera questions using text or voice.',
      icon: Video,
      page: 'AI Avatar Video Call',
      tag: 'VIDEO CALL'
    },
    {
      title: 'Skin Image Assistance',
      desc: 'Upload an image for the planned analysis workflow.',
      icon: Camera,
      page: 'Skin Assistance',
      tag: 'IMAGE SUPPORT'
    },
    {
      title: 'Medicine Assistance',
      desc: 'Upload packaging for medicine information support.',
      icon: Pill,
      page: 'Medicine Assistance',
      tag: 'IMAGE SUPPORT'
    },
    {
      title: 'Health Records',
      desc: 'Record measurements and review history.',
      icon: Activity,
      page: 'Health Records',
      tag: 'TRACKING'
    },
    {
      title: 'Medicine Reminders',
      desc: 'Create a reminder schedule.',
      icon: Bell,
      page: 'Reminders',
      tag: 'REMINDERS'
    },
    {
      title: 'Emergency Support',
      desc: 'View emergency contact guidance.',
      icon: ShieldAlert,
      page: 'Emergency Support',
      tag: 'SAFETY'
    }
  ];

  return (
    <div className="content">
      <section className="welcome-panel">
        <div className="welcome-copy">
          <span className="pill-label">WELCOME TO MEDIVOXA</span>
          <h2>Your health,<br />your assistant.</h2>
          <p>
            Understand everyday health information and organize personal
            health tasks in one place.
          </p>
          <button
            className="primary-btn"
            onClick={() => setPage('AI Avatar Video Call')}
          >
            Talk to Dr. Meera <MessageCircle size={17} />
          </button>
        </div>

        <div className="doctor-art">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="doctor-circle">
            <Stethoscope size={72} />
          </div>
          <div className="floating-note">
            <Waves size={17} /> Support when you need it
          </div>
        </div>
      </section>

      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR TOOLKIT</span>
          <h2>How can we help today?</h2>
        </div>
        <span className="subtle-text">Choose a feature to begin</span>
      </div>

      <div className="feature-grid">
        {cards.map(({ title, desc, icon: Icon, page, tag }) => (
          <button
            className="feature-card"
            key={title}
            onClick={() => setPage(page)}
          >
            <div className="feature-icon">
              <Icon size={22} />
            </div>
            <span className="card-tag">{tag}</span>
            <h3>{title}</h3>
            <p>{desc}</p>
            <span className="card-link">
              Open feature <span>↗</span>
            </span>
          </button>
        ))}
      </div>

      <div className="safety-banner">
        <ShieldAlert size={21} />
        <div>
          <b>Your safety matters</b>
          <p>
            MediVoxa AI does not diagnose conditions or replace a qualified
            healthcare professional.
          </p>
        </div>
      </div>
    </div>
  );
}

function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text:
        'Hello! I’m Dr. Meera, your MediVoxa AI assistant. I can share ' +
        'general health information, but I cannot diagnose or prescribe. ' +
        'What would you like to ask?'
    }
  ]);

  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function send(e) {
    e.preventDefault();

    const message = input.trim();
    if (!message || busy) return;

    setMessages(old => [...old, { role: 'user', text: message }]);
    setInput('');
    setBusy(true);
    setError('');

    try {
      const data = await request('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      setMessages(old => [
        ...old,
        { role: 'assistant', text: data.answer || 'No answer was returned.' }
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="content narrow">
      <div className="module-intro">
        <div className="large-icon"><MessageCircle /></div>
        <div>
          <h2>Ask Dr. Meera</h2>
          <p>General health information, explained in simple language.</p>
        </div>
      </div>

      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`message-row ${m.role}`}>
            <div className="message-avatar">
              {m.role === 'assistant'
                ? <Stethoscope size={17} />
                : <UserRound size={17} />}
            </div>
            <div className="bubble">
              <small>{m.role === 'assistant' ? 'Dr. Meera · AI assistant' : 'You'}</small>
              <p>{m.text}</p>
            </div>
          </div>
        ))}

        {busy && (
          <div className="typing">Dr. Meera is preparing a response…</div>
        )}
        {error && <div className="error-box">{error}</div>}
      </div>

      <form className="chat-form" onSubmit={send}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a general health question…"
          maxLength={4000}
        />
        <button className="primary-btn" disabled={busy || !input.trim()}>
          {busy ? 'Sending…' : 'Send'} <span>➤</span>
        </button>
      </form>

      <p className="disclaimer">
        Not for emergencies. Do not share sensitive personal information.
        For urgent symptoms, contact emergency services.
      </p>
    </div>
  );
}

function AIAvatarPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState('');

  async function askAI(text) {
    const message = text.trim();

    if (!message || busy) return;

    setQuestion('');
    setAnswer('');
    setError('');
    setBusy(true);

    try {
      const data = await request('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      const reply = data.answer || 'Sorry, no answer was returned.';
      setAnswer(reply);
      speakAnswer(reply);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function speakAnswer(text) {
    if (!('speechSynthesis' in window)) {
      setError('Speech output is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-IN';
    speech.rate = 1;

    window.speechSynthesis.speak(speech);
  }

  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        'Voice input is not supported in this browser. Please type your question.'
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      setError('');
    };

    recognition.onresult = event => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript);
    };

    recognition.onerror = () => {
      setError('Could not capture your voice. Please try again.');
    };

    recognition.onend = () => {
      setListening(false);
    };

    try {
      recognition.start();
    } catch {
      setListening(false);
      setError('Could not start the microphone. Please try again.');
    }
  }

  function stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  return (
    <div className="content">
      <div className="module-intro">
        <div className="large-icon"><Video /></div>
        <div>
          <h2>AI Avatar Video Consultation</h2>
          <p>
            Talk with Dr. Meera using text or voice and receive general
            healthcare information.
          </p>
        </div>
      </div>

      <div className="consultation-layout">
        <section className="avatar-panel">
          <div className="video-frame">
            <video
              className="doctor-video"
              src="/dr-meera-demo.mp4"
              autoPlay
              muted
              loop
              playsInline
              controls
              poster="/dr-meera-poster.jpg"
            />

            <div className="video-caption">
              <span className="live-dot" />
              Dr. Meera · AI Healthcare Assistant
            </div>
          </div>

          <p className="disclaimer">
            This is a prerecorded avatar video, not a live doctor or a
            real-time lip-synced avatar.
          </p>

          <div className="avatar-video-actions">
            <button
              className="small-btn"
              type="button"
              onClick={() => {
                const video = document.querySelector('.doctor-video');
                if (video) {
                  video.currentTime = 0;
                  video.play().catch(() => {});
                }
              }}
            >
              Replay avatar video
            </button>
          </div>
        </section>

        <section className="consultation-chat panel">
          <h3>Consult with Dr. Meera</h3>

          <div className="consultation-answer" aria-live="polite">
            {!answer && !busy && (
              <p>
                Hello! I’m Dr. Meera. You can type or speak a general
                healthcare question to begin.
              </p>
            )}

            {busy && <p>Preparing your response...</p>}

            {answer && <p>{answer}</p>}
          </div>

          {answer && (
            <div className="speech-actions">
              <button
                type="button"
                className="small-btn"
                onClick={() => speakAnswer(answer)}
              >
                🔊 Speak answer again
              </button>

              <button
                type="button"
                className="small-btn"
                onClick={stopSpeaking}
              >
                Stop voice
              </button>
            </div>
          )}

          {error && <div className="error-box">{error}</div>}

          <form
            className="avatar-input-form"
            onSubmit={e => {
              e.preventDefault();
              askAI(question);
            }}
          >
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Type your health question..."
              rows={3}
              maxLength={4000}
            />

            <div className="avatar-actions">
              <button
                type="button"
                className="small-btn"
                onClick={startListening}
                disabled={listening || busy}
              >
                {listening ? 'Listening...' : '🎤 Speak'}
              </button>

              <button
                type="submit"
                className="primary-btn"
                disabled={busy || !question.trim()}
              >
                {busy ? 'Please wait...' : 'Ask Dr. Meera'}
              </button>
            </div>
          </form>

          <p className="disclaimer">
            AI-generated information may be incorrect. This feature does not
            diagnose conditions or replace a qualified healthcare professional.
            Do not use it for emergencies.
          </p>
        </section>
      </div>
    </div>
  );
}

function ImagePage({ kind }) {
  const isSkin = kind === 'skin';
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!file) {
      setPreview('');
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function submit(e) {
    e.preventDefault();

    if (!file) {
      setError('Please choose an image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Please choose an image smaller than 5 MB.');
      return;
    }

    setBusy(true);
    setError('');
    setResult('');

    const form = new FormData();
    form.append('image', file);

    try {
      const data = await request(`/api/${kind}/analyze`, {
        method: 'POST',
        body: form
      });

      setResult(data.message || 'The request completed.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="content narrow">
      <div className="module-intro">
        <div className="large-icon">
          {isSkin ? <Camera /> : <Pill />}
        </div>
        <div>
          <h2>{isSkin ? 'Skin Image Assistance' : 'Medicine Image Assistance'}</h2>
          <p>
            {isSkin
              ? 'Upload a clear image to test the image-upload workflow.'
              : 'Upload medicine packaging for the prototype information workflow.'}
          </p>
        </div>
      </div>

      <form className="upload-panel" onSubmit={submit}>
        <label className="upload-zone">
          <Upload size={34} />
          <b>Choose an image</b>
          <span>PNG, JPG or WEBP · Maximum 5 MB</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={e => {
              setFile(e.target.files?.[0] || null);
              setResult('');
              setError('');
            }}
          />
        </label>

        {preview && (
          <div className="preview-wrap">
            <img src={preview} alt="Selected upload preview" />
            <span>{file?.name}</span>
          </div>
        )}

        <button className="primary-btn full-btn" disabled={busy}>
          {busy
            ? 'Processing...'
            : isSkin
              ? 'Submit skin image'
              : 'Submit medicine image'}
        </button>
      </form>

      {error && <div className="error-box">{error}</div>}

      {result && (
        <div className="result-box">
          <b>Result</b>
          <p>{result}</p>
        </div>
      )}

      <div className="safety-banner">
        <ShieldAlert size={21} />
        <div>
          <b>Important limitation</b>
          <p>
            {isSkin
              ? 'This prototype does not currently predict or diagnose skin conditions.'
              : 'This prototype does not identify pills or confirm medicine identity.'}
            {' '}Verify concerns with a qualified healthcare professional or pharmacist.
          </p>
        </div>
      </div>
    </div>
  );
}

function HealthPage() {
  const [type, setType] = useState('blood_pressure');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  async function load() {
    try {
      const data = await request('/api/health-records');
      setRecords(data.records || []);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save(e) {
    e.preventDefault();
    setError('');
    setStatus('');

    try {
      await request('/api/health-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          record_type: type,
          value_text: value,
          notes
        })
      });

      setValue('');
      setNotes('');
      setStatus('Record saved.');
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  const labels = {
    blood_pressure: 'Blood pressure',
    blood_sugar: 'Blood sugar',
    weight: 'Weight'
  };

  return (
    <div className="content">
      <div className="module-intro">
        <div className="large-icon"><Activity /></div>
        <div>
          <h2>Personal health records</h2>
          <p>
            Save measurements you choose to record. These entries are not
            medical advice.
          </p>
        </div>
      </div>

      <div className="two-column">
        <form className="panel form-panel" onSubmit={save}>
          <h3>Add a measurement</h3>

          <label>
            Measurement type
            <select value={type} onChange={e => setType(e.target.value)}>
              {Object.entries(labels).map(([k, v]) => (
                <option value={k} key={k}>{v}</option>
              ))}
            </select>
          </label>

          <label>
            Value
            <input
              value={value}
              onChange={e => setValue(e.target.value)}
              required
              maxLength={100}
              placeholder={
                type === 'blood_pressure'
                  ? 'e.g. 120/80 mmHg'
                  : type === 'blood_sugar'
                    ? 'e.g. 95 mg/dL'
                    : 'e.g. 62 kg'
              }
            />
          </label>

          <label>
            Notes (optional)
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              maxLength={1000}
              placeholder="Optional context"
            />
          </label>

          <button className="primary-btn">Save record</button>
          {status && <div className="success-text">{status}</div>}
          {error && <div className="error-box">{error}</div>}
        </form>

        <div className="panel">
          <div className="section-heading compact">
            <div>
              <h3>Recent entries</h3>
              <p>Newest first</p>
            </div>
            <button type="button" className="small-btn" onClick={load}>
              Refresh
            </button>
          </div>

          {records.length === 0 ? (
            <div className="empty-state">
              <Activity size={30} />
              <p>No records yet. Add your first measurement.</p>
            </div>
          ) : (
            <div className="record-list">
              {records.map(r => (
                <div className="record-item" key={r.id}>
                  <div>
                    <b>{labels[r.record_type] || r.record_type}</b>
                    <p>{r.notes || 'No notes'}</p>
                    <small>{new Date(r.created_at).toLocaleString()}</small>
                  </div>
                  <strong>{r.value_text}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReminderPage() {
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [time, setTime] = useState('09:00');
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  async function load() {
    try {
      const data = await request('/api/reminders');
      setReminders(data.reminders || []);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save(e) {
    e.preventDefault();
    setError('');
    setStatus('');

    try {
      await request('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicine_name: name,
          instructions,
          reminder_time: time
        })
      });

      setName('');
      setInstructions('');
      setStatus(
        'Schedule saved. Browser notification support is best-effort only.'
      );
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function toggle(r) {
    try {
      await request(`/api/reminders/${r.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !r.active })
      });

      load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="content">
      <div className="module-intro">
        <div className="large-icon"><Bell /></div>
        <div>
          <h2>Medicine reminders</h2>
          <p>
            Save a schedule based on instructions from your healthcare
            professional.
          </p>
        </div>
      </div>

      <div className="two-column">
        <form className="panel form-panel" onSubmit={save}>
          <h3>Create a reminder</h3>

          <label>
            Medicine name
            <input
              required
              maxLength={160}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter the prescribed medicine name"
            />
          </label>

          <label>
            Instructions (optional)
            <input
              maxLength={300}
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="Follow the label or clinician's instructions"
            />
          </label>

          <label>
            Reminder time
            <input
              type="time"
              required
              value={time}
              onChange={e => setTime(e.target.value)}
            />
          </label>

          <button className="primary-btn">Save reminder</button>
          {status && <div className="success-text">{status}</div>}
          {error && <div className="error-box">{error}</div>}
        </form>

        <div className="panel">
          <div className="section-heading compact">
            <div>
              <h3>Your schedules</h3>
              <p>Saved reminders</p>
            </div>
            <button type="button" className="small-btn" onClick={load}>
              Refresh
            </button>
          </div>

          {reminders.length === 0 ? (
            <div className="empty-state">
              <Bell size={30} />
              <p>No schedules yet.</p>
            </div>
          ) : (
            <div className="record-list">
              {reminders.map(r => (
                <div className="record-item" key={r.id}>
                  <div>
                    <b>{r.medicine_name}</b>
                    <p>{r.instructions || 'Follow the prescribed instructions'}</p>
                    <small>{r.active ? 'Active' : 'Paused'}</small>
                  </div>
                  <div className="reminder-actions">
                    <strong>{String(r.reminder_time).slice(0, 5)}</strong>
                    <button
                      type="button"
                      className="small-btn"
                      onClick={() => toggle(r)}
                    >
                      {r.active ? 'Pause' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="disclaimer">
            This prototype stores schedules but does not guarantee a
            notification at the scheduled time. Do not rely on it as your only
            medication reminder.
          </p>
        </div>
      </div>
    </div>
  );
}

function EmergencyPage() {
  return (
    <div className="content narrow">
      <div className="emergency-panel">
        <div className="emergency-symbol"><ShieldAlert size={38} /></div>
        <span className="pill-label">URGENT HELP</span>
        <h2>If this is an emergency</h2>
        <p>
          Do not wait for an AI response. Contact emergency services or go to
          the nearest emergency department.
        </p>
        <a className="emergency-number" href="tel:112">
          112 <span>Call India emergency services</span>
        </a>
        <p className="disclaimer">
          Calling availability depends on your device and network. If calling
          does not work, use another phone or seek nearby help.
        </p>
      </div>

      <div className="panel">
        <h3>Personal emergency contacts</h3>
        <p>
          This prototype does not yet store contacts. Keep important contact
          numbers accessible on your phone and share relevant medical
          information with trusted people.
        </p>
      </div>
    </div>
  );
}

export default App;
