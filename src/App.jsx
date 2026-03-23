import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const revealOnScroll = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, amount: 0.2 },
};

const storySteps = [
  {
    title: "First Hello",
    text: "A coffee date that stretched into sunset conversations and became the beginning of everything.",
  },
  {
    title: "The Adventure Years",
    text: "City walks, late-night playlists, tiny celebrations, and the kind of partnership that made ordinary days glow.",
  },
  {
    title: "The Yes",
    text: "One unforgettable question, a thousand happy tears, and the decision to build a forever together.",
  },
];

const events = [
  {
    day: "Day 1",
    date: "6 July",
    title: "Check-in, Haldi Carnival, Pool Party, Ring Ceremony & Sangeet",
    time: "11:00 AM to late night",
    place: "Arrival, daytime celebrations, and evening festivities",
    items: [
      "Guests check in by 11:00 AM and breakfast is served on arrival.",
      "Haldi carnival begins at 2:00 PM with lunch and festive celebrations.",
      "Pool party continues through the afternoon until around 6:00 PM.",
      "Guests return to their rooms to relax and refresh before the evening.",
      "Ring ceremony begins at 9:00 PM, followed by sangeet, dances, and dinner.",
    ],
  },
  {
    day: "Day 2",
    date: "7 July",
    title: "Sagan, Rajasthani Thali Lunch, Pheras, Warmala & Wedding Dinner",
    time: "Morning to evening",
    place: "Traditional rituals and the grand wedding celebration",
    items: [
      "Morning begins with Sagan and family rituals.",
      "A Rajasthani thali lunch is served for all our guests.",
      "Bride and groom pheras take place in the afternoon.",
      "A grand warmala ceremony is planned for the evening.",
      "The celebrations conclude with a grand wedding dinner.",
    ],
  },
  {
    day: "Day 3",
    date: "8 July",
    title: "Farewell Morning",
    time: "After breakfast",
    place: "Departure to our native places",
    items: [
      "Breakfast is served in the morning before checkout.",
      "After breakfast, everyone departs from the destination with love and blessings.",
    ],
  },
];

const moments = [
  "Haldi carnival colors",
  "Pool party energy",
  "Sangeet performances",
  "Grand warmala evening",
];

const marqueeItems = [
  "6 July Check-in",
  "Haldi Carnival",
  "Pool Party",
  "Ring Ceremony",
  "Sangeet Night",
  "7 July Pheras",
  "Grand Warmala",
  "Wedding Dinner",
  "8 July Farewell",
];

const venueName = "JMD Resort Mandu";
const venueAddress = "325/1, gram, Sulibardi, Nalchha, Madhya Pradesh 454010";
const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=JMD+Resort+Mandu,+325%2F1,+gram,+Sulibardi,+Nalchha,+Madhya+Pradesh+454010";
const rsvpEndpoint = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

const details = [
  {
    label: "Check-in",
    value: "Guests are expected to arrive and check in by 11:00 AM on 6 July",
  },
  {
    label: "Day 1 Flow",
    value: "Breakfast, haldi carnival, lunch, pool party, rest, ring ceremony and sangeet",
  },
  {
    label: "Farewell",
    value: "After breakfast on 8 July, we leave the destination for our native places",
  },
];

const promises = [
  "A joyful haldi carnival and poolside celebration",
  "A sparkling ring ceremony and dance-filled sangeet night",
  "Traditional rituals with a Rajasthani thali lunch",
  "A grand warmala and unforgettable wedding dinner",
];

export default function App() {
  const [musicOn, setMusicOn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState({ type: "", message: "" });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    attendance: "",
    dance: "",
    guestCount: "",
    note: "",
  });
  const audioContextRef = useRef(null);
  const intervalRef = useRef(null);
  const stepRef = useRef(0);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playNote = (context, frequency, duration, volume) => {
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start(now);
    oscillator.stop(now + duration + 0.05);
  };

  const startMusic = async () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }

    const context = audioContextRef.current;
    if (context.state === "suspended") {
      await context.resume();
    }

    const melody = [
      [392, 523.25],
      [440, 587.33],
      [349.23, 523.25],
      [392, 659.25],
      [329.63, 493.88],
      [349.23, 523.25],
      [392, 587.33],
      [293.66, 440],
    ];

    const playStep = () => {
      const [base, harmony] = melody[stepRef.current % melody.length];
      playNote(context, base, 1.8, 0.028);
      playNote(context, harmony, 1.6, 0.016);
      stepRef.current += 1;
    };

    playStep();
    intervalRef.current = window.setInterval(playStep, 1800);
    setMusicOn(true);
  };

  const stopMusic = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state === "running") {
      await audioContextRef.current.suspend();
    }

    setMusicOn(false);
  };

  const toggleMusic = async () => {
    if (musicOn) {
      await stopMusic();
      return;
    }

    await startMusic();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!rsvpEndpoint) {
      setSubmitState({
        type: "error",
        message:
          "RSVP is not connected yet. Add your Google Sheets script URL to enable submissions.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitState({ type: "", message: "" });

    try {
      await fetch(rsvpEndpoint, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          ...formData,
          guestCount: Number(formData.guestCount || 0),
          submittedAt: new Date().toISOString(),
        }),
      });

      setSubmitState({
        type: "success",
        message: "Thank you. Your RSVP has been saved successfully.",
      });
      setFormData({
        name: "",
        phone: "",
        attendance: "",
        dance: "",
        guestCount: "",
        note: "",
      });
    } catch (error) {
      setSubmitState({
        type: "error",
        message:
          "We could not save the RSVP right now. Please try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />
      <div className="grain" />
      <div className="petal petal-one" />
      <div className="petal petal-two" />
      <div className="petal petal-three" />

      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark">S</span>
          <span className="brand-name">Sharad & Soulmate</span>
        </div>
        <nav className="topnav">
          <a href="#story">Story</a>
          <a href="#events">Events</a>
          <a href="#gallery">Gallery</a>
          <a href="#rsvp">RSVP</a>
        </nav>
      </header>

      <button type="button" className="music-toggle" onClick={toggleMusic}>
        <span className={`music-indicator ${musicOn ? "is-on" : ""}`} />
        {musicOn ? "Pause Tune" : "Play Sweet Tune"}
      </button>

      <main>
        <section className="hero">
          <motion.div
            className="hero-copy"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0.1}
          >
            <p className="eyebrow">A celebration of love, light, and new beginnings</p>
            <h1>Three days of love, rituals, music, and celebration.</h1>
            <p className="hero-text">
              Join us from 6 to 8 July for our destination wedding celebration,
              from check-in breakfast and haldi carnival to sangeet night,
              pheras, warmala, wedding dinner, and a heartfelt farewell.
            </p>
            <div className="hero-meta">
              <div>
                <strong>03</strong>
                <span>Days</span>
              </div>
              <div>
                <strong>11 AM</strong>
                <span>Check-in</span>
              </div>
              <div>
                <strong>8 July</strong>
                <span>Farewell</span>
              </div>
            </div>
            <div className="hero-actions">
              <a className="primary-btn" href="#rsvp">
                RSVP With Love
              </a>
              <a className="secondary-btn" href="#events">
                Explore The Weekend
              </a>
            </div>
          </motion.div>

          <motion.div
            className="hero-card"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0.35}
          >
            <div className="date-badge">06 • 07 • 08 JULY</div>
            <div className="portrait-frame">
              <div className="portrait-glow" />
              <div className="portrait-image">
                <div className="portrait-texture" />
              </div>
            </div>
            <div className="hero-card-footer">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="location-link"
              >
                {venueName}
              </a>
              <span>Family Celebration</span>
            </div>
          </motion.div>
        </section>

        <section className="marquee-band" aria-label="Celebration highlights">
          <div className="marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </section>

        <motion.section
          id="story"
          className="section story-section"
        >
          <div className="section-heading">
            <p className="eyebrow">Our Story</p>
            <h2>Built from little moments that became a lifetime.</h2>
          </div>
          <div className="story-grid">
            {storySteps.map((step, index) => (
              <motion.article
                key={step.title}
                className="glass-card story-card"
                variants={fadeUp}
                custom={index * 0.12}
                {...revealOnScroll}
              >
                <span className="story-index">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="section promise-section"
        >
          <div className="promise-layout">
            <motion.div
              className="promise-visual glass-card"
              variants={fadeUp}
              custom={0.08}
              {...revealOnScroll}
            >
              <div className="promise-ring" />
              <div className="promise-ring promise-ring-inner" />
              <div className="promise-copy">
                <p className="eyebrow">The Feeling</p>
                <h2>A destination wedding filled with joyful rituals, family warmth, and unforgettable celebration.</h2>
              </div>
            </motion.div>
            <motion.div
              className="promise-list"
              variants={fadeUp}
              custom={0.2}
              {...revealOnScroll}
            >
              {promises.map((promise) => (
                <div key={promise} className="promise-item">
                  <span />
                  <p>{promise}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          id="events"
          className="section event-section"
        >
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Wedding Weekend</p>
              <h2>Our complete celebration itinerary for 6 July to 8 July.</h2>
            </div>
            <p className="section-note">
              We wanted every guest to know exactly how the celebrations flow,
              from arrival and breakfast to farewell after the wedding.
            </p>
          </div>
          <a
            className="venue-banner glass-card"
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            <span className="venue-label">Venue</span>
            <strong>{venueName}</strong>
            <p>{venueAddress}</p>
            <em>Open in Google Maps</em>
          </a>
          <div className="timeline">
            {events.map((event, index) => (
              <motion.article
                key={event.title}
                className="timeline-item"
                variants={fadeUp}
                custom={index * 0.14}
                {...revealOnScroll}
              >
                <div className="timeline-line" />
                <div className="timeline-content glass-card">
                  <p className="timeline-day">{event.day}</p>
                  <p className="timeline-date">{event.date}</p>
                  <h3>{event.title}</h3>
                  <p>{event.time}</p>
                  <span>{event.place}</span>
                  <ul className="timeline-list">
                    {event.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="section details-section"
        >
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Guest Experience</p>
              <h2>A wedding stay designed to feel smooth, joyful, and full of celebration.</h2>
            </div>
            <p className="section-note">
              These highlights help guests quickly understand the most important
              parts of the itinerary before they arrive.
            </p>
          </div>
          <div className="details-grid">
            {details.map((detail, index) => (
              <motion.article
                key={detail.label}
                className="detail-card glass-card"
                variants={fadeUp}
                custom={index * 0.12}
                {...revealOnScroll}
              >
                <p>{detail.label}</p>
                <h3>{detail.value}</h3>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="gallery"
          className="section gallery-section"
        >
          <div className="section-heading">
            <p className="eyebrow">Celebration Mood</p>
            <h2>A blend of festive color, poolside fun, grand rituals, and elegant wedding nights.</h2>
          </div>
          <div className="gallery-grid">
            <motion.div
              className="gallery-panel tall"
              variants={fadeUp}
              custom={0.05}
              {...revealOnScroll}
            >
              <div className="panel-overlay" />
              <span>Haldi Carnival</span>
            </motion.div>
            <motion.div
              className="gallery-panel wide"
              variants={fadeUp}
              custom={0.15}
              {...revealOnScroll}
            >
              <div className="panel-overlay" />
              <span>Sangeet Under Lights</span>
            </motion.div>
            <motion.div
              className="gallery-panel"
              variants={fadeUp}
              custom={0.25}
              {...revealOnScroll}
            >
              <div className="panel-overlay" />
              <span>Pool Party</span>
            </motion.div>
            <motion.div
              className="gallery-panel"
              variants={fadeUp}
              custom={0.35}
              {...revealOnScroll}
            >
              <div className="panel-overlay" />
              <span>Grand Warmala</span>
            </motion.div>
          </div>
          <div className="moment-strip">
            {moments.map((moment) => (
              <span key={moment}>{moment}</span>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="rsvp"
          className="section rsvp-section"
        >
          <motion.div
            className="rsvp-panel glass-card"
            variants={fadeUp}
            custom={0.1}
            {...revealOnScroll}
          >
            <p className="eyebrow">You Are Invited</p>
            <h2>We would be honored to celebrate this beautiful day with you and your family.</h2>
            <p>
              Please share your RSVP so we can prepare a warm, joyful, and
              memorable celebration for everyone joining us.
            </p>
            <div className="rsvp-layout">
              <form className="rsvp-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <select
                  name="attendance"
                  value={formData.attendance}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Will you attend?
                  </option>
                  <option>Happily attending</option>
                  <option>Joining virtually</option>
                  <option>Sending love from afar</option>
                </select>
                <select
                  name="dance"
                  value={formData.dance}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Willing to dance at sangeet?
                  </option>
                  <option>Yes, absolutely</option>
                  <option>Maybe, tell me more</option>
                  <option>No, but cheering loudly</option>
                </select>
                <input
                  type="number"
                  name="guestCount"
                  min="1"
                  placeholder="How many members are expected?"
                  value={formData.guestCount}
                  onChange={handleChange}
                  required
                />
                <textarea
                  name="note"
                  placeholder="Leave a note for the couple"
                  rows="4"
                  value={formData.note}
                  onChange={handleChange}
                />
                <button type="submit" className="primary-btn submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Sending RSVP..." : "Send Your RSVP"}
                </button>
                {submitState.message ? (
                  <p className={`form-message ${submitState.type}`}>{submitState.message}</p>
                ) : null}
              </form>
              <div className="rsvp-aside">
                <div className="rsvp-note">
                  <p className="eyebrow">A Note For Our Guests</p>
                  <h3>Your presence will make our celebration even more meaningful and special.</h3>
                </div>
                <div className="countdown-card">
                  <span>Wedding Invitation</span>
                  <strong>6 to 8 July 2026</strong>
                  <p>Join us for haldi, pool party, ring ceremony, sangeet, pheras, warmala, wedding dinner, and a heartfelt farewell.</p>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="countdown-link"
                  >
                    Open venue in Google Maps
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
}
