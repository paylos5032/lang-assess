export default function Mock() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold text-black">Practice</h1>
        <p className="mt-4 text-gray-600">
          Translate this short sentence. This is only a test and is not scored.
        </p>
        <p className="mt-6 text-black">The meeting starts at 9.</p>
        <textarea
          className="mt-3 h-28 w-full rounded-lg border border-gray-300 px-4 py-3 text-black"
          placeholder="Your translation"
        />
        <a
          href="/soft"
          className="mt-8 inline-block rounded-full bg-black px-6 py-3 text-white"
        >
          Finish practice
        </a>
      </div>
    </main>
  );
}