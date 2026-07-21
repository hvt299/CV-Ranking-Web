'use client';

import { useCallback, useEffect, useRef } from 'react';

const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';

interface UseLinkedInAuthOptions {
    onSuccess: (code: string) => void;
    onError: (message: string) => void;
}

export function useLinkedInAuth({ onSuccess, onError }: UseLinkedInAuthOptions) {
    const popupRef = useRef<Window | null>(null);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        function handleMessage(event: MessageEvent) {
            if (event.origin !== window.location.origin) return;
            if (event.data?.type !== 'linkedin-oauth') return;

            const savedState = sessionStorage.getItem('linkedin_oauth_state');
            sessionStorage.removeItem('linkedin_oauth_state');

            if (pollRef.current) clearInterval(pollRef.current);
            popupRef.current?.close();

            if (event.data.error) {
                onError('Đăng nhập LinkedIn thất bại hoặc đã bị huỷ');
                return;
            }
            if (!event.data.code || event.data.state !== savedState) {
                onError('Phiên xác thực LinkedIn không hợp lệ, vui lòng thử lại');
                return;
            }
            onSuccess(event.data.code);
        }

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [onSuccess, onError]);

    const linkedInLogin = useCallback(() => {
        const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || '';
        if (!clientId) {
            onError('Thiếu cấu hình NEXT_PUBLIC_LINKEDIN_CLIENT_ID');
            return;
        }

        const state = crypto.randomUUID();
        sessionStorage.setItem('linkedin_oauth_state', state);

        const redirectUri = `${window.location.origin}/linkedin`;
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: clientId,
            redirect_uri: redirectUri,
            scope: 'openid profile email',
            state,
        });

        const width = 520;
        const height = 640;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        popupRef.current = window.open(
            `${LINKEDIN_AUTH_URL}?${params.toString()}`,
            'linkedin-oauth',
            `width=${width},height=${height},left=${left},top=${top}`
        );

        if (!popupRef.current) {
            onError('Trình duyệt đã chặn cửa sổ popup. Vui lòng cho phép popup và thử lại.');
            return;
        }

        pollRef.current = setInterval(() => {
            if (popupRef.current?.closed) {
                clearInterval(pollRef.current!);
                pollRef.current = null;
            }
        }, 500);
    }, [onError]);

    return { linkedInLogin };
}