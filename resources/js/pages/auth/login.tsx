import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { Form } from '@inertiajs/react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    return (
        // <AuthLayout
        //     title="Log in to your account"
        //     description="Enter your email and password below to log in"
        // >
        <div className="min-h-screen bg-[#E8E8E8] py-10 font-poppins text-[#454545]">
            <div className="mx-auto h-full w-11/12">
                <div className="grid h-full w-full grid-cols-2 items-center gap-x-5">
                    <div className="h-full w-full">
                        <div className="relative mx-auto flex h-full flex-col items-center justify-center rounded-xl border-4 border-[#EDF1F1] bg-white px-5 py-5 shadow">
                            <div className="relative flex w-full items-center justify-between">
                                <div className="absolute top-4 left-5 flex items-center space-x-2">
                                    <img
                                        src="/images/logo/bpmp.webp"
                                        width={20}
                                        height={20}
                                    />
                                    <h4 className="text-base font-black">
                                        BPMP BABEL
                                    </h4>
                                </div>
                                {canRegister && (
                                    <div className="absolute top-4 right-5 text-center text-sm text-muted-foreground">
                                        Belum mempunyai akun?{' '}
                                        <TextLink
                                            className="font-semibold text-[#1D4ED8]"
                                            href={register()}
                                            tabIndex={5}
                                        >
                                            daftar di sini
                                        </TextLink>
                                    </div>
                                )}
                            </div>
                            <div className="flex h-full flex-col items-center justify-center">
                                <h2 className="text-center text-2xl font-extrabold text-[#454545]">
                                    Welcome to E-Fasilitas BPMP BABEL!
                                </h2>
                                <h3 className="text-center text-lg text-[#454545]/30">
                                    Welcome back! Enter your details to
                                    continue.
                                </h3>
                                <Form
                                    {...store.form()}
                                    resetOnSuccess={['password']}
                                    className="mt-10 flex w-full flex-col gap-y-6"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <div className="grid gap-6 font-poppins">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="email">
                                                        Alamat Email
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        name="email"
                                                        required
                                                        autoFocus
                                                        tabIndex={1}
                                                        autoComplete="email"
                                                        placeholder="email@example.com"
                                                    />
                                                    <InputError
                                                        message={errors.email}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    {/* <div className="flex items-center">
                                              
                                                {canResetPassword && (
                                                    <TextLink
                                                        href={request()}
                                                        className="ml-auto text-sm"
                                                        tabIndex={5}
                                                    >
                                                        Forgot password?
                                                    </TextLink>
                                                )}
                                            </div> */}
                                                    <Label htmlFor="password">
                                                        Kata Sandi
                                                    </Label>
                                                    <Input
                                                        id="password"
                                                        type="password"
                                                        name="password"
                                                        required
                                                        tabIndex={2}
                                                        autoComplete="current-password"
                                                        placeholder="Password"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.password
                                                        }
                                                    />
                                                </div>

                                                <div className="flex items-center space-x-3">
                                                    <Checkbox
                                                        id="remember"
                                                        name="remember"
                                                        tabIndex={3}
                                                    />
                                                    <Label htmlFor="remember">
                                                        Ingat Saya
                                                    </Label>
                                                </div>

                                                <Button
                                                    variant={'blue'}
                                                    type="submit"
                                                    className="mt-4 w-full"
                                                    tabIndex={4}
                                                    disabled={processing}
                                                    data-test="login-button"
                                                >
                                                    {processing && <Spinner />}
                                                    Sign in
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </Form>
                                <div className="mt-4 flex items-center justify-center space-x-3 text-[#909091]">
                                    <hr className="h-0.5 w-24 border border-[#909091]" />
                                    <p className="w-fit text-center">
                                        atau masuk menggunakan
                                    </p>
                                    <hr className="h-0.5 w-24 border border-[#909091]" />
                                </div>
                                <div className="mt-5 flex items-center space-x-4">
                                    <div className="flex flex-col items-center space-y-2">
                                        <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-[#F5F5F5]">
                                            <img
                                                className=""
                                                src="/images/icons/facebook.svg"
                                                width={30}
                                                height={30}
                                            />
                                        </div>
                                        <p className="text-sm">Facebook</p>
                                    </div>
                                    <div className="flex flex-col items-center space-y-2">
                                        <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-[#F5F5F5]">
                                            <img
                                                className=""
                                                src="/images/icons/google.svg"
                                                width={30}
                                                height={30}
                                            />
                                        </div>
                                        <p className="text-sm">Gmail</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-5 flex items-center space-x-2">
                                <h4 className="text-sm text-[#909091]">
                                    © 2025 BPMP Provinsi Kepulauan Bangka
                                    Belitung. All rights reserved.
                                </h4>
                            </div>
                        </div>
                    </div>

                    <div className="h-full w-full">
                        <div className="mx-auto h-full rounded-xl border-4 border-[#EDF1F1] bg-[#018FD3] pt-5 shadow">
                            <h2 className="mx-auto mt-5 w-[400px] text-center text-3xl font-bold text-white">
                                Solusi Sewa Gedung Terbaik di Provinsi Bangka
                                Belitung
                            </h2>
                            <img
                                className="mt-10 ml-auto max-w-11/12"
                                src="/images/login/preview.webp"
                            />
                        </div>
                    </div>

                    {status && (
                        <div className="mb-4 text-center text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}
                </div>
            </div>
        </div>

        // </AuthLayout>
    );
}
