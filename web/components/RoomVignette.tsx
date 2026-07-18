/**
 * Living UI vignettes: tiny animated interface fragments, one per capability
 * family. Pure SVG + CSS keyframes (see the "Vignettes" block in globals.css),
 * so they cost nothing and keep animating forever. Used inside the glass room
 * modules on What We Build and as poster frames in the Studio proof reel.
 * [DEMO_VIDEO_TBD] the proof reel can swap these for real <video> clips.
 */
export default function RoomVignette({ id }: { id: string }) {
  return (
    <svg
      className={`vig vig--${id}`}
      viewBox="0 0 320 190"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* shared browser chrome */}
      <rect className="vig-frame" x="1" y="1" width="318" height="188" rx="6" />
      <circle className="vig-lamp" cx="16" cy="14" r="3" />
      <circle className="vig-lamp" cx="28" cy="14" r="3" />
      <circle className="vig-lamp" cx="40" cy="14" r="3" />
      <line className="vig-chrome" x1="1" y1="26" x2="319" y2="26" />
      {id === "websites" && (
        <g>
          <rect className="vig-ink" x="24" y="52" width="150" height="10" rx="2" />
          <rect className="vig-ink" x="24" y="70" width="110" height="10" rx="2" />
          <rect className="vig-dim" x="24" y="94" width="170" height="5" rx="2" />
          <rect className="vig-dim" x="24" y="106" width="140" height="5" rx="2" />
          <rect className="vig-cta" x="24" y="130" width="86" height="24" rx="2" />
          <rect className="vig-dim" x="220" y="52" width="76" height="102" rx="3" />
        </g>
      )}
      {id === "saas" && (
        <g>
          <rect className="vig-dim" x="16" y="38" width="56" height="140" rx="3" />
          <rect className="vig-card vig-card-1" x="86" y="42" width="66" height="52" rx="3" />
          <rect className="vig-card vig-card-2" x="160" y="42" width="66" height="52" rx="3" />
          <rect className="vig-card vig-card-3" x="234" y="42" width="66" height="52" rx="3" />
          <rect className="vig-card vig-card-4" x="86" y="104" width="140" height="66" rx="3" />
          <rect className="vig-card vig-card-5" x="234" y="104" width="66" height="66" rx="3" />
        </g>
      )}
      {id === "ai-automation" && (
        <g>
          <rect className="vig-bubble vig-bub-1" x="24" y="44" width="150" height="26" rx="12" />
          <rect className="vig-bubble vig-bub-2 vig-bub--gold" x="146" y="82" width="150" height="26" rx="12" />
          <rect className="vig-bubble vig-bub-3" x="24" y="120" width="120" height="26" rx="12" />
          <g className="vig-typing">
            <circle cx="160" cy="171" r="3" />
            <circle cx="172" cy="171" r="3" />
            <circle cx="184" cy="171" r="3" />
          </g>
        </g>
      )}
      {id === "crm-growth" && (
        <g>
          <line className="vig-chrome" x1="112" y1="26" x2="112" y2="189" />
          <line className="vig-chrome" x1="212" y1="26" x2="212" y2="189" />
          <rect className="vig-lead vig-lead-1" x="24" y="44" width="72" height="20" rx="2" />
          <rect className="vig-lead vig-lead-2" x="24" y="74" width="72" height="20" rx="2" />
          <rect className="vig-lead vig-lead-3" x="124" y="44" width="72" height="20" rx="2" />
          <rect className="vig-lead vig-lead-4" x="224" y="44" width="72" height="20" rx="2" />
        </g>
      )}
      {id === "technical-seo" && (
        <g>
          <path className="vig-gauge-track" d="M90 150 A 70 70 0 0 1 230 150" />
          <path className="vig-gauge-fill" d="M90 150 A 70 70 0 0 1 230 150" />
          <rect className="vig-dim" x="248" y="60" width="48" height="5" rx="2" />
          <rect className="vig-dim" x="248" y="74" width="40" height="5" rx="2" />
          <rect className="vig-dim" x="248" y="88" width="44" height="5" rx="2" />
          <g className="vig-ticks">
            <path className="vig-tick" d="M250 106 l4 5 l8 -9" />
            <path className="vig-tick" d="M250 126 l4 5 l8 -9" />
          </g>
        </g>
      )}
      {id === "data-dashboards" && (
        <g>
          <rect className="vig-bar vig-bar-1" x="34" y="80" width="22" height="86" />
          <rect className="vig-bar vig-bar-2" x="70" y="60" width="22" height="106" />
          <rect className="vig-bar vig-bar-3" x="106" y="96" width="22" height="70" />
          <rect className="vig-bar vig-bar-4" x="142" y="46" width="22" height="120" />
          <path className="vig-spark" d="M190 140 L216 112 L238 126 L262 84 L294 62" />
        </g>
      )}
      {id === "cloud-devops" && (
        <g>
          <rect className="vig-dim" x="34" y="46" width="180" height="32" rx="3" />
          <rect className="vig-dim" x="34" y="88" width="180" height="32" rx="3" />
          <rect className="vig-dim" x="34" y="130" width="180" height="32" rx="3" />
          <circle className="vig-led vig-led-1" cx="200" cy="62" r="4" />
          <circle className="vig-led vig-led-2" cx="200" cy="104" r="4" />
          <circle className="vig-led vig-led-3" cx="200" cy="146" r="4" />
          <path className="vig-uptime" d="M236 150 h60 M236 150 l8 0 4 -10 6 20 5 -10 h37" />
        </g>
      )}
      {id === "growth-infra" && (
        <g>
          <path className="vig-edge vig-edge-1" d="M60 150 L160 100" />
          <path className="vig-edge vig-edge-2" d="M160 100 L120 52" />
          <path className="vig-edge vig-edge-3" d="M160 100 L252 66" />
          <path className="vig-edge vig-edge-4" d="M160 100 L262 142" />
          <circle className="vig-node" cx="60" cy="150" r="6" />
          <circle className="vig-node" cx="120" cy="52" r="6" />
          <circle className="vig-node vig-node--gold" cx="160" cy="100" r="8" />
          <circle className="vig-node" cx="252" cy="66" r="6" />
          <circle className="vig-node" cx="262" cy="142" r="6" />
        </g>
      )}
    </svg>
  );
}
