import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';
import {AuthLogin} from './auth-login.component';
import { expect } from 'storybook/test';
import { within } from "shadow-dom-testing-library"

type Args = {
    loading: boolean;
    error: string;
};

// Mock API
const mockApi = (() => {
    const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

    return {
        async login(email: string, _password: string) {
            await delay();
            if (email.includes('error')) {
                throw new Error('Login failed');
            }
            return { user: { id: 1, name: 'Test User', email } };
        },

        // Mock other methods if necessary to satisfy interface
        async me() { return { user: { id: 1, name: 'Test User', email: 'test@example.com' } }; },
        async logout() { return { message: 'Logged out' }; },
        async listTodos() { return { todos: [] }; },
        async createTodo() { throw new Error('Not implemented'); },
        async toggleTodo() { throw new Error('Not implemented'); },
        async deleteTodo() { throw new Error('Not implemented'); },
    };
})();

// Define custom element for stories that injects mockApi
class AuthLoginStory extends AuthLogin {
    constructor() {
        super(mockApi);
    }
}
customElements.define('auth-login-story', AuthLoginStory);

const meta: Meta<Args> = {
    title: 'Auth/Login',
    component: 'auth-login-story',
    args: {
        loading: false,
        error: '',
    },
    render: (args) =>
        html`<auth-login-story .loading=${args.loading} .error=${args.error}></auth-login-story>`,
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};
export const Loading: Story = {args: {loading: true}};
export const WithError: Story = {args: {error: '이메일 또는 비밀번호를 확인하세요.'}};

// Interaction Tests

export const SuccessfulLogin: Story = {
    play: async ({ canvasElement, userEvent }) => {
        const canvas = within(canvasElement);

        // Wait for rendering
        await new Promise(resolve => setTimeout(resolve, 500));

        const emailInputs = canvas.getAllByShadowPlaceholderText('you@example.com');
        const emailInput = emailInputs.find(el => el.tagName.toLowerCase() === 'input') as HTMLInputElement;

        const passwordInputs = canvas.getAllByShadowPlaceholderText('••••••••');
        const passwordInput = passwordInputs.find(el => el.tagName.toLowerCase() === 'input') as HTMLInputElement;

        const loginButton = canvas.getByShadowRole('button', { name: '로그인' });

        await expect(emailInput).toBeInTheDocument();
        await expect(passwordInput).toBeInTheDocument();

        // Simulate typing
        await userEvent.type(emailInput, 'user@example.com');
        await userEvent.type(passwordInput, 'password123');

        // Click login
        await userEvent.click(loginButton);
    }
};
