"use client";

import { getGroqChatCompletion } from "./actions/models";
import { useState } from "react";
import type { UIModel } from "./lib/types";

export default function Page() {
  // a list of model_ref
  const [newModel, setNewModel] = useState("");
  const [models, setModels] = useState<UIModel[]>([{ model_ref: "llama 3.1" }]);

  const ModelPanel = ({
    index,
    length,
    model,
  }: {
    index: number;
    length: number;
    model: UIModel;
  }) => {
    return (
      <div
        id={index.toString()}
        className={
          length === 1
            ? "w-full p-4 border border-black v-full rounded-lg relative"
            : `w-1/2 p-4 border border-black v-full rounded-lg  relative`
        }
      >
        <header className="flex justify-between">
          <p className="text-gray-800 font-bold text-center uppercase">
            {model.model_ref}
          </p>
          <button
            onClick={() => setModels(models.filter((_, i) => i !== index - 1))}
            className="text-gray-500 py-0.5 rounded-full"
          >
            x
          </button>
        </header>
        <div>
          <p>{model.prediction}</p>
        </div>
      </div>
    );
  };

  const handleSubmitNewModel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newModel = (e.target as HTMLFormElement).newModel.value;
    if (newModel) {
      setModels((preModels) => [...preModels, { model_ref: newModel }]);
    }
  };

  const handleSubmitCompletion = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const userPrompt = (e.target as HTMLFormElement).prompt.value;
    if (userPrompt) {
      const predictions = await Promise.all(
        models.map(async (model) => ({
          ...model,
          prediction: await getGroqChatCompletion(userPrompt),
        }))
      );
      setModels(predictions);
    }
  };

  return (
    <main className="flex min-h-screen flex-col p-2">
      <div className="flex justify-center rounded-lg bg-blue-200 py-4 mb-2">
        <form onSubmit={handleSubmitNewModel}>
          <div className="mb-6">
            <select
              name="newModel"
              className="text-center appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none"
              onChange={(e) => setNewModel(e.target.value)}
            >
              <option value="">Select a model</option>
              <option value="llama3.1">Llama 3.1</option>
              <option value="bert">BERT</option>
              <option value="gpt3">GPT-3</option>
            </select>
          </div>
          <div className="w-full text-center">
            <input
              type="submit"
              value={"Add Model"}
              className="bg-[#00E699] cursor-pointer transition-colors hover:bg-[#00e5BF] text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none"
              disabled={models.length >= 3}
            />
          </div>
        </form>
      </div>

      <div className="flex justify-center rounded-lg bg-blue-200 py-4">
        <form onSubmit={handleSubmitCompletion} className="w-2/3 rounded">
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
      <div className="flex flex-row justify-between w-full gap-2 mt-2">
        {models.map((model, index) => (
          <ModelPanel
            key={index}
            index={index + 1}
            model={model}
            length={models.length}
          />
        ))}
      </div>
    </main>
  );
}
