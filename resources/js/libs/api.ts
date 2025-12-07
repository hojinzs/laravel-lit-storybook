type FetchOptions = {
    method?: string;
    body?: unknown;
};

const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';

async function request<T>(url: string, { method = 'GET', body }: FetchOptions = {}): Promise<T> {
    let response: Response;

    try {
        response = await fetch(url, {
            method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf,
            },
            body: body ? JSON.stringify(body) : undefined,
        });
    } catch (error) {
        throw new Error('서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
    }

    if (response.redirected || [401, 403, 419, 302].includes(response.status)) {
        window.location.href = '/login';
        return Promise.reject(new Error('로그인이 필요합니다.'));
    }

    if (! response.ok) {
        if (response.status === 401) {
            window.location.href = '/login';
            return Promise.reject(new Error('로그인이 필요합니다.'));
        }

        let error = '';
        try {
            const data = await response.json();
            error = (data?.message as string) ?? '';
        } catch (_) {
            error = await response.text();
        }

        throw new Error(error || '요청에 실패했습니다.');
    }

    return response.json() as Promise<T>;
}

export type User = {
    id: number;
    name: string;
    email: string;
};

export type Todo = {
    id: number;
    title: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
};

export const api = {
    me: () => request<{ user: User | null }>('/me'),
    login: (email: string, password: string) =>
        request<{ user: User }>('/login', { method: 'POST', body: { email, password } }),
    logout: () => request<{ message: string }>('/logout', { method: 'POST' }),
    listTodos: () => request<{ todos: Todo[] }>('/todos'),
    createTodo: (title: string) => request<{ todo: Todo }>('/todos', { method: 'POST', body: { title } }),
    toggleTodo: (id: number, completed: boolean) =>
        request<{ todo: Todo }>(`/todos/${id}`, { method: 'PATCH', body: { completed } }),
    deleteTodo: (id: number) => request<{ message: string }>(`/todos/${id}`, { method: 'DELETE' }),
};
