export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-black">
          Language assessment
        </h1>
        <p className="mt-3 text-gray-600">Choose how you want to continue.</p>
        <div className="mt-8 flex flex-col gap-3">
          <a
            href="/new"
            className="rounded-full bg-black px-6 py-3 text-white"
          >
            Company: create assessment
          </a>
          <a
            href="/report"
            className="rounded-full border border-black px-6 py-3 text-black"
          >
            Company: view report
          </a>
          <a
            href="/welcome"
            className="rounded-full border border-black px-6 py-3 text-black"
          >
            Candidate: start test
          </a>
        </div>
        <p className="mt-10 text-sm text-gray-500">
          If something does not work, contact support.
        </p>
      </div>
    </main>
  );
}