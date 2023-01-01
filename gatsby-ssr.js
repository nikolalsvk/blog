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
      return mql.matches ? "dark" : "light"
    }

    // If they are using a browser/OS that doesn't support
    // color themes, let's default to 'light'.
    return "light"
  }
  const colorMode = getInitialColorMode();
  const root = document.documentElement;
  root.style.setProperty(
    '--color-primary',
    colorMode === 'dark'
      ? '${COLORS.dark.primary}'
      : '${COLORS.light.primary}'
  );
  root.style.setProperty(
    '--color-secondary',
    colorMode === 'dark'
      ? '${COLORS.dark.secondary}'
      : '${COLORS.light.secondary}'
  );
  root.style.setProperty(
    '--color-text',
    colorMode === 'dark'
      ? '${COLORS.dark.text}'
      : '${COLORS.light.text}'
  );
  root.style.setProperty(
    '--color-background',
    colorMode === 'dark'
      ? '${COLORS.dark.background}'
      : '${COLORS.light.background}'
  );
  root.style.setProperty('--initial-color-mode', colorMode);
})()`

  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: codeToRunOnClient }} />
}

export const onRenderBody = ({ setPreBodyComponents }) => {
  setPreBodyComponents(<MagicScriptTag key="theme-magic-script" />)
}
