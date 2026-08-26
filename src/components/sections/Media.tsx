import { Play, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { mediaVideos } from "../../data/media";

const fallbackVerses = [
  { text: "Porque eu bem sei os pensamentos que penso de vós, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.", ref: "Jeremias 29:11" },
  { text: "Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento.", ref: "Provérbios 3:5" },
  { text: "O Senhor é o meu pastor; nada me faltará.", ref: "Salmos 23:1" },
  { text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.", ref: "João 3:16" },
  { text: "Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.", ref: "1 Tessalonicenses 5:18" },
  { text: "O amor é sofredor, é benigno; o amor não é invejoso; o amor não trata com leviandade, não se ensoberbece.", ref: "1 Coríntios 13:4" },
  { text: "Eu vos deixo a paz, a minha paz vos dou; não vo-la dou como o mundo a dá. Não se turbe o vosso coração, nem se atemorize.", ref: "João 14:27" },
  { text: "Mas os que esperam no Senhor renovarão as forças, subirão com asas como águias; correrão, e não se cansarão; caminharão, e não se fatigarão.", ref: "Isaías 40:31" },
  { text: "O Senhor é a minha luz e a minha salvação; a quem temerei? O Senhor é a fortaleza da minha vida; de quem me recearei?", ref: "Salmos 27:1" },
  { text: "Clama a mim, e responder-te-ei, e anunciar-te-ei coisas grandes e firmes, que tu não sabes.", ref: "Jeremias 33:3" },
  { text: "Deem graça ao Senhor, porque ele é bom; o seu amor dura para sempre.", ref: "Salmos 136:1" },
  { text: "Porque onde estiver o vosso aí, estará também o vosso coração.", ref: "Mateus 6:21" },
  { text: "Buscai primeiro o Reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas.", ref: "Mateus 6:33" },
  { text: "Aquietai-vos, e sabei que eu sou Deus; serei exaltado entre os gentios; serei exaltado sobre a terra.", ref: "Salmos 46:10" },
  { text: "Lançai sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.", ref: "1 Pedro 5:7" },
  { text: "E conhecereis a verdade, e a verdade vos libertará.", ref: "João 8:32" },
  { text: "Porque Deus não nos deu espírito de temor, mas de fortaleza, de amor e de moderação.", ref: "2 Timóteo 1:7" },
  { text: "Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.", ref: "Salmos 23:4" },
  { text: "Todo aquele que pede, recebe; e todo aquele que busca, acha; e ao que bate, ser-lhe-á aberto.", ref: "Mateus 7:8" },
  { text: "Venham a mim, todos vocês que estão cansados e sobrecarregados, e eu darei descanso a vocês.", ref: "Mateus 11:28" },
  { text: "O Senhor é bom, um refúgio no dia da angústia; ele conhece os que nele confiam.", ref: "Naum 1:7" },
  { text: "Se Deus é por nós, quem será contra nós?", ref: "Romanos 8:31" },
  { text: "Eis que estou convosco todos os dias, até a consumação do século.", ref: "Mateus 28:20" },
  { text: "Portanto, se alguém estiver em Cristo, nova criatura é; as coisas velhas já passaram; eis que tudo se fez novo.", ref: "2 Coríntios 5:17" },
  { text: "O Senhor é bom; o seu amor dura para sempre; a sua fidelidade geração após geração.", ref: "Salmos 118:1" },
  { text: "Não se cansem de fazer o bem, porque a seu tempo colherão, se não desistirem.", ref: "Gálatas 6:9" },
  { text: "Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará.", ref: "Salmos 91:1" },
  { text: "Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar os pecados e nos purificar de toda injustiça.", ref: "1 João 1:9" },
  { text: "Respondeu Jesus: Eu sou o caminho, a verdade e a vida. Ninguém vem ao Pai senão por mim.", ref: "João 14:6" },
  { text: "Amados, amemo-nos uns aos outros, porque o amor é de Deus; e todo aquele que ama é nascido de Deus e conhece a Deus.", ref: "1 João 4:7" },
  { text: "Porque o Filho do Homem veio buscar e salvar o que se havia perdido.", ref: "Lucas 19:10" },
  { text: "E não vos transformeis segundo este mundo, mas transformai-vos pela renovação do vosso entendimento.", ref: "Romanos 12:2" },
  { text: "Porque é pela graça que estáis salvos, por meio da fé; e isto não vem de vós, é dom de Deus.", ref: "Efésios 2:8" },
  { text: "Porque o Senhor, o teu Deus, é um Deus que anda contigo; não te desamparará nem te deixará.", ref: "Deuteronômio 31:6" },
  { text: "Porque todas as coisas são possíveis ao que crê.", ref: "Marcos 9:23" },
  { text: "Vigiai e orai, para que não entreis em tentação; o espírito, na verdade, está pronto, mas a carne é fraca.", ref: "Mateus 26:41" },
  { text: "A luz brilha nas trevas, e as trevas não prevaleceram contra ela.", ref: "João 1:5" },
  { text: "Porque o Senhor dá a sabedoria; da sua boca vem o conhecimento e o entendimento.", ref: "Provérbios 2:6" },
  { text: "Mas a cada um é dada a manifestação do Espírito, para proveito comum.", ref: "1 Coríntios 12:7" },
  { text: "Porque o salário do pecado é a morte, mas o dom de Deus é a vida eterna em Cristo Jesus, nosso Senhor.", ref: "Romanos 6:23" },
];

function getDailyVerse() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return fallbackVerses[dayOfYear % fallbackVerses.length];
}

export function Media() {
  const [verse, setVerse] = useState(getDailyVerse);
  const featured = mediaVideos.find((v) => v.featured);
  const others = mediaVideos.filter((v) => !v.featured);
  const hasVideos = featured?.youtubeId;

  useEffect(() => {
    let cancelled = false;
    fetch("https://bible-api.com/romans828?translation=pt")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data?.text) {
          setVerse({ text: data.text.trim(), ref: data.reference ?? "Romanos 8:28" });
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const openVideo = (youtubeId: string) => {
    if (!youtubeId) return;
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, "_blank");
  };

  return (
    <section className="ibbi-section" id="midia">
      <div className="ibbi-container">
        <span className="section-label">Mídia</span>
        <h2 className="section-title">
          Mensagens que<br />transformam vidas.
        </h2>

        {/* Versículo do Dia — sempre visível */}
        <div style={{
          marginTop: 36,
          padding: "44px 36px",
          background: "rgba(214,161,58,.06)",
          border: "1px solid rgba(214,161,58,.2)",
          borderRadius: 14,
          textAlign: "center",
        }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <BookOpen size={18} style={{ color: "var(--gold)" }} />
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)" }}>
              Versículo do Dia
            </span>
          </div>
          <blockquote style={{ fontSize: "clamp(18px, 2.4vw, 26px)", fontStyle: "italic", color: "var(--white-soft)", lineHeight: 1.7, margin: "0 0 18px", fontWeight: 400 }}>
            "{verse.text}"
          </blockquote>
          <cite style={{ fontSize: 15, fontWeight: 700, color: "var(--gold)", fontStyle: "normal", letterSpacing: "0.04em" }}>
            — {verse.ref}
          </cite>
        </div>

        {/* Vídeos — abaixo do versículo */}
        {hasVideos && (
          <>
            <div className="ibbi-media-featured" style={{ marginTop: 32 }} onClick={() => openVideo(featured!.youtubeId)}>
              <img src={featured!.thumbnail} alt={featured!.title} loading="lazy" />
              <div className="ibbi-media-play">
                <Play size={28} fill="white" />
              </div>
            </div>

            {others.length > 0 && (
              <div className="ibbi-media-grid" style={{ marginTop: 24 }}>
                {others.map((v) => (
                  <div key={v.id} className="ibbi-media-card" onClick={() => openVideo(v.youtubeId)}>
                    <div className="ibbi-media-card-img">
                      <img src={v.thumbnail} alt={v.title} loading="lazy" />
                    </div>
                    <div className="ibbi-media-card-body">
                      <h4>{v.title}</h4>
                      <span>{v.date}{v.speaker ? ` • ${v.speaker}` : ""}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
