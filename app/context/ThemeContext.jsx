"use client";

import { ThemeProvider } from "next-themes";

const ThemeContext = ({ children }) => {
    return (
        <ThemeProvider attribute="class">
            {children}
        </ThemeProvider>
    )
}

export default ThemeContext;