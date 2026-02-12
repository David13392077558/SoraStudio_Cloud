import { BrandLogo } from "@/app/components/BrandLogo";
import { AuthForm } from "@/app/components/AuthForm";

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center">
      <div className="w-full max-w-md glass-dark border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-center">
          <BrandLogo />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold gradient-text">注册</h1>
          <p className="text-sm text-white/60">
            创建账号以开始使用任务队列与工作流。
          </p>
        </div>

        <AuthForm mode="register" />
      </div>
    </div>
  );
}

