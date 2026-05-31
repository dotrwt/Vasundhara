import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import vasundharaLogo from "../assets/Vasundhara_logo2.png"
import "./LandingPage.css";

export const LandingPage: React.FC = () => {
  const { admin } = useAuth();

  useEffect(() => {
    document.title = "Vasundhara — Land Registry Portal";
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="landing-page-body">
      {/* NAV */}
      <nav>
        <div className="nav-logo">
          <img src={vasundharaLogo} alt="Vasundhara Logo" />
          <span>Vasundhara</span>
        </div>
        <ul className="nav-links">
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#how">How it works</a>
          </li>
          <li>
            {admin ? (
              <Link to="/dashboard" className="nav-cta">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="nav-cta">
                Sign In
              </Link>
            )}
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-pattern"></div>
        <div className="hero-left">
          <div className="hero-eyebrow">Digital Land Registry of India</div>
          <h1>
            The land beneath
            <br />
            your feet,
            <br />
            <em>recorded.</em>
          </h1>
          <p className="hero-sub">
            Vasundhara is a modern, secure land audit and registry portal — bringing accuracy, and accountability to land records across India.
          </p>
          <div className="hero-actions">
            <Link to={admin ? "/dashboard" : "/login"} className="btn-primary">
              Access the Portal
            </Link>
            <a href="#how" className="btn-ghost">
              See how it works
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-num">Aadhaar</div>
              <div className="stat-label">Identity records</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">4-Step</div>
              <div className="stat-label">Streamlined enrollment</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">XLSX</div>
              <div className="stat-label">Export ready registry</div>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-right-inner">
            <div className="card-preview">
              <div className="card-preview-header">
                <div className="card-avatar">रा</div>
                <div>
                  <div className="card-title">Ramesh Kumar Sharma</div>
                  <div className="card-sub">Khasra #4521 · Bhopal District</div>
                </div>
              </div>
              <div className="card-row">
                <span className="card-row-label">Aadhaar</span>
                <span className="card-row-value">XXXX-XXXX-4782</span>
              </div>
              <div className="card-row">
                <span className="card-row-label">Tehsil</span>
                <span className="card-row-value">Huzur</span>
              </div>
              <div className="card-row">
                <span className="card-row-label">Village (Gao)</span>
                <span className="card-row-value">Ratibad</span>
              </div>
              <div className="card-row">
                <span className="card-row-label">Survey Nos.</span>
                <span className="card-row-value">124/2, 125, 126/A</span>
              </div>
              <div className="card-row">
                <span className="card-row-label">Status</span>
                <span className="card-row-value">
                  <span className="card-badge badge-green">Verified</span>
                </span>
              </div>
              <div className="card-land-total">
                <span className="clt-label">Total Landholding</span>
                <span className="clt-value">4.72 ha</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" id="features">
        <div className="reveal">
          <div className="section-label">What we offer</div>
          <h2>
            Built for the complexity
            <br />
            of Indian land records
          </h2>
          <p className="section-intro">
            From Aadhaar identity to multi-survey land parcels — every field in Vasundhara reflects the real structure of land administration in India.
          </p>
        </div>
        <div className="features-grid reveal">
          <div className="feature-cell">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div className="feature-title">Aadhaar & PAN Verified</div>
            <p className="feature-desc">
              Every land owner is enrolled with their 12-digit Aadhaar and PAN details, ensuring tamper-proof identity linkage for all records.
            </p>
          </div>
          <div className="feature-cell">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24">
                <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div className="feature-title">Granular Land Mapping</div>
            <p className="feature-desc">
              Record multiple survey numbers per landholding, capture District, Tehsil, and Gao details with precise hectare measurements.
            </p>
          </div>
          <div className="feature-cell">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="feature-title">4-Step Enrollment</div>
            <p className="feature-desc">
              A guided wizard captures personal details, land parameters, DMR account numbers, and final review with secure database commits.
            </p>
          </div>
          <div className="feature-cell">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="feature-title">Search & Pagination</div>
            <p className="feature-desc">
              Instantly query the full registry by name, Aadhaar, survey number or village with fast paginated results across thousands of records.
            </p>
          </div>
          <div className="feature-cell">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="feature-title">Excel Export</div>
            <p className="feature-desc">
              Download the complete registry as a structured XLSX spreadsheet — audit-ready, shareable with district offices, no formatting required.
            </p>
          </div>
          <div className="feature-cell">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="feature-title">JWT-Secured Access</div>
            <p className="feature-desc">
              Admin authentication using JSON Web Tokens and bcrypt-hashed passwords — all data protected behind role-based access control.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how">
        <div className="reveal">
          <div className="section-label">Process</div>
          <h2>
            From field to digital record
            <br />
            in four steps
          </h2>
          <p className="section-intro">A structured flow designed for district-level administrators, revenue officers, and tehsildars.</p>
        </div>
        <div className="steps-grid reveal">
          <div className="step">
            <div className="step-num">01</div>
            <div className="step-title">Personal Identity</div>
            <p className="step-desc">
              Enter the land owner's full name, mobile number, Aadhaar (12 digits), PAN, and Samagra ID to establish identity anchor.
            </p>
          </div>
          <div className="step">
            <div className="step-num">02</div>
            <div className="step-title">Land & Location</div>
            <p className="step-desc">
              Map the District, Tehsil, and Gao. Add survey (Khasra) numbers, specify the area in hectares, and verify the total holding.
            </p>
          </div>
          <div className="step">
            <div className="step-num">03</div>
            <div className="step-title">DMR Accounts</div>
            <p className="step-desc">
              Input specific bank account numbers for Kharif Cash, Kharif Kind, Rabi Cash, and Rabi Kind accounts for the land owner.
            </p>
          </div>
          <div className="step">
            <div className="step-num">04</div>
            <div className="step-title">Review & Commit</div>
            <p className="step-desc">
              A final live preview summarises all entered details, landholdings, and DMR accounts. Confirm to commit securely to the database.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">
          <img src={vasundharaLogo} alt="Vasundhara Logo" />
          <span>Vasundhara</span>
        </div>
        <div className="footer-copy">© 2026 Vasundhara. Land Registry Portal. This is a testing project and is not an official portal.</div>
        <div className="footer-links">
          <a href="https://github.com/dotrwt/Vasundhara">GitHub</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
