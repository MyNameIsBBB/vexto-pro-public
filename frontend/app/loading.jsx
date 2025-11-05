export default function Loading() {
    return (
        <div className="min-h-screen grid place-items-center bg-[#0b1020] text-white">
            <div className="relative flex flex-col items-center">
                {/* glow */}
                <div
                    className="absolute -inset-24 -z-10 blur-3xl opacity-60"
                    style={{
                        background:
                            "radial-gradient(60% 60% at 50% 50%, rgba(124,58,237,0.35), transparent 60%), radial-gradient(50% 50% at 70% 40%, rgba(34,211,238,0.25), transparent 60%)",
                    }}
                />

                {/* logo/brand */}
                <div className="inline-flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#22d3ee]" />
                    <div className="text-xl font-bold tracking-tight">
                        <span className="text-white">vexto</span>
                        <span className="bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent">
                            .co
                        </span>
                    </div>
                </div>

                {/* loader */}
                <div className="mt-6 flex items-center gap-2 text-white/80">
                    <div className="h-2 w-2 rounded-full bg-[#7c3aed] animate-bounce [animation-delay:-.2s]" />
                    <div className="h-2 w-2 rounded-full bg-[#22d3ee] animate-bounce [animation-delay:-.1s]" />
                    <div className="h-2 w-2 rounded-full bg-white/80 animate-bounce" />
                </div>

                {/* hint */}
                <p className="mt-4 text-xs text-white/60">
                    กำลังโหลดประสบการณ์ที่ลื่นไหล…
                </p>
            </div>
        </div>
    );
}
