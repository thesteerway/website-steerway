import { Fragment } from "react";

/**
 * Renders a copy string with *asterisk-wrapped* words as champagne-italic
 * keyword emphasis inside the flowing paragraph (the Agence DIX device). Plain
 * function, server-safe. Authored in the copy data as: "...that *actually work*".
 */
export default function Rich({ children }: { children: string }) {
  const parts = children.split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.length > 2 && p.startsWith("*") && p.endsWith("*") ? (
          <em className="kw" key={i}>
            {p.slice(1, -1)}
          </em>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        )
      )}
    </>
  );
}
