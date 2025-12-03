import {css} from "lit";

export const styles = css`
    .app {
        min-height: 100vh;
        background: #f5f7fb;
        padding: 36px 16px 48px;
        display: flex;
        justify-content: center;
    }

    .container {
        width: 100%;
        max-width: 860px;
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 18px;
        box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
        padding: 24px;
    }

    .toolbar {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
        align-items: center;
        margin-bottom: 16px;
    }

    .title {
        margin: 0;
        font-size: 22px;
        font-weight: 700;
    }

    .subtitle {
        margin: 4px 0 0;
        color: #64748b;
        font-size: 14px;
    }

    .badge {
        background: #e0f2fe;
        color: #075985;
        border-radius: 999px;
        padding: 6px 12px;
        font-weight: 700;
        font-size: 12px;
    }

    .error {
        border: 1px solid #fecdd3;
        background: #fef2f2;
        color: #b91c1c;
        border-radius: 12px;
        padding: 10px 12px;
        font-size: 13px;
        margin-bottom: 12px;
    }

    .actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        align-items: center;
        margin-bottom: 12px;
    }

    .hint {
        color: #6b7280;
        font-size: 13px;
    }
`
