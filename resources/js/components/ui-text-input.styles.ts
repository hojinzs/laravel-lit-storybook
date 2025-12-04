import {css} from 'lit';

export const uiTextInputStyles = css`
    :host {
        display: block;
    }
    .field {
        width: 100%;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        box-sizing: border-box;
        background: #f8fafc;
        padding: 12px 14px;
        font-size: 14px;
        outline: none;
        transition: border-color 120ms ease, box-shadow 120ms ease;
        color: #0f172a;
    }
    .field:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
    }
    .field:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;
