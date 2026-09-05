/**
 * Stamps a saved theme choice on <html> before the first paint, so a reader who
 * picked light does not get a frame of dark on every navigation. Both root
 * layouts run this.
 */
export const THEME_SCRIPT = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t}}catch(e){}`;
