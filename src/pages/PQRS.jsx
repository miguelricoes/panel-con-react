export default function PQRS() {
  return (
    <div className="text-white w-full">
      <h2 className="text-xl mb-4">Q&A - Enviar PQRS</h2>

      <div className="mt-4">
        <label className="block mb-1">Tipo de PQRS:</label>
        <select className="w-full p-2 rounded bg-gray-800 text-white mb-3">
          <option value="Petición">Petición</option>
          <option value="Queja">Queja</option>
          <option value="Reclamo">Reclamo</option>
          <option value="Sugerencia">Sugerencia</option>
        </select>

        <label className="block mb-1">Mensaje:</label>
        <textarea
          placeholder="Escribe tu mensaje aquí..."
          rows="4"
          className="w-full p-2 rounded bg-gray-800 text-white mb-3 resize-none"
        ></textarea>

        <input type="file" className="block mb-3 text-white" />

        <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
          Enviar PQRS
        </button>
      </div>
    </div>
  );
}
