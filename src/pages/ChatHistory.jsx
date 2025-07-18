import { useState } from "react";
import { useConfigStore } from "@/store/configStore";
import { Send, Camera, User } from "lucide-react";

export default function ChatHistory() {
  const tema = useConfigStore((state) => state.tema);
  const [profileImage, setProfileImage] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      message: "¡Hola! Soy el asistente virtual de Glamping Brillo de Luna 🌙✨ ¿En qué puedo ayudarte hoy?",
      time: "10:30 AM",
      date: "Hoy"
    },
    {
      id: 2,
      sender: "user",
      message: "Hola, me gustaría saber sobre las cabañas disponibles para este fin de semana",
      time: "10:32 AM",
      date: "Hoy"
    },
    {
      id: 3,
      sender: "bot",
      message: "¡Perfecto! Tenemos varias opciones disponibles para este fin de semana. Nuestras cabañas incluyen:\n\n🏡 Cabaña Luna Llena - 2 personas\n🏡 Cabaña Estrella Fugaz - 4 personas\n🏡 Cabaña Vía Láctea - 6 personas\n\n¿Para cuántas personas necesitas alojamiento?",
      time: "10:33 AM",
      date: "Hoy"
    },
    {
      id: 4,
      sender: "user",
      message: "Para 4 personas, ¿cuál sería el precio?",
      time: "10:35 AM",
      date: "Hoy"
    },
    {
      id: 5,
      sender: "bot",
      message: "La Cabaña Estrella Fugaz es perfecta para ustedes! 🌟\n\nPrecio por noche: $150.000 COP\nIncluye:\n✅ Desayuno continental\n✅ Fogata nocturna\n✅ Acceso a senderos\n✅ Wifi y parqueadero\n\n¿Te gustaría hacer una reserva?",
      time: "10:36 AM",
      date: "Hoy"
    }
  ]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: "user",
        message: newMessage,
        time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
        date: "Hoy"
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
      
      // Simular respuesta del bot después de 2 segundos
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          sender: "bot",
          message: "Gracias por tu mensaje. Estoy procesando tu solicitud... 🤖",
          time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
          date: "Hoy"
        };
        setMessages(prev => [...prev, botResponse]);
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className={`h-full flex flex-col ${tema === 'claro' ? 'bg-gray-50' : 'bg-gray-900'}`}>
      {/* Header del chat */}
      <div className={`p-4 border-b flex items-center gap-3 ${
        tema === 'claro' 
          ? 'bg-white border-gray-200 text-gray-900' 
          : 'bg-gray-800 border-gray-700 text-white'
      }`}>
        <div className="relative">
          {profileImage ? (
            <img 
              src={profileImage} 
              alt="Bot Avatar" 
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white">
              <User size={24} />
            </div>
          )}
          <label className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600">
            <Camera size={12} />
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="hidden" 
            />
          </label>
        </div>
        <div>
          <h3 className="font-bold">Asistente Glamping Brillo de Luna</h3>
          <p className={`text-sm ${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>
            En línea
          </p>
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-green-500 text-white'
                  : tema === 'claro'
                  ? 'bg-white text-gray-900 border border-gray-200'
                  : 'bg-gray-700 text-white'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.message}</p>
              <p className={`text-xs mt-1 ${
                msg.sender === 'user' 
                  ? 'text-green-100' 
                  : tema === 'claro' 
                  ? 'text-gray-500' 
                  : 'text-gray-400'
              }`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input para nuevo mensaje */}
      <div className={`p-4 border-t ${
        tema === 'claro' 
          ? 'bg-white border-gray-200' 
          : 'bg-gray-800 border-gray-700'
      }`}>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            className={`flex-1 px-4 py-2 rounded-full border ${
              tema === 'claro'
                ? 'bg-gray-100 border-gray-300 text-gray-900'
                : 'bg-gray-700 border-gray-600 text-white'
            }`}
          />
          <button
            onClick={sendMessage}
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}