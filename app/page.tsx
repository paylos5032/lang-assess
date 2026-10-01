"use client";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold text-black">Language assessment</h1>
        <p className="mt-3 text-gray-600">Company tools.</p>

        <a
          href="/new"
          className="mt-8 block rounded-full bg-black px-6 py-3 text-white"
        >
          Create assessment
        </a>
        <a
          href="/tests"
          className="mt-3 block rounded-full border border-black px-6 py-3 text-black"
        >
          All tests
        </a>

        <p className="mt-10 text-sm text-gray-500">
          If something does not work, contact support.
        </p>
      </div>
    </main>
  );
}