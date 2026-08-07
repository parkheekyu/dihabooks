import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['"Noto Sans KR"', 'system-ui', 'sans-serif'],
      },
      // Type scale matched to weolbu.com (measured computed styles, 2026-07).
      // Their workhorse is 16px/24px for card titles and body copy; metadata sits
      // at 13px/16px. Our 2xl/3xl already matched their 24/30 headings.
      fontSize: {
        xs: ["13px", { lineHeight: "18px" }],
        sm: ["16px", { lineHeight: "24px" }],
        base: ["17px", { lineHeight: "26px" }],
        lg: ["19px", { lineHeight: "28px" }],
        xl: ["21px", { lineHeight: "30px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["30px", { lineHeight: "38px" }],
      },
      screens: {
        'mobile': '375px',
        'tablet': '768px',
        'desktop': '1024px',
      },
      colors: {
        /** 스토어 제목과 구매 CTA에 쓰는 브랜드 블루. 테마와 무관하게 고정. */
        brand: "#1843bc",
        kakao: {
          DEFAULT: "hsl(var(--kakao))",
          foreground: "hsl(var(--kakao-foreground))",
        },
        star: "hsl(var(--star))",
        "footer-bg": "hsl(var(--footer-bg))",
        "footer-foreground": "hsl(var(--footer-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      // Calibrated to the main-page review card (rounded-lg = 8px). The default
      // xl/2xl/3xl steps were noticeably rounder than that, so they are pulled
      // in to keep one consistent softness across the site.
      borderRadius: {
        sm: "calc(var(--radius) - 4px)", // 4px
        md: "calc(var(--radius) - 2px)", // 6px
        lg: "var(--radius)", // 8px — reference
        xl: "10px", // was 12
        "2xl": "12px", // was 16
        "3xl": "16px", // was 24
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
