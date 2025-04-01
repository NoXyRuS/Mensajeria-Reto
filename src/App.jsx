import { useState } from "react";

function App() {
  const [step, setStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("Invitacion");
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0);

  const handleChannelChange = (channel) => {
    setSelectedChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((item) => item !== channel)
        : [...prev, channel]
    );
  };

  const predefinedMessages = {
    Invitacion: {
      subject: "Invitación al proceso de [nombre del proceso]",
      message: "Estimado/a [Nombre],\n\nEsperamos que te encuentres bien. A través de este medio, queremos invitarte a participar en el proceso de [nombre del proceso], que se llevará a cabo el [fecha] a las [hora]. El lugar del encuentro será [dirección/sala virtual].\n\nTu participación es muy importante para nosotros. Agradeceríamos que confirmes tu asistencia respondiendo a este correo.\n\nQuedamos atentos a cualquier consulta que puedas tener.\n\nCordialmente,\n[Nombre del remitente]\n[Puesto]\n[Empresa/Organización]"
    },
    Recordatorio: {
      subject: "Recordatorio del proceso de [nombre del proceso]",
      message: "Estimado/a [Nombre],\n\nQueremos recordarte que el proceso de [nombre del proceso], al que amablemente confirmaste tu asistencia, se realizará el [fecha] a las [hora].\n\nEl evento tendrá lugar en [dirección/sala virtual]. Si tienes alguna duda o necesitas asistencia previa, no dudes en contactarnos.\n\nTe esperamos puntual.\n\nSaludos cordiales,\n[Nombre del remitente]\n[Puesto]\n[Empresa/Organización]"
    },
    Personalizado: {
      subject: "",
      message: ""
    }
  };

  const getOrderedChannels = (channels) => {
    const order = ["SMS", "Correo Electrónico", "WhatsApp"];
    return channels.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  };
  const handleSend = () => {
    const body = getOrderedChannels(selectedChannels).map((channel) => {
      const channelData = { canal: channel, contenido: {} };
  
      if (channel === "SMS") {
        channelData.contenido.mensaje = message;
      } else if (channel === "Correo Electrónico") {
        channelData.contenido.asunto = subject;
        channelData.contenido.mensaje = message;
      } else if (channel === "WhatsApp") {
        channelData.contenido.mensaje = message;
      }
  
      return channelData;
    });
  
    const dataToSend = {
      plantilla: selectedTemplate,
      canales: body
    };
  
    console.log(dataToSend);
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-96 p-4 bg-white rounded-lg shadow-lg">
        {step === 0 ? (
          <>
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-black text-white rounded-lg w-full"
            >
              Enviar Mensaje
            </button>
          </>
        ) : step === 1 ? (
          <>
            <h2 className="text-lg font-semibold mb-4">Selección de Plantilla</h2>
            <div className="space-y-2">
              {["Invitacion", "Recordatorio", "Personalizado"].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value={option}
                    id={option}
                    checked={selectedTemplate === option}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="form-radio"
                  />
                  <label htmlFor={option} className="text-gray-700">{option}</label>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={() => setStep(0)} className="px-4 py-2 border rounded-lg text-gray-700 border-gray-300">Cancelar</button>
              <button
                onClick={() => {
                  setSubject(predefinedMessages[selectedTemplate].subject);
                  setMessage(predefinedMessages[selectedTemplate].message);
                  setStep(2);
                }}
                className="px-4 py-2 bg-black text-white rounded-lg"
              >
                Siguiente
              </button>
            </div>
          </>
        ) : step === 2 ? (
          <>
            <h2 className="text-lg font-semibold mb-4">Selección de Canales</h2>
            <div className="space-y-2">
              {["SMS", "Correo Electrónico", "WhatsApp"].map((channel) => (
                <div key={channel} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={channel}
                    id={channel}
                    checked={selectedChannels.includes(channel)}
                    onChange={() => handleChannelChange(channel)}
                    className="form-checkbox"
                  />
                  <label htmlFor={channel} className="text-gray-700">{channel}</label>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={() => setStep(1)} className="px-4 py-2 border rounded-lg text-gray-700 border-gray-300">Atrás</button>
              <button
                onClick={() => {
                  if (selectedChannels.length === 0) {
                    alert("Por favor, selecciona al menos un canal.");
                    return;
                  }
                  setStep(3);
                  setCurrentChannelIndex(0);
                }}
                disabled={selectedChannels.length === 0}
                className={`px-4 py-2 ${selectedChannels.length === 0 ? "bg-gray-400" : "bg-black"} text-white rounded-lg`}
              >
                Siguiente
              </button>
            </div>
          </>
        ) : step === 3 ? (
          <>
            {getOrderedChannels(selectedChannels).map((channel, index) => (
              currentChannelIndex === index && (
                <div key={channel} className="mb-6">
                  <h2 className="text-lg font-semibold mb-4">{channel}</h2>
                  {channel === "Correo Electrónico" && (
                    <>
                      <h3 className="text-md font-medium mb-2">Asunto</h3>
                      <input
                        className="w-full p-2 border rounded-lg text-gray-700 border-gray-300"
                        placeholder="Escribe asunto"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </>
                  )}
                  <h3 className="text-md font-medium mb-2 mt-4">Mensaje</h3>
                  <textarea
                    className="w-full p-2 border rounded-lg text-gray-700 border-gray-300"
                    rows="4"
                    placeholder="Escribe mensaje"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => {
                        if (currentChannelIndex === 0) {
                          setStep(2);
                        } else {
                          setCurrentChannelIndex(currentChannelIndex - 1);
                        }
                      }}
                      className="px-4 py-2 border rounded-lg text-gray-700 border-gray-300"
                    >
                      Atrás
                    </button>
                    {currentChannelIndex < selectedChannels.length - 1 ? (
                      <button onClick={() => setCurrentChannelIndex(currentChannelIndex + 1)} className="px-4 py-2 bg-black text-white rounded-lg">
                        Siguiente
                      </button>
                    ) : (
                      <button
                        onClick={handleSend}
                        className="px-4 py-2 bg-black text-white rounded-lg"
                      >
                        Enviar
                      </button>
                    )}
                  </div>
                </div>
              )
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
}

export default App;
