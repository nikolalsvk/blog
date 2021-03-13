import React from "react"

import { COLORS } from "./src/contexts/theme"

const MagicScriptTag = () => {
  let codeToRunOnClient = `
(function() {
  function getInitialColorMode() {
    const persistedColorPreference = window.localStorage.getItem("theme")
    const hasPersistedPreference = typeof persistedColorPreference === "string"

    // If the user has explicitly chosen light or dark,
    // let's use it. Otherwise, this value will be null.
    if (hasPersistedPreference) {
      return persistedColorPreference
    }

    // If they haven't been explicit, let's check the media
    // query
    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    const hasMediaQueryPreference = typeof mql.matches === "boolean"
    if (hasMediaQueryPreference) {
      return mql.matches ? "purple" : "normal"
    }

    // If they are using a browser/OS that doesn't support
    // color themes, let's default to 'light'.
    return "normal"
  }
  const colorMode = getInitialColorMode();
  const root = document.documentElement;
  root.style.setProperty(
    '--color-primary',
    colorMode === 'purple'
      ? '${COLORS.purple.primary}'
      : '${COLORS.normal.primary}'
  );
  root.style.setProperty(
    '--color-secondary',
    colorMode === 'purple'
      ? '${COLORS.purple.secondary}'
      : '${COLORS.normal.secondary}'
  );
  root.style.setProperty(
    '--color-text',
    colorMode === 'purple'
      ? '${COLORS.purple.text}'
      : '${COLORS.normal.text}'
  );
  root.style.setProperty(
    '--color-background',
    colorMode === 'purple'
      ? '${COLORS.purple.background}'
      : '${COLORS.normal.background}'
  );
  root.style.setProperty('--initial-color-mode', colorMode);
})()`

  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: codeToRunOnClient }} />
}

export const onRenderBody = ({ setPreBodyComponents }) => {
  setPreBodyComponents(<MagicScriptTag key="theme-magic-script" />)
}
