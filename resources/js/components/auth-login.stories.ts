import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';
import './auth-login';

type Args = {
    loading: boolean;
    error: string;
};

const meta: Meta<Args> = {
    title: 'Auth/Login',
    component: 'auth-login',
    args: {
        loading: false,
        error: '',
    },
    render: (args) =>
        html`<auth-login .loading=${args.loading} .error=${args.error}></auth-login>`,
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};
export const Loading: Story = {args: {loading: true}};
export const WithError: Story = {args: {error: '이메일 또는 비밀번호를 확인하세요.'}};
