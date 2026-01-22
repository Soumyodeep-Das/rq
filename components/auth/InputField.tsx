import { LucideIcon } from "lucide-react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon: LucideIcon;
}

export const InputField = ({ icon: Icon, className, ...props }: InputFieldProps) => (
    <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
            <Icon size={20} />
        </div>
        <input
            {...props}
            className={`w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-slate-600 ${className}`}
        />
    </div>
);
