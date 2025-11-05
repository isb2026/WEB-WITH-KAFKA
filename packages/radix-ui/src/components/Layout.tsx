import React from 'react';

export interface LayoutProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export const RadixContainer = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>{children}</div>
);

export const RadixMain = ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <main {...props}>{children}</main>
);

export const RadixSection = ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <section {...props}>{children}</section>
);

export const RadixHeader = ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <header {...props}>{children}</header>
);

export const RadixFooter = ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <footer {...props}>{children}</footer>
);

export const RadixNav = ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <nav {...props}>{children}</nav>
);

export const RadixAside = ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <aside {...props}>{children}</aside>
);

export const RadixArticle = ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <article {...props}>{children}</article>
); 