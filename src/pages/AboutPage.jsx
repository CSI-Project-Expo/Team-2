import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
    const navigate = useNavigate();
    const cardRefs = useRef([]);

    const handleMove = (e, index) => {
        const card = cardRefs.current[index];
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateX = -(y - rect.height / 2) / 20;
        const rotateY = (x - rect.width / 2) / 20;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    };

    const resetCard = (index) => {
        const card = cardRefs.current[index];
        if (card) {
            card.style.transform = "rotateX(0) rotateY(0) translateY(0)";
        }
    };

    const cards = [
        {
            title: "Real Opportunities",
            text: "Verified jobs and internships designed for real career growth.",
        },
        {
            title: "Direct Connection",
            text: "Students and recruiters connect faster with less friction.",
        },
        {
            title: "Modern Experience",
            text: "Clean, transparent hiring built for today’s generation.",
        },
    ];

    return (
        <div
            style={{
                background: "#fdfcf7",
                minHeight: "100vh",
                overflow: "hidden",
                position: "relative",
                perspective: "1200px",
            }}
        >
            {/* ===== GLOBAL ANIMATIONS ===== */}
            <style>
                {`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
          100% { transform: translateY(0px); }
        }

        @keyframes fadeUp {
          from { opacity:0; transform: translateY(40px); }
          to { opacity:1; transform: translateY(0); }
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}
            </style>

            {/* ===== MOVING BACKGROUND BLOBS ===== */}
            <div
                style={{
                    position: "absolute",
                    width: "900px",
                    height: "900px",
                    background:
                        "radial-gradient(circle, rgba(255,215,0,0.22), transparent 70%)",
                    top: "-350px",
                    right: "-300px",
                    filter: "blur(30px)",
                    animation: "float 12s ease-in-out infinite",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    width: "700px",
                    height: "700px",
                    background:
                        "radial-gradient(circle, rgba(255,190,60,0.16), transparent 70%)",
                    bottom: "-250px",
                    left: "-250px",
                    filter: "blur(30px)",
                    animation: "float 14s ease-in-out infinite",
                }}
            />

            {/* ===== HERO ===== */}
            <section
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "130px 25px 90px",
                    position: "relative",
                    zIndex: 2,
                    animation: "fadeUp 1s ease forwards",
                }}
            >
                <p
                    style={{
                        color: "#d4af37",
                        fontWeight: "700",
                        letterSpacing: "2px",
                        marginBottom: "14px",
                    }}
                >
                    ABOUT HIRESPHERE
                </p>

                <h1
                    style={{
                        fontSize: "clamp(2.8rem,6vw,5rem)",
                        fontWeight: "800",
                        lineHeight: "1.05",
                        marginBottom: "20px",
                        background:
                            "linear-gradient(90deg,#111,#111,#d4af37,#111,#111)",
                        backgroundSize: "300% 300%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        animation: "gradientMove 8s ease infinite",
                    }}
                >
                    The future of hiring
                    <br />
                    feels different here.
                </h1>

                <p
                    style={{
                        maxWidth: "760px",
                        fontSize: "1.2rem",
                        color: "#555",
                        lineHeight: "1.8",
                    }}
                >
                    HireSphere blends clarity, technology, and human connection to make
                    hiring feel premium, simple, and modern — for students and companies alike.
                </p>
            </section>

            {/* ===== GLASS 3D CARDS ===== */}
            <section
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "0 25px 100px",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
                    gap: "20px",
                    position: "relative",
                    zIndex: 2,
                }}
            >
                {cards.map((c, i) => (
                    <div
                        key={i}
                        ref={(el) => (cardRefs.current[i] = el)}
                        onMouseMove={(e) => handleMove(e, i)}
                        onMouseLeave={() => resetCard(i)}
                        style={{
                            background: "rgba(255,255,255,0.35)",
                            backdropFilter: "blur(16px)",
                            border: "1px solid rgba(255,255,255,0.5)",
                            borderRadius: "18px",
                            padding: "28px",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                            transition: "transform 0.2s ease",
                            transformStyle: "preserve-3d",
                            animation: `float ${7 + i}s ease-in-out infinite`,
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {/* shimmer light */}
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background:
                                    "linear-gradient(120deg, transparent, rgba(255,255,255,0.4), transparent)",
                                backgroundSize: "200% 100%",
                                animation: "shimmer 5s linear infinite",
                                pointerEvents: "none",
                            }}
                        />

                        <h3 style={{ marginTop: 0 }}>{c.title}</h3>
                        <p style={{ color: "#555", marginBottom: 0 }}>{c.text}</p>
                    </div>
                ))}
            </section>

            {/* ===== STORY GLASS PANEL ===== */}
            <section
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "0 25px 100px",
                    position: "relative",
                    zIndex: 2,
                }}
            >
                <div
                    style={{
                        background: "rgba(255,255,255,0.45)",
                        backdropFilter: "blur(18px)",
                        border: "1px solid rgba(255,255,255,0.6)",
                        borderRadius: "20px",
                        padding: "40px",
                        boxShadow: "0 18px 35px rgba(0,0,0,0.08)",
                    }}
                >
                    <h2 style={{ marginTop: 0 }}>Our Story</h2>
                    <p style={{ color: "#555", lineHeight: "1.9", marginBottom: 0 }}>
                        We built HireSphere because hiring felt outdated. Students were lost,
                        companies were overwhelmed, and great opportunities were missed.
                        Our mission is to make hiring feel clear, premium, and human again.
                    </p>
                </div>
            </section>

            {/* ===== CTA (UNCHANGED LOGIC) ===== */}
            <section
                style={{
                    textAlign: "center",
                    padding: "80px 25px 100px",
                    background: "rgba(255,250,240,0.75)",
                    backdropFilter: "blur(10px)",
                    borderTop: "1px solid #f2e7c8",
                }}
            >
                <h2 style={{ fontSize: "2rem", marginBottom: "12px" }}>
                    Ready to explore opportunities?
                </h2>

                <p style={{ color: "#666", marginBottom: "25px" }}>
                    Join students and companies shaping the future of hiring.
                </p>

                <button
                    onClick={() => navigate("/jobs")}
                    style={{
                        background: "#f2c200",
                        color: "#111",
                        border: "none",
                        padding: "12px 30px",
                        borderRadius: "8px",
                        fontWeight: "700",
                        cursor: "pointer",
                        fontSize: "1rem",
                        transition: "all 0.25s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                            "0 10px 20px rgba(242,194,0,0.35)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    Explore Jobs
                </button>
            </section>
        </div>
    );
};

export default AboutPage;
