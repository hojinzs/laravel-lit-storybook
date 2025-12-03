import {html, LitElement} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import authCss from './auth-login.css?inline';
import {api} from './api';
import './ui-text-input';
import './ui-button';

const sheet = new CSSStyleSheet();
sheet.replaceSync(authCss);

const csrf =
    document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ??
    (window as unknown as {__csrf?: string}).__csrf ??
    '';

@customElement('auth-login')
export class AuthLogin extends LitElement {
    static styles = [sheet];
    static formAssociated = true;

    @property({type: Boolean})
    declare loading: boolean;

    @property({type: String})
    declare error: string;

    @property({type: Boolean})
    declare autoSubmit: boolean;

    /**
     * 폼을 전통적인 POST로 제출할지 여부.
     * true면 기본 form submit을 허용하고 hidden _token을 포함한다.
     */
    @property({type: Boolean})
    declare useFormSubmit: boolean;

    /**
     * useFormSubmit=true일 때 사용되는 액션 URL.
     */
    @property({type: String})
    declare action: string;

    @property({type: String})
    declare redirectTo: string;

    @state()
    declare email: string;

    @state()
    declare password: string;

    // Form-associated custom element internals (still keep for compatibility)
    private internals: ElementInternals;

    @query('input.native-submit')
    declare nativeSubmit: HTMLInputElement | null;

    constructor() {
        super();
        this.email = '';
        this.password = '';
        this.loading = false;
        this.error = '';
        this.autoSubmit = false;
        this.useFormSubmit = false;
        this.redirectTo = '/';
        this.action = '/login';
        this.internals = this.attachInternals();
    }

    private syncFormValue() {
        if (! this.useFormSubmit) {
            return;
        }

        const formData = new FormData();
        formData.set('email', this.email);
        formData.set('password', this.password);
        formData.set('_token', csrf);
        this.internals.setFormValue(formData);
    }

    private async submit(e: Event) {
        if (this.useFormSubmit) {
            // allow native POST submit with hidden _token; nothing to prevent
            this.syncFormValue();
            return;
        }

        e.preventDefault();
        if (this.autoSubmit) {
            await this.selfLogin();
            return;
        }

        this.dispatchEvent(
            new CustomEvent('login-submit', {
                detail: { email: this.email, password: this.password },
                bubbles: true,
                composed: true,
            }),
        );
    }

    private async selfLogin() {
        this.loading = true;
        this.error = '';
        try {
            await api.login(this.email, this.password);
            window.location.assign(this.redirectTo || '/');
        } catch (error) {
            console.error(error);
            this.error = '이메일 또는 비밀번호를 확인하세요.';
        } finally {
            this.loading = false;
        }
    }

    render() {
        return html`
            <div class="card">
                <h1 class="title">로그인</h1>
                <p class="subtitle">계정으로 로그인하세요.</p>

                ${this.error ? html`<div class="error">${this.error}</div>` : null}

                <form class="form" method="POST" action=${this.action} @submit=${this.submit}>

                    <div>
                        <label for="email" class="label">이메일</label>
                        <ui-text-input
                            id="email"
                            name="email"
                            type="email"
                            autocomplete="email"
                            .value=${this.email}
                            placeholder="you@example.com"
                            @ui-input=${(e: CustomEvent) => {
                                this.email = e.detail.value;
                                this.syncFormValue();
                            }}
                            ?required=${true}
                        ></ui-text-input>
                    </div>

                    <div>
                        <label for="password" class="label">비밀번호</label>
                        <ui-text-input
                            id="password"
                            name="password"
                            type="password"
                            autocomplete="current-password"
                            .value=${this.password}
                            placeholder="••••••••"
                            @ui-input=${(e: CustomEvent) => {
                                this.password = e.detail.value;
                                this.syncFormValue();
                            }}
                            ?required=${true}
                        ></ui-text-input>
                    </div>

                    <!-- native hidden inputs to ensure form serialization -->
                    <input type="hidden" name="email" .value=${this.email} />
                    <input type="hidden" name="password" .value=${this.password} />
                    ${this.useFormSubmit ? html`<input type="hidden" name="_token" value=${csrf} />` : null}

                    <ui-button
                        type="submit"
                        .disabled=${this.loading}
                        variant="primary"
                        class="w-full"
                    >
                        ${this.loading ? '로그인 중...' : '로그인'}
                    </ui-button>
                </form>
            </div>
        `;
    }
}
