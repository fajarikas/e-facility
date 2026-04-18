import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { Form, Head, Link } from '@inertiajs/react';
import { Mail, Lock, LogIn } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({ status, canRegister }: LoginProps) {
    return (
        <AuthSplitLayout
            title="Selamat Datang"
            description="Silakan masuk ke akun Anda untuk melanjutkan."
        >
            <Head title="Log in" />

            {status && (
                <div className="mb-4 rounded-xl bg-emerald-50 p-4 text-sm font-bold text-emerald-600 ">
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="space-y-6"
            >
                {({ processing, errors }) => (
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                Alamat Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="nama@email.com"
                                    className="h-14 rounded-2xl border-none bg-gray-50 pl-12 text-sm font-bold ring-1 ring-gray-200 transition-all focus:bg-white focus:ring-2 focus:ring-[#1f9cd7]   "
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                    Kata Sandi
                                </Label>
                            </div>
                            <div className="relative">
                                <Lock className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="h-14 rounded-2xl border-none bg-gray-50 pl-12 text-sm font-bold ring-1 ring-gray-200 transition-all focus:bg-white focus:ring-2 focus:ring-[#1f9cd7]   "
                                />
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="rounded-md border-gray-300 text-[#1f9cd7] focus:ring-[#1f9cd7]"
                                />
                                <Label htmlFor="remember" className="text-sm font-bold text-gray-600 ">
                                    Ingat Saya
                                </Label>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="h-14 w-full rounded-2xl bg-[#1f9cd7] text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-[#1785b7] hover:shadow-blue-500/40 active:scale-95 disabled:opacity-50"
                            tabIndex={4}
                            disabled={processing}
                        >
                            {processing ? <Spinner className="mr-2" /> : <LogIn className="mr-2 h-4 w-4" />}
                            Masuk Sekarang
                        </Button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-100 " />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-4 font-black tracking-widest text-muted-foreground ">
                                    Atau Masuk Dengan
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="h-12 rounded-xl font-bold ">
                                <img src="/images/icons/google.svg" className="mr-2 h-5 w-5" alt="Google" />
                                Google
                            </Button>
                            <Button variant="outline" className="h-12 rounded-xl font-bold ">
                                <img src="/images/icons/facebook.svg" className="mr-2 h-5 w-5" alt="Facebook" />
                                Facebook
                            </Button>
                        </div>
                    </div>
                )}
            </Form>

            {canRegister && (
                <p className="mt-8 text-center text-sm font-medium text-muted-foreground">
                    Belum punya akun?{' '}
                    <Link
                        href={register()}
                        className="font-black text-[#1f9cd7] hover:underline"
                    >
                        Daftar Di Sini
                    </Link>
                </p>
            )}
        </AuthSplitLayout>
    );
}
