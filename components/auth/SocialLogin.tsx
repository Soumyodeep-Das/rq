import React from "react";
import { GoogleLogo } from "./AuthIcons";

export const SocialLogin = () => (
    <button className="w-full bg-white text-slate-950 hover:bg-slate-200 font-semibold py-3 rounded-xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98]">
        <GoogleLogo />
        <span>Continue with Google</span>
    </button>
);
