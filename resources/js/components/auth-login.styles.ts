import {css} from 'lit';

export const authLoginStyles = css`
.card {
    width: 100%;
    max-width: 420px;
    margin: 0 auto;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
}

.title {
    margin: 0 0 4px;
    font-size: 22px;
    font-weight: 700;
}

.subtitle {
    margin: 0 0 16px;
    color: #64748b;
    font-size: 14px;
}

.form {
    display: grid;
    gap: 12px;
}

.label {
    font-weight: 600;
    font-size: 13px;
    color: #0f172a;
}

.error {
    border: 1px solid #fecdd3;
    background: #fef2f2;
    color: #b91c1c;
    border-radius: 12px;
    padding: 10px 12px;
    font-size: 13px;
}
`;
