import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock next/headers (cookies API used by auth/session.ts)
vi.mock("next/headers", () => {
  const cookieStore = new Map<string, { name: string; value: string }>();
  return {
    cookies: vi.fn(async () => ({
      get: (name: string) => cookieStore.get(name) ?? undefined,
      set: (name: string, value: string) => {
        cookieStore.set(name, { name, value });
      },
      delete: (name: string) => {
        cookieStore.delete(name);
      },
      _store: cookieStore, // Exposed for test manipulation
    })),
  };
});

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  })),
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

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
