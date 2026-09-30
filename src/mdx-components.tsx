import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h2: props => <h2 {...props} className="display mt-14 scroll-mt-32 text-[clamp(24px,3vw,36px)] font-bold first:mt-0" />,
  h3: props => <h3 {...props} className="display mt-8 text-xl font-bold" />,
  p: props => <p {...props} className="mt-4 max-w-[65ch] text-muted" />,
  ul: props => <ul {...props} className="mt-4 space-y-2 text-muted" />,
  li: props => <li {...props} className="relative pl-5 before:absolute before:left-0 before:top-2.5 before:size-1.5 before:rounded-full before:bg-accent before:content-['']" />,
  strong: props => <strong {...props} className="font-medium text-fg" />,
  a: props => <a {...props} className="text-accent underline-offset-4 hover:underline" target={props.href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer" />,
  code: props => <code {...props} className="rounded bg-surface px-1.5 py-0.5 font-mono text-[0.9em] text-fg" />,
  pre: props => <pre {...props} className="mt-4 overflow-x-auto rounded-lg border border-line bg-surface p-4 text-sm" />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
