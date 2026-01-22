import { store } from '@/routes/register';
import { Form } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

export default function Register() {
    return (
        <div className="min-h-screen bg-[#E8E8E8] py-10 font-poppins text-[#454545]">
            <div className="mx-auto h-full w-11/12">
                <div className="grid h-full w-full grid-cols-2 items-center gap-x-5">
                    <div className="h-full w-full">
                        <div className="relative mx-auto flex h-full flex-col items-center justify-center overflow-y-auto rounded-xl border-4 border-[#EDF1F1] bg-white px-5 py-5 shadow">
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
                                <div className="absolute top-4 right-5 text-center text-sm text-muted-foreground">
                                    Sudah mempunyai akun?{' '}
                                    <TextLink
                                        className="font-semibold text-[#1D4ED8]"
                                        href={'/login'}
                                        tabIndex={5}
                                    >
                                        masuk di sini
                                    </TextLink>
                                </div>
                            </div>
                            <div className="my-20 flex h-full flex-col items-center justify-center">
                                <h2 className="text-center text-2xl font-extrabold text-[#454545]">
                                    Welcome to E-Fasilitas BPMP BABEL!
                                </h2>
                                <h3 className="text-center text-lg text-[#454545]/30">
                                    Welcome back! Enter your details to
                                    continue.
                                </h3>
                                <Form
                                    {...store.form()}
                                    resetOnSuccess={[
                                        'password',
                                        'password_confirmation',
                                    ]}
                                    disableWhileProcessing
                                    className="mt-5 flex w-full flex-col gap-6"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <div className="grid gap-6">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">
                                                        Nama
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        type="text"
                                                        required
                                                        autoFocus
                                                        tabIndex={1}
                                                        autoComplete="name"
                                                        name="name"
                                                        placeholder="Full name"
                                                    />
                                                    <InputError
                                                        message={errors.name}
                                                        className="mt-2"
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="email">
                                                        Alamat Email
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        required
                                                        tabIndex={2}
                                                        autoComplete="email"
                                                        name="email"
                                                        placeholder="email@example.com"
                                                    />
                                                    <InputError
                                                        message={errors.email}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="password">
                                                        Kata Sandi
                                                    </Label>
                                                    <Input
                                                        id="password"
                                                        type="password"
                                                        required
                                                        tabIndex={3}
                                                        autoComplete="new-password"
                                                        name="password"
                                                        placeholder="Password"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.password
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="password_confirmation">
                                                        Konfirmasi Kata Sanidi
                                                    </Label>
                                                    <Input
                                                        id="password_confirmation"
                                                        type="password"
                                                        required
                                                        tabIndex={4}
                                                        autoComplete="new-password"
                                                        name="password_confirmation"
                                                        placeholder="Confirm password"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.password_confirmation
                                                        }
                                                    />
                                                </div>

                                                <Button
                                                    variant={'blue'}
                                                    type="submit"
                                                    className="mt-2 w-full"
                                                    tabIndex={5}
                                                    data-test="register-user-button"
                                                >
                                                    {processing && <Spinner />}
                                                    Create account
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
                                        <a
                                            href="/auth/facebook/redirect"
                                            className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-[#F5F5F5] hover:bg-[#ECECEC]"
                                        >
                                            <img
                                                className=""
                                                src="/images/icons/facebook.svg"
                                                width={30}
                                                height={30}
                                            />
                                        </a>
                                        <p className="text-sm">Facebook</p>
                                    </div>
                                    <div className="flex flex-col items-center space-y-2">
                                        <a
                                            href="/auth/google/redirect"
                                            className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-[#F5F5F5] hover:bg-[#ECECEC]"
                                        >
                                            <img
                                                className=""
                                                src="/images/icons/google.svg"
                                                width={30}
                                                height={30}
                                            />
                                        </a>
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
    );
}
