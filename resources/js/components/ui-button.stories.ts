import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';
import './ui-button';

type Args = {
    variant: 'primary' | 'success' | 'secondary' | 'danger';
    size: 'sm' | 'md';
    disabled: boolean;
};

const meta: Meta<Args> = {
    title: 'UI/Button',
    component: 'ui-button',
    args: {
        variant: 'primary',
        size: 'md',
        disabled: false,
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'success', 'secondary', 'danger'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md'],
        },
    },
    render: (args) =>
        html`<ui-button variant=${args.variant} size=${args.size} ?disabled=${args.disabled}>
            Click
        </ui-button>`,
};

export default meta;
type Story = StoryObj<Args>;

export const Primary: Story = {};
export const Success: Story = {args: {variant: 'success'}};
export const Secondary: Story = {args: {variant: 'secondary'}};
export const Danger: Story = {args: {variant: 'danger'}};
