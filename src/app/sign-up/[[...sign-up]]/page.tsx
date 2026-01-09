import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-[#F2F6FC] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-pink/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-20%] w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[120px]" />

            <SignUp
                appearance={{
                    elements: {
                        card: "bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl rounded-[32px] p-8",
                        headerTitle: "text-2xl font-bold text-slate-800",
                        headerSubtitle: "text-slate-500",
                        socialButtonsBlockButton: "bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl",
                        formButtonPrimary: "bg-brand-blue hover:bg-[#003d91] text-white rounded-xl shadow-lg shadow-brand-blue/20",
                        formFieldInput: "bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20",
                        footerActionLink: "text-brand-blue hover:text-brand-pink transition-colors"
                    }
                }}
            />
        </div>
    );
}
