import type { Metadata } from "next";
import Link from "next/link";
import { LampProvider } from "@/components/buildlog/lamp";
import { profile } from "@/lib/portfolio-data";

export const metadata: Metadata = {
  title: "Colophon, privacy and terms",
  description:
    "How this site was built, what it does with your data (almost nothing), and the terms for using it.",
};

export default function ColophonPage() {
  return (
    <LampProvider>
      <div className="bl-root">
        <div className="bl-paper" aria-hidden="true" />
        <div className="bl-grain-layer" aria-hidden="true" />

        <article className="bl-doc">
          <Link className="bl-doc-back" href="/">
            Back to the log
          </Link>

          <h1>Colophon</h1>
          <p className="bl-doc-updated">Last updated 31 October 2026</p>

          <p>
            This is a personal portfolio belonging to {profile.full}. It is not a
            product, it does not have users, and nothing here is for sale. What
            follows is a plain account of how it was made and what it does with your
            data, because those pages are usually written by lawyers and are usually
            unreadable.
          </p>

          <h2>How it is built</h2>
          <ul>
            <li>
              <strong>Framework:</strong> Next.js on React, rendered on the server and
              deployed to Cloudflare Workers.
            </li>
            <li>
              <strong>Typefaces:</strong> Fraunces for display, Instrument Sans for
              body copy, Caveat for the handwriting, JetBrains Mono for the labels.
              All four are self-hosted at build time, so your browser never calls a
              font server while you read this.
            </li>
            <li>
              <strong>Hand-drawn annotations:</strong> rough-notation, triggered by an
              intersection observer as each line scrolls into view.
            </li>
            <li>
              <strong>The icons</strong> are drawn by hand as SVG paths rather than
              pulled from an icon library, which is why the corners do not quite meet.
            </li>
            <li>
              <strong>Grok,</strong> the companion in the corner, is a procedural SVG
              avatar driven by a JSON definition. It has 23 animations and 28
              expressions, and it picks one based on where you are on the page and how
              long you have been still.
            </li>
          </ul>

          <h2>Privacy</h2>
          <p>
            There is no analytics on this site. No Google Analytics, no Plausible, no
            Vercel Analytics, no pixel, no heatmap, no session recording. Nobody is
            watching you read.
          </p>
          <ul>
            <li>
              <strong>Cookies:</strong> none. The site sets no cookies at all.
            </li>
            <li>
              <strong>Local storage:</strong> one key, <code>buildlog-lamp</code>,
              which remembers whether you prefer the dark surface or the paper one. It
              never leaves your browser. Clear your site data and it is gone.
            </li>
            <li>
              <strong>Forms:</strong> there are none. The contact links open your own
              email client. Nothing is submitted to this site, so there is nothing for
              it to store.
            </li>
            <li>
              <strong>Server logs:</strong> the host, Cloudflare, keeps standard
              request logs that can include your IP address and user agent. That is
              ordinary infrastructure logging, it is not read by anyone here, and it
              is not combined with anything else.
            </li>
            <li>
              <strong>Third parties:</strong> if you follow a link to GitHub, LinkedIn
              or a live project, that site has its own privacy policy and this one
              stops applying.
            </li>
          </ul>
          <p>
            If you email {profile.full} through one of these links, your message and
            address sit in a normal email inbox and are used to reply to you. Nothing
            else.
          </p>

          <h2>Terms</h2>
          <ul>
            <li>
              The writing, the project descriptions, the portrait and the design of
              this site belong to {profile.full}. Please do not republish them as your
              own work.
            </li>
            <li>
              The figures quoted in the case files are drawn from real project work.
              Where a number is approximate it is written as approximate. If you are
              evaluating this for a role and want the detail behind any of them, ask
              and you will get it.
            </li>
            <li>
              Live project links point at real deployments. They are demonstrations of
              student and internship work, provided as they are, with no guarantee of
              uptime.
            </li>
            <li>
              This site is provided without warranty. It is a portfolio, not a
              service.
            </li>
          </ul>

          <h2>Credits</h2>
          <ul>
            <li>
              The avatar renderer is <code>@bible-strong/avatar-react</code> by
              Stéphane Montlouis-Calixte, used under the AGPL-3.0 licence.
            </li>
            <li>
              <code>rough-notation</code> by Preet Shihn, MIT licensed, draws every
              circle and underline on the page.
            </li>
            <li>
              The scattering grid in the stack section is adapted from a Codrops
              demo.
            </li>
          </ul>

          <h2>Questions</h2>
          <p>
            Email <a href={`mailto:${profile.email}`}>{profile.email}</a>. That address
            is read by a person.
          </p>
        </article>
      </div>
    </LampProvider>
  );
}
