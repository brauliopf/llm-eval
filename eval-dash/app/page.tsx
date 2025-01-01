import { createModel } from "./actions/models";

export default async function Home() {
  const ui = (
    <form action={createModel} className="shadow-md w-2/3 rounded px-8">
      <div className="mb-6">
        <input
          type="text"
          name="message"
          placeholder="Mistakes are the portals of discovery - James Joyce"
          className="text-center appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none"
        />
      </div>
      <div className="w-full text-center">
        <input
          type="submit"
          value={"Save Message"}
          className="bg-[#00E699] cursor-pointer transition-colors hover:bg-[#00e5BF] text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none"
        />
      </div>
    </form>
  );

  return (
    <main className="flex -mt-16 min-h-screen flex-col align-center justify-center items-center px-24">
      <h2 className="text-2xl pb-6 text-gray-400">{"Save a model"}</h2>
      {ui}
    </main>
  );
}
