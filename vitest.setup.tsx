import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

// Mock motion/react
vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
    article: ({ children, ...props }: { children?: React.ReactNode }) => (
      <article {...props}>{children}</article>
    ),
    button: ({ children, onClick, ...props }: { children?: React.ReactNode; onClick?: () => void }) => (
      <button onClick={onClick} {...props}>{children}</button>
    ),
    header: ({ children, ...props }: { children?: React.ReactNode }) => (
      <header {...props}>{children}</header>
    ),
    aside: ({ children, ...props }: { children?: React.ReactNode }) => (
      <aside {...props}>{children}</aside>
    ),
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));
