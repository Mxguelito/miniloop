import { Heart, MessageCircle, ThumbsDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

/* =======================
   REACTION BUTTON
======================= */
function Reaction({ icon: Icon, label, activeColor }) {
  const [active, setActive] = useState(false);

  return (
    <button
      onClick={() => setActive(!active)}
      className={`flex items-center gap-1 text-xs sm:text-sm transition
        ${
          active
            ? activeColor
            : "text-white/50 hover:text-white"
        }
      `}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

/* =======================
   POST CARD
======================= */
function PostCard({ author, role, content, date, category }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  function addComment() {
    if (!text.trim()) return;
    setComments([...comments, text]);
    setText("");
  }

  return (
    <article className="rounded-2xl bg-gradient-to-b from-white/5 to-black/20 border border-white/10 p-4 sm:p-5 space-y-4">
      {/* HEADER */}
      <header className="flex justify-between items-start">
        <div>
          <p className="text-white font-semibold text-sm sm:text-base">
            {author}
          </p>

          <div className="flex gap-2 mt-1 flex-wrap">
            <span
              className={`text-xs px-2 py-0.5 rounded-full border
                ${
                  role === "ADMIN"
                    ? "bg-yellow-400/15 border-yellow-400/30 text-yellow-300"
                    : "bg-green-400/15 border-green-400/30 text-green-300"
                }
              `}
            >
              {role}
            </span>

            {category && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full border
                  ${
                    category === "AVISO"
                      ? "bg-blue-400/15 border-blue-400/30 text-blue-300"
                      : category === "SERVICIO"
                      ? "bg-green-400/15 border-green-400/30 text-green-300"
                      : "bg-purple-400/15 border-purple-400/30 text-purple-300"
                  }
                `}
              >
                {category}
              </span>
            )}
          </div>
        </div>

        <span className="text-xs text-white/40">{date}</span>
      </header>

      {/* CONTENT */}
      <p className="text-sm text-white/80 leading-relaxed">
        {content}
      </p>

      {/* ACTIONS */}
      <div className="flex gap-6 pt-3 border-t border-white/10">
        <Reaction
          icon={Heart}
          label="Me gusta"
          activeColor="text-red-400"
        />

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-xs sm:text-sm text-white/50 hover:text-white transition"
        >
          <MessageCircle size={16} />
          Comentar
        </button>

        <Reaction
          icon={ThumbsDown}
          label="No me gusta"
          activeColor="text-yellow-400"
        />
      </div>

      {/* COMMENTS */}
      {showComments && (
        <div className="space-y-3 pt-3">
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribí un comentario…"
              className="flex-1 rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-sm text-white outline-none"
            />
            <button
              onClick={addComment}
              className="px-3 py-2 rounded-xl bg-blue-500/20 border border-blue-400/30 text-sm"
            >
              Enviar
            </button>
          </div>

          {comments.map((c, i) => (
            <div
              key={i}
              className="text-sm text-white/80 bg-black/20 p-3 rounded-xl"
            >
              {c}
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

/* =======================
   HOME FEED
======================= */
export default function HomeFeed() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const [posts, setPosts] = useState([
    {
      author: "Administración",
      role: "ADMIN",
      category: "AVISO",
      date: "Hoy",
      content:
        "Se informa que el día viernes se realizarán tareas de mantenimiento en el ascensor.",
    },
    {
      author: "Tesorería",
      role: "TESORERO",
      category: "AVISO",
      date: "Ayer",
      content:
        "La liquidación de enero ya se encuentra disponible para su consulta.",
    },
  ]);

  const [text, setText] = useState("");
  const [category, setCategory] = useState("AVISO");
  const [filter, setFilter] = useState("TODOS");

  const ROLE_CATEGORIES = {
    ADMIN: ["AVISO", "SERVICIO", "KIOSCO"],
    TESORERO: ["AVISO", "SERVICIO"],
  };

  const allowedCategories = ROLE_CATEGORIES[user?.role] || [];
  const canPublish = allowedCategories.length > 0;

  function publicarPost() {
    if (!text.trim()) return;

    setPosts([
      {
        author: user.name || "Usuario",
        role: user.role,
        category,
        date: "Ahora",
        content: text,
      },
      ...posts,
    ]);

    setText("");
    setOpen(false);
    setCategory("AVISO");
  }

  return (
    <section className="mt-10 space-y-5">
      {/* HEADER */}
      <div className="flex justify-between items-center">
       <div className="mb-4">
  <div className="flex items-center gap-3">
    <span className="text-xl">📰</span>
    <h2 className="text-xl font-semibold text-white">
      Novedades del consorcio
    </h2>
  </div>

  <p className="mt-1 ml-8 text-sm text-white/50">
    Avisos, servicios y comunicaciones oficiales.
  </p>
</div>


        {canPublish && (
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-400/30 text-sm hover:bg-blue-500/30 transition"
          >
            + Publicar
          </button>
        )}
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 flex-wrap">
        {["TODOS", "AVISO", "SERVICIO", "KIOSCO"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs border transition
              ${
                filter === f
                  ? "bg-white/20 border-white/30 text-white"
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
              }
            `}
          >
            {f}
          </button>
        ))}
      </div>

      {/* POSTS */}
      {posts
        .filter((p) => filter === "TODOS" || p.category === filter)
        .map((p, i) => (
          <PostCard key={i} {...p} />
        ))}

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center">
          <div className="w-full sm:max-w-md bg-[#0b1220] border border-white/10 rounded-t-2xl sm:rounded-2xl p-5 space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Nueva publicación
            </h3>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribí el aviso..."
              className="w-full h-28 rounded-xl bg-black/30 border border-white/10 p-3 text-sm text-white resize-none"
            />

            <div className="flex gap-2">
              {allowedCategories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-2 rounded-xl text-sm border
                    ${
                      category === c
                        ? "bg-blue-500/30 border-blue-400/40 text-white"
                        : "bg-white/10 border-white/10 text-white/70"
                    }
                  `}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setOpen(false)}
                className="text-white/60 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={publicarPost}
                className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-400/30 text-sm"
              >
                Publicar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
