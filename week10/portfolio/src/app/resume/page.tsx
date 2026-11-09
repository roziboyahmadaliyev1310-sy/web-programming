"use client";

import Link from "next/link";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";

export default function ResumePage() {
  return (
    <main className="resume-page">
      <div className="resume-toolbar">
        <Link className="button button--quiet" href="/">
          ← Back to portfolio
        </Link>
        <button
          className="button button--primary"
          type="button"
          onClick={() => window.print()}
        >
          Print / Save as PDF <span aria-hidden="true">↓</span>
        </button>
      </div>

      <article className="resume-sheet">
        <header>
          <p className="eyebrow">MIDNIGHT OBSERVATORY · FIELD GUIDE</p>
          <h1>{profile.name}</h1>
          <p className="resume-role">{profile.role}</p>
          <div className="resume-contact">
            <span>{profile.university}</span>
            <a
              href={`https://github.com/${profile.github}`}
              target="_blank"
              rel="noreferrer"
            >
              github.com/{profile.github}
            </a>
          </div>
        </header>

        <p className="resume-summary">
          {profile.intro} I’m growing my skills through responsive web
          interfaces, public API projects, and accessible browser experiences.
        </p>

        <section aria-labelledby="resume-projects">
          <h2 id="resume-projects">Selected projects</h2>
          {projects.map((project) => (
            <article className="resume-project" key={project.id}>
              <div className="resume-project-head">
                <h3>{project.name}</h3>
                <span className="timeline-when">
                  {project.status === "in-progress"
                    ? "IN PROGRESS"
                    : project.status === "coursework"
                      ? "COURSEWORK"
                      : "LIVE"}
                </span>
              </div>
              <p>{project.details}</p>
              <p className="resume-project-tech">
                {project.technologies.join(" · ")}
              </p>
            </article>
          ))}
        </section>

        <section aria-labelledby="resume-skills">
          <h2 id="resume-skills">Skills in use</h2>
          <ul className="resume-skill-list">
            {skills.map((skill) => (
              <li key={skill.id}>{skill.name}</li>
            ))}
          </ul>
        </section>

        <p className="resume-note">
          This snapshot is generated from projects documented in the Midnight
          Observatory portfolio. Certificate and contact details are not
          included unless verified.
        </p>
      </article>
    </main>
  );
}
