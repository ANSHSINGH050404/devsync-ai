import {
  User2,
  Send,
  Plus,
  Settings,
  Search,
  MessageSquare,
  Users,
  FileText,
  Star,
  MoreVertical,
  Mic,
  Paperclip,
  Smile,
  X,
  PlusIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from '../config/axios'

const UserSelectionModal = ({ isOpen, onClose, onSelect, projectInfo, setModalOpen }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [users, setUser] = useState([]);

  const handleClick = (id) => {
    setSelectedId(id);
    onSelect(id); // Pass selected user id to parent
  };

  function addCollaborators() {
    if (!selectedId) {
      alert('Please select a user first');
      return;
    }

    // Use the projectInfo passed as prop instead of calling useLocation here
    axios.put('/projects/add-user', {
      projectId: projectInfo.project._id,
      users: [selectedId] // Send as array with single user ID
    }).then((res) => {
      console.log(res.data);
      setModalOpen(false);
      setSelectedId(null); // Reset selection
    }).catch((err) => {
      console.log(err);
      alert('Failed to add collaborator');
    });
  }
 
  useEffect(() => {
    axios.get('/users/all').then((res) => {
      setUser(res.data.users);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  // ✅ Conditional return AFTER all hooks
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Select a User</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* User List */}
        <div className="max-h-72 overflow-y-auto">
          {users.map((user) => (
            <button
              key={user._id}
              onClick={() => handleClick(user._id)}
              className={`w-full flex items-center justify-between px-4 py-3 text-left transition ${
                selectedId === user._id ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
            >
              <div>
                <p className="font-medium text-gray-900">{user.email}</p>
                <p className="text-xs text-gray-500">{user.role || 'User'}</p>
              </div>
              {selectedId === user._id && (
                <span className="text-blue-600 text-sm font-medium">✓</span>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={addCollaborators}
            disabled={!selectedId}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Collaborator
          </button>
        </div>
      </div>
    </div>
  );
};

const Project = () => {
  const [isSidePanelOpen, setSidePanelOpen] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, user: "Alice", avatar: "AJ", message: "Hey! Updates are ready for review", time: "10:30 AM", isMe: false },
    { id: 2, user: "You", avatar: "ME", message: "Perfect! Will check them now", time: "10:32 AM", isMe: true },
    { id: 3, user: "Mike", avatar: "MC", message: "Color palette looks great 👍", time: "10:35 AM", isMe: false },
  ]);

  const location = useLocation();
  const projectInfo = location.state;
  console.log(projectInfo);

  console.log("Selected user id:", selectedUserId);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        user: "You",
        avatar: "ME",
        message: message.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMe: true,
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  return (
    <main className="h-screen w-screen flex bg-gray-50 relative">
      {/* Sidebar */}
      {isSidePanelOpen && (
        <section className="left h-full w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">P</span>
              </div>
              <h1 className="font-semibold text-gray-900 text-sm truncate">
                {projectInfo?.name || "Project"}
              </h1>
            </div>
            <div className="flex items-center space-x-1">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <User2 className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => setModalOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <PlusIcon className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => setSidePanelOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </header>

          {/* Quick Navigation */}
          <nav className="p-3 border-b border-gray-100">
            <div className="flex space-x-1">
              <button className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-xs text-gray-600">
                <FileText className="w-4 h-4" />
                <span>Files</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-xs text-gray-600">
                <Users className="w-4 h-4" />
                <span>Team</span>
              </button>
            </div>
          </nav>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex space-x-2 max-w-[85%] ${msg.isMe ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-xs">
                      {msg.avatar.slice(0, 1)}
                    </span>
                  </div>
                  <div>
                    <div
                      className={`p-2 rounded-lg text-sm ${
                        msg.isMe
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-100 text-gray-900 rounded-bl-none"
                      }`}
                    >
                      <p>{msg.message}</p>
                    </div>
                    <p
                      className={`text-xs text-gray-500 mt-1 ${
                        msg.isMe ? "text-right" : "text-left"
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-3 border-t border-gray-100 bg-white">
            <form onSubmit={handleSendMessage} className="space-y-2">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-500 focus:outline-none"
                />
                <button type="button" className="p-1 hover:bg-gray-200 rounded transition-colors">
                  <Paperclip className="w-4 h-4 text-gray-500" />
                </button>
                <button type="button" className="p-1 hover:bg-gray-200 rounded transition-colors">
                  <Smile className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <button
                type="submit"
                disabled={!message.trim()}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Reopen side panel */}
      {!isSidePanelOpen && (
        <button
          onClick={() => setSidePanelOpen(true)}
          className="absolute top-4 left-4 p-2 bg-white border rounded-lg shadow hover:bg-gray-100"
        >
          <MoreVertical className="w-5 h-5 text-gray-700" />
        </button>
      )}

      {/* User Selection Modal */}
      <UserSelectionModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={setSelectedUserId}
        projectInfo={projectInfo}
        setModalOpen={setModalOpen}
      />
    </main>
  );
};

export default Project;