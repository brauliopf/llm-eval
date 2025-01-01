import { getGroqChatCompletion } from "./actions/models";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-2">
      <div className="flex justify-center rounded-lg bg-blue-200 py-4">
        <form action={getGroqChatCompletion} className="w-2/3 rounded">
          <div className="mb-6">
            <input
              type="text"
              name="prompt"
              placeholder="Test Prompt"
              className="text-center appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none"
            />
          </div>
          <div className="w-full text-center">
            <input
              type="submit"
              value={"Generate responses"}
              className="bg-[#00E699] cursor-pointer transition-colors hover:bg-[#00e5BF] text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none"
            />
          </div>
        </form>
      </div>
    </main>
  );
}
