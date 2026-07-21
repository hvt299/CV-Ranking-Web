'use client';

import { useEffect } from 'react';

export default function LinkedInCallbackPage() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');
        const error = params.get('error') || params.get('error_description');

        if (window.opener) {
            window.opener.postMessage(
                { type: 'linkedin-oauth', code, state, error },
                window.location.origin
            );
        }
        window.close();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center text-slate-500 text-sm">
            Đang xử lý đăng nhập LinkedIn...
        </div>
    );
}