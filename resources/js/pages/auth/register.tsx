import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import { store } from '@/routes/register';
import { Form, Head, Link } from '@inertiajs/react';
import { Mail, Lock, User, UserPlus } from 'lucide-react';

export default function Register() {
    return (
        <AuthSplitLayout
            title="Daftar Akun"
            description="Lengkapi data diri Anda untuk mulai menggunakan layanan kami."
        >
            <Head title="Register" />

            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                className="space-y-6"
            >
                {({ processing, errors }) => (
                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                Nama Lengkap
                            </Label>
                            <div className="relative">
                                <User className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    placeholder="Masukkan nama lengkap"
                                    className="h-14 rounded-2xl border-none bg-gray-50 pl-12 text-sm font-bold ring-1 ring-gray-200 transition-all focus:bg-white focus:ring-2 focus:ring-[#1f9cd7]   "
                                />
                            </div>
                            <InputError message={errors.name} />
                        </div>

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
                                    tabIndex={2}
                                    autoComplete="email"
                                    placeholder="nama@email.com"
                                    className="h-14 rounded-2xl border-none bg-gray-50 pl-12 text-sm font-bold ring-1 ring-gray-200 transition-all focus:bg-white focus:ring-2 focus:ring-[#1f9cd7]   "
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                Kata Sandi
                            </Label>
                            <div className="relative">
                                <Lock className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    className="h-14 rounded-2xl border-none bg-gray-50 pl-12 text-sm font-bold ring-1 ring-gray-200 transition-all focus:bg-white focus:ring-2 focus:ring-[#1f9cd7]   "
                                />
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                Konfirmasi Kata Sandi
                            </Label>
                            <div className="relative">
                                <Lock className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    className="h-14 rounded-2xl border-none bg-gray-50 pl-12 text-sm font-bold ring-1 ring-gray-200 transition-all focus:bg-white focus:ring-2 focus:ring-[#1f9cd7]   "
                                />
                            </div>
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <Button
                            type="submit"
                            className="mt-2 h-14 w-full rounded-2xl bg-[#1f9cd7] text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-[#1785b7] hover:shadow-blue-500/40 active:scale-95 disabled:opacity-50"
                            tabIndex={5}
                            disabled={processing}
                        >
                            {processing ? <Spinner className="mr-2" /> : <UserPlus className="mr-2 h-4 w-4" />}
                            Daftar Sekarang
                        </Button>

                        <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-100 " />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-4 font-black tracking-widest text-muted-foreground ">
                                    Atau Daftar Dengan
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

            <p className="mt-8 text-center text-sm font-medium text-muted-foreground">
                Sudah punya akun?{' '}
                <Link
                    href="/login"
                    className="font-black text-[#1f9cd7] hover:underline"
                >
                    Masuk Di Sini
                </Link>
            </p>
        </AuthSplitLayout>
    );
}
