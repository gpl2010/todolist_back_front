export default function Header() {
  return (
    <header className="header">
      <svg className="header__waves" viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 70 C80 40 160 100 260 75 S460 40 600 80 V120 H0Z" fill="#2c5694" opacity=".55" />
        <path d="M0 95 C100 70 200 115 320 95 S520 75 600 100 V120 H0Z" fill="#33619f" opacity=".5" />
      </svg>

      <svg className="header__logo" viewBox="0 0 120 120" aria-hidden="true">
        <g transform="rotate(-8 60 60)">
          <rect x="22" y="18" width="62" height="82" rx="9" fill="#eaf2ff" stroke="#4f86d9" strokeWidth="4" />
          <rect x="40" y="10" width="26" height="12" rx="5" fill="#5b8fe0" />
          <path d="m32 44 5 5 9-10M32 64l5 5 9-10M32 84l5 5 9-10" fill="none" stroke="#1f3f73" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M54 42h22M54 62h22M54 82h14" stroke="#8db4ee" strokeWidth="4" strokeLinecap="round" />
        </g>
        <g transform="rotate(32 88 70)">
          <rect x="80" y="30" width="14" height="52" rx="3" fill="#3f86f0" />
          <path d="M80 82h14l-7 16Z" fill="#f4d6a8" />
          <path d="M84.5 92h5l-2.5 6Z" fill="#23467c" />
          <rect x="80" y="30" width="14" height="9" rx="3" fill="#f08a8a" />
        </g>
      </svg>

      <div className="header__title">
        <h1>To Do List</h1>
        <svg viewBox="0 0 300 14" aria-hidden="true">
          <path d="M4 9 C60 2 140 2 296 8" fill="none" stroke="#7fb0f5" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </div>

      <p className="header__tagline">
        Pequenas tarefas, grandes resultados!
      </p>
    </header>
  );
}
