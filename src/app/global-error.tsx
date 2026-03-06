"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Что-то пошло не так</h2>
        <button onClick={() => reset()}>Попробовать снова</button>
      </body>
    </html>
  );
}
