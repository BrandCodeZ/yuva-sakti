/**
 * Runs before first paint so the page never flashes the wrong theme.
 * Order of preference: the visitor's saved choice, then the OS setting.
 */
const themeScript = `(function(){try{var s=localStorage.getItem("ysr-theme");var d=window.matchMedia("(prefers-color-scheme: dark)").matches;var t=(s==="dark"||s==="light")?s:(d?"dark":"light");var r=document.documentElement;r.setAttribute("data-theme",t);r.style.colorScheme=t;}catch(e){document.documentElement.setAttribute("data-theme","light");}})();`;

export function ThemeScript() {
  return (
    <script id="theme-init" dangerouslySetInnerHTML={{ __html: themeScript }} />
  );
}
