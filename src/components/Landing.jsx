import React from "react";

const NavBar = () => {
  const links = ["Product", "Resources", "Pricing", "Customers", "New", "Contact"];
  return (
    <header className="linear-nav">
      <div className="linear-logo">
        <div className="logo-dot" />
        <span>Linear</span>
      </div>
      <nav className="linear-links">
        {links.map((link) => (
          <a key={link} href="#" className="nav-link">
            {link}
          </a>
        ))}
      </nav>
      <div className="nav-actions">
        <button className="ghost-btn">Log in</button>
        <button className="light-btn">Sign up</button>
      </div>
    </header>
  );
};

const ComplianceRow = () => {
  const items = ["SOC 2", "GDPR", "HIPPAA", "AI-ready", "ISO", "HiTrust"];
  return (
    <div className="compliance-row">
      {items.map((item) => (
        <div key={item} className="compliance-pill">
          <div className="pill-dot" />
          <span>{item}</span>
        </div>
      ))}
      <div className="badge-pill">Linear AI</div>
    </div>
  );
};

const InboxMock = ({ accent }) => {
  const list = [
    "LLM Chatbots",
    "Embed Clustering",
    "Payments API",
    "Upgrade Onboarding",
    "QA Automations",
    "Space framework",
  ];

  return (
    <div className="mock-board" data-accent={accent}>
      <aside className="mock-sidebar">
        <div className="sidebar-title">Linear</div>
        <div className="sidebar-menu">
          {['Inbox', 'My issues', 'Views', 'Projects'].map((item) => (
            <div key={item} className="sidebar-item">
              <div className="sidebar-dot" />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <div className="sidebar-folder">Projects</div>
        <div className="sidebar-stack">
          {list.map((item) => (
            <div key={item} className="sidebar-project">
              <span>{item}</span>
              <div className="project-status" />
            </div>
          ))}
        </div>
      </aside>
      <div className="mock-content">
        <div className="mock-toolbar">
          <div className="pill">Inbox · 236 issues</div>
          <div className="toolbar-actions">
            <span className="pill muted">Space framework</span>
            <span className="pill muted">Design systems</span>
          </div>
        </div>
        <div className="mock-layout">
          <div className="mock-list">
            {list.map((item, idx) => (
              <div key={item} className={`list-item ${idx === 2 ? "active" : ""}`}>
                <div>
                  <p className="list-title">{item}</p>
                  <p className="list-subtitle">Refactor sonic crawler</p>
                </div>
                <span className="badge">High</span>
              </div>
            ))}
          </div>
          <div className="mock-issue">
            <div className="issue-header">
              <div>
                <p className="issue-kicker">LUA-1293 · Refactor sonic crawler</p>
                <h4>Refactor sonic crawler</h4>
              </div>
              <button className="ghost-btn small">Deploy</button>
            </div>
            <div className="issue-body">
              <div className="code-block">
                <div className="code-line">
                  public class <span>SpaceSonicCrawler</span> extends CLICommand {'{'}
                </div>
                <div className="code-line">  public int run(List&lt;String&gt; args) {'{'} ... {'}'}</div>
                <div className="code-line">  public int run(CommandContext ctx) {'{'} ... {'}'}</div>
              </div>
              <div className="pill-row">
                <div className="pill">LLM Chatbots</div>
                <div className="pill">in progress</div>
                <div className="pill">Backend</div>
              </div>
              <div className="comment-card">
                <div className="avatar" />
                <div>
                  <p className="comment-title">We should separate the commit dispatched from CLI and job runner</p>
                  <p className="comment-body">
                    Let’s sync the project with the Space framework channel and ensure the milestones are aligned.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCards = () => {
  const cards = [
    {
      title: "Purpose-built for product development",
      subtitle: "Product planning",
    },
    { title: "Designed to move fast", subtitle: "Speed" },
    { title: "Crafted to perfection", subtitle: "Create" },
  ];

  return (
    <section className="feature-grid">
      <div className="section-header">
        <div>
          <p className="section-kicker">Product development</p>
          <h2>Made for modern product teams</h2>
        </div>
        <p className="section-subtitle">
          Linear is shaped by the practices and principles that drive great products. It’s designed for teams that move
          quickly, use resources wisely, and demand the highest-quality user experience. Make the switch.
        </p>
      </div>
      <div className="feature-card-grid">
        {cards.map((card) => (
          <div key={card.title} className="feature-card">
            <p className="card-pill">{card.subtitle}</p>
            <h3>{card.title}</h3>
            <div className="card-lines" />
          </div>
        ))}
      </div>
    </section>
  );
};

const AiSection = () => (
  <section className="ai-section">
    <div className="section-header">
      <div>
        <p className="section-kicker">Artificial intelligence</p>
        <h2>AI-assisted product development</h2>
      </div>
      <p className="section-subtitle">
        Linear for Agents. Choose from a variety of AI integrations to do work for you, from code generation to other
        technical tasks.
      </p>
      <div className="action-row">
        <button className="light-btn">Learn more</button>
      </div>
    </div>
    <div className="assign-card">
      <div className="assign-row">
        <span className="muted">Assign to</span>
        <div className="pill">Cursor</div>
      </div>
      <div className="assign-options">
        {['GitHub Copilot', 'Sentry', 'Linear', 'Devin'].map((agent, idx) => (
          <div key={agent} className={`assign-option ${idx === 0 ? "active" : ""}`}>
            <div className="avatar" />
            <span>{agent}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const OperationsSection = () => (
  <section className="operations-section">
    <div className="operation-card">
      <p className="section-kicker">AI operations</p>
      <h3>Self-driving product operations</h3>
      <p className="section-subtitle">
        Streamline your product development workflows with AI assistance for routine, manual tasks.
      </p>
      <div className="mini-panel">
        <div className="mini-header">Why this response was suggested</div>
        <p className="mini-body">
          Models use the instructions given to the previous issue when proposing next steps in the mock app.
        </p>
        <div className="mini-footer">
          <span className="badge">Alternatives</span>
          <button className="ghost-btn small">Accept suggestion</button>
        </div>
      </div>
    </div>
    <div className="operation-card">
      <p className="section-kicker">Plugins</p>
      <h3>Linear MCP</h3>
      <p className="section-subtitle">
        Connect Linear to your favorite tools including Cursor, Claude, ChatGPT, and more.
      </p>
      <div className="mini-panel">
        <div className="mini-header">I ask anything</div>
        <div className="chat-row">
          <div className="avatar" />
          <div>
            <p className="comment-title">Show me the issues assigned to Jane for AppRefactor</p>
            <p className="comment-body">Pulling your responses now…</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const TimelineSection = () => (
  <section className="timeline-section">
    <div className="section-header">
      <div>
        <p className="section-kicker">Product and long-term planning</p>
        <h2>Set the product direction</h2>
      </div>
      <p className="section-subtitle">
        Align your team around a unified product timeline. Plan, manage, and track all product initiatives with Linear’s
        visual planning tools.
      </p>
    </div>
    <div className="timeline-visual">
      <div className="timeline-grid">
        <div className="timeline-bar" style={{ left: "18%", width: "28%" }}>
          <span>Realtime inference</span>
        </div>
        <div className="timeline-bar" style={{ left: "42%", width: "22%" }}>
          <span>Prototypes</span>
        </div>
        <div className="timeline-bar muted" style={{ left: "65%", width: "20%" }}>
          <span>RLHF fine tuning</span>
        </div>
      </div>
    </div>
  </section>
);

const ProjectSection = () => (
  <section className="project-section">
    <div className="operation-card">
      <p className="section-kicker">Project management</p>
      <h3>Manage projects end-to-end</h3>
      <p className="section-subtitle">
        Consolidate specs, milestones, tasks, and other documentation in one centralized location.
      </p>
      <div className="mini-panel">
        <div className="mini-header">Project overview</div>
        <div className="project-meta">
          <div>
            <p className="muted">Milestones</p>
            <p className="comment-title">Design review</p>
          </div>
          <div>
            <p className="muted">Progress</p>
            <p className="comment-title">62%</p>
          </div>
        </div>
        <div className="progress-line">
          <span style={{ width: "62%" }} />
        </div>
      </div>
    </div>
    <div className="operation-card">
      <p className="section-kicker">Updates</p>
      <h3>Project updates</h3>
      <p className="section-subtitle">
        Communicate progress and project health with built-in project updates.
      </p>
      <div className="mini-panel">
        <div className="chat-row">
          <div className="avatar" />
          <div>
            <p className="comment-title">We are ready to launch next Thursday</p>
            <p className="comment-body">Sep 16</p>
          </div>
        </div>
        <div className="chat-row">
          <div className="avatar" />
          <div>
            <p className="comment-title">Edge deployment shipped</p>
            <p className="comment-body">Sep 8</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const IdeationSection = () => (
  <section className="ideation-section">
    <div className="ideation-top">
      <div className="ideation-card">
        <div className="section-header">
          <div>
            <p className="section-kicker">Specs</p>
            <h3>Ideate and specify what to build next</h3>
          </div>
          <p className="section-subtitle">
            Collaborative documents built into Linear keep product specs and work together on formatting options.
          </p>
        </div>
        <div className="doc-panel">
          <div className="doc-header">
            <span className="badge">Discovery</span>
            <span className="badge">Spec framework</span>
          </div>
          <div className="doc-body">
            <p className="comment-title">Collaborate on ideas</p>
            <p className="comment-body">Outline production and work together on feature requirements with rich formatting options.</p>
          </div>
        </div>
      </div>
    </div>
    <div className="ideation-grid">
      {[
        "Interactive strategy product",
        "Cross-team projects",
        "Milestones",
        "Progress insights",
      ].map((item) => (
        <div key={item} className="ideation-tile">
          <div className="tile-icon" />
          <p className="comment-title">{item}</p>
          <p className="comment-body">Detailed structure to keep everyone aligned.</p>
        </div>
      ))}
    </div>
  </section>
);

const FoundationsSection = () => (
  <section className="foundations-section">
    <div className="foundation-copy">
      <p className="section-kicker">Under the hood</p>
      <h2>Built on strong foundations</h2>
      <p className="section-subtitle">
        Linear is simple to use, yet it’s easy to overlook the wealth of user-guided features behind the scenes that
        keep Linear robust, safe, and blazing fast.
      </p>
      <div className="foundation-grid">
        <div>
          <h4>Linear Sync Engine</h4>
          <p className="comment-body">Built with a high-performance architecture and sync across devices.</p>
        </div>
        <div>
          <h4>Enterprise-ready security</h4>
          <p className="comment-body">Best-in-class security practices built into every aspect of Linear.</p>
        </div>
        <div>
          <h4>Engineered for scale</h4>
          <p className="comment-body">Built for teams of all sizes managing big roadmaps and projects.</p>
        </div>
      </div>
    </div>
    <div className="blueprint-panel">
      <div className="blueprint-grid">
        <div className="blueprint-block large" />
        <div className="blueprint-block" />
        <div className="blueprint-block" />
      </div>
    </div>
  </section>
);

const Footer = () => {
  const columns = {
    Features: ["Roadmaps", "Inbox", "Cycles", "Views", "AI", "Projects", "Issue types", "Backlog", "Automations", "Integrations", "Linear API", "Mobile"],
    Product: ["Pricing", "Download", "Changelog", "Documentation", "Status", "Security"],
    Company: ["About", "Careers", "Open roles", "Referral Program", "Diversity", "Brand", "Blog"],
    Resources: ["Developers", "Startup program", "Community", "Templates", "Library", "Email"] ,
    Connect: ["Contact us", "Support", "X/Twitter", "Discord", "Slack", "Privacy", "Terms"],
  };

  return (
    <footer className="linear-footer">
      <div className="cta-row">
        <div>
          <h2>Plan the present. Build the future.</h2>
        </div>
        <div className="action-row">
          <button className="ghost-btn">Contact sales</button>
          <button className="light-btn">Get started</button>
        </div>
      </div>
      <div className="footer-grid">
        {Object.entries(columns).map(([title, items]) => (
          <div key={title} className="footer-column">
            <h4>{title}</h4>
            <div className="footer-links">
              {items.map((item) => (
                <a key={item} href="#">
                  {item}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
};

const Landing = () => {
  return (
    <div className="linear-landing">
      <NavBar />
      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <ComplianceRow />
            <div className="hero-title-block">
              <h1>Linear is a purpose-built tool for planning and building products</h1>
              <p>
                Meet the system for modern software development. Streamline issues, projects, and product roadmaps.
              </p>
              <div className="action-row">
                <button className="light-btn">Start building</button>
                <button className="ghost-btn">New: Linear agent for Slack</button>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="angled-layer shadow" />
            <div className="angled-layer overlay" />
            <InboxMock accent="primary" />
          </div>
        </section>

        <section className="hero-section secondary">
          <div className="hero-visual full">
            <div className="angled-layer shadow" />
            <InboxMock accent="secondary" />
          </div>
        </section>

        <FeatureCards />
        <AiSection />
        <OperationsSection />
        <TimelineSection />
        <ProjectSection />
        <IdeationSection />
        <FoundationsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
