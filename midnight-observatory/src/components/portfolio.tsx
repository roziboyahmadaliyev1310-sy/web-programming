"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  siGithub,
  siHtml5,
  siJavascript,
  siNextdotjs,
  siTailwindcss,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";
import { certifications } from "@/data/certifications";
import { profile } from "@/data/profile";
import { projects, type ProjectId } from "@/data/projects";
import { skillCategories, skills, type SkillCategory } from "@/data/skills";
import { terminalCommands, type TerminalCommand } from "@/data/terminal-commands";
import { timeline } from "@/data/timeline";

const navigation = [
  { id: "about", label: "About", symbol: "◎" },
  { id: "skills", label: "Skills", symbol: "✧" },
  { id: "certifications", label: "Certifications", symbol: "◇" },
  { id: "projects", label: "Projects", symbol: "✦" },
  { id: "resume", label: "Resume", symbol: "▤" },
  { id: "contact", label: "Contact", symbol: "↗" },
] as const;

const brandIcons: Record<string, SimpleIcon> = {
  "html-css": siHtml5,
  javascript: siJavascript,
  typescript: siTypescript,
  nextjs: siNextdotjs,
  tailwind: siTailwindcss,
  github: siGithub,
};

type Theme = "night" | "daybreak";
type Connector = { projectId: ProjectId; path: string };

function Counter({
  value,
  suffix = "",
}: {
  value: number | null;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (value === null) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let frame = 0;
    if (reducedMotion) {
      frame = requestAnimationFrame(() => setCount(value));
      return () => cancelAnimationFrame(frame);
    }

    const start = performance.now();
    const duration = 950;

    const update = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{value === null ? "—" : `${count}${suffix}`}</>;
}

function SkillMark({ skillId, mark }: { skillId: string; mark: string }) {
  const icon = brandIcons[skillId];

  if (!icon) return <span className="skill-mark-text">{mark}</span>;

  return (
    <svg
      className="skill-mark-icon"
      viewBox="0 0 24 24"
      role="img"
      aria-label={`${icon.title} logo`}
    >
      <path d={icon.path} />
    </svg>
  );
}

function ProjectCard({
  project,
  active,
  setCardRef,
}: {
  project: (typeof projects)[number];
  active: boolean;
  setCardRef: (id: ProjectId, node: HTMLElement | null) => void;
}) {
  return (
    <article
      className={`project-card project-card--${project.visual}${active ? " is-connected" : ""}`}
      id={`project-${project.id}`}
      ref={(node) => setCardRef(project.id, node)}
      data-project-id={project.id}
    >
      <div className="project-art" aria-hidden="true">
        <span className="project-art-orbit" />
        <span className="project-art-glyph">
          {project.visual === "books"
            ? "▤"
            : project.visual === "api"
              ? "{ }"
              : project.visual === "atlas"
                ? "✧"
                : "✦"}
        </span>
        <span className="project-art-index">{project.number}</span>
      </div>
      <div className="project-copy">
        <div className="project-meta">
          <span>{project.kind}</span>
          <span className={`project-status project-status--${project.status}`}>
            {project.status === "in-progress"
              ? "In progress"
              : project.status === "coursework"
                ? "Coursework"
                : "Live"}
          </span>
        </div>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <ul className="technology-list" aria-label="Technologies used">
          {project.technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
        <div className="project-links">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer">
              Visit project <span aria-hidden="true">↗</span>
            </a>
          )}
          {project.sourceUrl && (
            <a href={project.sourceUrl} target="_blank" rel="noreferrer">
              Source <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function Portfolio() {
  const [theme, setTheme] = useState<Theme>("night");
  const [activeSection, setActiveSection] = useState("top");
  const [activeRole, setActiveRole] = useState(0);
  const [activeCategory, setActiveCategory] = useState<SkillCategory | "All">(
    "All",
  );
  const [selectedSkillId, setSelectedSkillId] = useState(skills[0].id);
  const [activeCommand, setActiveCommand] =
    useState<TerminalCommand>("whoami");
  const [repoCount, setRepoCount] = useState<number | null>(null);
  const [githubStatus, setGithubStatus] = useState("Loading public GitHub stats");
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [constellationSize, setConstellationSize] = useState({
    width: 0,
    height: 0,
  });
  const [openCertification, setOpenCertification] = useState<number | null>(
    null,
  );

  const constellationRef = useRef<HTMLDivElement>(null);
  const skillButtonRefs = useRef(new Map<string, HTMLButtonElement>());
  const projectCardRefs = useRef(new Map<ProjectId, HTMLElement>());

  const selectedSkill = useMemo(
    () => skills.find((skill) => skill.id === selectedSkillId) ?? skills[0],
    [selectedSkillId],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-25% 0px -58% 0px", threshold: [0, 0.2, 0.5] },
    );

    const sections = navigation
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const timer = window.setInterval(() => {
      setActiveRole((current) => (current + 1) % profile.roles.length);
    }, 2550);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadRepositoryCount() {
      try {
        const response = await fetch(
          `https://api.github.com/users/${profile.github}`,
          {
            headers: { Accept: "application/vnd.github+json" },
            signal: controller.signal,
          },
        );
        if (!response.ok) {
          throw new Error(`GitHub returned ${response.status}`);
        }

        const data: unknown = await response.json();
        if (
          typeof data !== "object" ||
          data === null ||
          !("public_repos" in data) ||
          typeof data.public_repos !== "number"
        ) {
          throw new Error("GitHub response did not include a public repo count");
        }

        setRepoCount(data.public_repos);
        setGithubStatus("Public repository count loaded from GitHub");
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Could not load the public GitHub repository count.", error);
        setGithubStatus("Public GitHub stats are temporarily unavailable");
      }
    }

    void loadRepositoryCount();
    return () => controller.abort();
  }, []);

  const updateConstellation = useCallback(() => {
    const root = constellationRef.current;
    const skillNode = skillButtonRefs.current.get(selectedSkillId);
    if (!root || !skillNode) return;

    const rootRect = root.getBoundingClientRect();
    const skillRect = skillNode.getBoundingClientRect();
    const width = root.clientWidth;
    const height = root.clientHeight;
    const startX = skillRect.left + skillRect.width / 2 - rootRect.left;
    const startY = skillRect.top + skillRect.height / 2 - rootRect.top;
    const nextConnectors: Connector[] = [];

    for (const projectId of selectedSkill.usedIn) {
      const card = projectCardRefs.current.get(projectId);
      if (!card) continue;

      const cardRect = card.getBoundingClientRect();
      const endX =
        cardRect.left + Math.min(cardRect.width * 0.24, 140) - rootRect.left;
      const endY = cardRect.top + Math.min(cardRect.height * 0.28, 90) - rootRect.top;
      const bend = Math.max(50, Math.abs(endX - startX) * 0.38);
      const direction = endX >= startX ? 1 : -1;

      nextConnectors.push({
        projectId,
        path: `M ${startX} ${startY} C ${startX + bend * direction} ${startY}, ${endX - bend * direction} ${endY}, ${endX} ${endY}`,
      });
    }

    setConstellationSize({ width, height });
    setConnectors(nextConnectors);
  }, [selectedSkill, selectedSkillId]);

  useEffect(() => {
    const root = constellationRef.current;
    if (!root) return;

    let frame = 0;
    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateConstellation);
    };
    const observer = new ResizeObserver(scheduleUpdate);

    observer.observe(root);
    scheduleUpdate();
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [updateConstellation]);

  const setProjectCardRef = useCallback(
    (id: ProjectId, node: HTMLElement | null) => {
      if (node) projectCardRefs.current.set(id, node);
      else projectCardRefs.current.delete(id);
    },
    [],
  );

  const handleSkillKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const columns = window.matchMedia("(max-width: 430px)").matches
      ? 2
      : window.matchMedia("(max-width: 900px)").matches
        ? 3
        : 4;
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % skills.length;
    if (event.key === "ArrowLeft")
      nextIndex = (index - 1 + skills.length) % skills.length;
    if (event.key === "ArrowDown")
      nextIndex = Math.min(index + columns, skills.length - 1);
    if (event.key === "ArrowUp") nextIndex = Math.max(index - columns, 0);
    if (nextIndex !== index) {
      event.preventDefault();
      const next = skills[nextIndex];
      setSelectedSkillId(next.id);
      skillButtonRefs.current.get(next.id)?.focus();
    }
  };

  const featuredCount = projects.length;
  const shippedCount = projects.filter(
    (project) => project.status !== "in-progress",
  ).length;
  const closeCertification = useCallback(
    () => setOpenCertification(null),
    [],
  );

  return (
    <div className="site-shell" data-theme={theme} id="top">
      <div className="sky-noise" aria-hidden="true" />
      <div className="sky-glow sky-glow--one" aria-hidden="true" />
      <div className="sky-glow sky-glow--two" aria-hidden="true" />

      <header className="masthead">
        <a className="wordmark" href="#top" aria-label="Midnight Observatory home">
          <span className="wordmark-icon" aria-hidden="true">
            ✦
          </span>
          <span>
            MIDNIGHT <b>OBSERVATORY</b>
          </span>
        </a>
        <div className="masthead-actions">
          <span className="availability">
            <span className="availability-dot" aria-hidden="true" />
            OPEN TO LEARNING
          </span>
          <button
            className="theme-toggle"
            type="button"
            onClick={() =>
              setTheme((current) =>
                current === "night" ? "daybreak" : "night",
              )
            }
            aria-label={
              theme === "night"
                ? "Switch to the daybreak color theme"
                : "Switch to the night sky color theme"
            }
          >
            <span aria-hidden="true">{theme === "night" ? "☼" : "☾"}</span>
            {theme === "night" ? "Daybreak" : "Night sky"}
          </button>
        </div>
      </header>

      <nav className="star-dock" aria-label="Main navigation">
        {navigation.map((item) => (
          <a
            key={item.id}
            className={`dock-link${activeSection === item.id ? " is-active" : ""}`}
            href={`#${item.id}`}
            aria-label={item.label}
            aria-current={activeSection === item.id ? "location" : undefined}
            title={item.label}
          >
            <span className="dock-symbol" aria-hidden="true">
              {item.symbol}
            </span>
            <span className="dock-label">{item.label}</span>
          </a>
        ))}
      </nav>

      <main>
        <section className="hero-section section-frame" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-star" aria-hidden="true">
                ✦
              </span>
              FIELD NOTES · WEB & SOFTWARE
            </p>
            <p className="whoami-line">
              <span aria-hidden="true">&gt;</span> observing: {profile.name}
              <span className="terminal-caret" aria-hidden="true" />
            </p>
            <h1 id="hero-title">
              Building small things
              <br />
              for a <span>wide-open web.</span>
            </h1>
            <p className="hero-role" aria-live="polite">
              I’m <span key={activeRole}>{profile.roles[activeRole]}</span>
              <i aria-hidden="true">.</i>
            </p>
            <p className="hero-bio">
              <span>Computer Engineering student at Gachon University.</span>
              <span>Learning through useful web apps and public APIs.</span>
              <span>Curious about accessible, thoughtful software.</span>
            </p>
            <div className="hero-actions">
              <a className="button button--primary" href="#projects">
                Explore my projects <span aria-hidden="true">↘</span>
              </a>
              <a className="button button--quiet" href="#contact">
                Get in touch <span aria-hidden="true">↗</span>
              </a>
              <a className="button button--quiet" href="/resume">
                Resume <span aria-hidden="true">↗</span>
              </a>
            </div>
            <a
              className="scroll-cue"
              href="#about"
              aria-label="Scroll to About"
            >
              <span className="scroll-line" aria-hidden="true" />
              SCROLL TO EXPLORE
            </a>
          </div>

          <div className="portrait-stage" aria-label="Portfolio photo">
            <div className="portrait-orbit portrait-orbit--outer" aria-hidden="true" />
            <div className="portrait-orbit portrait-orbit--inner" aria-hidden="true" />
            <div className="portrait-window">
              <Image
                src="/images/portfolio-photo.jpg"
                alt="Portfolio headshot photo of Ruziboy"
                fill
                priority
                sizes="(max-width: 720px) 72vw, 360px"
                className="portrait-image"
              />
              <div className="portrait-wash" aria-hidden="true" />
              <span className="portrait-caption">PORTFOLIO PHOTO · 01</span>
            </div>
            <span className="orbit-chip orbit-chip--one">JavaScript</span>
            <span className="orbit-chip orbit-chip--two">Open APIs</span>
            <span className="orbit-chip orbit-chip--three">Web craft</span>
            <span className="orbit-chip orbit-chip--four">Curiosity</span>
            <span className="portrait-star portrait-star--one" aria-hidden="true">
              ✧
            </span>
            <span className="portrait-star portrait-star--two" aria-hidden="true">
              ✦
            </span>
          </div>

          <div className="readings" aria-label="Portfolio readings">
            <div className="reading">
              <span className="reading-value">
                <Counter value={repoCount} suffix="+" />
              </span>
              <span className="reading-label">PUBLIC REPOS</span>
            </div>
            <div className="reading">
              <span className="reading-value">
                <Counter value={featuredCount} />
              </span>
              <span className="reading-label">PROJECTS TRACKED</span>
            </div>
            <div className="reading">
              <span className="reading-value">
                <Counter value={certifications.length} />
              </span>
              <span className="reading-label">VERIFIED CERTS</span>
            </div>
            <div className="reading">
              <span className="reading-value">
                <Counter value={shippedCount} />
              </span>
              <span className="reading-label">PROJECTS SHIPPED</span>
            </div>
            <span className="sr-only" aria-live="polite">
              {githubStatus}
            </span>
          </div>
        </section>

        <section className="section-frame about-section" id="about">
          <SectionHeading
            number="01"
            label="A LITTLE ABOUT ME"
            title="Engineer in the making."
            subtitle="Learning by exploring, building, and sharing what works."
          />

          <div className="about-grid">
            <div className="about-copy">
              {profile.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <div className="about-signoff">
                <span className="signoff-star" aria-hidden="true">
                  ✦
                </span>
                <span>Always curious. Always building.</span>
              </div>
            </div>

            <div className="mission-console">
              <div className="console-topline">
                <span className="console-light" aria-hidden="true" />
                <span>MISSION CONSOLE</span>
                <span className="console-state">ONLINE</span>
              </div>
              <div className="console-screen">
                <p className="console-prompt">ruziboy@observatory ~ %</p>
                <p className="console-command">
                  $ {activeCommand}
                  <span className="terminal-caret" aria-hidden="true" />
                </p>
                <p className="console-output" aria-live="polite">
                  {terminalCommands[activeCommand]}
                </p>
              </div>
              <div className="command-list" aria-label="Mission console commands">
                {(Object.keys(terminalCommands) as TerminalCommand[]).map(
                  (command) => (
                    <button
                      type="button"
                      key={command}
                      className={
                        activeCommand === command ? "command-chip is-active" : "command-chip"
                      }
                      onClick={() => setActiveCommand(command)}
                      aria-pressed={activeCommand === command}
                    >
                      {command}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="timeline-block">
            <div className="subsection-title">
              <span>THE ORBIT SO FAR</span>
              <span className="subsection-rule" aria-hidden="true" />
              <span className="subsection-note">A growing journey</span>
            </div>
            <ol className="orbit-timeline">
              {timeline.map((milestone, index) => (
                <li className="timeline-stop" key={milestone.title}>
                  <span className="timeline-orbit" aria-hidden="true" />
                  <span className="timeline-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="timeline-when">{milestone.when}</span>
                  <h3>{milestone.title}</h3>
                  <p className="timeline-place">{milestone.place}</p>
                  <p className="timeline-detail">{milestone.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <div className="work-atlas" ref={constellationRef}>
          <svg
            className="constellation-lines"
            viewBox={`0 0 ${constellationSize.width} ${constellationSize.height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {connectors.map((connector) => (
              <path
                className="constellation-path"
                key={connector.projectId}
                d={connector.path}
              />
            ))}
          </svg>

          <section className="section-frame skills-section" id="skills">
            <SectionHeading
              number="02"
              label="THE STAR MAP"
              title="Pick a skill. Find the work."
              subtitle="Every skill here points to a project where I’ve used it."
            />

            <div className="category-filters" aria-label="Filter skills by category">
              {(["All", ...skillCategories] as const).map((category) => (
                <button
                  type="button"
                  key={category}
                  className={
                    activeCategory === category
                      ? "filter-chip is-active"
                      : "filter-chip"
                  }
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={activeCategory === category}
                >
                  {category}
                </button>
              ))}
            </div>
            {activeCategory !== "All" &&
              !skills.some((skill) => skill.category === activeCategory) && (
                <p className="empty-filter-note">
                  No {activeCategory} skills are documented yet. I only add a
                  skill when it connects to real project work.
                </p>
              )}

            <div className="skills-layout">
              <div className="skill-map" role="group" aria-label="Select a skill">
                {skills.map((skill, index) => {
                  const dimmed =
                    activeCategory !== "All" &&
                    skill.category !== activeCategory;
                  return (
                    <button
                      key={skill.id}
                      ref={(node) => {
                        if (node) skillButtonRefs.current.set(skill.id, node);
                        else skillButtonRefs.current.delete(skill.id);
                      }}
                      type="button"
                      className={`skill-star${selectedSkillId === skill.id ? " is-selected" : ""}${dimmed ? " is-dimmed" : ""}`}
                      onClick={() => setSelectedSkillId(skill.id)}
                      onKeyDown={(event) => handleSkillKeyDown(event, index)}
                      aria-pressed={selectedSkillId === skill.id}
                      aria-label={`${skill.name}, ${skill.category}`}
                      title={`${skill.name} · ${skill.category}`}
                    >
                      <span className="skill-icon">
                        <SkillMark skillId={skill.icon ?? ""} mark={skill.mark} />
                      </span>
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-category">{skill.category}</span>
                    </button>
                  );
                })}
              </div>

              <aside className="skill-detail" aria-live="polite" aria-atomic="true">
                <div className="detail-starfield" aria-hidden="true">
                  <span>✦</span>
                  <span>✧</span>
                  <span>·</span>
                </div>
                <div className="detail-mark">
                  <SkillMark
                    skillId={selectedSkill.icon ?? ""}
                    mark={selectedSkill.mark}
                  />
                </div>
                <p className="detail-kicker">{selectedSkill.category}</p>
                <h3>{selectedSkill.name}</h3>
                <p className="detail-note">{selectedSkill.note}</p>
                <div className="used-in-block">
                  <span className="used-in-label">CONNECTED PROJECTS</span>
                  <ul className="used-in-list">
                    {selectedSkill.usedIn.map((projectId) => {
                      const project = projects.find(
                        (item) => item.id === projectId,
                      );
                      if (!project) return null;
                      return (
                        <li key={projectId}>
                          <a href={`#project-${projectId}`}>
                            <span className="connection-dot" aria-hidden="true">
                              ✦
                            </span>
                            {project.name}
                            <span aria-hidden="true">↗</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </aside>
            </div>
            <p className="constellation-hint">
              <span aria-hidden="true">⌁</span> The gold paths connect your
              selected skill to the projects below. Use arrow keys to explore
              the skill stars.
            </p>
          </section>

          <section className="section-frame projects-section" id="projects">
            <SectionHeading
              number="04"
              label="SELECTED WORK"
              title="Built under these skies."
              subtitle="A few projects, experiments, and works in progress."
            />
            <div className="project-grid">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  active={selectedSkill.usedIn.includes(project.id)}
                  setCardRef={setProjectCardRef}
                />
              ))}
            </div>
          </section>
        </div>

        <section
          className="section-frame certifications-section"
          id="certifications"
        >
          <SectionHeading
            number="03"
            label="VERIFIED LEARNING"
            title="Mission patches."
            subtitle="Credentials are listed only when I can provide real details and a verification source."
          />
          {certifications.length > 0 ? (
            <div className="certification-grid">
              {certifications.map((certification, index) => (
                <article className="cert-card" key={`${certification.issuer}-${certification.title}`}>
                  <span className="cert-shield" aria-hidden="true">
                    ◈
                  </span>
                  <span className="cert-issuer">{certification.issuer}</span>
                  <h3>{certification.title}</h3>
                  <span className="cert-date">{certification.date}</span>
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => setOpenCertification(index)}
                  >
                    What’s covered <span aria-hidden="true">↗</span>
                  </button>
                  {certification.verifyUrl && (
                    <a
                      className="text-link"
                      href={certification.verifyUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Verify <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="cert-empty">
              <span className="empty-constellation" aria-hidden="true">
                ✧ <b>·</b> ✦ <b>·</b> ✧
              </span>
              <div>
                <p className="empty-kicker">NO PATCHES LOGGED YET</p>
                <h3>Only the real ones belong here.</h3>
                <p>
                  I haven’t added a verified certificate record yet. This
                  section will show the issuer, date, covered topics, and a
                  working verification link when those details are ready.
                </p>
              </div>
              <span className="cert-count">{certifications.length} verified</span>
            </div>
          )}
        </section>

        {openCertification !== null && certifications[openCertification] && (
          <CertificationDialog
            certification={certifications[openCertification]}
            onClose={closeCertification}
          />
        )}

        <section className="section-frame resume-section" id="resume">
          <div className="resume-card">
            <div className="resume-copy">
              <p className="eyebrow">05 · THE FIELD GUIDE</p>
              <h2>A one-page snapshot.</h2>
              <p>
                Explore a concise resume built from the projects and skills
                documented here. Use your browser’s print dialog to save it as
                a PDF.
              </p>
            </div>
            <a className="button button--primary" href="/resume">
              Open printable resume <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section className="section-frame contact-section" id="contact">
          <SectionHeading
            number="06"
            label="SIGNAL FROM EARTH"
            title="Let’s keep in touch."
            subtitle="Have a project, a question, or a good idea? Find me on GitHub."
          />
          <div className="contact-card">
            <span className="contact-star" aria-hidden="true">
              ✦
            </span>
            <div>
              <p className="contact-kicker">PUBLIC PROFILE</p>
              <h3>{profile.github}</h3>
              <p>Follow along as I learn, build, and share new work.</p>
            </div>
            <a
              className="button button--primary"
              href={`https://github.com/${profile.github}`}
              target="_blank"
              rel="noreferrer"
            >
              Open GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a href="#top" className="footer-mark">
          <span aria-hidden="true">✦</span> RUZIBOY
        </a>
        <span>Made with curiosity, code, and a little stardust.</span>
        <a href="#top">Back to the sky ↑</a>
      </footer>
    </div>
  );
}

function SectionHeading({
  number,
  label,
  title,
  subtitle,
}: {
  number: string;
  label: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="section-heading">
      <div className="section-plate" aria-hidden="true">
        <span>{number}</span>
      </div>
      <div className="section-heading-copy">
        <p className="section-label">{label}</p>
        <h2>{title}</h2>
        <p className="section-subtitle">{subtitle}</p>
      </div>
      <span className="heading-star" aria-hidden="true">
        ✧
      </span>
    </div>
  );
}

function CertificationDialog({
  certification,
  onClose,
}: {
  certification: (typeof certifications)[number];
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();

    return () => {
      if (dialog.open) dialog.close();
    };
  }, [onClose]);

  return (
    <dialog
      className="cert-dialog"
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div className="dialog-topline">
        <span className="cert-issuer">{certification.issuer}</span>
        <button
          type="button"
          className="dialog-close"
          onClick={onClose}
          aria-label="Close certificate details"
        >
          ×
        </button>
      </div>
      <h2>{certification.title}</h2>
      <p className="cert-date">{certification.date}</p>
      <h3>What’s covered</h3>
      <ul>
        {certification.coveredTopics.map((topic) => (
          <li key={topic}>{topic}</li>
        ))}
      </ul>
      {certification.verifyUrl && (
        <a
          className="button button--primary"
          href={certification.verifyUrl}
          target="_blank"
          rel="noreferrer"
        >
          Verify certificate <span aria-hidden="true">↗</span>
        </a>
      )}
    </dialog>
  );
}
