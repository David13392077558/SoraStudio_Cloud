import { BrandLogo } from "@/app/components/BrandLogo";
import { AuthForm } from "@/app/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center">
      <div className="w-full max-w-md glass-dark border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-center">
          <BrandLogo />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold gradient-text">登录</h1>
          <p className="text-sm text-white/60">
            登录后即可创建任务、查看历史与项目管理。
          </p>
        </div>

        <AuthForm mode="login" />
      </div>
    </div>
  );
}

